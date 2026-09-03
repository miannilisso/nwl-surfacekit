import { readFile } from "node:fs/promises"
import path from "node:path"

import postcss from "postcss"

export function dedupeSurfaceKitCss({ packageCssPath, referenceCssPath }) {
  return {
    postcssPlugin: "dedupe-surfacekit-css",
    async Once(root) {
      if (
        !root.source?.input.file ||
        path.resolve(root.source.input.file) !== path.resolve(referenceCssPath)
      ) {
        return
      }

      const packageRoot = postcss.parse(await readFile(packageCssPath, "utf8"))
      const packageSelectors = new Set()

      packageRoot.walkRules((rule) => packageSelectors.add(rule.selector))
      root.walkRules((rule) => {
        if (packageSelectors.has(rule.selector)) rule.remove()
      })
    },
  }
}

dedupeSurfaceKitCss.postcss = true

export default dedupeSurfaceKitCss
