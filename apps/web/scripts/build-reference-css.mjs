import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import process from "node:process"

import tailwindcss from "@tailwindcss/postcss"
import postcss from "postcss"

import { dedupeSurfaceKitCss } from "../postcss/dedupe-surfacekit-css.mjs"

function readArgument(name) {
  const index = process.argv.indexOf(name)
  const value = index >= 0 ? process.argv[index + 1] : undefined
  if (!value) throw new Error(`Missing required ${name} argument`)
  return value
}

const input = readArgument("--input")
const output = readArgument("--output")
const from = readArgument("--from")
const packageCssPath = fileURLToPath(
  new URL("../../../packages/ui/dist/globals.css", import.meta.url)
)
const source = await readFile(input, "utf8")
const result = await postcss([
  tailwindcss(),
  dedupeSurfaceKitCss({ packageCssPath, referenceCssPath: from }),
]).process(source, {
  from,
  to: output,
})

await writeFile(output, result.css)
