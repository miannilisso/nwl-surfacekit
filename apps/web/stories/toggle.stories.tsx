import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Toggle } from "@nwl/surfacekit/components/toggle"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Switches a single formatting or display option between pressed states.",
      },
    },
  },
  args: { children: "Bold", "aria-label": "Bold" },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole("button", { name: "Bold" })
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
  },
}

export const Pressed: Story = { args: { defaultPressed: true } }

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold">Default</Toggle>
      <Toggle aria-label="Italic" variant="outline">
        Outline
      </Toggle>
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }
