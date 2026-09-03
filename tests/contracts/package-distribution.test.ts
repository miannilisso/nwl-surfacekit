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

import postcss from "postcss"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

const execFileAsync = promisify(execFile)
const repositoryRoot = process.cwd()
const packageRoot = path.join(repositoryRoot, "packages/ui")
let temporaryRoot = ""
let tarballPath = ""
let packedFiles: string[] = []
let consumerRoot = ""
let consumerLockfile = ""

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

async function writeConsumerFixture(root: string) {
  await mkdir(root)
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      name: "surfacekit-package-consumer",
      private: true,
      type: "module",
      dependencies: {
        "@nwl/surfacekit": `file:../${path.basename(tarballPath)}`,
        react: "19.2.8",
        "react-dom": "19.2.8",
      },
    })
  )
  await writeFile(
    path.join(root, "button-entry.js"),
    'export { Button } from "@nwl/surfacekit/components/button"\n'
  )
  await writeFile(
    path.join(root, "css-entry.js"),
    'import "@nwl/surfacekit/globals.css"\n'
  )
  await writeFile(
    path.join(root, "vite.config.mjs"),
    `const entry = process.env.SURFACEKIT_CONSUMER_ENTRY ?? "button-entry.js"

export default {
  build: {
    emptyOutDir: true,
    lib: { entry, formats: ["es"], fileName: "surfacekit-consumer" },
    minify: true,
    rolldownOptions: { external: [/^react(?:-dom)?(?:\\/.*)?$/] },
  },
}
`
  )
}

async function createOfflineConsumer(root: string) {
  await writeConsumerFixture(root)
  await execFileAsync(
    "pnpm",
    [
      "install",
      "--lockfile-only",
      "--offline",
      "--ignore-workspace",
      "--config.minimum-release-age=0",
    ],
    { cwd: root, maxBuffer: 10 * 1024 * 1024 }
  )
  const lockfile = await readFile(path.join(root, "pnpm-lock.yaml"), "utf8")
  await execFileAsync(
    "pnpm",
    [
      "install",
      "--frozen-lockfile",
      "--offline",
      "--ignore-workspace",
      "--config.minimum-release-age=0",
    ],
    { cwd: root, maxBuffer: 10 * 1024 * 1024 }
  )
  return lockfile
}

async function buildConsumer(entry: string) {
  await execFileAsync(
    process.execPath,
    [path.join(repositoryRoot, "node_modules/vite/bin/vite.js"), "build"],
    {
      cwd: consumerRoot,
      env: { ...process.env, SURFACEKIT_CONSUMER_ENTRY: entry },
      maxBuffer: 10 * 1024 * 1024,
    }
  )
}

