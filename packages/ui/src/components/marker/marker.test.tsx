import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Marker, MarkerContent, MarkerIcon } from "./marker"

describe("Marker", () => {
  it("renders decorative icons and content across variants", () => {
    const { container } = render(
      <Marker variant="separator">
        <MarkerIcon>•</MarkerIcon>
        <MarkerContent>Today</MarkerContent>
      </Marker>
    )
    expect(
      screen.getByText("Today").closest('[data-slot="marker"]')
    ).toHaveAttribute("data-variant", "separator")
    expect(
      container.querySelector('[data-slot="marker-icon"]')
    ).toHaveAttribute("aria-hidden", "true")
  })

  it("composes as a native interactive element", () => {
    render(
      <Marker variant="border" render={<a href="/history" />}>
        <MarkerContent>View history</MarkerContent>
      </Marker>
    )
    const link = screen.getByRole("link", { name: "View history" })
    expect(link).toHaveAttribute("href", "/history")
    expect(link).toHaveAttribute("data-variant", "border")
  })
})
