import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Label } from "@nwl/surfacekit/components/label"
import { Switch } from "@nwl/surfacekit/components/switch"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Turns a setting on or off with an immediately applied state.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="alerts-switch" {...args} />
      <Label htmlFor="alerts-switch">Enable alerts</Label>
    </div>
  ),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Off: Story = {
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("switch", {
      name: "Enable alerts",
    })
    await userEvent.click(control)
    await expect(control).toBeChecked()
  },
}

export const On: Story = { args: { defaultChecked: true } }

export const Disabled: Story = { args: { disabled: true } }
