import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AuthPanel, AuthShell } from "./auth-shell"

describe("AuthShell", () => {
  it("renders the shell content and supporting panel", () => {
    render(
      <AuthShell title="Welcome back" subtitle="Sign in to continue">
        <AuthPanel title="Secure access" subtitle="Use your work account to continue">
          <div>Continue with SSO</div>
        </AuthPanel>
      </AuthShell>
    )

    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument()
    expect(screen.getAllByText("Secure access").length).toBeGreaterThan(0)
    expect(screen.getByText("Continue with SSO")).toBeInTheDocument()
  })
})
