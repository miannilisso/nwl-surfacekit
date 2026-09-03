import { fileURLToPath } from "node:url"

const dedupePlugin = fileURLToPath(
  new URL("./postcss/dedupe-surfacekit-css.mjs", import.meta.url)
)
const packageCssPath = fileURLToPath(
  new URL("../../packages/ui/dist/globals.css", import.meta.url)
)
const referenceCssPath = fileURLToPath(
  new URL("./app/reference-app.css", import.meta.url)
)

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    [dedupePlugin]: { packageCssPath, referenceCssPath },
  },
}

export default config
