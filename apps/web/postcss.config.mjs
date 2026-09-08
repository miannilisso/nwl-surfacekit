import { resolveReferenceAppPaths } from "./postcss/reference-app-paths.mjs"

// Turbopack bundles this configuration before executing it, so relative URLs
// derived from import.meta.url would point into `.next/build/assets`. Package
// scripts execute Next with the web workspace as cwd; anchor source discovery
// there to keep production and development builds deterministic.
const { appRoot, packageSourceRoot, referenceCssPath, sourcePlugin } =
  resolveReferenceAppPaths()

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    [sourcePlugin]: { appRoot, packageSourceRoot, referenceCssPath },
    "@tailwindcss/postcss": {},
  },
}

export default config
