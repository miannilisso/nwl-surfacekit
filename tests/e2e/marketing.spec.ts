import { expect, test, type Locator } from "@playwright/test"

async function expectHydrated(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactProps"))
      )
    )
    .toBe(true)
}

test("landing page presents verified inventory and primary journeys", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/SurfaceKit/)
  await expect(
    page
      .getByRole("main")
      .getByRole("heading", { level: 1, name: "SurfaceKit" })
  ).toBeVisible()
  await expect(page.getByText("60", { exact: true })).toBeVisible()
  await expect(page.getByText("10", { exact: true })).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Explore the playground" })
  ).toHaveAttribute("href", "/playground")
})

test("theme action persists the dark theme", async ({ page }) => {
  await page.goto("/")

  const themeSwitcher = page.getByRole("button", { name: "Toggle theme" })
  await expectHydrated(themeSwitcher)
  await themeSwitcher.click()
  await expect(page.locator("html")).toHaveClass(/dark/)

  await page.reload()
  await expect(page.locator("html")).toHaveClass(/dark/)
})

test("capabilities page exposes real routes, patterns, and evidence limits", async ({
  page,
}) => {
  await page.goto("/marketing")
  await expect(
    page.getByRole("main").getByRole("heading", {
      level: 1,
      name: "Built for modern product development",
    })
  ).toBeVisible()
  const feedbackTab = page.getByRole("tab", { name: "Feedback" })
  await expect(feedbackTab).toBeVisible()
  await feedbackTab.click()
  await expect(
    page.getByRole("heading", { name: "Enterprise patterns" })
  ).toBeVisible()
  await expect(
    page.getByText(
      /automated checks do not establish complete WCAG conformance/i
    )
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Alert" })).toHaveAttribute(
    "href",
    "/playground/feedback#alert"
  )

  const body = await page.locator("body").innerText()
  expect(body).not.toMatch(/100% accessible|battle-tested|full coverage/i)
})
