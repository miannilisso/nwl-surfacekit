import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@nwl/surfacekit/components/toggle-group"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Coordinates single or multiple pressed options with roving keyboard focus.",
      },
    },
  },
  args: { "aria-label": "Text alignment" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Single: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Center" }))
    await expect(
      canvas.getByRole("button", { name: "Center" })
    ).toHaveAttribute("aria-pressed", "true")
  },
}

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["left", "right"] },
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
}

export const DisabledItem: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
      <ToggleGroupItem value="review">Review</ToggleGroupItem>
      <ToggleGroupItem value="published" disabled>
        Published
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}
