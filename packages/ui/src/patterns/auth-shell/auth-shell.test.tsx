import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AuthPanel, AuthShell } from "./auth-shell"

describe("AuthShell", () => {
  it("labels authentication content and a custom supporting panel", () => {
    render(
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to continue"
        aside={
          <AuthPanel
            title="Application access"
            subtitle="Configured by the consuming application"
          >
            <p>Available methods are selected by the application.</p>
            <footer>Security policy SK-12</footer>
          </AuthPanel>
        }
      >
        <form aria-label="Sign in">
          <button>Continue with SSO</button>
        </form>
      </AuthShell>
    )
    expect(
      screen.getByRole("heading", { level: 1, name: "Welcome back" })
    ).toBeVisible()
    expect(screen.getByText("Sign in to continue")).toBeVisible()
    expect(screen.getByRole("form", { name: "Sign in" })).toBeVisible()
    expect(
      screen.getByRole("heading", { name: "Application access" })
    ).toBeVisible()
    expect(screen.getByText("Security policy SK-12")).toBeVisible()
  })

  it("preserves long authentication error content", () => {
    const message =
      "Authentication could not be completed because the organization identity provider rejected the signed assertion. Contact an administrator and include request ID req_01J9."
    render(
      <AuthShell title="Verification required" subtitle={message}>
        <p>{message}</p>
      </AuthShell>
    )
    expect(screen.getAllByText(message)).toHaveLength(2)
  })

  it("provides the default access panel without optional subtitles", () => {
    render(
      <AuthShell title="Continue">
        <AuthPanel title="Policy">
          <p>Managed access</p>
        </AuthPanel>
      </AuthShell>
    )

    expect(screen.getByRole("heading", { name: "Continue" })).toBeVisible()
    expect(screen.getByRole("heading", { name: "Secure access" })).toBeVisible()
    expect(
      screen.getByText("Works with your chosen sign-in service")
    ).toBeVisible()
    expect(screen.getByRole("heading", { name: "Policy" })).toBeVisible()
  })

  it("keeps brand, support, legal, and footer content available with or without the aside", () => {
    render(
      <AuthShell
        title="Continue"
        brand={<a href="/">Northwind</a>}
        support={<a href="/support">Get help</a>}
        legal={<a href="/privacy">Privacy</a>}
        footer={<p>Use of this screen does not create a session.</p>}
      >
        <p>Sign-in form</p>
      </AuthShell>
    )

    expect(screen.getByRole("link", { name: "Northwind" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Get help" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Privacy" })).toBeVisible()
    expect(
      screen.getByText("Use of this screen does not create a session.")
    ).toBeVisible()
    expect(screen.queryByText(/oauth|enterprise-ready|enforced/i)).toBeNull()
  })
})
