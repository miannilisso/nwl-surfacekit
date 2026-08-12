import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Kbd, KbdGroup } from "./kbd"

describe("Kbd", () => {
  it("marks a single keyboard input with custom styling", () => {
    render(<Kbd className="shortcut-key">K</Kbd>)

    const key = screen.getByText("K")
    expect(key.tagName).toBe("KBD")
    expect(key).toHaveAttribute("data-slot", "kbd")
    expect(key).toHaveClass("shortcut-key")
  })

  it("groups a shortcut without creating nested kbd elements", () => {
    render(
      <KbdGroup aria-label="Open command menu">
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
    )

    const group = screen.getByRole("group", { name: "Open command menu" })
    expect(group.tagName).toBe("SPAN")
    expect(group).toHaveAttribute("data-slot", "kbd-group")
    expect(group.querySelectorAll("kbd")).toHaveLength(2)
  })
})
