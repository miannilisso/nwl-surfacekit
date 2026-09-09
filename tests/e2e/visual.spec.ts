import { expect, test, type Page } from "@playwright/test"

import { applicationRoutes, routeSnapshotName } from "./routes"

test.describe.configure({ mode: "serial" })
test.beforeEach(({ browserName }) => {
  test.skip(
    browserName !== "chromium",
    "Visual baselines are Chromium-specific"
  )
})

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((selectedTheme) => {
    window.localStorage.setItem("theme", selectedTheme)
  }, theme)
}

async function prepareRoute(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState("networkidle")
  await expect(
    page.getByRole("status", { name: "Loading example" })
  ).toHaveCount(0)
  await page.evaluate(() => document.fonts.ready)

  if (path === "/playground/data-display") {
    const bars = page.locator("#chart .recharts-bar-rectangle")
    let previousHeights = ""
    let stableBarSamples = 0
    await expect
      .poll(
        async () => {
          const heights = await bars.evaluateAll((elements) =>
            elements.map((element) => element.getBoundingClientRect().height)
          )
          const sample = heights.map((height) => Math.round(height)).join(",")
          const hasRenderedBars =
            heights.length === 8 && heights.every((height) => height > 0.5)

          stableBarSamples =
            hasRenderedBars && sample === previousHeights
              ? stableBarSamples + 1
              : 0
          previousHeights = sample

          return stableBarSamples
        },
        { intervals: [100, 150, 250, 400, 500], timeout: 10_000 }
      )
      .toBeGreaterThanOrEqual(3)
  }

  let previousHeight = -1
  let stableSamples = 0
  await expect
    .poll(
      async () => {
        const height = await page.evaluate(
          () => document.documentElement.scrollHeight
        )
        stableSamples = height === previousHeight ? stableSamples + 1 : 0
        previousHeight = height
        return stableSamples
      },
      { intervals: [100, 150, 250, 400, 500], timeout: 10_000 }
    )
    .toBeGreaterThanOrEqual(4)
}

for (const route of applicationRoutes) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route.snapshot} desktop ${theme}`, async ({ page }) => {
      await setTheme(page, theme)
      await prepareRoute(page, route.path)
      await expect(page).toHaveScreenshot(
        `${routeSnapshotName(route)}-desktop-${theme}.png`,
        { fullPage: true, animations: "disabled" }
      )
    })
  }

  test(`${route.snapshot} mobile light`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await setTheme(page, "light")
    await prepareRoute(page, route.path)
    await expect(page).toHaveScreenshot(
      `${routeSnapshotName(route)}-mobile-light.png`,
      { fullPage: true, animations: "disabled" }
    )
  })
}
