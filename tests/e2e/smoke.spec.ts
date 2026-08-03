import { expect, test } from "@playwright/test"

test("marketing route family renders public shell", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("link", { name: "SurfaceKit" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "SurfaceKit" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Playground" }).first()).toBeVisible()

  await page.goto("/marketing")
  await expect(page.getByRole("heading", { name: "Composable shells" })).toBeVisible()
})

test("playground route family renders app shell and component previews", async ({ page }) => {
  await page.goto("/playground")

  await expect(page.getByRole("heading", { name: "Component playground" })).toBeVisible()
  await expect(page.getByRole("navigation", { name: "Navigation" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Default" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Auth shell composition" })).toBeVisible()
})
