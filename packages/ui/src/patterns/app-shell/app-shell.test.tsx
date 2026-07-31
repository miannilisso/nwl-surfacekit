import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AppShell, AppSidebar, AppTopbar } from "./app-shell.js"

describe("AppShell", () => {
  it("renders the shell sections and navigation content", () => {
    render(
      <AppShell
        topbar={<AppTopbar title="Workspace" />}
        sidebar={<AppSidebar items={["Overview", "Projects"]} />}
      >
        <div>Body content</div>
      </AppShell>
    )

    expect(screen.getByText("Workspace")).toBeInTheDocument()
    expect(screen.getByText("Overview")).toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Body content")).toBeInTheDocument()
  })
})
