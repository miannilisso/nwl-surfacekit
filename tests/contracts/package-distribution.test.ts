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

import { transform, transformStyleAttribute } from "lightningcss"
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

function canonicalCss(css: string) {
  let result = css
  for (let pass = 0; pass < 4; pass += 1) {
    const next = transform({
      filename: "contract.css",
      code: Buffer.from(result),
      minify: true,
    }).code.toString()
    if (next === result) return result
    result = next
  }
  return result
}

function canonicalAtRule(name: string, params: string) {
  const body = name.endsWith("keyframes")
    ? "to{opacity:1}"
    : ".contract{--contract:0}"
  const atRule = postcss.parse(canonicalCss(`@${name} ${params}{${body}}`))
    .first as postcss.AtRule
  return [atRule.name, atRule.params]
}

function atRuleContext(rule: postcss.Rule | postcss.AtRule) {
  const context: Array<[string, string]> = []
  let parent = rule.parent
  while (parent) {
    if (parent.type === "atrule") {
      context.unshift(
        canonicalAtRule(parent.name, parent.params) as [string, string]
      )
    }
    parent = parent.parent
  }
  return JSON.stringify(context)
}

function canonicalSelector(selector: string) {
  const rule = postcss.parse(
    canonicalCss(`${selector}{--surfacekit-selector:0}`)
  ).first as postcss.Rule
  return rule.selector
}

function canonicalSelectorForRule(rule: postcss.Rule, selector: string) {
  let parent = rule.parent
  while (parent) {
    if (parent.type === "atrule" && parent.name.endsWith("keyframes")) {
      return selector.trim().replace(/\s+/g, "")
    }
    parent = parent.parent
  }
  return canonicalSelector(selector)
}

function canonicalValue(value: string) {
  return canonicalDeclarationBlock(
    postcss.parse(`.contract{--contract-value:${value}}`).first as postcss.Rule,
    new Map()
  ).slice("--contract-value:".length)
}

function splitVarArguments(value: string) {
  let depth = 0
  let quote = ""
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if (quote) {
      if (character === "\\") index += 1
      else if (character === quote) quote = ""
    } else if (character === '"' || character === "'") quote = character
    else if (character === "(") depth += 1
    else if (character === ")") depth -= 1
    else if (character === "," && depth === 0) {
      return [value.slice(0, index).trim(), value.slice(index + 1).trim()]
    }
  }
  return [value.trim()]
}

function findClosingParenthesis(value: string, start: number) {
  let depth = 1
  let quote = ""
  for (let index = start; index < value.length; index += 1) {
    const character = value[index]
    if (quote) {
      if (character === "\\") index += 1
      else if (character === quote) quote = ""
    } else if (character === '"' || character === "'") quote = character
    else if (character === "(") depth += 1
    else if (character === ")" && --depth === 0) return index
  }
  return -1
}

function normalizeKnownVarFallbacks(
  value: string,
  packageVariables: Map<string, Set<string>>
) {
  let result = ""
  let cursor = 0
  while (cursor < value.length) {
    const start = value.indexOf("var(", cursor)
    if (start < 0) return result + value.slice(cursor)
    const end = findClosingParenthesis(value, start + 4)
    if (end < 0) return result + value.slice(cursor)
    const [property, fallback] = splitVarArguments(value.slice(start + 4, end))
    const normalizedFallback = fallback
      ? normalizeKnownVarFallbacks(fallback, packageVariables)
      : undefined
    const fallbackMatches =
      normalizedFallback &&
      packageVariables.get(property)?.has(canonicalValue(normalizedFallback))
    result += `${value.slice(cursor, start)}var(${property}${fallbackMatches || !normalizedFallback ? "" : `,${normalizedFallback}`})`
    cursor = end + 1
  }
  return result
}

function packageVariableValues(css: string) {
  const variables = new Map<string, Set<string>>()
  postcss.parse(canonicalCss(css)).walkDecls(/^--/, ({ prop, value }) => {
    const values = variables.get(prop) ?? new Set()
    values.add(canonicalValue(value))
    variables.set(prop, values)
  })
  return variables
}

