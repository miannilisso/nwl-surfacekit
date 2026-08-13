import { expect, test } from "@playwright/test"

import {
  getSurfacesByCategory,
  surfaceCategories,
} from "../../apps/web/lib/surfacekit/catalog"

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
  await page.goto("/form-inputs#checkbox")
  await page.waitForLoadState("networkidle")
  const checkbox = page.getByRole("checkbox", { name: "Include release notes" })
  await checkbox.click()
  await expect(checkbox).not.toBeChecked()

  await page.goto("/navigation#tabs")
  await page.waitForLoadState("networkidle")
  const activityTab = page.getByRole("tab", { name: "Activity" })
  await activityTab.click()
  await expect(activityTab).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("tabpanel")).toContainText("Recent member")

  await page.goto("/dialogs-overlays#dropdown-menu")
  await page.waitForLoadState("networkidle")
  await page.getByRole("button", { name: "Workspace actions" }).click()
  await page.getByRole("menuitem", { name: "Open" }).click()
  await expect(page.getByText("Workspace opened")).toBeVisible()
})
