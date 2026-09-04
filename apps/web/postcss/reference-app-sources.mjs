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
  return new Set(
    new Scanner({
      sources: [
        ...patterns.map((pattern) => ({ base, pattern, negated: false })),
        ...negatedPatterns.map((pattern) => ({
          base,
          pattern,
          negated: true,
        })),
      ],
    }).scan()
  )
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
    Once(root) {
      if (
        !root.source?.input.file ||
        path.resolve(root.source.input.file) !== path.resolve(referenceCssPath)
      ) {
        return
      }

      const appCandidates = scan(appRoot, appSourcePatterns)
      const packageCandidates = scan(packageSourceRoot, packageSourcePatterns, [
        "**/*.test.{ts,tsx}",
      ])

      root.walkAtRules("source", (atRule) => atRule.remove())
      for (const candidate of [...appCandidates]
        .filter((value) => !packageCandidates.has(value))
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
