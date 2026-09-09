import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { WebHero, WebShell, WebShellFooter, WebShellHeader } from "./web-shell"

describe("WebShell", () => {
  it("composes header navigation, main, hero actions, and footer landmarks", () => {
    render(
      <WebShell
        header={
          <WebShellHeader
            title="SurfaceKit"
            links={[{ label: "Components", href: "/components" }]}
          />
        }
        footer={
          <WebShellFooter
            links={[
              { label: "Docs", href: "/docs" },
              { label: "Careers", href: "/careers" },
            ]}
          />
        }
      >
        <WebHero
          eyebrow="Enterprise UI"
          title="Ship governed interfaces"
          description="Accessible foundations for production teams."
        />
      </WebShell>
    )
    expect(screen.getByRole("banner")).toBeVisible()
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components"
    )
    expect(screen.getByRole("main")).toHaveTextContent(
      "Ship governed interfaces"
    )
    expect(
      screen.getByRole("button", { name: /Open playground/ })
    ).toHaveAttribute("href", "/playground")
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Docs")
  })

  it("supports custom hero actions and a minimal shell", () => {
    render(
      <WebShell>
        <WebHero
          title="Documentation"
          description="Implementation guidance."
          action={<a href="/get-started">Get started</a>}
        />
      </WebShell>
    )
    expect(screen.queryByRole("banner")).not.toBeInTheDocument()
    expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute(
      "href",
      "/get-started"
    )
  })

  it("allows embedded shells to yield the page-level main landmark", () => {
    render(
      <WebShell mainProps={{ role: "presentation" }}>
        Embedded public page
      </WebShell>
    )
    expect(screen.queryByRole("main")).not.toBeInTheDocument()
    expect(screen.getByText("Embedded public page")).toHaveAttribute(
      "role",
      "presentation"
    )
  })

  it("opens an accessible mobile menu without duplicating desktop navigation markup", async () => {
    const user = userEvent.setup()

    render(
      <WebShellHeader
        title="SurfaceKit"
        links={[{ label: "Components", href: "#components" }]}
        mobileNavigation={{ title: "SurfaceKit navigation" }}
      />
    )

    expect(screen.getAllByRole("navigation", { name: "Primary" })).toHaveLength(
      1
    )
    await user.click(
      screen.getByRole("button", { name: "Open primary navigation" })
    )
    const dialog = await screen.findByRole("dialog", {
      name: "SurfaceKit navigation",
    })

    expect(
      within(dialog).getByRole("link", { name: "Components" })
    ).toBeVisible()
  })

  it("reports controlled mobile menu changes and uses custom labels", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <WebShellHeader
        title="SurfaceKit"
        links={[{ label: "Components", href: "#components" }]}
        mobileNavigation={{
          open: false,
          onOpenChange,
          triggerLabel: "Show site links",
          closeLabel: "Hide site links",
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Show site links" }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("closes its mobile menu after navigation activation or a route change", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <WebShellHeader
        title="SurfaceKit"
        links={[{ label: "Components", href: "#components" }]}
        mobileNavigation={{ defaultOpen: true, routeKey: "/" }}
      />
    )

    let dialog = await screen.findByRole("dialog")
    await user.click(within(dialog).getByRole("link", { name: "Components" }))
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )

    await user.click(
      screen.getByRole("button", { name: "Open primary navigation" })
    )
    dialog = await screen.findByRole("dialog")
    expect(dialog).toBeVisible()

    rerender(
      <WebShellHeader
        title="SurfaceKit"
        links={[{ label: "Components", href: "#components" }]}
        mobileNavigation={{ defaultOpen: true, routeKey: "/components" }}
      />
    )

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
  })
})
