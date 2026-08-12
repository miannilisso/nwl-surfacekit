import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge } from "./badge"

describe("Badge", () => {
  it("renders its text with the selected visual variant", () => {
    render(<Badge variant="destructive">Blocked</Badge>)

    const badge = screen.getByText("Blocked")
    expect(badge).toHaveAttribute("data-slot", "badge")
    expect(badge).toHaveAttribute("data-variant", "destructive")
    expect(badge).toHaveClass("bg-destructive", "text-white")
  })

  it("composes into an accessible link without losing badge metadata", () => {
    render(
      <Badge render={<a href="/releases" />} variant="outline">
        Release notes
      </Badge>
    )

    const link = screen.getByRole("link", { name: "Release notes" })
    expect(link).toHaveAttribute("href", "/releases")
    expect(link).toHaveAttribute("data-slot", "badge")
    expect(link).toHaveAttribute("data-variant", "outline")
  })
})
