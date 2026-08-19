import { expect, test, type Page } from "@playwright/test"

async function openReadyPage(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState("networkidle")
  await expect(
    page.getByRole("status", { name: "Loading example" })
  ).toHaveCount(0)
}

test("keyboard navigation reaches the playground", async ({ page }) => {
  await openReadyPage(page, "/")

  const link = page.getByRole("link", { name: "Explore the playground" })
  await link.focus()
  await page.keyboard.press("Enter")

  await expect(page).toHaveURL(/\/playground$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "Component playground" })
  ).toBeVisible()
})

test("catalog search opens the exact component anchor", async ({ page }) => {
  await openReadyPage(page, "/playground")

  await page.getByRole("searchbox", { name: "Search SurfaceKit" }).fill("Input OTP")
  const result = page.getByRole("link", { name: "Input OTP" })
  await expect(result).toHaveAttribute("href", "/form-inputs#input-otp")
  await result.click()

  await expect(page).toHaveURL(/\/form-inputs#input-otp$/)
  await expect(page.locator("#input-otp")).toBeVisible()
})

test("form controls preserve entered and selected values", async ({ page }) => {
  await openReadyPage(page, "/form-inputs")

  await page.getByRole("textbox", { name: "Work email" }).fill("owner@example.com")
  await expect(page.getByRole("textbox", { name: "Work email" })).toHaveValue(
    "owner@example.com"
  )

  const releaseNotes = page.getByRole("checkbox", {
    name: "Include release notes",
  })
  await releaseNotes.click()
  await expect(releaseNotes).not.toBeChecked()

  const enterprise = page.getByRole("radio", { name: "Enterprise" })
  await enterprise.click()
  await expect(enterprise).toBeChecked()

  await page
    .getByRole("combobox", { name: "Deployment region" })
    .selectOption("frankfurt")
  await expect(
    page.getByRole("combobox", { name: "Deployment region" })
  ).toHaveValue("frankfurt")

  const framework = page.getByRole("combobox", { name: "Framework" })
  await framework.fill("Vue")
  await page.getByRole("option", { name: "Vue" }).click()
  await expect(framework).toHaveValue("Vue")
})

test("tabs and dropdown menus support keyboard operation", async ({ page }) => {
  await openReadyPage(page, "/navigation")

  const overview = page.getByRole("tab", { name: "Overview" })
  await overview.focus()
  await overview.press("ArrowRight")
  await expect(page.getByRole("tab", { name: "Activity" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("tab", { name: "Activity" })).toHaveAttribute(
    "aria-selected",
    "true"
  )
  await expect(page.getByText("Recent member and deployment activity.")).toBeVisible()

  await openReadyPage(page, "/dialogs-overlays")
  const menuTrigger = page.getByRole("button", { name: "Workspace actions" })
  await menuTrigger.focus()
  await menuTrigger.press("ArrowDown")
  await expect(page.getByRole("menuitem", { name: "Open" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByText("Workspace opened")).toBeVisible()
})

test("dialogs restore focus and toasts can be dismissed", async ({ page }) => {
  await openReadyPage(page, "/dialogs-overlays")

  const dialogTrigger = page.getByRole("button", { name: "Edit profile" })
  await dialogTrigger.focus()
  await page.keyboard.press("Enter")
  await expect(
    page.getByRole("dialog", { name: "Profile settings" })
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialogTrigger).toBeFocused()

  await page.getByRole("button", { name: "Show notification" }).click()
  const toast = page.getByRole("dialog", { name: "Changes saved" })
  await expect(toast).toBeVisible()
  await toast.hover()
  await page.getByRole("button", { name: "Close toast" }).click()
  await expect(page.getByText("Changes saved")).toHaveCount(0)
})

test("sidebar trigger collapses and expands the navigation", async ({ page }) => {
  await openReadyPage(page, "/layout-utilities")

  const sidebar = page.locator("#sidebar [data-slot=sidebar]").first()
  const trigger = page.locator("#sidebar").getByRole("button", {
    name: "Toggle Sidebar",
  })
  await expect(sidebar).toHaveAttribute("data-state", "expanded")
  await trigger.click()
  await expect(sidebar).toHaveAttribute("data-state", "collapsed")
  await trigger.click()
  await expect(sidebar).toHaveAttribute("data-state", "expanded")
})

test("permission and danger patterns expose outcome feedback", async ({ page }) => {
  await openReadyPage(page, "/patterns")

  await expect(page.getByText("Billing access required")).toBeVisible()
  await page.getByRole("button", { name: "Request access" }).click()
  await expect(
    page.getByRole("heading", { name: "Billing controls" })
  ).toBeVisible()

  await page.getByRole("button", { name: "Delete project" }).click()
  await expect(page.getByText("Delete production project?")).toBeVisible()
  await page
    .getByRole("button", { name: "Delete project" })
    .last()
    .click()
  await expect(page.getByText("Project deletion confirmed")).toBeVisible()
})
