import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const staticDir = path.join(process.cwd(), "apps/web/.next/static")
const serverOnlyPatterns = [
  /DATABASE_URL/,
  /PRIVATE_KEY/,
  /SERVER_SECRET/,
  /SERVICE_ROLE/,
  /SESSION_SECRET/,
  /process\.env\.(?!NEXT_PUBLIC_)[A-Z0-9_]*(SECRET|TOKEN|KEY|PASSWORD|URL)/,
]

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name)

      return entry.isDirectory() ? listFiles(entryPath) : entryPath
    })
  )

  return nested.flat()
}

let files

try {
  files = await listFiles(staticDir)
} catch (error) {
  throw new Error(
    `Build output is missing at ${staticDir}. Run pnpm --filter web build before pnpm test:env.`,
    {
      cause: error,
    }
  )
}

const clientFiles = files.filter((file) => /\.(js|css|html|json)$/.test(file))
const matches = []

for (const file of clientFiles) {
  const contents = await readFile(file, "utf8")
  const pattern = serverOnlyPatterns.find((candidate) =>
    candidate.test(contents)
  )

  if (pattern) {
    matches.push(`${path.relative(process.cwd(), file)} matched ${pattern}`)
  }
}

if (matches.length > 0) {
  throw new Error(
    `Server-only environment markers were found in client bundles:\n${matches.join("\n")}`
  )
}

console.log(
  `Checked ${clientFiles.length} client bundle files for server-only environment markers.`
)
