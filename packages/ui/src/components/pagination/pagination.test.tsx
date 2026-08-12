import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

describe("Pagination", () => {
  it("labels navigation and exposes the current page", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="?page=1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="?page=2" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="?page=3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(
      screen.getByRole("navigation", { name: "pagination" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(
      screen.getByRole("link", { name: "Go to previous page" })
    ).toHaveAttribute("href", "?page=1")
    expect(
      screen.getByRole("link", { name: "Go to next page" })
    ).toHaveAttribute("href", "?page=3")
  })

  it("hides the visual ellipsis from assistive technology", () => {
    const { container } = render(<PaginationEllipsis />)
    expect(
      container.querySelector('[data-slot="pagination-ellipsis"]')
    ).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByText("More pages")).toHaveClass("sr-only")
  })
})
