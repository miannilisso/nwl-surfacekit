import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Spinner } from "./spinner"

describe("Spinner", () => {
  it("announces loading with a default accessible name", () => {
    render(<Spinner />)

    expect(screen.getByRole("status", { name: "Loading" })).toHaveAttribute(
      "data-slot",
      "spinner"
    )
  })

  it("accepts a contextual name and caller-controlled size", () => {
    render(<Spinner aria-label="Publishing release" className="size-6" />)

    expect(
      screen.getByRole("status", { name: "Publishing release" })
    ).toHaveClass("animate-spin", "size-6")
  })
})
