import { expect, test, type Page } from "@playwright/test"

import { applicationRoutes, routeSnapshotName } from "./routes"

test.describe.configure({ mode: "serial" })

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
