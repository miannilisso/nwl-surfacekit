import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
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

function MultipleFruitCombobox() {
  const anchor = useComboboxAnchor()
  const fruit = ["apple", "banana"]

  return (
    <Combobox multiple items={fruit} defaultValue={["apple"]}>
      <ComboboxChips ref={anchor}>
        <ComboboxChip>Apple</ComboboxChip>
        <ComboboxChipsInput aria-label="Fruit choices" />
      </ComboboxChips>
      <ComboboxTrigger aria-label="Toggle fruit choices">
        <ComboboxValue placeholder="Choose fruit" />
      </ComboboxTrigger>
      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => <ComboboxItem value={item}>{item}</ComboboxItem>}
          </ComboboxCollection>
        </ComboboxList>
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

  it("composes multiple-selection chips, values, collections, and anchors", async () => {
    const user = userEvent.setup()
    render(<MultipleFruitCombobox />)

    expect(screen.getByText("Apple")).toHaveAttribute(
      "data-slot",
      "combobox-chip"
    )
    expect(
      screen.getByRole("combobox", { name: "Fruit choices" })
    ).toHaveAttribute("data-slot", "combobox-chip-input")
    await user.click(
      screen.getByRole("button", { name: "Toggle fruit choices" })
    )
    expect(await screen.findByRole("option", { name: "banana" })).toBeVisible()
    expect(
      document.querySelector('[data-slot="combobox-content"]')
    ).toHaveAttribute("data-chips", "true")
  })
})
