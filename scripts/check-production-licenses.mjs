import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const args = process.argv.slice(2)
function argument(name, fallback) {
  const index = args.indexOf(name)
  if (index < 0) return fallback
  if (!args[index + 1]) throw new Error(`${name} requires a path`)
  return args[index + 1]
}

const input = argument("--input", "")
const policyPath = argument(
  "--policy",
  path.join(root, "config/production-license-policy.json")
)
const licenses = JSON.parse(
  input
    ? readFileSync(input, "utf8")
    : execFileSync(
        "pnpm",
        ["--filter", "@nwl/surfacekit", "licenses", "list", "--prod", "--json"],
        { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
      )
)
const policy = JSON.parse(readFileSync(policyPath, "utf8"))
if (!Array.isArray(policy.allowedExpressions) || !policy.packages)
  throw new Error("Invalid production license policy")

const observed = new Map()
const errors = []
for (const [expression, entries] of Object.entries(licenses)) {
  if (!expression || /^unknown$/i.test(expression))
    errors.push(`Unknown license expression: ${expression}`)
  else if (!policy.allowedExpressions.includes(expression))
    errors.push(`Unapproved license expression: ${expression}`)
  if (!Array.isArray(entries))
    throw new Error(`Invalid inventory for ${expression}`)
  for (const entry of entries) {
    if (!entry.name || !Array.isArray(entry.versions) || !entry.versions.length)
      throw new Error(`Invalid inventory entry for ${expression}`)
    for (const version of entry.versions) {
      const key = `${entry.name}@${version}`
      if (observed.has(key) && observed.get(key) !== expression)
        errors.push(`Conflicting licenses for ${key}`)
      observed.set(key, expression)
      const expected = policy.packages[key]
      if (!expected) errors.push(`Unknown package: ${key}`)
      else if (expected !== expression)
        errors.push(`License changed for ${key}: ${expected} -> ${expression}`)
    }
  }
}
for (const key of Object.keys(policy.packages)) {
  if (!observed.has(key)) errors.push(`Approved package missing: ${key}`)
}
if (errors.length) {
  console.error(errors.join("\n"))
  process.exitCode = 1
} else {
  console.log(
    `Production license policy passed: ${observed.size} locked packages`
  )
}
