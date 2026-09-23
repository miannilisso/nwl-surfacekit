import { execFileSync, spawn } from "node:child_process"
import { mkdtemp, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { once } from "node:events"

import { expect, it } from "vitest"

it("removes its owned fixture directory when a timeout sends SIGTERM", async () => {
  const sandbox = await mkdtemp(
    path.join(tmpdir(), "surfacekit-termination-test-")
  )
  const child = spawn(
    process.execPath,
    [path.join(process.cwd(), "tests/consumers/run.mjs")],
    {
      cwd: process.cwd(),
      detached: process.platform !== "win32",
      env: { ...process.env, TMPDIR: sandbox },
      stdio: ["ignore", "ignore", "pipe"],
    }
  )

  try {
    let fixtureRoots: string[] = []
    for (let attempt = 0; attempt < 50; attempt += 1) {
      fixtureRoots = (await readdir(sandbox)).filter((name) =>
        name.startsWith("surfacekit-clean-consumers-")
      )
      if (fixtureRoots.length) break
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    expect(fixtureRoots).toHaveLength(1)

    let buildGroup = ""
    if (process.platform !== "win32") {
      for (let attempt = 0; attempt < 50; attempt += 1) {
        const processes = execFileSync("ps", ["-eo", "pid=,ppid=,pgid="], {
          encoding: "utf8",
        })
        const build = processes
          .split("\n")
          .map((line) => line.trim().split(/\s+/))
          .find(([, parent]) => parent === String(child.pid))
        if (build) {
          buildGroup = build[2]
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      expect(buildGroup).not.toBe("")
    }

    const stopped = once(child, "close")
    child.kill("SIGTERM")
    await Promise.race([
      stopped,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Runner ignored SIGTERM")), 10_000)
      ),
    ])
    expect(
      (await readdir(sandbox)).filter((name) =>
        name.startsWith("surfacekit-clean-consumers-")
      )
    ).toEqual([])
    if (process.platform !== "win32") {
      const processes = execFileSync(
        "ps",
        ["-eo", "pid=,pgid=,ppid=,stat=,cmd="],
        {
          encoding: "utf8",
        }
      )
      const liveGroupMembers = processes.split("\n").filter((line) => {
        const [, group, , state] = line.trim().split(/\s+/)
        return (
          [String(child.pid), buildGroup].includes(group) &&
          !state?.startsWith("Z")
        )
      })
      expect(liveGroupMembers).toEqual([])
    }
  } finally {
    try {
      if (process.platform === "win32") child.kill("SIGKILL")
      else process.kill(-child.pid!, "SIGKILL")
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error
    }
    child.stderr.destroy()
    await rm(sandbox, { recursive: true, force: true })
  }
}, 30_000)

it.skipIf(process.platform === "win32")(
  "stops a detached production server before removing its fixture",
  async () => {
    const sandbox = await mkdtemp(
      path.join(tmpdir(), "surfacekit-termination-test-")
    )
    const child = spawn(
      process.execPath,
      [path.join(process.cwd(), "tests/consumers/run.mjs")],
      {
        cwd: process.cwd(),
        detached: true,
        env: { ...process.env, TMPDIR: sandbox },
        stdio: ["ignore", "ignore", "pipe"],
      }
    )
    let serverPid = 0
    let stderr = ""
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString()
    })

    try {
      for (let attempt = 0; attempt < 200; attempt += 1) {
        const processes = execFileSync(
          "ps",
          ["-eo", "pid=,ppid=,pgid=,stat=,args="],
          {
            encoding: "utf8",
          }
        )
        const server = processes.split("\n").find((line) => {
          const [, parent] = line.trim().split(/\s+/)
          return (
            parent === String(child.pid) && line.includes("next start --port")
          )
        })
        if (server) {
          serverPid = Number(server.trim().split(/\s+/)[0])
          break
        }
        if (child.exitCode !== null)
          throw new Error(`Runner exited before server: ${stderr}`)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      expect(serverPid).toBeGreaterThan(0)

      const stopped = once(child, "close")
      child.kill("SIGTERM")
      await Promise.race([
        stopped,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Runner ignored SIGTERM")), 20_000)
        ),
      ])
      expect(
        (await readdir(sandbox)).filter((name) =>
          name.startsWith("surfacekit-clean-consumers-")
        )
      ).toEqual([])

      const processes = execFileSync("ps", ["-eo", "pgid=,stat="], {
        encoding: "utf8",
      })
      const liveServerGroup = processes.split("\n").filter((line) => {
        const [group, state] = line.trim().split(/\s+/)
        return group === String(serverPid) && !state?.startsWith("Z")
      })
      expect(liveServerGroup).toEqual([])
    } finally {
      for (const pid of [serverPid, child.pid]) {
        if (!pid) continue
        try {
          process.kill(-pid, "SIGKILL")
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error
        }
      }
      child.stderr.destroy()
      await rm(sandbox, { recursive: true, force: true })
    }
  },
  150_000
)
