import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AppShell, AppSidebar, AppTopbar } from "./app-shell"

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
})
