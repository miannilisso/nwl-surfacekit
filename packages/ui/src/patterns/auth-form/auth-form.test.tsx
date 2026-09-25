import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { AuthForm } from "./auth-form"

describe("AuthForm", () => {
  it("serializes an inert POST form including slot actions before hydration despite caller props", () => {
    const markup = renderToString(
      <AuthForm
        title="Sign in"
        method="get"
        inert={false}
        alternativeActions={<button type="submit">Alternative</button>}
        secondaryActions={<button type="button">Recovery</button>}
        footer={<button type="button">Help</button>}
      >
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          defaultValue="browser-owned-secret"
        />
      </AuthForm>
    )
    const document = new DOMParser().parseFromString(markup, "text/html")
    const form = document.querySelector("form")
    expect(form?.getAttribute("method")).toBe("post")
    expect(form?.hasAttribute("inert")).toBe(true)
    expect(form?.querySelector("fieldset")?.hasAttribute("disabled")).toBe(true)
    expect(
      form
        ?.querySelector('input[name="password"]')
        ?.getAttribute("autocomplete")
    ).toBe("current-password")
    expect(
      form?.querySelector('input[name="password"]')?.getAttribute("value")
    ).toBe("browser-owned-secret")
    expect(form?.querySelectorAll("button")).toHaveLength(4)
  })

  it("hydrates in place and resumes one prevented submit with native FormData", async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      expect(event.defaultPrevented).toBe(true)
      expect(new FormData(event.currentTarget).get("password")).toBe(
        "kept-secret"
      )
    })
    const element = (
      <AuthForm title="Sign in" onSubmit={onSubmit}>
        <input name="password" type="password" defaultValue="kept-secret" />
      </AuthForm>
    )
    const host = document.createElement("div")
    document.body.append(host)
    host.innerHTML = renderToString(element)
    const input = host.querySelector("input")
    const form = host.querySelector("form")
    expect(form?.hasAttribute("inert")).toBe(true)
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await React.act(async () => {
        root = hydrateRoot(host, element)
      })
      expect(error).not.toHaveBeenCalled()
      expect(host.querySelector("input")).toBe(input)
      expect(form?.hasAttribute("inert")).toBe(false)
      expect(form?.getAttribute("method")).toBe("post")
      expect(
        form?.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true })
        )
      ).toBe(false)
      expect(onSubmit).toHaveBeenCalledOnce()
    } finally {
      await React.act(async () => root?.unmount())
      host.remove()
    }
  })

  it("preserves caller-requested inert after hydration", () => {
    render(<AuthForm title="Sign in" inert />)
    expect(screen.getByRole("form", { name: "Sign in" })).toHaveAttribute(
      "inert"
    )
  })

  it("always prevents native navigation before exposing named form data", () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      expect(event.defaultPrevented).toBe(true)
      expect(Object.fromEntries(new FormData(event.currentTarget))).toEqual({
        password: "browser-owned-secret",
      })
    })
    render(
      <AuthForm title="Sign in" onSubmit={onSubmit}>
        <input
          name="password"
          type="password"
          defaultValue="browser-owned-secret"
        />
      </AuthForm>
    )

    expect(
      fireEvent.submit(screen.getByRole("form", { name: "Sign in" }))
    ).toBe(false)
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it("prevents native GET navigation when no submit callback is supplied", () => {
    render(
      <AuthForm title="Sign in">
        <input name="username" defaultValue="alice" />
      </AuthForm>
    )

    expect(
      fireEvent.submit(screen.getByRole("form", { name: "Sign in" }))
    ).toBe(false)
  })

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

  it.each(["locked", "expired"] as const)(
    "blocks primary submission while %s and leaves recovery actions available",
    (state) => {
      const onSubmit = vi.fn()
      render(
        <AuthForm
          title="Continue"
          state={state}
          onSubmit={onSubmit}
          secondaryActions={<button type="button">Restart recovery</button>}
        >
          <input name="username" aria-label="Username" />
        </AuthForm>
      )

      const form = screen.getByRole("form", { name: "Continue" })
      expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled()
      expect(
        screen.getByRole("button", { name: "Restart recovery" })
      ).toBeEnabled()
      fireEvent.submit(form)
      expect(onSubmit).not.toHaveBeenCalled()
    }
  )
})
