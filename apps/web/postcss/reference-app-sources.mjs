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

function registerDependencies(result, scanners, watchedDirectories) {
  const parent = result.opts.from
  const files = new Set(scanners.flatMap(({ files }) => files))
  const directories = new Map()

  for (const scanner of scanners) {
    for (const { base, pattern } of scanner.globs) {
      watchedDirectories.add(path.resolve(base))
      directories.set(`${path.resolve(base)}\0${pattern}`, {
        dir: path.resolve(base),
        glob: pattern.replaceAll("\\", "/"),
      })
    }
  }
  for (const file of files) watchedDirectories.add(path.dirname(file))

  // The normal file/glob messages drive framework watch invalidation. Keep
  // source directories as dependencies too so Tailwind's cached compiler sees
  // a changed mtime when a previously scanned source file is removed.
  for (const file of [...files, ...watchedDirectories].sort()) {
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
  const watchedDirectories = new Set()

  return {
    postcssPlugin: "surfacekit-reference-app-sources",
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
      registerDependencies(
        result,
        [app.scanner, packageSources.scanner],
        watchedDirectories
      )

      root.walkAtRules("source", (atRule) => atRule.remove())
      for (const candidate of [...app.candidates]
        .filter((value) => !packageSources.candidates.has(value))
        .sort()) {
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
