import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import process from "node:process"

import tailwindcss from "@tailwindcss/postcss"
import postcss from "postcss"

import { referenceAppSources } from "../postcss/reference-app-sources.mjs"

function readArgument(name) {
  const index = process.argv.indexOf(name)
  const value = index >= 0 ? process.argv[index + 1] : undefined
  if (!value) throw new Error(`Missing required ${name} argument`)
  return value
}

const input = readArgument("--input")
const output = readArgument("--output")
const from = readArgument("--from")
const appRoot = fileURLToPath(new URL("..", import.meta.url))
const packageSourceRoot = fileURLToPath(
  new URL("../../../packages/ui/src", import.meta.url)
)
const source = await readFile(input, "utf8")
const result = await postcss([
  referenceAppSources({
    appRoot,
    packageSourceRoot,
    referenceCssPath: from,
  }),
  tailwindcss(),
]).process(source, {
  from,
  to: output,
})

await writeFile(output, result.css)
