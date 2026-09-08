import { statSync } from "node:fs"
import path from "node:path"
import process from "node:process"

function isDirectory(candidate) {
  try {
    return statSync(candidate).isDirectory()
  } catch {
    return false
  }
}

function isFile(candidate) {
  try {
    return statSync(candidate).isFile()
  } catch {
    return false
  }
}

export function resolveReferenceAppPaths(cwd = process.cwd()) {
  const candidates = [cwd, path.join(cwd, "apps/web")].filter(
    (candidate, index, values) => values.indexOf(candidate) === index
  )
  const appRoot = candidates.find(
    (candidate) =>
      isDirectory(path.join(candidate, "app")) &&
      isDirectory(path.join(candidate, "postcss")) &&
      isFile(path.join(candidate, "package.json"))
  )

  if (!appRoot) {
    throw new Error(
      `Unable to locate the SurfaceKit web workspace from ${path.resolve(cwd)}`
    )
  }

  const packageSourceRoot = path.resolve(appRoot, "../../packages/ui/src")
  const referenceCssPath = path.join(appRoot, "app/reference-app.css")
  const sourcePlugin = path.join(appRoot, "postcss/reference-app-sources.mjs")

  if (
    !isDirectory(packageSourceRoot) ||
    !isFile(referenceCssPath) ||
    !isFile(sourcePlugin)
  ) {
    throw new Error(
      `SurfaceKit reference PostCSS inputs are incomplete under ${appRoot}`
    )
  }

  return { appRoot, packageSourceRoot, referenceCssPath, sourcePlugin }
}