function canonicalDeclarationBlock(
  rule: postcss.Rule | postcss.AtRule,
  packageVariables: Map<string, Set<string>>
) {
  let result = rule.nodes
    .filter((node): node is postcss.Declaration => node.type === "decl")
    .map(
      (declaration) =>
        `${declaration.prop}:${normalizeKnownVarFallbacks(declaration.value, packageVariables)}${declaration.important ? "!important" : ""}`
    )
    .join(";")
  for (let pass = 0; pass < 4; pass += 1) {
    const next = transformStyleAttribute({
      code: Buffer.from(result),
      minify: true,
    }).code.toString()
    if (next === result) return result
    result = next
  }
  return result
}

function canonicalRuleMap(
  css: string,
  packageVariables: Map<string, Set<string>>
) {
  const rules = new Map<
    string,
    Map<string, { important: boolean; value: string }>
  >()
  postcss.parse(canonicalCss(css)).walkRules((rule) => {
    const context = atRuleContext(rule)
    const declarations = postcss.parse(
      `.contract{${canonicalDeclarationBlock(rule, packageVariables)}}`
    ).first as postcss.Rule
    for (const selector of rule.selectors) {
      const key = JSON.stringify([
        context,
        canonicalSelectorForRule(rule, selector),
      ])
      const effective = rules.get(key) ?? new Map()
      for (const node of declarations.nodes) {
        if (node.type !== "decl") continue
        const current = effective.get(node.prop)
        if (!current?.important || node.important) {
          effective.set(node.prop, {
            important: Boolean(node.important),
            value: node.value,
          })
        }
      }
      rules.set(key, effective)
    }
  })
  return rules
}

type DeclarationValue = { important: boolean; value: string }
type DeclarationMap = Map<string, DeclarationValue>
type DeclarationOccurrences = Map<string, DeclarationMap[]>

const fontFaceIdentityDescriptors = [
  "font-family",
  "font-style",
  "font-weight",
  "font-stretch",
  "unicode-range",
]

function declarationAtRuleKey(
  atRule: postcss.AtRule,
  declarations: DeclarationMap
) {
  const identity =
    atRule.name === "font-face"
      ? fontFaceIdentityDescriptors.flatMap((descriptor) => {
          const value = declarations.get(descriptor)
          return value ? [[descriptor, value] as const] : []
        })
      : []
  return JSON.stringify([
    atRuleContext(atRule),
    atRule.name,
    atRule.params,
    identity,
  ])
}

function canonicalDeclarationAtRuleOccurrences(
  css: string,
  packageVariables: Map<string, Set<string>>
) {
  const atRules: DeclarationOccurrences = new Map()
  postcss.parse(canonicalCss(css)).walkAtRules((atRule) => {
    if (!atRule.nodes?.some((node) => node.type === "decl")) return
    const declarations = postcss.parse(
      `.contract{${canonicalDeclarationBlock(atRule, packageVariables)}}`
    ).first as postcss.Rule
    const effective: DeclarationMap = new Map()
    for (const node of declarations.nodes) {
      if (node.type !== "decl") continue
      const current = effective.get(node.prop)
      if (!current?.important || node.important) {
        effective.set(node.prop, {
          important: Boolean(node.important),
          value: node.value,
        })
      }
    }
    const key = declarationAtRuleKey(atRule, effective)
    const occurrences = atRules.get(key) ?? []
    occurrences.push(effective)
    atRules.set(key, occurrences)
  })
  return atRules
}

function declarationMapsEqual(left: DeclarationMap, right: DeclarationMap) {
  if (left.size !== right.size) return false
  for (const [property, leftValue] of left) {
    const rightValue = right.get(property)
    if (
      !rightValue ||
      leftValue.important !== rightValue.important ||
      leftValue.value !== rightValue.value
    ) {
      return false
    }
  }
  return true
}

function declarationMapConflicts(
  key: string,
  packageValues: DeclarationMap,
  appValues: DeclarationMap
) {
  const conflicts: string[] = []
  for (const [property, appValue] of appValues) {
    const packageValue = packageValues.get(property)
    if (
      packageValue &&
      (appValue.important !== packageValue.important ||
        appValue.value !== packageValue.value)
    ) {
      conflicts.push(
        `${key} ${property}: package=${JSON.stringify(packageValue)} app=${JSON.stringify(appValue)}`
      )
    }
  }
  return conflicts
}

function declarationConflicts(
  packageDeclarations: ReturnType<typeof canonicalRuleMap>,
  appDeclarations: ReturnType<typeof canonicalRuleMap>
) {
  const conflicts: string[] = []
  for (const [key, appValues] of appDeclarations) {
    const packageValues = packageDeclarations.get(key)
    if (!packageValues) continue
    conflicts.push(...declarationMapConflicts(key, packageValues, appValues))
  }
  return conflicts
}

