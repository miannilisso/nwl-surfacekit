import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { createHash } from "node:crypto"
import {
  cp,
  mkdtemp,
  readFile,
  realpath,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises"
import { createRequire } from "node:module"
import { createServer } from "node:net"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

import { chromium } from "@playwright/test"

const repositoryRoot = process.cwd()
const fixtureSource = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures"
)
const packageRoot = path.join(repositoryRoot, "packages/ui")
const version = {
  react: "19.3.0",
  "react-dom": "19.3.0",
  "@types/react": "19.3.0",
  "@types/react-dom": "19.3.0",
  typescript: "6.0.3",
  next: "16.3.6",
  vite: "8.3.0",
}
const commands = []
const activeChildren = new Set()
let temporaryRootPromise
let cleanupPromise
let terminating = false

async function command(program, args, cwd, timeout = 180_000) {
  if (terminating) throw new Error("Consumer run is terminating")
  const label = `${program} ${args.join(" ")}`
  process.stderr.write(`${path.basename(cwd)}: ${label}\n`)
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, {
      cwd,
      detached: process.platform !== "win32",
      env: {
        ...process.env,
        CI: "1",
        TERM: "dumb",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    })
    activeChildren.add(child)
    let stdout = ""
    let stderr = ""
    let failure
    let killTimer
    const timeoutTimer = setTimeout(() => {
      failure = new Error(`${label} timed out after ${timeout} ms`)
      signalServer(child, "SIGTERM")
      killTimer = setTimeout(() => signalServer(child, "SIGKILL"), 5_000)
    }, timeout)
    for (const [stream, append] of [
      [
        child.stdout,
        (text) => {
          stdout += text
        },
      ],
      [
        child.stderr,
        (text) => {
          stderr += text
        },
      ],
    ]) {
      stream.on("data", (chunk) => {
        append(chunk.toString())
        if (stdout.length + stderr.length > 20 * 1024 * 1024) {
          failure = new Error(`${label} exceeded its output limit`)
          signalServer(child, "SIGKILL")
        }
      })
    }
    child.once("error", (error) => {
      failure = error
    })
    child.once("close", (code, signal) => {
      clearTimeout(timeoutTimer)
      clearTimeout(killTimer)
      activeChildren.delete(child)
      if (failure || code !== 0) {
        const error =
          failure ?? new Error(`${label} exited with ${code ?? signal}`)
        process.stderr.write(`${label} failed:\n${stdout}\n${stderr}\n`)
        reject(error)
        return
      }
      commands.push({
        cwd: path.basename(cwd),
        command: label,
        stdout: stdout.trim(),
      })
      resolve(stdout)
    })
  })
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex")
}

function publicSpecifiers(files) {
  const subpaths = files.flatMap((file) => {
    let match = /^dist\/components\/([^/]+)\/index\.js$/.exec(file)
    if (match) return [`components/${match[1]}`]
    match = /^dist\/patterns\/([^/]+)\/index\.js$/.exec(file)
    if (match) return [`patterns/${match[1]}`]
    if (file === "dist/patterns/index.js") return ["patterns"]
    match = /^dist\/(hooks|lib)\/([^/]+)\.js$/.exec(file)
    return match ? [`${match[1]}/${match[2]}`] : []
  })
  assert(subpaths.length > 0, "Tarball has no public JavaScript modules")
  return [...new Set(subpaths)].sort().map((name) => `@nwl/surfacekit/${name}`)
}

async function freePort() {
  const server = createServer()
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  const address = server.address()
  assert(address && typeof address !== "string")
  await new Promise((resolve) => server.close(resolve))
  return address.port
}

