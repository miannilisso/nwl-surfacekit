import { render, screen, waitFor, within } from "@testing-library/react"
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

  it("opens mobile navigation with an accessible controlled state", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <AppShell
        sidebar={
          <AppSidebar
            label="Workspace navigation"
            items={[{ label: "Overview", href: "/overview" }]}
          />
        }
        mobileNavigation={{ open: false, onOpenChange }}
      >
        Workspace
      </AppShell>
    )

    await user.click(
      screen.getByRole("button", { name: "Open workspace navigation" })
    )

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("traps mobile navigation focus and restores it after Escape", async () => {
    const user = userEvent.setup()

    render(
      <AppShell
        sidebar={
          <AppSidebar
            label="Workspace navigation"
            items={[{ label: "Overview", href: "/overview" }]}
          />
        }
        mobileNavigation={{ title: "Workspace navigation" }}
      >
        <button type="button">Background action</button>
      </AppShell>
    )

    const trigger = screen.getByRole("button", {
      name: "Open workspace navigation",
    })
    await user.click(trigger)
    const dialog = await screen.findByRole("dialog", {
      name: "Workspace navigation",
    })

    expect(within(dialog).getByRole("link", { name: "Overview" })).toBeVisible()
    expect(document.body).toHaveStyle({
      overflowX: "hidden",
      overflowY: "hidden",
    })

    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe("")
  })

  it("closes mobile navigation after link activation", async () => {
    const user = userEvent.setup()

    render(
      <AppShell
        sidebar={
          <AppSidebar
            label="Workspace navigation"
            items={[{ label: "Reports", href: "#reports" }]}
          />
        }
        mobileNavigation={{ defaultOpen: true }}
      >
        Workspace
      </AppShell>
    )

    const dialog = await screen.findByRole("dialog")
    await user.click(within(dialog).getByRole("link", { name: "Reports" }))

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
  })

  it("closes uncontrolled mobile navigation when the route identity changes", async () => {
    const sidebar = (
      <AppSidebar
        label="Workspace navigation"
        items={[{ label: "Overview", href: "/overview" }]}
      />
    )
    const { rerender } = render(
      <AppShell
        sidebar={sidebar}
        mobileNavigation={{ defaultOpen: true, routeKey: "/overview" }}
      >
        Workspace
      </AppShell>
    )

    expect(await screen.findByRole("dialog")).toBeVisible()

    rerender(
      <AppShell
        sidebar={sidebar}
        mobileNavigation={{ defaultOpen: true, routeKey: "/reports" }}
      >
        Workspace
      </AppShell>
    )

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
  })

  it("restores body scrolling when open mobile navigation unmounts", async () => {
    const { unmount } = render(
      <AppShell
        sidebar={
          <AppSidebar items={[{ label: "Overview", href: "/overview" }]} />
        }
        mobileNavigation={{ defaultOpen: true }}
      >
        Workspace
      </AppShell>
    )

    expect(await screen.findByRole("dialog")).toBeVisible()
    expect(document.body).toHaveStyle({
      overflowX: "hidden",
      overflowY: "hidden",
    })
    unmount()
    expect(document.body.style.overflow).toBe("")
  })
})
