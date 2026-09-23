import { execFile } from "node:child_process"
import { promisify } from "node:util"

import { expect, it } from "vitest"

const execFileAsync = promisify(execFile)

it("keeps the package-rebuilding consumer gate out of default Vitest discovery", async () => {
  const { stdout } = await execFileAsync(
    "pnpm",
    ["exec", "vitest", "list", "--filesOnly"],
    { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 }
  )

  expect(stdout).not.toContain("tests/consumers/clean-consumers.test.ts")
  expect(stdout).toContain("tests/contracts/package-distribution.test.ts")
}, 30_000)

it("discovers the consumer gate only in its dedicated Vitest config", async () => {
  const { stdout } = await execFileAsync(
    "pnpm",
    [
      "exec",
      "vitest",
      "list",
      "--config",
      "vitest.consumers.config.ts",
      "--filesOnly",
    ],
    { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 }
  )

  expect(stdout).toContain("tests/consumers/clean-consumers.test.ts")
  expect(stdout).not.toContain("tests/contracts/package-distribution.test.ts")
}, 30_000)
