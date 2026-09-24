import { readFile } from "node:fs/promises"

import { expect, it } from "vitest"

const read = (name: string) => readFile(name, "utf8")

it("runs full verification on Node 20 and focused checks on Node 22 and 24", async () => {
  const workflow = await read(".github/workflows/verify.yml")
  expect(workflow).toMatch(/node-version:\s*20\.19\.0/)
  expect(workflow).toMatch(/node:\s*\[22\.13\.0, 24\.0\.0\]/)
  expect(workflow).toContain("pnpm verify:ci")
  expect(workflow).toContain("pnpm test:consumers")
  expect(workflow).toContain("verification-required:")
  expect(workflow).toContain("needs.verify-primary.result")
  expect(workflow).toContain("needs.verify-supported.result")
})

it("wires executable release gates and preserves transferred artifact verification", async () => {
  const workflow = await read(".github/workflows/release.yml")
  expect(workflow).toContain("surfacekit-v1.0.0")
  expect(workflow).toContain("node scripts/check-release-gates.mjs identity")
  expect(workflow).toContain("node scripts/check-release-gates.mjs policy")
  expect(workflow).toContain(
    "node scripts/check-release-gates.mjs verification"
  )
  expect(workflow).toContain("verify-release-artifact.mjs")
  expect(workflow).toContain("SURFACEKIT_RELEASE_TARBALL")
  expect(workflow).toContain("sha256sum -c")
  expect(workflow).toContain("sbom-path:")
  expect(workflow).toContain("bundle-path")
  expect(workflow).toContain("--draft")
  expect(workflow).toContain("--draft=false")
  expect(workflow).toContain("gh release download")
  const publish = workflow.split("\n  publish:\n")[1]
  expect(publish).toBeDefined()
  expect(publish).not.toMatch(/actions\/checkout|pnpm|node scripts|npm /)
  expect(publish).toContain("contents: write")
  expect(publish).toContain("GH_REPO: ${{ github.repository }}")
  expect(publish).not.toContain("id-token: write")
})

it("pins every action and checks the license policy and Next config on every canonical run", async () => {
  const [verify, release, manifest] = await Promise.all([
    read(".github/workflows/verify.yml"),
    read(".github/workflows/release.yml"),
    read("package.json"),
  ])
  for (const workflow of [verify, release]) {
    for (const line of workflow
      .split("\n")
      .filter((line) => /\buses:/.test(line))) {
      expect(line).toMatch(/uses:\s+[^\s@]+@[0-9a-f]{40}\s+#\s+v[\d.]+/)
    }
    for (const checkout of workflow.matchAll(
      /uses:\s+actions\/checkout@[^\n]+\n\s+with:\n(\s+[^\n]+\n)+/g
    )) {
      expect(checkout[0]).toContain("persist-credentials: false")
    }
  }
  expect(manifest).toContain("check:production-licenses")
  expect(manifest).toContain("apps/web/next.config.test.ts")
})