async function startServer(program, args, cwd, port) {
  if (terminating) throw new Error("Consumer run is terminating")
  const child = spawn(program, args, {
    cwd,
    detached: process.platform !== "win32",
    env: {
      ...process.env,
      PORT: String(port),
      CI: "1",
      TERM: "dumb",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  })
  activeChildren.add(child)
  let output = ""
  child.stdout.on("data", (chunk) => {
    output += chunk.toString()
  })
  child.stderr.on("data", (chunk) => {
    output += chunk.toString()
  })
  const url = `http://127.0.0.1:${port}/`
  try {
    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (child.exitCode !== null)
        throw new Error(`Server exited early: ${output}`)
      try {
        const response = await fetch(url)
        if (response.ok) return { child, url, response: await response.text() }
      } catch {
        /* Server has not opened its port yet. */
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    throw new Error(`Server did not start: ${output}`)
  } catch (error) {
    signalServer(child, "SIGTERM")
    throw error
  }
}

function signalServer(child, signal) {
  try {
    if (process.platform === "win32") child.kill(signal)
    else process.kill(-child.pid, signal)
  } catch (error) {
    if (error.code !== "ESRCH") throw error
  }
}

async function stopServer(child) {
  const stopped =
    child.exitCode === null && child.signalCode === null
      ? new Promise((resolve) => child.once("exit", resolve))
      : Promise.resolve()
  signalServer(child, "SIGTERM")
  await Promise.race([
    stopped,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ])
  if (child.exitCode === null && child.signalCode === null)
    signalServer(child, "SIGKILL")
  child.stdout.destroy()
  child.stderr.destroy()
  activeChildren.delete(child)
}

async function cleanup() {
  if (cleanupPromise) return cleanupPromise
  cleanupPromise = (async () => {
    const children = [...activeChildren]
    for (const child of children) signalServer(child, "SIGTERM")
    let timer
    await Promise.race([
      Promise.all(
        children.map((child) =>
          child.exitCode !== null || child.signalCode !== null
            ? Promise.resolve()
            : new Promise((resolve) => child.once("exit", resolve))
        )
      ),
      new Promise((resolve) => {
        timer = setTimeout(resolve, 5_000)
      }),
    ])
    clearTimeout(timer)
    for (const child of children) {
      signalServer(child, "SIGKILL")
      child.stdout?.destroy()
      child.stderr?.destroy()
    }
    activeChildren.clear()

    const tempRoot = await temporaryRootPromise
    if (tempRoot) {
      assert.equal(path.dirname(tempRoot), tmpdir())
      assert(path.basename(tempRoot).startsWith("surfacekit-clean-consumers-"))
      await rm(tempRoot, { recursive: true, force: true })
    }
  })()
  return cleanupPromise
}

for (const [signal, exitCode] of [
  ["SIGINT", 130],
  ["SIGTERM", 143],
]) {
  process.once(signal, () => {
    terminating = true
    void cleanup().then(
      () => process.exit(exitCode),
      (error) => {
        process.stderr.write(`Consumer cleanup failed: ${error}\n`)
        process.exit(1)
      }
    )
  })
}

async function browserSmoke(url, expectedTitle) {
  const browser = await chromium.launch({ headless: true })
  const warnings = []
  try {
    const page = await browser.newPage()
    page.on("console", (message) => {
      if (["warning", "error"].includes(message.type()))
        warnings.push(message.text())
    })
    page.on("pageerror", (error) => warnings.push(error.message))
    await page.goto(url, { waitUntil: "networkidle" })
    await page.getByRole("heading", { name: expectedTitle }).waitFor()
    const button = page.getByRole("button", { name: "Clicks 0" })
    await button.waitFor()
    const lightButton = await button.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        display: style.display,
        height: style.height,
        paddingInlineStart: style.paddingInlineStart,
        backgroundColor: style.backgroundColor,
      }
    })
    const light = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim()
    )
    await button.click()
    await page.getByRole("button", { name: "Clicks 1" }).waitFor()
    await page.getByRole("button", { name: "Toggle theme" }).click()
    const darkButton = await page
      .getByRole("button", { name: "Clicks 1" })
      .evaluate((element) => {
        const style = getComputedStyle(element)
        return {
          display: style.display,
          height: style.height,
          paddingInlineStart: style.paddingInlineStart,
          backgroundColor: style.backgroundColor,
        }
      })
    const dark = await page.evaluate(() => ({
      className: document.documentElement.className,
      background: getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim(),
    }))
    assert(light, "Light theme CSS custom property is absent")
    assert(dark.className.includes("dark"), "Dark theme class is absent")
    assert(
      dark.background && dark.background !== light,
      "Dark theme CSS did not change"
    )
    assert.deepEqual(warnings, [], `Browser warnings: ${warnings.join("; ")}`)
    return {
      hydrated: true,
      lightTheme: true,
      darkTheme: true,
      browserWarnings: warnings,
      lightBackground: light,
      darkBackground: dark.background,
      buttonStyles: { light: lightButton, dark: darkButton },
    }
  } finally {
    await browser.close()
  }
}

