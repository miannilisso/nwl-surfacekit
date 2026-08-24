import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AppShell, AppSidebar, AppTopbar, ThemeSwitcher } from "./app-shell"

const theme = vi.hoisted(() => ({
  resolvedTheme: "light",
  setTheme: vi.fn(),
}))

vi.mock("next-themes", () => ({
  useTheme: () => theme,
}))

describe("AppShell", () => {
  it("composes banner, navigation, and main landmarks with active links", () => {
    render(
      <AppShell
        topbar={<AppTopbar title="Workspace" eyebrow="SurfaceKit" />}
        sidebar={
          <AppSidebar
            label="Workspace navigation"
            items={[
              { label: "Overview", href: "/overview", active: true },
              { label: "Reports", href: "/reports", badge: 3 },
            ]}
          />
        }
      >
        <h2>Release dashboard</h2>
      </AppShell>
    )
    expect(screen.getByRole("banner")).toHaveTextContent("Workspace")
    expect(
      screen.getByRole("navigation", { name: "Workspace navigation" })
    ).toBeVisible()
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("link", { name: /Reports/ })).toHaveAttribute(
      "href",
      "/reports"
    )
    expect(screen.getByRole("main")).toHaveTextContent("Release dashboard")
  })

  it("renders and invokes custom topbar actions", async () => {
    const user = userEvent.setup()
    const onInvite = vi.fn()
    render(
      <AppTopbar
        title="Workspace"
        actions={
          <button type="button" onClick={onInvite}>
            Invite member
          </button>
        }
      />
    )
    await user.click(screen.getByRole("button", { name: "Invite member" }))
    expect(onInvite).toHaveBeenCalledOnce()
  })

  it("allows embedded shells to yield the page-level main landmark", () => {
    render(
      <AppShell mainProps={{ role: "presentation" }}>
        Embedded workspace
      </AppShell>
    )
    expect(screen.queryByRole("main")).not.toBeInTheDocument()
    expect(screen.getByText("Embedded workspace")).toHaveAttribute(
      "role",
      "presentation"
    )
  })

  it("allows an application router to render internal links", () => {
    render(
      <AppSidebar
        items={[{ label: "Components", href: "/playground", active: true }]}
        renderItem={(item, props) => (
          <a {...props} data-router-link="true" href={item.href} />
        )}
      />
    )
    const link = screen.getByRole("link", { name: "Components" })
    expect(link).toHaveAttribute("data-router-link", "true")
    expect(link).toHaveAttribute("aria-current", "page")
  })

  it("renders an optional footer in the contentinfo landmark", () => {
    render(
      <AppShell footer={<span>SurfaceKit footer</span>}>Workspace</AppShell>
    )

    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "SurfaceKit footer"
    )
  })

  it("places an optional sidebar footer after the navigation list", () => {
    render(
      <AppSidebar
        items={[{ label: "Overview", href: "/playground" }]}
        footer={<a href="/">Home</a>}
      />
    )

    const list = screen.getByRole("list")
    const home = screen.getByRole("link", { name: "Home" })

    expect(
      list.compareDocumentPosition(home) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it("switches from light to dark when the theme action is pressed", async () => {
    const user = userEvent.setup()
    render(<ThemeSwitcher />)

    await user.click(screen.getByRole("button", { name: "Toggle theme" }))

    expect(theme.setTheme).toHaveBeenCalledWith("dark")
  })
})
