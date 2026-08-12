import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Label } from "@nwl/surfacekit/components/label"
import { Slider } from "@nwl/surfacekit/components/slider"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Selects one value or a bounded range using pointer and keyboard input.",
      },
    },
  },
  args: {
    defaultValue: [50],
    getThumbAriaLabel: (_index: number) => "Volume",
    className: "w-72",
  },
  render: (args) => (
    <div className="grid gap-3">
      <Label>Volume</Label>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole("slider", { name: "Volume" })
    slider.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(slider).toHaveValue("51")
  },
}

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    getThumbAriaLabel: (index) =>
      index === 0 ? "Minimum price" : "Maximum price",
  },
}

export const Steps: Story = {
  args: {
    defaultValue: [25],
    step: 25,
    getThumbAriaLabel: () => "Completion",
  },
}

export const Disabled: Story = { args: { disabled: true } }
