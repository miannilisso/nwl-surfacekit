import path from "node:path"

import { expect, it } from "vitest"

import { resolveReferenceAppPaths } from "../../apps/web/postcss/reference-app-paths.mjs"

const repositoryRoot = process.cwd()
const appRoot = path.join(repositoryRoot, "apps/web")

it.each([
  ["workspace root", repositoryRoot],
  ["web workspace", appRoot],
])("resolves reference PostCSS paths from the %s", (_label, cwd) => {
  expect(resolveReferenceAppPaths(cwd)).toEqual({
    appRoot,
    packageSourceRoot: path.join(repositoryRoot, "packages/ui/src"),
    referenceCssPath: path.join(appRoot, "app/reference-app.css"),
    sourcePlugin: path.join(appRoot, "postcss/reference-app-sources.mjs"),
  })
})

it("rejects an unrelated working directory instead of scanning the wrong tree", () => {
  expect(() =>
    resolveReferenceAppPaths(path.parse(repositoryRoot).root)
  ).toThrow(/Unable to locate the SurfaceKit web workspace/)
})
