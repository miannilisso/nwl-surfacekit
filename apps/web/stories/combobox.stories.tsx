import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

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
} from "@nwl/surfacekit/components/combobox"

type ExampleProps = { disabled?: boolean; empty?: boolean; grouped?: boolean }
function ComboboxExample({ disabled, empty, grouped }: ExampleProps) {
  return (
    <Combobox disabled={disabled}>
      <ComboboxInput
        aria-label="Framework"
        placeholder="Search frameworks…"
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          {grouped ? (
            <>
              <ComboboxGroup>
                <ComboboxLabel>Frontend</ComboboxLabel>
                <ComboboxItem value="React">React</ComboboxItem>
                <ComboboxItem value="Vue">Vue</ComboboxItem>
              </ComboboxGroup>
              <ComboboxSeparator />
              <ComboboxGroup>
                <ComboboxLabel>Backend</ComboboxLabel>
                <ComboboxItem value="Django">Django</ComboboxItem>
              </ComboboxGroup>
            </>
          ) : (
            !empty && (
              <>
                <ComboboxItem value="React">React</ComboboxItem>
                <ComboboxItem value="Vue">Vue</ComboboxItem>
              </>
            )
          )}
        </ComboboxList>
        <ComboboxEmpty>No frameworks found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}
const meta = {
  title: "SurfaceKit/Components/Form Inputs/Combobox",
  component: ComboboxExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Filters and selects values from an accessible searchable option list.",
      },
    },
  },
} satisfies Meta<typeof ComboboxExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("combobox", {
      name: "Framework",
    })
    await userEvent.type(input, "Vue")
    await userEvent.click(
      within(document.body).getByRole("option", { name: "Vue" })
    )
    await expect(input).toHaveValue("Vue")
  },
}
export const Grouped: Story = { args: { grouped: true } }
export const Empty: Story = { args: { empty: true } }
export const MultipleChips: Story = {
  args: { grouped: true },
  name: "Multiple chips (selection catalog)",
}
export const Disabled: Story = { args: { disabled: true } }
