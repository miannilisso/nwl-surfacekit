import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

for (const path of ["/", "/marketing", "/playground"]) {
  test(`has no detectable wcag2a/wcag2aa violations on ${path}`, async ({ page }) => {
    await page.goto(path)

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()

    expect(results.violations).toEqual([])
  })
}
