import { execFile } from "node:child_process"
import path from "node:path"
import { promisify } from "node:util"

import { expect, it } from "vitest"

const execFileAsync = promisify(execFile)

it("builds and hydrates isolated Next and Vite consumers from one verified tarball", async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    [path.join(process.cwd(), "tests/consumers/run.mjs")],
    { cwd: process.cwd(), maxBuffer: 20 * 1024 * 1024, timeout: 900_000 }
  )
  const report = JSON.parse(stdout) as {
    tarball: { beforeSha256: string; afterSha256: string; files: string[] }
    exports: { esm: string[]; types: string[] }
    cssGzipBytes: number
    buttonGzipBytes: number
    consumers: Record<
      "next" | "vite",
      {
        productionBuild: boolean
        ssr: boolean
        hydrated: boolean
        lightTheme: boolean
        darkTheme: boolean
        reactSingleton: boolean
        browserWarnings: string[]
      }
    >
  }

  expect(report.tarball.beforeSha256).toMatch(/^[a-f0-9]{64}$/)
  expect(report.tarball.afterSha256).toBe(report.tarball.beforeSha256)
  expect(report.tarball.files).toContain("dist/globals.css")
  expect(report.tarball.files).toContain("dist/components/button/index.js")
  expect(report.exports.esm).toContain("@nwl/surfacekit/components/button")
  expect(report.exports.types).toEqual(report.exports.esm)
  expect(report.cssGzipBytes).toBeLessThanOrEqual(30 * 1024)
  expect(report.buttonGzipBytes).toBeLessThanOrEqual(15 * 1024)
  for (const consumer of Object.values(report.consumers)) {
    expect(consumer).toMatchObject({
      productionBuild: true,
      ssr: true,
      hydrated: true,
      lightTheme: true,
      darkTheme: true,
      reactSingleton: true,
      browserWarnings: [],
    })
  }
  if (process.env.SURFACEKIT_SIZE_REPORT === "1") {
    const inventory = {
      root: report.tarball.files.filter((file) => !file.startsWith("dist/")),
      components: report.tarball.files.filter((file) =>
        file.startsWith("dist/components/")
      ).length,
      patterns: report.tarball.files.filter((file) =>
        file.startsWith("dist/patterns/")
      ).length,
      hooks: report.tarball.files.filter((file) =>
        file.startsWith("dist/hooks/")
      ).length,
      lib: report.tarball.files.filter((file) => file.startsWith("dist/lib/"))
        .length,
      css: report.tarball.files.filter((file) => file.endsWith(".css")).length,
      js: report.tarball.files.filter((file) => file.endsWith(".js")).length,
      declarations: report.tarball.files.filter((file) =>
        file.endsWith(".d.ts")
      ).length,
      maps: report.tarball.files.filter((file) => file.endsWith(".map")).length,
    }
    process.stdout.write(
      `${JSON.stringify({
        tarballSha256: report.tarball.beforeSha256,
        packedFiles: report.tarball.files.length,
        inventory,
        publicExports: report.exports.esm.length,
        cssGzipBytes: report.cssGzipBytes,
        buttonGzipBytes: report.buttonGzipBytes,
        consumers: report.consumers,
      })}\n`
    )
  }
}, 910_000)