function declarationAtRuleConflicts(
  packageDeclarations: DeclarationOccurrences,
  appDeclarations: DeclarationOccurrences
) {
  const conflicts = new Set<string>()
  for (const [key, appOccurrences] of appDeclarations) {
    const packageOccurrences = packageDeclarations.get(key)
    if (!packageOccurrences) continue
    const [, name] = JSON.parse(key) as [string, string]

    if (name === "property") {
      const packageValues = packageOccurrences.at(-1)
      const appValues = appOccurrences.at(-1)
      if (packageValues && appValues) {
        for (const conflict of declarationMapConflicts(
          key,
          packageValues,
          appValues
        )) {
          conflicts.add(conflict)
        }
      }
      continue
    }

    const unmatchedPackage = [...packageOccurrences]
    const unmatchedApp = appOccurrences.filter((appValues) => {
      const match = unmatchedPackage.findIndex((packageValues) =>
        declarationMapsEqual(packageValues, appValues)
      )
      if (match < 0) return true
      unmatchedPackage.splice(match, 1)
      return false
    })
    for (const appValues of unmatchedApp) {
      for (const packageValues of packageOccurrences) {
        for (const conflict of declarationMapConflicts(
          key,
          packageValues,
          appValues
        )) {
          conflicts.add(conflict)
        }
      }
    }
  }
  return [...conflicts]
}

function cascadeConflicts(packageCss: string, appCss: string) {
  const packageVariables = packageVariableValues(packageCss)
  return [
    ...declarationConflicts(
      canonicalRuleMap(packageCss, packageVariables),
      canonicalRuleMap(appCss, packageVariables)
    ),
    ...declarationAtRuleConflicts(
      canonicalDeclarationAtRuleOccurrences(packageCss, packageVariables),
      canonicalDeclarationAtRuleOccurrences(appCss, packageVariables)
    ),
  ]
}

it("accepts equivalent at-rule descriptors and rejects non-neutral descriptor conflicts", () => {
  const packageCss = `
    @layer properties {
      @property --surfacekit-contract-length {
        syntax: "<length>";
        inherits: false;
        initial-value: 0px;
      }
    }
  `
  const equivalentAppCss = `
    @layer properties {
      @property --surfacekit-contract-length {
        syntax: "<length>";
        inherits: false;
        initial-value: 0;
      }
    }
  `
  const conflictingAppCss = `
    @layer properties {
      @property --surfacekit-contract-length {
        syntax: "<length>";
        inherits: false;
        initial-value: 1px;
      }
    }
  `

  expect(cascadeConflicts(packageCss, equivalentAppCss)).toEqual([])
  expect(cascadeConflicts(packageCss, conflictingAppCss)).toEqual([
    expect.stringContaining("initial-value"),
  ])
})

it("does not hide an earlier page descriptor conflict behind a later match", () => {
  const packageCss = "@page contract { margin: 0; }"
  const appCss = `
    @page contract { margin: 1in; }
    @page contract { margin: 0; }
  `

  expect(cascadeConflicts(packageCss, appCss)).toEqual([
    expect.stringContaining("margin"),
  ])
})

it("compares repeated font faces as order-independent occurrences", () => {
  const firstFace = `
    @font-face {
      font-family: "Surface Repeated";
      font-style: normal;
      font-weight: 400;
      src: url("/first.woff2") format("woff2");
    }
  `
  const secondFace = `
    @font-face {
      font-family: "Surface Repeated";
      font-style: normal;
      font-weight: 400;
      src: url("/second.woff2") format("woff2");
    }
  `

  expect(
    cascadeConflicts(`${firstFace}${secondFace}`, `${secondFace}${firstFace}`)
  ).toEqual([])
})

