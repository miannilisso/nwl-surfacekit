import { expect, test, type Page } from "@playwright/test"

import { applicationRoutes } from "./routes"

const storybookOrigin = "http://127.0.0.1:6006"

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript(
    (value) => localStorage.setItem("theme", value),
    theme
  )
}

async function ready(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState("networkidle")
  await page.evaluate(() => document.fonts.ready)
}

test("AppShell mobile navigation is modal, route-aware, and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await ready(page, "/playground")

  const trigger = page.getByRole("button", {
    name: "Open playground navigation",
  })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Playground navigation" })
  await expect(dialog).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).overflowY))
    .toBe("hidden")

  await page.keyboard.press("Tab")
  await expect
    .poll(() =>
      page.evaluate(() => {
        const active = document.activeElement
        const surface = document.querySelector('[role="dialog"]')
        return Boolean(active && surface?.contains(active))
      })
    )
    .toBe(true)

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await dialog.getByRole("link", { name: "Form Inputs" }).click()
  await expect(page).toHaveURL(/\/playground\/form-inputs$/)
  await expect(dialog).toBeHidden()
})

test("WebShellHeader exposes one mobile modal navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await ready(page, "/")

  const trigger = page.getByRole("button", { name: "Open primary navigation" })
  await expect(trigger).toBeVisible()
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "SurfaceKit navigation" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("link", { name: "Capabilities" })).toBeVisible()
  await dialog.getByRole("button", { name: "Close site navigation" }).click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test.describe("mobile layout and scrollbar evidence", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "Layout evidence is Chromium-specific"
    )
  })

  for (const width of [320, 390, 768]) {
    for (const theme of ["light", "dark"] as const) {
      test(`all application routes fit at ${width}px in ${theme}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: width < 700 ? 844 : 900 })
        await setTheme(page, theme)
        for (const route of applicationRoutes) {
          await ready(page, route.path)
          const overflow = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth
          )
          expect(overflow, route.path).toBeLessThanOrEqual(0)
        }
      })
    }
  }

  test("native and custom scrollbars resolve SurfaceKit theme tokens", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(
      `${storybookOrigin}/iframe.html?id=surfacekit-components-advanced-scroll-area--both-axes&viewMode=story`
    )
    await page.locator("body.sb-show-main").waitFor({ state: "visible" })
    await page.locator('[data-slot="scroll-area-viewport"]').waitFor()

    const values = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement)
      const thumb = getComputedStyle(
        document.querySelector('[data-slot="scroll-area-thumb"]')!
      )
      return {
        size: root.getPropertyValue("--scrollbar-size").trim(),
        track: root.getPropertyValue("--scrollbar-track").trim(),
        thumb: root.getPropertyValue("--scrollbar-thumb").trim(),
        thumbBackground: thumb.backgroundColor,
      }
    })

    expect(Number.parseFloat(values.size)).toBe(0.625)
    expect(values.track).not.toBe("")
    expect(values.thumb).not.toBe("")
    expect(values.thumbBackground).not.toBe("rgba(0, 0, 0, 0)")
  })

  test("mobile shell visuals remain reviewable in light and dark themes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 })
    await setTheme(page, "light")
    await ready(page, "/playground")
    await page
      .getByRole("button", { name: "Open playground navigation" })
      .click()
    await expect(page).toHaveScreenshot(
      "app-shell-mobile-navigation-light.png",
      {
        animations: "disabled",
      }
    )

    await page.setViewportSize({ width: 390, height: 844 })
    await setTheme(page, "dark")
    await ready(page, "/")
    await page.getByRole("button", { name: "Open primary navigation" }).click()
    await expect(page).toHaveScreenshot(
      "web-shell-mobile-navigation-dark.png",
      {
        animations: "disabled",
      }
    )
  })
})
