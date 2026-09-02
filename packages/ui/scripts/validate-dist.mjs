import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
const sourceRoot = path.join(packageRoot, "src")
const distRoot = path.join(packageRoot, "dist")

async function walk(root) {
  const entries = await readdir(root, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(root, entry.name)
      return entry.isDirectory() ? walk(entryPath) : [entryPath]
    })
  )
  return files.flat().sort()
}

const emittedModules = (await walk(distRoot)).filter((file) =>
  /\.(?:js|d\.ts)$/.test(file)
)
const importSpecifier =
  /(?:\bfrom\s*|\bimport\s*\(|\bimport\s*)["'](\.{1,2}\/[^"']+)["']/g

for (const file of emittedModules) {
  const source = await readFile(file, "utf8")
  if (source.includes("@nwl/surfacekit/")) {
    throw new Error(
      `Emitted self-alias remains in ${path.relative(packageRoot, file)}`
    )
  }

  for (const [, specifier] of source.matchAll(importSpecifier)) {
    if (!/\.(?:css|js|json)$/.test(specifier)) {
      throw new Error(
        `Extensionless ESM edge ${specifier} remains in ${path.relative(packageRoot, file)}`
      )
    }
  }
}

for (const sourceFile of (await walk(sourceRoot)).filter((file) =>
  /\.(?:ts|tsx)$/.test(file)
)) {
  const source = await readFile(sourceFile, "utf8")
  if (!/^"use client"/.test(source)) continue

  const emittedFile = path.join(
    distRoot,
    path.relative(sourceRoot, sourceFile).replace(/\.tsx?$/, ".js")
  )
  const emitted = await readFile(emittedFile, "utf8")
  if (!/^"use client";/.test(emitted)) {
    throw new Error(
      `Client directive was not preserved in ${path.relative(packageRoot, emittedFile)}`
    )
  }
}
