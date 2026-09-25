import { execFile } from "node:child_process"
import path from "node:path"
import { promisify } from "node:util"

import { expect, it } from "vitest"

const execFileAsync = promisify(execFile)
const runner = path.join(process.cwd(), "tests/consumers/run.mjs")

async function runFailureFixture(env: Record<string, string>) {
  try {
    await execFileAsync(process.execPath, [runner], {
      cwd: process.cwd(),
      env: { ...process.env, ...env },
      maxBuffer: 20 * 1024 * 1024,
      timeout: 900_000,
    })
    return { failed: false, stderr: "" }
  } catch (error) {
    const failure = error as Error & { stderr?: string }
    return { failed: true, stderr: failure.stderr ?? failure.message }
  }
}

it.each([
  ["tokens-only", "Button component CSS is missing"],
  ["light-only", "Button dark component CSS did not change"],
  ["transparent-theme", "Button component CSS is missing"],
] as const)(
  "fails the direct packed-consumer runner when the %s browser fixture lacks component styling",
  async (fixture, message) => {
    const result = await runFailureFixture({
      SURFACEKIT_TEST_CSS_FIXTURE: fixture,
    })
    expect(result.failed).toBe(true)
    expect(result.stderr).toContain(message)
    expect(result.stderr).not.toContain("SSR title absent")
    expect(result.stderr).not.toContain("Dark theme CSS did not change")
  },
  910_000
)

it.each([
  ["stderr", "Warning: fixture SSR warning"],
  ["stdout", "Warning: fixture SSR warning"],
  ["stderr-error", "Error: fixture SSR error"],
  ["stdout-deprecation", "DeprecationWarning: fixture SSR diagnostic"],
  ["stdout-type-error", "TypeError: fixture SSR diagnostic"],
  [
    "stdout-unhandled-rejection",
    "UnhandledPromiseRejectionWarning: fixture SSR diagnostic",
  ],
] as const)(
  "fails after a successful SSR response emits a chunked multiline diagnostic on %s",
  async (stream, diagnostic) => {
    const result = await runFailureFixture({
      SURFACEKIT_TEST_SERVER_WARNING: stream,
    })
    expect(result.failed).toBe(true)
    expect(result.stderr).toContain("Unexpected SSR server output")
    expect(result.stderr).toContain(diagnostic)
    expect(result.stderr).toContain("post-request detail")
  },
  910_000
)
