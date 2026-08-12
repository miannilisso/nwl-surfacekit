import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "./combobox"

function FruitCombobox() {
  return (
    <Combobox>
      <ComboboxInput aria-label="Fruit" placeholder="Search fruit" showClear />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>Fruit</ComboboxLabel>
            <ComboboxItem value="apple">Apple</ComboboxItem>
            <ComboboxSeparator />
            <ComboboxItem value="banana">Banana</ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
        <ComboboxEmpty>No fruit found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}

describe("Combobox", () => {
  it("opens, filters, selects, and clears a labeled value", async () => {
    const user = userEvent.setup()
    render(<FruitCombobox />)
    const input = screen.getByRole("combobox", { name: "Fruit" })
    await user.click(input)
    await user.type(input, "ban")
    await user.click(await screen.findByRole("option", { name: "Banana" }))
    expect(input).toHaveValue("banana")
    await user.click(screen.getByRole("button", { name: /clear/i }))
    expect(input).toHaveValue("")
  })

  it("shows grouped empty content after filtering and preserves disabled state", async () => {
    const user = userEvent.setup()
    const { rerender } = render(<FruitCombobox />)
    const input = screen.getByRole("combobox", { name: "Fruit" })
    await user.type(input, "pear")
    expect(await screen.findByText("No fruit found")).toBeVisible()

    rerender(
      <Combobox disabled>
        <ComboboxInput aria-label="Disabled fruit" disabled />
      </Combobox>
    )
    expect(
      screen.getByRole("combobox", { name: "Disabled fruit" })
    ).toBeDisabled()
  })
})
