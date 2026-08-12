import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { describe, expect, it } from "vitest"

const execFileAsync = promisify(execFile)
const generatedSegments = [
  "node_modules/",
  ".pnpm-store/",
  ".next/",
  "coverage/",
  "storybook-static/",
  "test-results/",
  "playwright-report/",
  "blob-report/",
  ".vitest/",
  ".vite/",
  ".turbo/",
  ".cache/",
  ".storybook-cache/",
  ".nyc_output/",
]

describe("repository hygiene", () => {
  it("does not track generated output or dependency caches", async () => {
    const { stdout } = await execFileAsync("git", ["ls-files"])
    const trackedGeneratedFiles = stdout
      .split("\n")
      .filter(Boolean)
      .filter((file) =>
        generatedSegments.some(
          (segment) => file.startsWith(segment) || file.includes(`/${segment}`)
        )
      )

    expect(trackedGeneratedFiles).toEqual([])
  })

  it("ignores representative generated paths", async () => {
    const candidates = [
      "node_modules/probe",
      ".pnpm-store/probe",
      "apps/web/.next/probe",
      "coverage/probe",
      "storybook-static/probe",
      "test-results/probe",
      "playwright-report/probe",
      "blob-report/probe",
      ".vitest/probe",
      ".vite/probe",
      ".turbo/probe",
      ".cache/probe",
      ".storybook-cache/probe",
      ".nyc_output/probe",
      ".worktrees/probe",
    ]
    const { stdout } = await execFileAsync("git", [
      "check-ignore",
      "--no-index",
      ...candidates,
    ])

    expect(stdout.trim().split("\n").sort()).toEqual(candidates.sort())
  })
})
