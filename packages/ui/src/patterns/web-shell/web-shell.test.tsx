import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

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
})
