import { expect, test } from "@playwright/test"

import { applicationRoutes } from "./routes"

for (const route of applicationRoutes) {
  test(`${route.path} renders its declared application shell`, async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text())
    })
    page.on("pageerror", (error) => pageErrors.push(error.message))

    const response = await page.goto(route.path)
    expect(response?.ok()).toBe(true)
    await expect(page.getByRole("main")).toHaveCount(1)
    await expect(
      page
        .getByRole("main")
        .getByRole("heading", { level: 1, name: route.heading })
    ).toBeVisible()
    expect(consoleErrors).toEqual([])
    expect(pageErrors).toEqual([])
  })
}
