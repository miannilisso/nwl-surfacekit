import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"

function PlanSelect() {
  return (
    <Select defaultValue="starter">
      <SelectTrigger aria-label="Plan">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plans</SelectLabel>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectSeparator />
          <SelectItem value="enterprise">Enterprise</SelectItem>
          <SelectItem value="legacy" disabled>
            Legacy
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

describe("Select", () => {
  it("opens a labeled trigger and selects an option with the keyboard", async () => {
    const user = userEvent.setup()
    render(<PlanSelect />)
    const trigger = screen.getByRole("combobox", { name: "Plan" })
    await user.click(trigger)
    await user.keyboard("{ArrowDown}{Enter}")
    expect(trigger).toHaveTextContent("enterprise")
    expect(trigger).toHaveFocus()
  })

  it("composes group labels, separators, and disabled items", async () => {
    const user = userEvent.setup()
    const { container } = render(<PlanSelect />)
    await user.click(screen.getByRole("combobox", { name: "Plan" }))
    expect(screen.getByText("Plans")).toHaveAttribute(
      "data-slot",
      "select-label"
    )
    expect(screen.getByRole("option", { name: "Legacy" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    expect(
      container.ownerDocument.querySelector('[data-slot="select-separator"]')
    ).toBeInTheDocument()
  })
})
