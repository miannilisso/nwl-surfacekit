import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

import { expect, it } from "vitest"

const execFileAsync = promisify(execFile)

it("rejects transferred bytes that differ from the packed SHA-256", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-artifact-test-"))
  try {
    const tarball = path.join(root, "surfacekit.tgz")
    await writeFile(tarball, "tampered artifact")
    await expect(
      execFileAsync(
        process.execPath,
        [
          "scripts/verify-release-artifact.mjs",
          tarball,
          "0".repeat(64),
          "1.0.0",
        ],
        { cwd: process.cwd() }
      )
    ).rejects.toThrow(/SHA-256 mismatch/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}, 20_000)

it("the clean consumers reject a transferred tarball before installing it if its digest changed", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-artifact-test-"))
  try {
    const tarball = path.join(root, "surfacekit.tgz")
    await writeFile(tarball, "tampered artifact")
    await expect(
      execFileAsync(process.execPath, ["tests/consumers/run.mjs"], {
        cwd: process.cwd(),
        env: {
          ...process.env,
          SURFACEKIT_RELEASE_TARBALL: tarball,
          SURFACEKIT_RELEASE_SHA256: "0".repeat(64),
        },
        timeout: 15_000,
      })
    ).rejects.toThrow(/Transferred tarball SHA-256 mismatch/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it("rejects a correct digest when the packed manifest does not match the tag version", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-artifact-test-"))
  try {
    const packageRoot = path.join(root, "package")
    const tarball = path.join(root, "surfacekit.tgz")
    await mkdir(packageRoot)
    await writeFile(
      path.join(packageRoot, "package.json"),
      JSON.stringify({ name: "@nwl/surfacekit", version: "0.1.0" })
    )
    await execFileAsync("tar", ["-czf", tarball, "-C", root, "package"])
    const digest = createHash("sha256")
      .update(await readFile(tarball))
      .digest("hex")
    await expect(
      execFileAsync(
        process.execPath,
        ["scripts/verify-release-artifact.mjs", tarball, digest, "1.0.0"],
        { cwd: process.cwd() }
      )
    ).rejects.toThrow(/version mismatch/)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
