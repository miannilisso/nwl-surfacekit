import path from "node:path"
import { fileURLToPath } from "node:url"

const sourcePlugin = fileURLToPath(
  new URL("./postcss/reference-app-sources.mjs", import.meta.url)
)
const referenceCssPath = fileURLToPath(
  new URL("./app/reference-app.css", import.meta.url)
)
const packageStylePath = fileURLToPath(
  new URL("../../packages/ui/src/styles/globals.css", import.meta.url)
)
const appRoot = path.dirname(path.dirname(referenceCssPath))
const packageSourceRoot = path.dirname(path.dirname(packageStylePath))

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    [sourcePlugin]: { appRoot, packageSourceRoot, referenceCssPath },
    "@tailwindcss/postcss": {},
  },
}

export default config