async function buildReferenceCss(input: string, output: string, from = input) {
  await execFileAsync(
    "pnpm",
    [
      "--filter",
      "web",
      "exec",
      "node",
      "scripts/build-reference-css.mjs",
      "--input",
      input,
      "--output",
      output,
      "--from",
      from,
    ],
    { cwd: repositoryRoot, maxBuffer: 10 * 1024 * 1024 }
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
  consumerRoot = path.join(temporaryRoot, "consumer")
  consumerLockfile = await createOfflineConsumer(consumerRoot)
}, 120_000)

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
    }

    const publicSpecifiers = moduleExports.map(
      (subpath) => `@nwl/surfacekit${subpath.slice(1)}`
    )
    await expect(
      execFileAsync(
        process.execPath,
        [
          "--input-type=module",
          "--eval",
          `for (const specifier of ${JSON.stringify(publicSpecifiers)}) await import(specifier)`,
        ],
        { cwd: consumerRoot, maxBuffer: 10 * 1024 * 1024 }
      )
    ).resolves.toEqual(expect.objectContaining({ stderr: "" }))

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
    const probe = path.join(temporaryRoot, "css-boundary-probe.tsx")
    const referenceInput = path.join(temporaryRoot, "reference-app-input.css")
    const appCssOutput = path.join(temporaryRoot, "reference-app.css")
    const referenceSourcePath = path.join(
      repositoryRoot,
      "apps/web/app/reference-app.css"
    )

    await writeFile(
      probe,
      'export const Probe = () => <div className="bg-[#123456] rounded-md" />\n'
    )
    await writeFile(
      referenceInput,
      `${await readFile(referenceSourcePath, "utf8")}\n@source "${probe}";\n`
    )

    // Rebuild while the probe exists: package discovery must remain isolated.
    await execFileAsync("pnpm", ["--filter", "@nwl/surfacekit", "build"], {
      cwd: repositoryRoot,
    })
    const css = await readFile(path.join(packageRoot, "dist/globals.css"))
    const cssSource = css.toString("utf8")
    const cssGzipBytes = gzipSync(css, { level: 9 }).byteLength

    expect(cssSource).not.toMatch(
      /@(import|source|apply|theme|custom-variant|plugin|config)\b/
    )
    expect(cssSource).toContain("--background:")
    expect(cssSource).toContain(".dark")
    expect(cssSource).toContain("ui-sans-serif")
    expect(cssSource).not.toContain("#123456")
    expect(cssGzipBytes).toBeLessThanOrEqual(30 * 1024)
    if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
      process.stdout.write(`SurfaceKit CSS gzip: ${cssGzipBytes} bytes\n`)
    }

    await buildReferenceCss(referenceInput, appCssOutput, referenceSourcePath)
    const appCss = await readFile(appCssOutput, "utf8")
    expect(appCss).toContain("#123456")
    expect(appCss).not.toMatch(/@layer\s+(?:theme|base|components)\b/)
    expect(appCss).not.toContain(
      "*,:after,:before,::backdrop{box-sizing:border-box"
    )
    expect(appCss).not.toMatch(/\.rounded-md\s*\{/)

    const packageSelectors = new Set<string>()
    const appSelectors = new Set<string>()
    postcss
      .parse(cssSource)
      .walkRules((rule) => packageSelectors.add(rule.selector))
    postcss.parse(appCss).walkRules((rule) => appSelectors.add(rule.selector))
    expect(
      [...appSelectors].filter((selector) => packageSelectors.has(selector))
    ).toEqual([])

    const packageRadius = cssSource.match(/\.rounded-md\{([^}]+)\}/)?.[1]
    expect(packageRadius).toContain("border-radius:calc(var(--radius) * .8)")

    for (const importPath of [
      "apps/web/app/layout.tsx",
      "apps/web/.storybook/preview.tsx",
    ]) {
      const imports = await readFile(
        path.join(repositoryRoot, importPath),
        "utf8"
      )
      expect(
        imports.indexOf('import "@nwl/surfacekit/globals.css"')
      ).toBeLessThan(
        imports.indexOf('import "./reference-app.css"') >= 0
          ? imports.indexOf('import "./reference-app.css"')
          : imports.indexOf('import "../app/reference-app.css"')
      )
    }
  }, 30_000)

  it("loads compiled CSS from the exact tarball without Tailwind installed", async () => {
    await expect(
      access(path.join(consumerRoot, "node_modules/tailwindcss"))
    ).rejects.toThrow()
    expect(consumerLockfile).not.toMatch(/(?:^|\/)tailwindcss@/m)
    expect(
      (await readdir(path.join(consumerRoot, "node_modules/.pnpm"))).some(
        (entry) => entry.startsWith("tailwindcss@")
      )
    ).toBe(false)

    await buildConsumer("css-entry.js")
    const emittedCss = (await listFiles(path.join(consumerRoot, "dist"))).find(
      (file) => file.endsWith(".css")
    )
    expect(emittedCss).toBeDefined()
    const css = await readFile(emittedCss!, "utf8")
    expect(css).toContain("--background:")
    expect(css).not.toMatch(
      /@(import|source|apply|theme|custom-variant|plugin|config)\b/
    )
  })

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
    const repeatConsumerRoot = path.join(temporaryRoot, "consumer-repeat")
    const repeatedLockfile = await createOfflineConsumer(repeatConsumerRoot)
    expect(repeatedLockfile).toBe(consumerLockfile)

    await buildConsumer("button-entry.js")
    const bundlePath = path.join(consumerRoot, "dist/surfacekit-consumer.js")
    const firstBundle = await readFile(bundlePath)
    await rm(path.join(consumerRoot, "dist"), { recursive: true, force: true })
    await buildConsumer("button-entry.js")
    const secondBundle = await readFile(bundlePath)
    expect(secondBundle).toEqual(firstBundle)

    const bundleGzipBytes = gzipSync(secondBundle, { level: 9 }).byteLength
    expect(bundleGzipBytes).toBeLessThanOrEqual(15 * 1024)
    if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
      process.stdout.write(
        `SurfaceKit Button bundle gzip: ${bundleGzipBytes} bytes\n`
      )
    }
  }, 120_000)
})
