import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import process from "node:process"
import { promisify } from "node:util"
import { gzipSync } from "node:zlib"

import { afterAll, beforeAll, describe, expect, it } from "vitest"

const execFileAsync = promisify(execFile)
const repositoryRoot = process.cwd()
const packageRoot = path.join(repositoryRoot, "packages/ui")
let temporaryRoot = ""
let tarballPath = ""
let packedFiles: string[] = []

type ExportTarget = {
  import: string
  types: string
}

async function readManifest() {
  return JSON.parse(
    await readFile(path.join(packageRoot, "package.json"), "utf8")
  ) as {
    exports: Record<string, ExportTarget | string>
    files?: string[]
    private?: boolean
  }
}

async function sourceModuleSubpaths() {
  const [components, patterns, hooks, utilities] = await Promise.all([
    readdir(path.join(packageRoot, "src/components"), { withFileTypes: true }),
    readdir(path.join(packageRoot, "src/patterns"), { withFileTypes: true }),
    readdir(path.join(packageRoot, "src/hooks"), { withFileTypes: true }),
    readdir(path.join(packageRoot, "src/lib"), { withFileTypes: true }),
  ])

  return [
    "./patterns",
    ...components
      .filter((entry) => entry.isDirectory())
      .map((entry) => `./components/${entry.name}`),
    ...patterns
      .filter((entry) => entry.isDirectory())
      .map((entry) => `./patterns/${entry.name}`),
    ...hooks
      .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry) => `./hooks/${entry.name.slice(0, -3)}`),
    ...utilities
      .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry) => `./lib/${entry.name.slice(0, -3)}`),
  ].sort()
}

async function listFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(root, entry.name)
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath]
    })
  )
  return files.flat().sort()
}

async function distSnapshot() {
  const distRoot = path.join(packageRoot, "dist")
  return Promise.all(
    (await listFiles(distRoot)).map(async (file) => ({
      path: path.relative(distRoot, file),
      sha256: createHash("sha256")
        .update(await readFile(file))
        .digest("hex"),
    }))
  )
}

function resolveTarget(
  exports: Record<string, ExportTarget | string>,
  subpath: string
) {
  const direct = exports[subpath]
  if (direct) return direct

  for (const [pattern, target] of Object.entries(exports)) {
    if (!pattern.includes("*")) continue
    const [prefix, suffix = ""] = pattern.split("*")
    if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue
    const wildcard = subpath.slice(
      prefix.length,
      subpath.length - suffix.length
    )
    if (typeof target === "string") return target.replace("*", wildcard)
    return {
      import: target.import.replace("*", wildcard),
      types: target.types.replace("*", wildcard),
    }
  }

  throw new Error(`Missing public export for ${subpath}`)
}

beforeAll(async () => {
  temporaryRoot = await mkdtemp(path.join(tmpdir(), "surfacekit-package-"))
  await execFileAsync("pnpm", ["--filter", "@nwl/surfacekit", "build"], {
    cwd: repositoryRoot,
  })
  const { stdout } = await execFileAsync(
    "pnpm",
    ["pack", "--pack-destination", temporaryRoot, "--json"],
    { cwd: packageRoot, maxBuffer: 10 * 1024 * 1024 }
  )
  const packResult = JSON.parse(stdout) as {
    filename: string
    files: Array<{ path: string }>
  }
  tarballPath = packResult.filename
  packedFiles = packResult.files.map(({ path }) => path).sort()
}, 60_000)

afterAll(async () => {
  if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true })
})

