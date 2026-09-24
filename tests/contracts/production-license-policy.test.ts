import { execFile } from "node:child_process"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

import { expect, it } from "vitest"

const execFileAsync = promisify(execFile)

async function check(license: string, name = "example") {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-license-test-"))
  try {
    const inventory = path.join(root, "inventory.json")
    const policy = path.join(root, "policy.json")
    await writeFile(
      inventory,
      JSON.stringify({ [license]: [{ name, versions: ["1.0.0"] }] })
    )
    await writeFile(
      policy,
      JSON.stringify({
        allowedExpressions: ["MIT"],
        packages: { "example@1.0.0": "MIT" },
      })
    )
    try {
      await execFileAsync(
        process.execPath,
        [
          "scripts/check-production-licenses.mjs",
          "--input",
          inventory,
          "--policy",
          policy,
        ],
        { cwd: process.cwd() }
      )
      return { passed: true, message: "" }
    } catch (error) {
      return { passed: false, message: String(error) }
    }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

it("accepts the approved locked production license", async () => {
  expect((await check("MIT")).passed).toBe(true)
})

it("rejects a changed license", async () => {
  expect((await check("ISC")).message).toContain("License changed")
})

it("rejects an unknown package", async () => {
  expect((await check("MIT", "new-package")).message).toContain(
    "Unknown package"
  )
})
