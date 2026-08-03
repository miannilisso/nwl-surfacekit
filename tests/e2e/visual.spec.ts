import { expect, test } from "@playwright/test"

test.describe.configure({ mode: "serial" })

for (const theme of ["light", "dark"] as const) {
  test(`playground visual regression in ${theme} theme`, async ({ page }) => {
    await page.addInitScript((selectedTheme) => {
      window.localStorage.setItem("theme", selectedTheme)
    }, theme)

    await page.goto("/playground")
    await page.locator("html").evaluate((element, selectedTheme) => {
      element.classList.toggle("dark", selectedTheme === "dark")
    }, theme)
    await expect(page.locator("html")).toHaveClass(theme === "dark" ? /dark/ : /^(?!.*dark).*$/)

    await expect(page).toHaveScreenshot(`playground-${theme}.png`, {
      fullPage: true,
      animations: "disabled",
    })
  })
}
