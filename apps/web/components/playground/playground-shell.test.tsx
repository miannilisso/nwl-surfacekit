import { render, screen } from "@testing-library/react"
import { usePathname } from "next/navigation"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { PlaygroundShell } from "./playground-shell"

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }))

describe("PlaygroundShell", () => {
  beforeEach(() =>
    vi.mocked(usePathname).mockReturnValue("/playground/data-display")
  )

  it("keeps the active category, home action, and product identity available", () => {
    render(
      <PlaygroundShell>
        <p>Examples</p>
      </PlaygroundShell>
    )
    expect(screen.getByRole("link", { name: /Data Display/ })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(
      screen.getByRole("link", { name: /Navigation/ })
    ).not.toHaveAttribute("aria-current")
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(screen.getByRole("contentinfo")).toHaveTextContent("SurfaceKit")
  })

  it("keeps the catalog reachable when the desktop sidebar is hidden", () => {
    render(<PlaygroundShell>Examples</PlaygroundShell>)
    expect(
      screen.getByRole("link", { name: "Browse catalog" })
    ).toHaveAttribute("href", "/playground")
    expect(screen.getByRole("main")).toHaveTextContent("Examples")
  })
})
