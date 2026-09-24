import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const [tarball, version, output, ...args] = process.argv.slice(2)
assert(
  tarball && version && output,
  "Usage: generate-release-sboms.mjs <tarball> <version> <output-dir> [--input licenses.json]"
)
assert.match(version, /^\d+\.\d+\.\d+$/)
const inputIndex = args.indexOf("--input")
const inventory = JSON.parse(
  inputIndex >= 0
    ? readFileSync(args[inputIndex + 1], "utf8")
    : execFileSync(
        "pnpm",
        ["--filter", "@nwl/surfacekit", "licenses", "list", "--prod", "--json"],
        { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
      )
)
const digest = createHash("sha256").update(readFileSync(tarball)).digest("hex")
const dependencies = new Map()
for (const [license, entries] of Object.entries(inventory)) {
  assert(license && Array.isArray(entries), "Invalid license inventory")
  for (const entry of entries) {
    assert(entry.name && Array.isArray(entry.versions), "Invalid license entry")
    for (const packageVersion of entry.versions) {
      const key = `${entry.name}@${packageVersion}`
      if (dependencies.has(key))
        assert.equal(
          dependencies.get(key).license,
          license,
          `Conflicting license for ${key}`
        )
      dependencies.set(key, {
        name: entry.name,
        version: packageVersion,
        license,
      })
    }
  }
}
const packages = [...dependencies.values()].sort((a, b) =>
  `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`)
)
const purl = (name, packageVersion) =>
  `pkg:npm/${name.startsWith("@") ? `%40${name.slice(1)}` : name}@${packageVersion}`
const spdxId = (index) => `SPDXRef-Package-${index}`
const subject = {
  SPDXID: "SPDXRef-SurfaceKit",
  name: "@nwl/surfacekit",
  versionInfo: version,
  downloadLocation: "NOASSERTION",
  filesAnalyzed: false,
  licenseConcluded: "NOASSERTION",
  licenseDeclared: "Apache-2.0",
  copyrightText: "NOASSERTION",
  checksums: [{ algorithm: "SHA256", checksumValue: digest }],
  externalRefs: [
    {
      referenceCategory: "PACKAGE-MANAGER",
      referenceType: "purl",
      referenceLocator: purl("@nwl/surfacekit", version),
    },
  ],
}
const spdx = {
  spdxVersion: "SPDX-2.3",
  dataLicense: "CC0-1.0",
  SPDXID: "SPDXRef-DOCUMENT",
  name: `surfacekit-${version}`,
  documentNamespace: `https://github.com/nanewarelabs/nwl-surfacekit/sbom/${digest}`,
  creationInfo: {
    created: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    creators: ["Tool: surfacekit-release-sboms"],
  },
  packages: [
    subject,
    ...packages.map((entry, index) => ({
      SPDXID: spdxId(index + 1),
      name: entry.name,
      versionInfo: entry.version,
      downloadLocation: "NOASSERTION",
      filesAnalyzed: false,
      licenseConcluded: "NOASSERTION",
      licenseDeclared: entry.license,
      copyrightText: "NOASSERTION",
      externalRefs: [
        {
          referenceCategory: "PACKAGE-MANAGER",
          referenceType: "purl",
          referenceLocator: purl(entry.name, entry.version),
        },
      ],
    })),
  ],
  relationships: [
    {
      spdxElementId: "SPDXRef-DOCUMENT",
      relationshipType: "DESCRIBES",
      relatedSpdxElement: "SPDXRef-SurfaceKit",
    },
  ],
}
const cyclonedx = {
  bomFormat: "CycloneDX",
  specVersion: "1.6",
  serialNumber: `urn:uuid:${digest.slice(0, 8)}-${digest.slice(8, 12)}-4${digest.slice(13, 16)}-8${digest.slice(17, 20)}-${digest.slice(20, 32)}`,
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    tools: {
      components: [{ type: "application", name: "surfacekit-release-sboms" }],
    },
    component: {
      type: "library",
      name: "@nwl/surfacekit",
      version,
      "bom-ref": purl("@nwl/surfacekit", version),
      purl: purl("@nwl/surfacekit", version),
      hashes: [{ alg: "SHA-256", content: digest }],
      licenses: [{ license: { id: "Apache-2.0" } }],
    },
  },
  components: packages.map((entry) => ({
    type: "library",
    name: entry.name,
    version: entry.version,
    "bom-ref": purl(entry.name, entry.version),
    purl: purl(entry.name, entry.version),
    licenses: [{ expression: entry.license }],
  })),
}
mkdirSync(output, { recursive: true })
writeFileSync(
  path.join(output, "sbom.spdx.json"),
  JSON.stringify(spdx, null, 2) + "\n"
)
writeFileSync(
  path.join(output, "sbom.cdx.json"),
  JSON.stringify(cyclonedx, null, 2) + "\n"
)
console.log(
  `Generated SPDX and CycloneDX SBOMs for ${packages.length} production packages and sha256:${digest}`
)
