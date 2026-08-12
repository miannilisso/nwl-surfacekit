import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"

describe("Breadcrumb", () => {
  it("provides a labeled trail with links and the current page", () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(
      container.querySelector('[data-slot="breadcrumb-separator"]')
    ).toHaveAttribute("aria-hidden", "true")
  })

  it("keeps collapsed-path decoration out of the accessibility tree", () => {
    const { container } = render(<BreadcrumbEllipsis />)
    expect(
      container.querySelector('[data-slot="breadcrumb-ellipsis"]')
    ).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByText("More")).toHaveClass("sr-only")
  })
})
