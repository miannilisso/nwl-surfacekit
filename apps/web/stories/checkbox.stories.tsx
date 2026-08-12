import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Checkbox } from "@nwl/surfacekit/components/checkbox"
import { Label } from "@nwl/surfacekit/components/label"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Selects independent boolean options with checked, mixed, and disabled states.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="release-checkbox" {...args} />
      <Label htmlFor="release-checkbox">Include release notes</Label>
    </div>
  ),
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Unchecked: Story = {
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole("checkbox", {
      name: "Include release notes",
    })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
}

export const Checked: Story = { args: { defaultChecked: true } }

export const Indeterminate: Story = { args: { indeterminate: true } }

export const Disabled: Story = { args: { disabled: true } }
