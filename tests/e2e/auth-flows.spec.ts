import { expect, test } from "@playwright/test"

async function expectHydrated(locator: import("@playwright/test").Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactProps"))
      )
    )
    .toBe(true)
}

test.describe("provider-neutral authentication examples", () => {
  test("password input preserves password-manager and visibility semantics", async ({
    page,
  }) => {
    await page.goto("/playground/form-inputs#password-input")
    const preview = page.locator("#password-input")
    const input = preview.getByRole("textbox", { name: "Password" })
    await expectHydrated(input)
    await expect(input).toHaveAttribute("name", "password")
    await expect(input).toHaveAttribute("autocomplete", "current-password")
    await expect(input).toHaveAttribute("type", "password")
    await input.fill("browser-only-example")
    await preview.getByRole("button", { name: "Show password" }).click()
    await expect(input).toHaveAttribute("type", "text")
    await expect(input).toHaveValue("browser-only-example")
  })

  test("auth form demonstrates every requested request flow and semantic state", async ({
    page,
  }) => {
    test.slow()
    await page.goto("/playground/patterns#auth-form")
    const preview = page.locator("#auth-form")
    const expectedFlows = [
      ["Password login", "Sign in with a password", "current-password"],
      ["SSO login", "Continue with your organization", null],
      ["Passkey login", "Continue with a passkey", null],
      ["Open signup", "Create an account", "new-password"],
      ["Invitation acceptance", "Accept invitation", "new-password"],
      ["Email verification", "Verify your email", null],
      ["Password recovery", "Recover access", null],
      ["Password reset", "Choose a new password", "new-password"],
    ] as const

    for (const [buttonName, heading, passwordAutocomplete] of expectedFlows) {
      await preview.getByRole("button", { name: buttonName }).click()
      await expect(preview.getByRole("group", { name: heading })).toBeVisible()
      const password = preview.locator('input[name="password"]')
      if (passwordAutocomplete) {
        await expect(password).toHaveAttribute(
          "autocomplete",
          passwordAutocomplete
        )
      } else {
        await expect(password).toHaveCount(0)
      }
    }

    await preview.getByRole("button", { name: "Passkey login" }).click()
    await expect(preview.locator('input[name="username"]')).toHaveAttribute(
      "autocomplete",
      "username webauthn"
    )

    await preview.getByRole("button", { name: "Password login" }).click()
    const form = preview.getByRole("form", { name: "Sign in with a password" })
    await preview.getByRole("button", { name: "pending" }).click()
    await expect(form).toHaveAttribute("aria-busy", "true")
    await expect(
      preview.getByRole("button", { name: "Continuing…" })
    ).toBeDisabled()
    await preview.getByRole("button", { name: "error" }).click()
    await expect(preview.getByRole("alert")).toContainText("could not complete")
    await preview.getByRole("button", { name: "locked" }).click()
    await expect(preview.getByRole("alert")).toContainText(
      "temporarily unavailable"
    )
    await preview.getByRole("button", { name: "expired" }).click()
    await expect(preview.getByRole("alert")).toContainText("expired")
    await preview.getByRole("button", { name: "idle" }).click()
    await preview.getByRole("button", { name: "Send request" }).click()
    await expect(preview.getByRole("status")).toContainText(
      "accepted for processing"
    )
  })

  test("security challenge normalizes OTP paste and preserves recovery-code state", async ({
    page,
  }) => {
    await page.goto("/playground/patterns#security-challenge")
    const preview = page.locator("#security-challenge")
    const otp = preview.getByRole("textbox", { name: "Verification code" })
    await expectHydrated(otp)
    await expect(otp).toHaveAttribute("autocomplete", "one-time-code")
    await expect(otp).toHaveAttribute("inputmode", "numeric")
    await otp.focus()
    await otp.evaluate((element) => {
      const paste = new Event("paste", { bubbles: true, cancelable: true })
      Object.defineProperty(paste, "clipboardData", {
        value: { getData: () => "12 a3-4567" },
      })
      element.dispatchEvent(paste)
    })
    await expect(otp).toHaveValue("123456")

    await preview.getByRole("button", { name: "Use a recovery code" }).click()
    const recovery = preview.getByRole("textbox", { name: "Recovery code" })
    await expect(recovery).toBeFocused()
    await expect(recovery).toHaveValue("RECOVERY7")
    await expect(recovery).toHaveAttribute("spellcheck", "false")
    await expect(recovery).toHaveAttribute("autocapitalize", "none")
    await preview.getByRole("button", { name: "Continue" }).click()
    await expect(preview.getByRole("status")).toContainText(
      "Verification requested"
    )
  })

  test("step-up request is modal and restores focus after cancellation", async ({
    page,
  }) => {
    await page.goto("/playground/patterns#step-up-dialog")
    const trigger = page.getByRole("button", { name: "Edit security policy" })
    await expectHydrated(trigger)
    await trigger.click()
    const dialog = page.getByRole("dialog", {
      name: "Action authorization required",
    })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute("aria-modal", "true")
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
      .toBe("hidden")
    await page.locator('[data-slot="dialog-overlay"]').click({
      position: { x: 1, y: 1 },
    })
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
      .not.toBe("hidden")

    await trigger.click()
    await expect(dialog).toBeVisible()
    await dialog.getByRole("button", { name: "Cancel" }).click()
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(
      page.locator("#step-up-dialog").getByRole("status")
    ).toContainText("Verification cancelled")
  })
})
