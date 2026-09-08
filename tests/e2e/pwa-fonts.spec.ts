import { readFile } from "node:fs/promises"

import { expect, test, type Page } from "@playwright/test"

const storybookUrl =
  "http://127.0.0.1:6006/iframe.html?id=surfacekit-introduction--overview&viewMode=story"
const canonicalIconPaths = [
  "/favicon.ico",
  "/favicons/apple-icon.png",
  "/favicons/icon0.svg",
  "/favicons/icon1.png",
  "/favicons/nwl-surfacekit.png",
  "/favicons/nwl-surfacekit.svg",
  "/favicons/web-app-manifest-192x192.png",
  "/favicons/web-app-manifest-512x512.png",
]

async function fontState(page: Page) {
  return page.evaluate(async () => {
    const code = document.createElement("code")
    code.textContent = "SurfaceKit"
    document.body.append(code)
    await Promise.all([
      document.fonts.load("16px Outfit", "SurfaceKit"),
      document.fonts.load("16px Geist", "SurfaceKit"),
      document.fonts.load('16px "Geist Mono"', "SurfaceKit"),
      document.fonts.ready,
    ])
    const body = getComputedStyle(document.body).fontFamily
    const heading = getComputedStyle(document.querySelector("h1")!).fontFamily
    const mono = getComputedStyle(code).fontFamily
    code.remove()
    const loadedFamilies = new Set(
      [...document.fonts]
        .filter((font) => font.status === "loaded")
        .map((font) => font.family.replace(/^['"]|['"]$/g, ""))
    )

    return {
      body,
      heading,
      mono,
      loaded: {
        outfit: loadedFamilies.has("Outfit"),
        geist: loadedFamilies.has("Geist"),
        geistMono: loadedFamilies.has("Geist Mono"),
      },
    }
  })
}

test("Next and Storybook load and apply the same local variable fonts", async ({
  page,
}) => {
  const externalFontRequests: string[] = []
  const localFontResponses = new Map<string, number>()
  page.on("request", (request) => {
    if (request.resourceType() !== "font") return

    const documentUrl = request.frame().url() || page.url()
    if (new URL(request.url()).origin !== new URL(documentUrl).origin) {
      externalFontRequests.push(request.url())
    }
  })
  page.on("response", (response) => {
    const url = new URL(response.url())
    if (url.pathname.startsWith("/fonts/")) {
      localFontResponses.set(url.pathname, response.status())
    }
  })

  await page.goto("/")
  await expect(
    page.getByRole("heading", { level: 1, name: "SurfaceKit" })
  ).toBeVisible()
  await expect(page.getByAltText("NWL SurfaceKit mark")).toBeVisible()
  await expect(
    page.locator(
      'link[rel="preload"][as="image"][href*="nwl-surfacekit"], link[rel="preload"][as="image"][imagesrcset*="nwl-surfacekit"]'
    )
  ).toHaveCount(0)
  const nextFonts = await fontState(page)
  expect(nextFonts.body).toMatch(/^"?Outfit"?(?:,|$)/)
  expect(nextFonts.heading).toMatch(/^"?Geist"?(?:,|$)/)
  expect(nextFonts.mono).toMatch(/^"?Geist Mono"?(?:,|$)/)
  expect(nextFonts.loaded).toEqual({
    outfit: true,
    geist: true,
    geistMono: true,
  })

  await page.goto(storybookUrl)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build and review reliable interfaces",
    })
  ).toBeVisible()
  const storybookFonts = await fontState(page)
  expect(storybookFonts.body).toMatch(/^"?Outfit"?(?:,|$)/)
  expect(storybookFonts.heading).toMatch(/^"?Geist"?(?:,|$)/)
  expect(storybookFonts.mono).toMatch(/^"?Geist Mono"?(?:,|$)/)
  expect(storybookFonts.loaded).toEqual(nextFonts.loaded)
  expect(externalFontRequests).toEqual([])
  expect([...localFontResponses.values()]).not.toHaveLength(0)
  expect(
    [...localFontResponses.values()].every((status) => status === 200)
  ).toBe(true)
})

