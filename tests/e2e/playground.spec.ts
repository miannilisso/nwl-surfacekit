import { expect, test, type Locator } from "@playwright/test"

import {
  getSurfacesByCategory,
  surfaceCategories,
} from "../../apps/web/lib/surfacekit/catalog"

async function expectHydrated(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactProps"))
      )
    )
    .toBe(true)
}

for (const category of surfaceCategories) {
  test(`${category.name} exposes every catalog example as a direct anchor`, async ({
    page,
  }) => {
    await page.goto(category.route)

    await expect(
      page
        .getByRole("main")
        .getByRole("heading", { name: category.name, level: 1 })
    ).toBeVisible()

    for (const entry of getSurfacesByCategory(category.id)) {
      const preview = page.locator(`#${entry.id}`)
      await expect(preview).toBeVisible()
      await expect(preview).toHaveAccessibleName(entry.name)
    }
  })
}

test("playground demos support representative keyboard and pointer workflows", async ({
  page,
}) => {
  await page.goto("/playground/form-inputs#checkbox")
  await page.waitForLoadState("networkidle")
  const checkbox = page.getByRole("checkbox", { name: "Include release notes" })
  await checkbox.click()
  await expect(checkbox).not.toBeChecked()

  await page.goto("/playground/navigation#tabs")
  await page.waitForLoadState("networkidle")
  const activityTab = page.getByRole("tab", { name: "Activity" })
  await expectHydrated(activityTab)
  await activityTab.click()
  await expect(activityTab).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("tabpanel", { name: "Activity" })).toContainText(
    "Recent member"
  )

  await page.goto("/playground/dialogs-overlays#dropdown-menu")
  await page.waitForLoadState("networkidle")
  const menuTrigger = page.getByRole("button", { name: "Workspace actions" })
  await expectHydrated(menuTrigger)
  await menuTrigger.click()
  await page.getByRole("menuitem", { name: "Open" }).click()
  await expect(page.getByText("Workspace opened")).toBeVisible()
})
