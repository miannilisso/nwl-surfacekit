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
            title="Enterprise access"
            subtitle="Managed by your organization"
          >
            <p>SSO enforcement enabled</p>
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
      screen.getByRole("heading", { name: "Enterprise access" })
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
})
