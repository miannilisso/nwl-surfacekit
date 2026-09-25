import { createRequire } from "node:module"
import path from "node:path"

import { expect, test } from "@playwright/test"

import { AuthForm } from "../../packages/ui/dist/patterns/auth-form/index.js"
import { SecurityChallenge } from "../../packages/ui/dist/patterns/security-challenge/index.js"

const packageRequire = createRequire(
  path.join(process.cwd(), "packages/ui/package.json")
)
const { createElement } = packageRequire("react") as typeof import("react")
const { renderToString } = packageRequire(
  "react-dom/server"
) as typeof import("react-dom/server")

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
  test("server-rendered auth and challenge forms cannot submit without JavaScript", async ({
    browser,
  }) => {
    const markup = renderToString(
      createElement(
        "main",
        null,
        createElement(
          "section",
          { id: "auth-form" },
          createElement(
            AuthForm,
            {
              title: "Sign in",
              method: "get",
              inert: false,
              alternativeActions: createElement(
                "button",
                { type: "submit" },
                "Alternative submit"
              ),
              secondaryActions: createElement(
                "button",
                { type: "button" },
                "Recovery"
              ),
              footer: createElement("button", { type: "button" }, "Help"),
            },
            createElement("input", {
              name: "password",
              type: "password",
              autoComplete: "current-password",
              defaultValue: "no-js-secret",
            })
          )
        ),
        createElement(
          "section",
          { id: "security-challenge" },
          createElement(SecurityChallenge, {
            method: "recovery-code",
            methods: ["recovery-code"],
            onMethodChange: () => undefined,
            value: "KEEP7",
            onValueChange: () => undefined,
            footer: createElement(
              "button",
              { type: "button" },
              "Restart challenge"
            ),
          })
        )
      )
    )
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    const requests: string[] = []
    page.on("request", (request) =>
      requests.push(`${request.url()} ${request.postData() ?? ""}`)
    )
    try {
      await page.setContent(
        `<!doctype html><html><body>${markup}</body></html>`
      )
      const auth = page.locator("#auth-form form")
      const challenge = page.locator("#security-challenge form")
      for (const form of [auth, challenge]) {
        await expect(form).toHaveAttribute("method", "post")
        await expect(form).toHaveAttribute("inert", "")
        await expect(form.locator("fieldset")).toHaveAttribute("disabled", "")
      }
      const initialUrl = page.url()
      for (const button of [
        auth.locator('button[type="submit"]').first(),
        auth.locator("button", { hasText: "Alternative submit" }),
        auth.locator("button", { hasText: "Recovery" }),
        auth.locator("button", { hasText: "Help" }),
        challenge.locator('button[type="submit"]'),
        challenge.locator("button", { hasText: "Restart challenge" }),
      ]) {
        await button.scrollIntoViewIfNeeded()
        const box = await button.boundingBox()
        expect(box).not.toBeNull()
        await page.mouse.click(
          box!.x + box!.width / 2,
          box!.y + box!.height / 2
        )
      }
      await page.keyboard.press("Enter")
      expect(page.url()).toBe(initialUrl)
      expect(requests).toEqual([])
      expect(
        requests.filter(
          (request) =>
            request.includes("no-js-secret") || request.includes("KEEP7")
        )
      ).toEqual([])
    } finally {
      await context.close()
    }
  })

  test("delayed hydration keeps credential and slot controls inert, then resumes the same input", async ({
    browser,
  }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    let releaseScripts = () => undefined
    const scriptsAllowed = new Promise<void>((resolve) => {
      releaseScripts = resolve
    })
    let heldScripts = 0
    await page.route("**/_next/static/**/*.js", async (route) => {
      heldScripts += 1
      await scriptsAllowed
      await route.continue()
    })
    const credential = "prehydration-secret"
    const leaked: string[] = []
    const posted: string[] = []
    const hydrationErrors: string[] = []
    page.on("request", (request) => {
      if (request.method() === "POST") posted.push(request.url())
      if (
        request.url().includes(credential) ||
        request.postData()?.includes(credential)
      ) {
        leaked.push(`${request.method()} ${request.url()}`)
      }
    })
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrat/i.test(message.text())) {
        hydrationErrors.push(message.text())
      }
    })
    page.on("pageerror", (error) => {
      if (/hydrat/i.test(error.message)) hydrationErrors.push(error.message)
    })
    try {
      await page.goto("/playground/patterns#auth-form", { waitUntil: "commit" })
      const form = page.locator("#auth-form form")
      const password = form.locator('input[name="password"]')
      await expect(form).toHaveAttribute("method", "post")
      await expect(form).toHaveAttribute("inert", "")
      await expect.poll(() => heldScripts).toBeGreaterThan(0)
      const originalInput = await password.elementHandle()
      await password.evaluate((input, value) => {
        ;(input as HTMLInputElement).value = value
      }, credential)
      const initialUrl = page.url()
      for (const button of [
        form.locator('button[type="submit"]').first(),
        form.locator("button", { hasText: "Request SSO sign in" }),
        form.locator("button", { hasText: "pending" }),
      ]) {
        await button.scrollIntoViewIfNeeded()
        const box = await button.boundingBox()
        expect(box).not.toBeNull()
        await page.mouse.click(
          box!.x + box!.width / 2,
          box!.y + box!.height / 2
        )
      }
      await page.keyboard.press("Enter")
      expect(page.url()).toBe(initialUrl)
      await expect(form).toHaveAttribute("inert", "")
      expect(leaked).toEqual([])
      expect(posted).toEqual([])

      releaseScripts()
      await expect(form).not.toHaveAttribute("inert")
      expect(await originalInput!.evaluate((input) => input.isConnected)).toBe(
        true
      )
      await expect(password).toHaveAttribute("autocomplete", "current-password")
      await expect(password).toHaveAttribute("name", "password")
      await expect(password).toHaveValue(credential)
      await page.evaluate(() => {
        const authForm = document.querySelector(
          "#auth-form form"
        ) as HTMLFormElement
        authForm.addEventListener("submit", (event) => {
          const passwordAtSubmit = String(
            new FormData(authForm).get("password")
          )
          setTimeout(() => {
            authForm.dataset.submitCount = String(
              Number(authForm.dataset.submitCount ?? 0) + 1
            )
            authForm.dataset.submitPrevented = String(event.defaultPrevented)
            authForm.dataset.submitPassword = passwordAtSubmit
          }, 0)
        })
      })
      await form.locator('button[type="submit"]').first().click()
      await expect(form).toHaveAttribute("data-submit-count", "1")
      await expect(form).toHaveAttribute("data-submit-prevented", "true")
      await expect(form).toHaveAttribute("data-submit-password", credential)
      expect(hydrationErrors).toEqual([])
      expect(leaked).toEqual([])
      expect(posted).toEqual([])
    } finally {
      releaseScripts()
      await context.close()
    }
  })

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
    const username = preview.locator('input[name="username"]')
    await expect(username).toHaveAttribute("type", "text")
    await expect(username).toHaveAttribute("autocomplete", "username")
    await username.fill("alice")
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