describe("SurfaceKit compiled distribution", () => {
  it("builds every public JavaScript export as Node-compatible ESM with declarations and maps", async () => {
    const manifest = await readManifest()
    const moduleExports = await sourceModuleSubpaths()

    expect(moduleExports.length).toBeGreaterThan(0)

    for (const subpath of moduleExports) {
      const target = resolveTarget(manifest.exports, subpath)
      expect(target, subpath).toEqual({
        types: expect.stringMatching(/^\.\/dist\/.+\.d\.ts$/),
        import: expect.stringMatching(/^\.\/dist\/.+\.js$/),
      })

      if (typeof target === "string") continue

      for (const emittedPath of [
        target.import,
        `${target.import}.map`,
        target.types,
        `${target.types}.map`,
      ]) {
        await expect(
          access(path.join(packageRoot, emittedPath))
        ).resolves.toBeUndefined()
      }

      await expect(
        import(`@nwl/surfacekit${subpath.slice(1)}`)
      ).resolves.toEqual(expect.any(Object))
    }

    expect(manifest.private).toBe(false)
    expect(manifest.files).toEqual(
      expect.arrayContaining(["dist", "README.md", "USAGE.md"])
    )

    const emittedFiles = await readdir(path.join(packageRoot, "dist"), {
      recursive: true,
    })
    expect(emittedFiles.some((file) => file.endsWith(".test.js"))).toBe(false)
  }, 20_000)

  it("removes stale output and reproduces identical dist bytes", async () => {
    const expected = await distSnapshot()
    const staleFile = path.join(packageRoot, "dist/stale-build-artifact.txt")
    await writeFile(staleFile, "must be removed")

    await execFileAsync("pnpm", ["--filter", "@nwl/surfacekit", "build"], {
      cwd: repositoryRoot,
    })

    await expect(access(staleFile)).rejects.toThrow()
    expect(await distSnapshot()).toEqual(expected)
  }, 30_000)

  it("ships self-contained compiled CSS with bounded package-only discovery", async () => {
    const css = await readFile(path.join(packageRoot, "dist/globals.css"))
    const cssSource = css.toString("utf8")
    const cssGzipBytes = gzipSync(css, { level: 9 }).byteLength

    expect(cssSource).not.toMatch(
      /@(import|source|apply|theme|custom-variant|plugin|config)\b/
    )
    expect(cssSource).toContain("--background:")
    expect(cssSource).toContain(".dark")
    expect(cssSource).toContain("ui-sans-serif")
    expect(cssGzipBytes).toBeLessThanOrEqual(30 * 1024)
    if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
      process.stdout.write(`SurfaceKit CSS gzip: ${cssGzipBytes} bytes\n`)
    }

    const packageProbe = path.join(
      repositoryRoot,
      "apps/web/components/surfacekit-package-css-probe.tsx"
    )
    const appCssOutput = path.join(temporaryRoot, "reference-app.css")

    try {
      await writeFile(
        packageProbe,
        'export const Probe = () => <div className="bg-[#123456]" />\n'
      )
      await execFileAsync(
        "pnpm",
        [
          "--filter",
          "@nwl/surfacekit",
          "exec",
          "tailwindcss",
          "-i",
          path.join(repositoryRoot, "apps/web/app/reference-app.css"),
          "-o",
          appCssOutput,
          "--minify",
        ],
        { cwd: repositoryRoot }
      )

      expect(await readFile(appCssOutput, "utf8")).toContain("#123456")
      expect(cssSource).not.toContain("#123456")
    } finally {
      await rm(packageProbe, { force: true })
    }
  }, 30_000)

  it("packs only approved runtime, documentation, and legal files", () => {
    expect(packedFiles).toEqual(
      expect.arrayContaining([
        "LICENSE",
        "NOTICE",
        "README.md",
        "USAGE.md",
        "package.json",
        "dist/globals.css",
        "dist/components/button/index.js",
        "dist/components/button/index.d.ts",
      ])
    )
    expect(
      packedFiles.every(
        (file) =>
          file.startsWith("dist/") ||
          [
            "LICENSE",
            "NOTICE",
            "README.md",
            "USAGE.md",
            "package.json",
          ].includes(file)
      )
    ).toBe(true)
    if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
      process.stdout.write(`SurfaceKit packed files: ${packedFiles.length}\n`)
    }
  })

  it("keeps React singleton peers and build tooling out of runtime dependencies", async () => {
    const manifest = JSON.parse(
      await readFile(path.join(packageRoot, "package.json"), "utf8")
    ) as {
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
      peerDependencies: Record<string, string>
      sideEffects: string[]
    }

    expect(manifest.peerDependencies).toEqual({
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    })
    expect(manifest.dependencies).not.toHaveProperty("react")
    expect(manifest.dependencies).not.toHaveProperty("react-dom")
    expect(manifest.sideEffects).toEqual(["**/*.css"])

    for (const buildDependency of [
      "@tailwindcss/cli",
      "@tailwindcss/postcss",
      "concurrently",
      "shadcn",
      "tailwindcss",
      "tsc-alias",
      "tw-animate-css",
      "typescript",
    ]) {
      expect(manifest.dependencies).not.toHaveProperty(buildDependency)
    }

    for (const packageBuildDependency of [
      "@tailwindcss/cli",
      "concurrently",
      "shadcn",
      "tailwindcss",
      "tsc-alias",
      "tw-animate-css",
      "typescript",
    ]) {
      expect(manifest.devDependencies).toHaveProperty(packageBuildDependency)
    }
  })

  it("tree-shakes Button from the exact tarball below 15 KB gzip", async () => {
    const consumerRoot = path.join(temporaryRoot, "button-consumer")
    await mkdir(consumerRoot)
    await writeFile(
      path.join(consumerRoot, "package.json"),
      JSON.stringify({
        name: "surfacekit-button-consumer",
        private: true,
        type: "module",
        dependencies: {
          "@nwl/surfacekit": `file:${tarballPath}`,
          react: "19.2.8",
          "react-dom": "19.2.8",
        },
      })
    )
    await writeFile(
      path.join(consumerRoot, "index.js"),
      'export { Button } from "@nwl/surfacekit/components/button"\n'
    )
    await writeFile(
      path.join(consumerRoot, "vite.config.mjs"),
      `export default {
  build: {
    lib: { entry: "index.js", formats: ["es"], fileName: "button" },
    minify: true,
    rolldownOptions: { external: [/^react(?:-dom)?(?:\\/.*)?$/] },
  },
}
`
    )

    try {
      await execFileAsync(
        "pnpm",
        [
          "install",
          "--ignore-workspace",
          "--prefer-offline",
          "--config.minimum-release-age=0",
        ],
        { cwd: consumerRoot, maxBuffer: 10 * 1024 * 1024 }
      )
    } catch (error) {
      const failure = error as Error & { stderr?: string; stdout?: string }
      throw new Error(
        `Consumer install failed:\n${failure.stdout ?? ""}\n${failure.stderr ?? failure.message}`
      )
    }
    await execFileAsync(
      "node",
      [path.join(repositoryRoot, "node_modules/vite/bin/vite.js"), "build"],
      { cwd: consumerRoot, maxBuffer: 10 * 1024 * 1024 }
    )

    const bundle = await readFile(path.join(consumerRoot, "dist/button.js"))
    const bundleGzipBytes = gzipSync(bundle, { level: 9 }).byteLength
    expect(bundleGzipBytes).toBeLessThanOrEqual(15 * 1024)
    if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
      process.stdout.write(
        `SurfaceKit Button bundle gzip: ${bundleGzipBytes} bytes\n`
      )
    }
  }, 120_000)
})
