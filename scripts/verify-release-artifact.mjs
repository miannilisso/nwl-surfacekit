import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import path from "node:path"

const [tarball, expectedDigest, expectedVersion] = process.argv.slice(2)
assert(
  tarball && expectedDigest && expectedVersion,
  "Usage: verify-release-artifact.mjs <tarball> <sha256> <version>"
)
assert.match(expectedDigest, /^[a-f0-9]{64}$/, "Invalid expected SHA-256")
assert.match(expectedVersion, /^\d+\.\d+\.\d+$/, "Invalid expected version")

const bytes = readFileSync(tarball)
const digest = createHash("sha256").update(bytes).digest("hex")
assert.equal(digest, expectedDigest, "Release tarball SHA-256 mismatch")
const manifest = JSON.parse(
  execFileSync(
    "tar",
    ["-xOzf", path.resolve(tarball), "package/package.json"],
    {
      encoding: "utf8",
    }
  )
)
assert.equal(manifest.name, "@nwl/surfacekit", "Unexpected package name")
assert.equal(
  manifest.version,
  expectedVersion,
  "Release tag/package version mismatch"
)
console.log(`Verified @nwl/surfacekit@${expectedVersion}: sha256:${digest}`)
