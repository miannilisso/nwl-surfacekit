import { execFile } from "node:child_process"
import { createHash } from "node:crypto"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"

import { describe, expect, it } from "vitest"

import nextConfig from "../../apps/web/next.config"

const execFileAsync = promisify(execFile)
const repositoryRoot = process.cwd()

const synchronizedAssets = [
  ["assets/favicons/favicon.ico", "apps/web/app/favicon.ico"],
  ["assets/favicons/apple-icon.png", "apps/web/public/favicons/apple-icon.png"],
  ["assets/favicons/icon0.svg", "apps/web/public/favicons/icon0.svg"],
  ["assets/favicons/icon1.png", "apps/web/public/favicons/icon1.png"],
  [
    "assets/favicons/nwl-surfacekit.png",
    "apps/web/public/favicons/nwl-surfacekit.png",
  ],
  [
    "assets/favicons/nwl-surfacekit.svg",
    "apps/web/public/favicons/nwl-surfacekit.svg",
  ],
  [
    "assets/favicons/web-app-manifest-192x192.png",
    "apps/web/public/favicons/web-app-manifest-192x192.png",
  ],
  [
    "assets/favicons/web-app-manifest-512x512.png",
    "apps/web/public/favicons/web-app-manifest-512x512.png",
  ],
  [
    "assets/fonts/Outfit/Outfit-VariableFont_wght.ttf",
    "apps/web/public/fonts/Outfit/Outfit-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist/Geist-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist/Geist-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist/Geist-Italic-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist/Geist-Italic-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist_Mono/GeistMono-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist_Mono/GeistMono-VariableFont_wght.ttf",
  ],
  [
    "assets/fonts/Geist_Mono/GeistMono-Italic-VariableFont_wght.ttf",
    "apps/web/public/fonts/Geist_Mono/GeistMono-Italic-VariableFont_wght.ttf",
  ],
] as const

async function sha256(file: string) {
  return createHash("sha256")
    .update(await readFile(path.join(repositoryRoot, file)))
    .digest("hex")
}

describe("reference-app assets", () => {
  it("keeps every served brand and font byte identical to its canonical asset", async () => {
    for (const [source, destination] of synchronizedAssets) {
      const [sourceStat, destinationStat, sourceHash, destinationHash] =
        await Promise.all([
          stat(path.join(repositoryRoot, source)),
          stat(path.join(repositoryRoot, destination)),
          sha256(source),
          sha256(destination),
        ])

      expect(destinationStat.size, destination).toBe(sourceStat.size)
      expect(destinationHash, destination).toBe(sourceHash)
    }

    await expect(
      execFileAsync(
        process.execPath,
        ["apps/web/scripts/sync-reference-assets.mjs", "--check"],
        { cwd: repositoryRoot }
      )
    ).resolves.toMatchObject({ stdout: expect.stringContaining("13 assets") })
  })

  it("preserves the local font licenses and leaves brand fonts outside the package", async () => {
    for (const license of [
      "assets/fonts/Outfit/OFL.txt",
      "assets/fonts/Geist/OFL.txt",
      "assets/fonts/Geist_Mono/OFL.txt",
    ]) {
      await expect(readFile(license, "utf8")).resolves.toContain(
        "SIL OPEN FONT LICENSE Version 1.1"
      )
    }

    await expect(
      stat(path.join(repositoryRoot, "packages/ui/dist/fonts"))
    ).rejects.toMatchObject({ code: "ENOENT" })
  })

  it("generates a revisioned worker from its source and cached canonical assets", async () => {
    const template = await readFile(
      path.join(repositoryRoot, "apps/web/pwa/service-worker.template.js"),
      "utf8"
    )
    const worker = await readFile(
      path.join(repositoryRoot, "apps/web/public/sw.js"),
      "utf8"
    )
    const revisionHash = createHash("sha256").update(template)
    for (const [source] of synchronizedAssets.slice(0, 8)) {
      revisionHash.update(source)
      revisionHash.update(await readFile(path.join(repositoryRoot, source)))
    }
    const revision = revisionHash.digest("hex").slice(0, 16)

    expect(template).toContain("__SURFACEKIT_CACHE_REVISION__")
    expect(worker).toBe(
      template.replaceAll("__SURFACEKIT_CACHE_REVISION__", revision)
    )
    expect(worker).toContain(`const CACHE_REVISION = "${revision}"`)
  })
})

describe("PWA metadata and headers", () => {
  it("publishes a root-scoped install manifest backed by supplied assets", async () => {
    const { default: createManifest } =
      await import("../../apps/web/app/manifest")

    expect(createManifest()).toEqual({
      name: "NWL SurfaceKit",
      short_name: "SurfaceKit",
      description:
        "Naneware Labs SurfaceKit component system playground and reference application.",
      start_url: "/playground",
      scope: "/",
      display: "standalone",
      orientation: "any",
      background_color: "#ffffff",
      theme_color: "#3aa346",
      icons: [
        {
          src: "/favicon.ico",
          sizes: "16x16 32x32 48x48",
          type: "image/x-icon",
        },
        {
          src: "/favicons/nwl-surfacekit.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/favicons/apple-icon.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/favicons/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/favicons/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/favicons/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/favicons/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    })
  })

  it("serves the service worker with a root scope and non-cacheable secure headers", async () => {
    const headers = await nextConfig.headers?.()
    const serviceWorker = headers?.find((entry) => entry.source === "/sw.js")

    expect(serviceWorker).toEqual({
      source: "/sw.js",
      headers: [
        {
          key: "Content-Type",
          value: "application/javascript; charset=utf-8",
        },
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Service-Worker-Allowed", value: "/" },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self'; worker-src 'self'",
        },
      ],
    })
    expect(headers).toContainEqual({
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: "worker-src 'self'",
        },
      ],
    })
  })
})
