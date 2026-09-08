import { expect, test, type Page } from "@playwright/test"

const storybookUrl =
  "http://127.0.0.1:6006/iframe.html?id=surfacekit-introduction--overview&viewMode=story"

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
    if (/fonts\.(?:googleapis|gstatic)\.com/i.test(request.url())) {
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
