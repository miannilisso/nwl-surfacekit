import { createHash } from "node:crypto"
import path from "node:path"

import { Scanner } from "@tailwindcss/oxide"

const appSourcePatterns = [
  "app/**/*.{ts,tsx}",
  "components/**/*.{ts,tsx}",
  "stories/**/*.{ts,tsx}",
  ".storybook/**/*.{ts,tsx}",
]

const packageSourcePatterns = [
  "components/**/*.{ts,tsx}",
  "patterns/**/*.{ts,tsx}",
  "hooks/**/*.{ts,tsx}",
  "lib/**/*.{ts,tsx}",
]

const candidateFingerprintPrefix = "surfacekit-candidates:"

function scan(base, patterns, negatedPatterns = []) {
  const scanner = new Scanner({
    sources: [
      ...patterns.map((pattern) => ({ base, pattern, negated: false })),
      ...negatedPatterns.map((pattern) => ({
        base,
        pattern,
        negated: true,
      })),
    ],
  })
  return { candidates: new Set(scanner.scan()), scanner }
}

function registerDependencies(result, scanners) {
  const parent = result.opts.from
  const files = new Set(scanners.flatMap(({ files }) => files))
  const directories = new Map()

  for (const scanner of scanners) {
    for (const { base, pattern } of scanner.globs) {
      const directory = path.resolve(base)
      directories.set(`${directory}\0${pattern}`, {
        dir: directory,
        glob: pattern.replaceAll("\\", "/"),
      })
    }
  }

  // PostCSS `dependency` messages must point to files; Turbopack treats a
  // directory-valued dependency as a file read and aborts the build. Source
  // directories are covered by the corresponding `dir-dependency` globs.
  for (const file of [...files].sort()) {
    result.messages.push({
      type: "dependency",
      plugin: "surfacekit-reference-app-sources",
      file: path.resolve(file),
      parent,
    })
  }
  for (const { dir, glob } of [...directories.values()].sort((left, right) =>
    `${left.dir}\0${left.glob}`.localeCompare(`${right.dir}\0${right.glob}`)
  )) {
    result.messages.push({
      type: "dir-dependency",
      plugin: "surfacekit-reference-app-sources",
      dir,
      glob,
      parent,
    })
  }
}

function cssString(value) {
  return `"${value
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\n", "\\a ")}"`
}

export function referenceAppSources({
  appRoot,
  packageSourceRoot,
  referenceCssPath,
}) {
  return {
    postcssPlugin: "surfacekit-reference-app-sources",
    OnceExit(root) {
      root.walkComments((comment) => {
        if (comment.text.startsWith(candidateFingerprintPrefix)) {
          comment.remove()
        }
      })
    },
    Once(root, { result }) {
      if (
        !root.source?.input.file ||
        path.resolve(root.source.input.file) !== path.resolve(referenceCssPath)
      ) {
        return
      }

      const app = scan(appRoot, appSourcePatterns)
      const packageSources = scan(packageSourceRoot, packageSourcePatterns, [
        "**/*.test.{ts,tsx}",
      ])
      registerDependencies(result, [app.scanner, packageSources.scanner])

      root.walkAtRules("source", (atRule) => atRule.remove())
      const appOnlyCandidates = [...app.candidates]
        .filter((value) => !packageSources.candidates.has(value))
        .sort()
      const fingerprint = createHash("sha256")
        .update(appOnlyCandidates.join("\0"))
        .digest("hex")
      const fingerprintComment = `${candidateFingerprintPrefix}${fingerprint}`
      root.prepend({ text: fingerprintComment })
      if (root.source?.input.css) {
        root.source.input.css = `${root.source.input.css}\n/* ${fingerprintComment} */`
      }
      for (const candidate of appOnlyCandidates) {
        root.append({
          name: "source",
          params: `inline(${cssString(candidate)})`,
        })
      }
    },
  }
}

referenceAppSources.postcss = true

export default referenceAppSources
