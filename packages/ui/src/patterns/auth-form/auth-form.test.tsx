import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AuthForm } from "./auth-form"

describe("AuthForm", () => {
  it("submits named native fields through a labelled form", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      expect(Object.fromEntries(new FormData(event.currentTarget))).toEqual({
        username: "person@example.com",
      })
    })
    render(
      <AuthForm
        title="Sign in"
        description="Continue with your account."
        submitLabel="Continue"
        onSubmit={onSubmit}
        alternativeActions={<button type="button">Use a passkey</button>}
        secondaryActions={<a href="/recover">Forgot password?</a>}
        footer={<p>Authentication is completed by your provider.</p>}
      >
        <label htmlFor="username">Email</label>
        <input
          id="username"
          name="username"
          defaultValue="person@example.com"
        />
      </AuthForm>
    )

    expect(screen.getByRole("form", { name: "Sign in" })).toBeVisible()
    expect(screen.getByRole("group", { name: "Sign in" })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Continue" }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.getByRole("button", { name: "Use a passkey" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Forgot password?" })).toBeVisible()
  })

  it.each([
    ["error", "We could not complete that request.", "alert"],
    ["locked", "Try again later or use another recovery option.", "alert"],
    ["expired", "This request expired. Start again.", "alert"],
    ["pending", "Request in progress.", "status"],
    ["success", "Request completed.", "status"],
  ] as const)(
    "announces the %s state without proving authentication",
    (state, message, role) => {
      render(
        <AuthForm title="Continue" state={state} statusMessage={message}>
          <input name="username" aria-label="Username" />
        </AuthForm>
      )
      expect(screen.getByRole(role)).toHaveTextContent(message)
    }
  )

  it("blocks duplicate submission and disables controls while pending", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <AuthForm title="Continue" state="pending" onSubmit={onSubmit}>
        <input name="username" aria-label="Username" />
      </AuthForm>
    )

    const form = screen.getByRole("form", { name: "Continue" })
    expect(form).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("group", { name: "Continue" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Continuing…" })).toBeDisabled()
    await user.click(screen.getByRole("button", { name: "Continuing…" }))
    fireEvent.submit(form)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
