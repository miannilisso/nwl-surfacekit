import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

import { expect, it } from "vitest"

const execFileAsync = promisify(execFile)

it("describes the exact release tarball and production package in SPDX and CycloneDX", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "surfacekit-sbom-test-"))
  try {
    const tarball = path.join(root, "surfacekit.tgz")
    const inventory = path.join(root, "licenses.json")
    await writeFile(tarball, "known package bytes")
    await writeFile(
      inventory,
      JSON.stringify({ MIT: [{ name: "example", versions: ["2.0.0"] }] })
    )
    await execFileAsync(
      process.execPath,
      [
        "scripts/generate-release-sboms.mjs",
        tarball,
        "1.0.0",
        root,
        "--input",
        inventory,
      ],
      { cwd: process.cwd() }
    )
    const spdx = JSON.parse(
      await readFile(path.join(root, "sbom.spdx.json"), "utf8")
    )
    const cdx = JSON.parse(
      await readFile(path.join(root, "sbom.cdx.json"), "utf8")
    )
    const digest = createHash("sha256")
      .update("known package bytes")
      .digest("hex")
    expect(spdx.spdxVersion).toBe("SPDX-2.3")
    expect(spdx.packages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "@nwl/surfacekit",
          versionInfo: "1.0.0",
          checksums: [{ algorithm: "SHA256", checksumValue: digest }],
        }),
        expect.objectContaining({ name: "example", versionInfo: "2.0.0" }),
      ])
    )
    expect(cdx.bomFormat).toBe("CycloneDX")
    expect(cdx.metadata.component).toMatchObject({
      name: "@nwl/surfacekit",
      version: "1.0.0",
    })
    expect(cdx.components).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "example", version: "2.0.0" }),
      ])
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