test("the operational manifest and supplied install assets are available", async ({
  page,
}) => {
  await page.goto("/")
  const manifestHref = await page
    .locator('link[rel="manifest"]')
    .getAttribute("href")
  expect(manifestHref).toBe("/manifest.webmanifest")

  const manifestResponse = await page.request.get(manifestHref!)
  expect(manifestResponse.ok()).toBe(true)
  expect(manifestResponse.headers()["content-type"]).toContain(
    "application/manifest+json"
  )
  const manifest = await manifestResponse.json()
  expect(manifest).toMatchObject({
    name: "NWL SurfaceKit",
    short_name: "SurfaceKit",
    start_url: "/playground",
    scope: "/",
    display: "standalone",
  })

  for (const icon of manifest.icons) {
    const response = await page.request.get(icon.src)
    expect(response.ok(), icon.src).toBe(true)
    expect(Number(response.headers()["content-length"] ?? 1)).toBeGreaterThan(0)
  }
})

test("production registers a secure root service worker and recovers after offline navigation", async ({
  browserName,
  context,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "PWA lifecycle coverage is Chromium-specific"
  )

  await page.goto("/playground")
  const registration = await page.evaluate(async () => {
    const value = await navigator.serviceWorker.ready
    return {
      scope: value.scope,
      scriptURL: value.active?.scriptURL,
      updateViaCache: value.updateViaCache,
    }
  })
  expect(registration).toEqual({
    scope: "http://127.0.0.1:3000/",
    scriptURL: "http://127.0.0.1:3000/sw.js",
    updateViaCache: "none",
  })

  const serviceWorkerResponse = await page.request.get("/sw.js")
  expect(serviceWorkerResponse.headers()).toMatchObject({
    "cache-control": "no-cache, no-store, must-revalidate",
    "content-security-policy":
      "default-src 'self'; script-src 'self'; worker-src 'self'",
    "content-type": "application/javascript; charset=utf-8",
    "service-worker-allowed": "/",
    "x-content-type-options": "nosniff",
  })

  const staticAsset = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => new URL(entry.name))
      .find(
        (url) =>
          url.pathname.startsWith("/_next/static/") &&
          url.pathname.endsWith(".js")
      )
      ?.toString()
  )
  expect(staticAsset).toBeDefined()
  await page.evaluate(async (asset) => {
    for (let index = 0; index < 70; index += 1) {
      const url = new URL(asset)
      url.searchParams.set("surfacekit-pressure", String(index))
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Unable to fetch ${url}`)
    }

    for (let index = 0; index < 70; index += 1) {
      const response = await fetch(
        `/favicons/nwl-surfacekit.svg?review=${index}`
      )
      if (!response.ok) throw new Error("Unable to fetch icon variant")
    }

    await Promise.allSettled([
      fetch("/api/surfacekit-cache-probe"),
      fetch("/auth/surfacekit-cache-probe"),
      fetch("/security-challenge/surfacekit-cache-probe"),
      fetch("/_next/static/surfacekit-missing.js"),
      fetch(asset, { method: "POST" }),
      fetch(`${asset}?surfacekit-rsc-probe=1`, { headers: { RSC: "1" } }),
      fetch(`${asset}?surfacekit-action-probe=1`, {
        headers: { "Next-Action": "surfacekit-probe" },
      }),
    ])
  }, staticAsset)

  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const names = await caches.keys()
        const runtime = names.find((name) =>
          name.startsWith("surfacekit-runtime-")
        )
        return runtime ? (await (await caches.open(runtime)).keys()).length : 0
      })
    )
    .toBe(64)

  const cacheState = await page.evaluate(async () => {
    const result: Record<string, string[]> = {}
    for (const name of await caches.keys()) {
      if (!name.startsWith("surfacekit-")) continue
      result[name] = (await (await caches.open(name)).keys()).map(
        (request) => new URL(request.url).pathname + new URL(request.url).search
      )
    }
    return result
  })
  const precache = Object.entries(cacheState).find(([name]) =>
    name.startsWith("surfacekit-precache-")
  )?.[1]
  const runtimeCache = Object.entries(cacheState).find(([name]) =>
    name.startsWith("surfacekit-runtime-")
  )?.[1]
  expect(precache?.toSorted()).toEqual(canonicalIconPaths.toSorted())
  expect(runtimeCache).toHaveLength(64)
  expect(Object.values(cacheState).flat().join("\n")).not.toMatch(
    /surfacekit-(?:cache|missing|rsc|action)-probe|\/api\/|\/auth\/|security-challenge/
  )

  await page.setViewportSize({ width: 320, height: 720 })
  await context.setOffline(true)
  await page.goto("/offline-check", { waitUntil: "domcontentloaded" })
  await expect(
    page.getByRole("heading", { level: 1, name: "You are offline" })
  ).toBeVisible()
  await expect(page.getByAltText("NWL SurfaceKit")).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth)
  ).toBeLessThanOrEqual(320)
  expect(await page.locator("body").innerText()).not.toMatch(
    /email|password|token|challenge/i
  )

  await context.setOffline(false)
  await page.goto("/playground")
  await expect(
    page.getByRole("heading", { level: 1, name: "Component playground" })
  ).toBeVisible()
})

test("only the newest of five worker updates remains staged beside the active generation", async ({
  browserName,
  context,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "PWA lifecycle coverage is Chromium-specific"
  )

  const firstSource = await readFile("apps/web/public/sw.js", "utf8")
  const firstRevision = firstSource.match(
    /const CACHE_REVISION = "([a-f0-9]+)"/
  )?.[1]
  expect(firstRevision).toBeDefined()
  await context.route("**/sw-generation-*.js", async (route) => {
    const generation = new URL(route.request().url()).pathname.match(
      /sw-generation-(\d+)\.js$/
    )?.[1]
    if (!generation) throw new Error("Missing worker generation")
    const revision = generation.repeat(16)
    const source = firstSource.replace(
      `const CACHE_REVISION = "${firstRevision}"`,
      `const CACHE_REVISION = "${revision}"`
    )
    await route.fulfill({
      body: source,
      contentType: "application/javascript; charset=utf-8",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Service-Worker-Allowed": "/",
        "X-Content-Type-Options": "nosniff",
      },
    })
  })

  await page.goto("/playground")
  const initial = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready
    return registration.active?.scriptURL
  })
  expect(initial).toBe("http://127.0.0.1:3000/sw.js")

  for (let generation = 2; generation <= 6; generation += 1) {
    await page.evaluate(async (value) => {
      const registration = await navigator.serviceWorker.register(
        `/sw-generation-${value}.js`,
        { scope: "/", updateViaCache: "none" }
      )
      const worker = registration.installing ?? registration.waiting
      if (worker && worker.state !== "installed") {
        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(
            () => reject(new Error("Updated worker did not finish installing")),
            10_000
          )
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed") {
              window.clearTimeout(timeout)
              resolve()
            }
          })
        })
      }
    }, generation)
  }

  await expect
    .poll(() =>
      page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration("/")
        return {
          active: registration?.active?.scriptURL,
          controller: navigator.serviceWorker.controller?.scriptURL,
          waiting: registration?.waiting?.scriptURL,
        }
      })
    )
    .toEqual({
      active: "http://127.0.0.1:3000/sw.js",
      controller: "http://127.0.0.1:3000/sw.js",
      waiting: "http://127.0.0.1:3000/sw-generation-6.js",
    })

  expect(
    await page.evaluate(async () =>
      (await caches.keys())
        .filter((name) => name.startsWith("surfacekit-precache-"))
        .sort()
    )
  ).toEqual(
    [
      `surfacekit-precache-${firstRevision}`,
      "surfacekit-precache-6666666666666666",
    ].sort()
  )
})

test("Storybook never registers the reference application service worker", async ({
  page,
}) => {
  await page.goto(storybookUrl)
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build and review reliable interfaces",
    })
  ).toBeVisible()
  expect(
    await page.evaluate(async () =>
      (await navigator.serviceWorker.getRegistrations()).map(
        (registration) => registration.scope
      )
    )
  ).toEqual([])
})