async function checkConsumer(root, specifiers) {
  const installedPackage = await realpath(
    path.join(root, "node_modules/@nwl/surfacekit")
  )
  assert(
    installedPackage.startsWith(`${root}${path.sep}`),
    "Package linked outside fixture"
  )
  const lockfile = await readFile(path.join(root, "pnpm-lock.yaml"), "utf8")
  assert(
    !/(?:workspace:|link:)/.test(lockfile),
    "Fixture contains a workspace or link dependency"
  )
  await command(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `for (const name of ${JSON.stringify(specifiers)}) await import(name)`,
    ],
    root
  )
  const typeProbe = specifiers
    .map(
      (specifier, index) =>
        `import * as Export${index} from ${JSON.stringify(specifier)}; void Export${index};`
    )
    .join("\n")
  await writeFile(path.join(root, "exports-check.ts"), typeProbe)
  await command(
    "pnpm",
    ["exec", "tsc", "--noEmit", "--project", "tsconfig.json"],
    root
  )
  const consumerRequire = createRequire(path.join(root, "package.json"))
  const packageRequire = createRequire(
    path.join(installedPackage, "package.json")
  )
  assert.strictEqual(consumerRequire("react"), packageRequire("react"))
  assert.strictEqual(consumerRequire("react-dom"), packageRequire("react-dom"))
  return {
    esm: specifiers,
    types: specifiers,
    reactSingleton: true,
    installedPackage,
  }
}

async function installFixture(kind, tempRoot, tarball) {
  const root = path.join(tempRoot, kind)
  await cp(path.join(fixtureSource, kind), root, { recursive: true })
  const dependencies = {
    "@nwl/surfacekit": `file:${tarball}`,
    react: version.react,
    "react-dom": version["react-dom"],
    [kind]: version[kind],
  }
  const devDependencies = {
    typescript: version.typescript,
    "@types/react": version["@types/react"],
    "@types/react-dom": version["@types/react-dom"],
  }
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify(
      {
        name: `surfacekit-${kind}-clean-consumer`,
        private: true,
        type: "module",
        dependencies,
        devDependencies,
      },
      null,
      2
    )
  )
  await command(
    "pnpm",
    ["install", "--ignore-workspace", "--config.minimum-release-age=0"],
    root,
    180_000
  )
  return root
}

async function runNext(root) {
  await command("pnpm", ["exec", "next", "build"], root, 180_000)
  const port = await freePort()
  const server = await startServer(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--port", String(port)],
    root,
    port
  )
  try {
    assert(
      server.response.includes("SurfaceKit Next consumer"),
      "Next SSR title absent"
    )
    assert(
      /Clicks\s*(?:<!--.*?-->\s*)?0/.test(server.response),
      "Next SSR Button absent"
    )
    return {
      productionBuild: true,
      ssr: true,
      ...(await browserSmoke(server.url, "SurfaceKit Next consumer")),
    }
  } finally {
    await stopServer(server.child)
  }
}

