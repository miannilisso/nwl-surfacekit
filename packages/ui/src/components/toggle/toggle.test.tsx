import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Toggle } from "./toggle"

describe("Toggle", () => {
  it("changes pressed state by pointer and keyboard", async () => {
    const user = userEvent.setup()
    render(<Toggle aria-label="Bold">B</Toggle>)

    const toggle = screen.getByRole("button", { name: "Bold" })
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    await user.click(toggle)
    expect(toggle).toHaveAttribute("aria-pressed", "true")
    toggle.focus()
    await user.keyboard(" ")
    expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  it("forwards variant, size, and disabled state", () => {
    render(
      <Toggle aria-label="Italic" variant="outline" size="lg" disabled>
        I
      </Toggle>
    )

    const toggle = screen.getByRole("button", { name: "Italic" })
    expect(toggle).toBeDisabled()
    expect(toggle).toHaveClass("border-input", "h-9")
  })
})
