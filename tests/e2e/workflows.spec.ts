import { expect, test, type Locator, type Page } from "@playwright/test"

async function expectHydrated(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactProps"))
      )
    )
    .toBe(true)
}

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

  await page
    .getByRole("searchbox", { name: "Search SurfaceKit" })
    .fill("Input OTP")
  const result = page.getByRole("link", { name: "Input OTP" })
  await expect(result).toHaveAttribute(
    "href",
    "/playground/form-inputs#input-otp"
  )
  await result.click()

  await expect(page).toHaveURL(/\/playground\/form-inputs#input-otp$/)
  await expect(page.locator("#input-otp")).toBeVisible()
})

test("playground sidebar home action returns to the SurfaceKit home page", async ({
  page,
}) => {
  await openReadyPage(page, "/playground/form-inputs")

  const home = page
    .getByRole("navigation", { name: "Playground" })
    .getByRole("link", { name: "Home" })
  await expectHydrated(home)
  await home.click()

  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "SurfaceKit" })
  ).toBeVisible()
})

test("mobile playground footer returns to the SurfaceKit home page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openReadyPage(page, "/playground/form-inputs")

  const footer = page.getByRole("contentinfo")
  const home = footer.getByRole("link", { name: "Home" })
  await expect(home).toBeVisible()
  await expectHydrated(home)
  await home.click()

  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole("heading", { level: 1, name: "SurfaceKit" })
  ).toBeVisible()
})

test("playground main content fills the remaining desktop width", async ({
  page,
}) => {
  await openReadyPage(page, "/playground/form-inputs")

  const mainBox = await page.getByRole("main").boundingBox()
  const viewport = page.viewportSize()

  expect(mainBox).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(mainBox!.x + mainBox!.width).toBeCloseTo(viewport!.width, 0)
})

test("embedded app shells honor a consumer min-height override", async ({
  page,
}) => {
  await openReadyPage(page, "/playground/patterns")

  const shellBox = await page
    .locator("#app-shell [data-slot=app-shell]")
    .boundingBox()
  const viewport = page.viewportSize()

  expect(shellBox).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(shellBox!.height).toBeLessThan(viewport!.height)
})

test("form controls preserve entered and selected values", async ({ page }) => {
  await openReadyPage(page, "/playground/form-inputs")

  await page
    .getByRole("textbox", { name: "Work email" })
    .fill("owner@example.com")
  await expect(page.getByRole("textbox", { name: "Work email" })).toHaveValue(
    "owner@example.com"
  )

  const releaseNotes = page.getByRole("checkbox", {
    name: "Include release notes",
  })
  await expectHydrated(releaseNotes)
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
  await openReadyPage(page, "/playground/navigation")

  const overview = page.getByRole("tab", { name: "Overview" })
  await expectHydrated(overview)
  await overview.focus()
  await overview.press("ArrowRight")
  await expect(page.getByRole("tab", { name: "Activity" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("tab", { name: "Activity" })).toHaveAttribute(
    "aria-selected",
    "true"
  )
  await expect(
    page.getByText("Recent member and deployment activity.")
  ).toBeVisible()

  await openReadyPage(page, "/playground/dialogs-overlays")
  const menuTrigger = page.getByRole("button", { name: "Workspace actions" })
  await expectHydrated(menuTrigger)
  await menuTrigger.focus()
  await expect(menuTrigger).toBeFocused()
  await menuTrigger.press("ArrowDown")
  const openItem = page.getByRole("menuitem", { name: "Open" })
  await expect(openItem).toBeVisible()
  await expect(openItem).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByText("Workspace opened")).toBeVisible()
})

test("dialogs restore focus and toasts can be dismissed", async ({ page }) => {
  await openReadyPage(page, "/playground/dialogs-overlays")

  const dialogTrigger = page.getByRole("button", { name: "Edit profile" })
  await expectHydrated(dialogTrigger)
  await dialogTrigger.focus()
  await dialogTrigger.press("Enter")
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

test("sidebar trigger collapses and expands the navigation", async ({
  page,
}) => {
  await openReadyPage(page, "/playground/layout-utilities")

  const sidebar = page.locator("#sidebar [data-slot=sidebar]").first()
  const trigger = page.locator("#sidebar").getByRole("button", {
    name: "Toggle Sidebar",
  })
  await expect(sidebar).toHaveAttribute("data-state", "expanded")
  await expectHydrated(trigger)
  await trigger.click()
  await expect(sidebar).toHaveAttribute("data-state", "collapsed")
  await trigger.click()
  await expect(sidebar).toHaveAttribute("data-state", "expanded")
})

test("permission and danger patterns expose outcome feedback", async ({
  page,
}) => {
  await openReadyPage(page, "/playground/patterns")

  await expect(page.getByText("Billing access required")).toBeVisible()
  const requestAccess = page.getByRole("button", { name: "Request access" })
  await expectHydrated(requestAccess)
  await requestAccess.click()
  await expect(
    page.getByRole("heading", { name: "Billing controls" })
  ).toBeVisible()

  const deleteProject = page.getByRole("button", { name: "Delete project" })
  await expectHydrated(deleteProject)
  await deleteProject.click()
  await expect(page.getByText("Delete production project?")).toBeVisible()
  await page.getByRole("button", { name: "Delete project" }).last().click()
  await expect(page.getByText("Project deletion confirmed")).toBeVisible()
})

test("legacy category routes permanently redirect to the canonical playground route", async ({
  page,
}) => {
  await page.goto("/form-inputs")

  await expect(page).toHaveURL(/\/playground\/form-inputs$/)
  await expect(
    page
      .getByRole("main")
      .getByRole("heading", { level: 1, name: "Form Inputs" })
  ).toBeVisible()
})