async function runVite(root) {
  await command("pnpm", ["exec", "vite", "build"], root)
  await command(
    "pnpm",
    [
      "exec",
      "vite",
      "build",
      "--ssr",
      "src/app.tsx",
      "--outDir",
      "dist-server",
    ],
    root
  )
  const cssFiles = (await readdir(path.join(root, "dist/assets"))).filter(
    (file) => file.endsWith(".css")
  )
  assert(cssFiles.length > 0, "Vite emitted no CSS")
  const builtCss = await readFile(
    path.join(root, "dist/assets", cssFiles[0]),
    "utf8"
  )
  assert(builtCss.includes("--background:"), "Vite omitted package CSS")
  const port = await freePort()
  const server = await startServer(process.execPath, ["server.mjs"], root, port)
  try {
    assert(
      server.response.includes("SurfaceKit Vite consumer"),
      "Vite SSR title absent"
    )
    assert(
      /Clicks\s*(?:<!--.*?-->\s*)?0/.test(server.response),
      "Vite SSR Button absent"
    )
    return {
      productionBuild: true,
      ssr: true,
      builtCssGzipBytes: gzipSync(builtCss, { level: 9 }).byteLength,
      ...(await browserSmoke(server.url, "SurfaceKit Vite consumer")),
    }
  } finally {
    await stopServer(server.child)
  }
}

async function main() {
  temporaryRootPromise = mkdtemp(
    path.join(tmpdir(), "surfacekit-clean-consumers-")
  )
  const tempRoot = await temporaryRootPromise
  try {
    await command(
      "pnpm",
      ["--filter", "@nwl/surfacekit", "build"],
      repositoryRoot
    )
    const packed = JSON.parse(
      await command(
        "pnpm",
        ["pack", "--pack-destination", tempRoot, "--json"],
        packageRoot
      )
    )
    const tarball = packed.filename
    assert(
      path.resolve(tarball).startsWith(`${tempRoot}${path.sep}`),
      "Tarball escaped fixture directory"
    )
    const files = packed.files.map(({ path: name }) => name).sort()
    const beforeSha256 = sha256(await readFile(tarball))
    const specifiers = publicSpecifiers(files)
    const nextRoot = await installFixture("next", tempRoot, tarball)
    const viteRoot = await installFixture("vite", tempRoot, tarball)
    const nextExports = await checkConsumer(nextRoot, specifiers)
    const viteExports = await checkConsumer(viteRoot, specifiers)
    assert.deepEqual(nextExports.esm, viteExports.esm)
    const css = await readFile(
      path.join(viteExports.installedPackage, "dist/globals.css")
    )
    const cssGzipBytes = gzipSync(css, { level: 9 }).byteLength
    assert(
      cssGzipBytes <= 30 * 1024,
      `Package CSS exceeds 30 KB gzip: ${cssGzipBytes}`
    )
    const next = {
      ...(await runNext(nextRoot)),
      reactSingleton: nextExports.reactSingleton,
    }
    const vite = {
      ...(await runVite(viteRoot)),
      reactSingleton: viteExports.reactSingleton,
    }
    await command(
      "pnpm",
      ["exec", "vite", "build", "--config", "vite.button.config.mjs"],
      viteRoot
    )
    const button = await readFile(path.join(viteRoot, "dist-button/button.js"))
    const buttonGzipBytes = gzipSync(button, { level: 9 }).byteLength
    assert(
      buttonGzipBytes <= 15 * 1024,
      `Button exceeds 15 KB gzip: ${buttonGzipBytes}`
    )
    const afterSha256 = sha256(await readFile(tarball))
    assert.equal(
      afterSha256,
      beforeSha256,
      "Tarball changed during consumer checks"
    )
    process.stdout.write(
      `${JSON.stringify({
        tarball: { beforeSha256, afterSha256, files },
        exports: { esm: nextExports.esm, types: nextExports.types },
        cssGzipBytes,
        buttonGzipBytes,
        consumers: { next, vite },
        commands,
      })}\n`
    )
  } finally {
    await cleanup()
  }
}

await main()
