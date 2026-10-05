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
  "@types/node": "20.19.43",
  typescript: "6.0.3",
  next: "16.3.8",
  vite: "8.3.2",
}
const commands = []
const activeChildren = new Set()
const SSR_STDOUT_DIAGNOSTIC_PATTERN =
  /\b(?:warn|(?:[a-z][a-z0-9]*)?warning|(?:aggregate|assertion|eval|internal|range|reference|syntax|system|type|uri)?error|fatal|(?:dom)?exception)\b|⚠/i
let temporaryRootPromise
let cleanupPromise
let terminating = false

function consumerEnvironment(extra = {}) {
  const environment = {
    ...process.env,
    ...extra,
    CI: "1",
    TERM: "dumb",
    NEXT_TELEMETRY_DISABLED: "1",
  }
  // NO_COLOR and FORCE_COLOR together produce a Node warning in clean fixtures.
  delete environment.FORCE_COLOR
  return environment
}

async function command(program, args, cwd, timeout = 180_000) {
  if (terminating) throw new Error("Consumer run is terminating")
  const commandArgs =
    program === "pnpm" && cwd !== repositoryRoot && cwd !== packageRoot
      ? ["--config.minimum-release-age=0", ...args]
      : args
  const label = `${program} ${commandArgs.join(" ")}`
  process.stderr.write(`${path.basename(cwd)}: ${label}\n`)
  return new Promise((resolve, reject) => {
    const child = spawn(program, commandArgs, {
      cwd,
      detached: process.platform !== "win32",
      env: consumerEnvironment(),
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
    env: consumerEnvironment({ PORT: String(port) }),
    stdio: ["ignore", "pipe", "pipe"],
  })
  activeChildren.add(child)
  const output = { stdout: "", stderr: "" }
  const closed = new Promise((resolve) => child.once("close", resolve))
  child.stdout.on("data", (chunk) => {
    output.stdout += chunk.toString()
  })
  child.stderr.on("data", (chunk) => {
    output.stderr += chunk.toString()
  })
  const url = `http://127.0.0.1:${port}/`
  try {
    for (let attempt = 0; attempt < 120; attempt += 1) {
      if (child.exitCode !== null)
        throw new Error(
          `Server exited early: ${output.stdout}\n${output.stderr}`
        )
      try {
        const response = await fetch(url)
        if (response.ok)
          return {
            child,
            closed,
            output,
            url,
            response: await response.text(),
          }
      } catch {
        /* Server has not opened its port yet. */
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
    throw new Error(`Server did not start: ${output.stdout}\n${output.stderr}`)
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

async function stopServer({ child, closed, output }) {
  if (child.exitCode === null && child.signalCode === null)
    signalServer(child, "SIGTERM")
  let timer
  let didClose = await Promise.race([
    closed.then(() => true),
    new Promise((resolve) => {
      timer = setTimeout(() => resolve(false), 5_000)
    }),
  ])
  clearTimeout(timer)
  if (!didClose) {
    signalServer(child, "SIGKILL")
    didClose = await Promise.race([
      closed.then(() => true),
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(false), 5_000)
      }),
    ])
    clearTimeout(timer)
  }
  if (!didClose) {
    child.stdout.destroy()
    child.stderr.destroy()
  }
  activeChildren.delete(child)
  assert(didClose, "SSR server did not close after SIGKILL")
  const stdout = output.stdout.replace(/\x1b\[[0-9;]*m/g, "")
  // Startup banners use stdout; any stderr or diagnostic stdout is unexpected.
  if (output.stderr.trim() || SSR_STDOUT_DIAGNOSTIC_PATTERN.test(stdout)) {
    throw new Error(
      `Unexpected SSR server output:\nstdout:\n${output.stdout}\nstderr:\n${output.stderr}`
    )
  }
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
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
    })
    page.on("console", (message) => {
      if (["warning", "error"].includes(message.type()))
        warnings.push(message.text())
    })
    page.on("pageerror", (error) => warnings.push(error.message))
    await page.goto(url, { waitUntil: "networkidle" })
    await page.getByRole("heading", { name: expectedTitle }).waitFor()
    const button = page.getByRole("button", { name: "Clicks 0" })
    await button.waitFor()
    const lightButton = await readButtonStyle(button)
    const light = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim()
    )
    await button.click()
    await page.getByRole("button", { name: "Clicks 1" }).waitFor()
    await page.getByRole("button", { name: "Toggle theme" }).click()
    await page.getByRole("button", { name: "Clicks 1" }).evaluate(
      (element) =>
        new Promise((resolve) => {
          const durations = getComputedStyle(element)
            .transitionDuration.split(",")
            .map((value) => {
              const duration = value.trim()
              return duration.endsWith("ms")
                ? Number.parseFloat(duration)
                : Number.parseFloat(duration) * 1000
            })
          setTimeout(resolve, Math.max(0, ...durations) + 50)
        })
    )
    const darkButton = await readButtonStyle(
      page.getByRole("button", { name: "Clicks 1" })
    )
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
    for (const [theme, style] of [
      ["light", lightButton],
      ["dark", darkButton],
    ]) {
      assert.equal(
        style.display,
        "inline-flex",
        `Button component CSS is missing in ${theme} theme: display`
      )
      assert.equal(
        style.height,
        "32px",
        `Button component CSS is missing in ${theme} theme: height`
      )
      assert.equal(
        style.paddingInlineStart,
        "12px",
        `Button component CSS is missing in ${theme} theme: padding`
      )
      assert(
        style.backgroundAlpha > 0,
        `Button component CSS is missing in ${theme} theme: background`
      )
    }
    assert.notEqual(
      darkButton.backgroundColor,
      lightButton.backgroundColor,
      "Button dark component CSS did not change"
    )
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

async function readButtonStyle(button) {
  return button.evaluate((element) => {
    const style = getComputedStyle(element)
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) throw new Error("Canvas color probe is unavailable")
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = style.backgroundColor
    context.fillRect(0, 0, 1, 1)
    return {
      display: style.display,
      height: style.height,
      paddingInlineStart: style.paddingInlineStart,
      backgroundColor: style.backgroundColor,
      backgroundAlpha: context.getImageData(0, 0, 1, 1).data[3],
    }
  })
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
  const cssFixture = process.env.SURFACEKIT_TEST_CSS_FIXTURE
  if (cssFixture) {
    assert(
      ["tokens-only", "light-only", "transparent-theme"].includes(cssFixture),
      "Unknown consumer CSS fixture"
    )
    const sourceFile = path.join(
      root,
      kind === "next" ? "app/layout.tsx" : "src/main.tsx"
    )
    const cssFile = path.join(
      root,
      kind === "next" ? "app/negative.css" : "src/negative.css"
    )
    await cp(
      path.join(fixtureSource, "negative-css", `${cssFixture}.css`),
      cssFile
    )
    const source = await readFile(sourceFile, "utf8")
    const packageImport = 'import "@nwl/surfacekit/globals.css"'
    assert(source.includes(packageImport), "Consumer CSS import is missing")
    await writeFile(
      sourceFile,
      source.replace(packageImport, 'import "./negative.css"')
    )
  }
  const dependencies = {
    "@nwl/surfacekit": `file:${tarball}`,
    react: version.react,
    "react-dom": version["react-dom"],
    [kind]: version[kind],
  }
  const devDependencies = {
    typescript: version.typescript,
    "@types/node": version["@types/node"],
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
  await command("pnpm", ["install", "--ignore-workspace"], root, 180_000)
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
    await stopServer(server)
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
    await stopServer(server)
  }
}

async function main() {
  temporaryRootPromise = mkdtemp(
    path.join(tmpdir(), "surfacekit-clean-consumers-")
  )
  const tempRoot = await temporaryRootPromise
  try {
    const externalTarball = process.env.SURFACEKIT_RELEASE_TARBALL
    let tarball
    let files
    let beforeSha256
    if (externalTarball) {
      tarball = path.resolve(externalTarball)
      const expected = process.env.SURFACEKIT_RELEASE_SHA256
      assert.match(expected ?? "", /^[a-f0-9]{64}$/, "Missing release SHA-256")
      beforeSha256 = sha256(await readFile(tarball))
      assert.equal(
        beforeSha256,
        expected,
        "Transferred tarball SHA-256 mismatch"
      )
      files = (await command("tar", ["-tzf", tarball], repositoryRoot))
        .trim()
        .split("\n")
        .map((name) => name.replace(/^package\//, ""))
        .sort()
    } else {
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
      tarball = packed.filename
      assert(
        path.resolve(tarball).startsWith(`${tempRoot}${path.sep}`),
        "Tarball escaped fixture directory"
      )
      files = packed.files.map(({ path: name }) => name).sort()
      beforeSha256 = sha256(await readFile(tarball))
    }
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
