import { spawnSync } from "node:child_process"
import { rm } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)))
const distRoot = path.join(packageRoot, "dist")

function run(script) {
  const result = spawnSync("pnpm", ["run", script], {
    cwd: packageRoot,
    env: process.env,
    stdio: "inherit",
  })

  if (result.status !== 0) process.exit(result.status ?? 1)
}

await rm(distRoot, { recursive: true, force: true })
run("build:js")
run("build:css")
run("validate:dist")