it("uses the last property registration as the effective definition", () => {
  const property = (initialValue: string) => `
    @property --surfacekit-effective-property {
      syntax: "<length>";
      inherits: false;
      initial-value: ${initialValue};
    }
  `

  expect(
    cascadeConflicts(
      `${property("2px")}${property("0")}`,
      `${property("1px")}${property("0px")}`
    )
  ).toEqual([])
})

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
    const appCssOutput = path.join(temporaryRoot, "reference-app.css")
    const referenceSourcePath = path.join(
      repositoryRoot,
      "apps/web/app/reference-app.css"
    )
    const sentinelSource = await readFile(
      path.join(
        repositoryRoot,
        "apps/web/stories/fixtures/reference-css-sentinel.ts"
      ),
      "utf8"
    )
    expect(sentinelSource).toContain('"bg-[#123456]"')

    // Rebuild with the tracked app/story sentinel present: package discovery
    // must remain isolated from every reference-app source glob.
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
    expect(cssSource).toContain("--touch-target-size:")
    expect(cssSource).toContain("--scrollbar-size:")
    expect(cssSource).toContain("--scrollbar-thumb-hover:")
    expect(cssSource).toContain("--scrollbar-thumb-active:")
    expect(cssSource).toContain(".surface-scrollbar")
    expect(cssSource).toContain("@media (forced-colors:active)")
    expect(cssSource).toContain("::-webkit-scrollbar-thumb:active")
    expect(cssSource).not.toContain("#123456")
    expect(cssGzipBytes).toBeLessThanOrEqual(30 * 1024)
    if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
      process.stdout.write(`SurfaceKit CSS gzip: ${cssGzipBytes} bytes\n`)
    }

    await buildReferenceCss(
      referenceSourcePath,
      appCssOutput,
      referenceSourcePath
    )
    const appCss = await readFile(appCssOutput, "utf8")
    expect(appCss).toContain("#123456")
    expect(appCss).not.toMatch(/@(import|source|apply|theme|custom-variant)\b/)
    expect(appCss).not.toMatch(/@layer\s+(?:theme|base|components)\b/)
    expect(appCss).not.toContain(
      "*,:after,:before,::backdrop{box-sizing:border-box"
    )
    const appCssGzipBytes = gzipSync(appCss, { level: 9 }).byteLength
    expect(appCssGzipBytes).toBeLessThanOrEqual(8 * 1024)
    if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
      process.stdout.write(
        `SurfaceKit reference app CSS gzip: ${appCssGzipBytes} bytes\n`
      )
    }

    // Compare canonicalized copies of the real compiled artifacts. Package
    // utility selector/contexts stay package-owned, and any remaining overlap
    // must keep the same effective declaration values.
    const packageVariables = packageVariableValues(cssSource)
    const packageRules = canonicalRuleMap(cssSource, packageVariables)
    const appRules = canonicalRuleMap(appCss, packageVariables)
    const overlaps = [...appRules].filter(([key]) => packageRules.has(key))
    const duplicateUtilities = overlaps.filter(([key]) => {
      const [serializedContext] = JSON.parse(key) as [string, string]
      const context = JSON.parse(serializedContext) as Array<[string, string]>
      return context.some(
        ([name, params]) => name === "layer" && params === "utilities"
      )
    })
    expect(duplicateUtilities).toEqual([])
    expect(cascadeConflicts(cssSource, appCss)).toEqual([])

    const packageRadius = cssSource.match(/\.rounded-md\{([^}]+)\}/)?.[1]
    expect(packageRadius).toContain("border-radius:calc(var(--radius) * .8)")
    expect(canonicalCss(appCss)).not.toMatch(
      /\.(?:rounded-md|text-muted-foreground)\{/
    )

    for (const importPath of [
      "apps/web/app/layout.tsx",
      "apps/web/.storybook/preview.tsx",
    ]) {
      const imports = await readFile(
        path.join(repositoryRoot, importPath),
        "utf8"
      )
      const packageImportIndex = imports.indexOf(
        'import "@nwl/surfacekit/globals.css"'
      )
      const localImportIndex = Math.max(
        imports.indexOf('import "./reference-app.css"'),
        imports.indexOf('import "../app/reference-app.css"')
      )
      expect(packageImportIndex).toBeGreaterThanOrEqual(0)
      expect(localImportIndex).toBeGreaterThanOrEqual(0)
      expect(packageImportIndex).toBeLessThan(localImportIndex)
    }
  }, 30_000)

  it("preserves app-owned keyframes in the reference stylesheet compiler", async () => {
    const input = path.join(temporaryRoot, "reference-keyframes.css")
    const output = path.join(temporaryRoot, "reference-keyframes-output.css")
    await writeFile(
      input,
      "@keyframes surfacekit-reference-pulse{0%{opacity:.25}100%{opacity:1}}"
    )

    await buildReferenceCss(input, output, input)

    expect(await readFile(output, "utf8")).toContain(
      "@keyframes surfacekit-reference-pulse"
    )
  })

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
