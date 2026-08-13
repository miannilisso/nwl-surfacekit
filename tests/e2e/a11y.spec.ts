import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

import { applicationRoutes } from "./routes"

for (const route of applicationRoutes) {
  test(`${route.path} has no automatically detectable A/AA violations`, async ({
    page,
  }) => {
    await page.goto(route.path)
    await expect(
      page
        .getByRole("main")
        .getByRole("heading", { level: 1, name: route.heading })
    ).toBeVisible()
    await expect(
      page.getByRole("status", { name: "Loading example" })
    ).toHaveCount(0)
    if (route.path === "/layout-utilities") {
      await expect(
        page.locator('[data-slot="resizable-handle"]')
      ).toHaveAttribute("aria-valuenow", /\d+/)
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze()

    expect(results.violations).toEqual([])
  })
}
