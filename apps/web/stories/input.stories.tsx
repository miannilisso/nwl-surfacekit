import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Collects single-line text and native input types with validation states.",
      },
    },
  },
  args: { placeholder: "Acme Design" },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="workspace-input">Workspace name</Label>
      <Input id="workspace-input" {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Types: Story = {
  render: () => (
    <div className="grid w-72 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email-input">Email</Label>
        <Input id="email-input" type="email" placeholder="team@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password-input">Password</Label>
        <Input
          id="password-input"
          type="password"
          value="surfacekit"
          readOnly
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="number-input">Seats</Label>
        <Input id="number-input" type="number" defaultValue={25} />
      </div>
    </div>
  ),
}

export const Invalid: Story = {
  args: { "aria-invalid": true, "aria-describedby": "workspace-error" },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="invalid-input">Workspace name</Label>
      <Input id="invalid-input" {...args} />
      <p id="workspace-error" className="text-sm text-destructive">
        Workspace name is required.
      </p>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, value: "Naneware Labs", readOnly: true },
}
