import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

function AlignmentGroup(props: React.ComponentProps<typeof ToggleGroup>) {
  return (
    <ToggleGroup aria-label="Alignment" {...props}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right" disabled>
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

describe("ToggleGroup", () => {
  it("enforces single selection by default", async () => {
    const user = userEvent.setup()
    render(<AlignmentGroup />)

    await user.click(screen.getByRole("button", { name: "Left" }))
    await user.click(screen.getByRole("button", { name: "Center" }))
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("supports multiple selection, vertical orientation, and disabled items", async () => {
    const user = userEvent.setup()
    render(<AlignmentGroup multiple orientation="vertical" />)

    await user.click(screen.getByRole("button", { name: "Left" }))
    await user.click(screen.getByRole("button", { name: "Center" }))
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("button", { name: "Right" })).toBeDisabled()
    expect(screen.getByRole("group", { name: "Alignment" })).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })
})
