import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@nwl/surfacekit/components/select"

type ExampleProps = {
  disabledItem?: boolean
  invalid?: boolean
  long?: boolean
  grouped?: boolean
}
function SelectExample({ disabledItem, invalid, long, grouped }: ExampleProps) {
  const values = long
    ? Array.from({ length: 20 }, (_, i) => `Region ${i + 1}`)
    : ["Starter", "Growth", "Enterprise"]
  return (
    <Select defaultValue="Starter">
      <SelectTrigger aria-label="Plan" aria-invalid={invalid} className="w-64">
        <SelectValue placeholder="Choose a plan" />
      </SelectTrigger>
      <SelectContent>
        {grouped && <SelectLabel>Available plans</SelectLabel>}
        {values.map((value, i) => (
          <SelectItem
            key={value}
            value={value}
            disabled={disabledItem && i === 2}
          >
            {value}
          </SelectItem>
        ))}
        {grouped && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Archived</SelectLabel>
              <SelectItem value="Legacy" disabled>
                Legacy
              </SelectItem>
            </SelectGroup>
          </>
        )}
      </SelectContent>
    </Select>
  )
}
const meta = {
  title: "SurfaceKit/Components/Form Inputs/Select",
  component: SelectExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Selects one option from an accessible popup list with grouping and keyboard navigation.",
      },
    },
  },
} satisfies Meta<typeof SelectExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", {
      name: "Plan",
    })
    await userEvent.click(trigger)
    const listbox = await within(canvasElement.ownerDocument.body).findByRole(
      "listbox"
    )
    await waitFor(() => expect(listbox).toBeVisible())
    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true")
    )
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await waitFor(() => expect(trigger).toHaveTextContent("Growth"))
  },
}
export const Groups: Story = { args: { grouped: true } }
export const DisabledItem: Story = { args: { disabledItem: true } }
export const LongList: Story = { args: { long: true } }
export const Invalid: Story = { args: { invalid: true } }
