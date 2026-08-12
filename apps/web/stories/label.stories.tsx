import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@nwl/surfacekit/components/label"

const meta = {
  title: "SurfaceKit/Label",
  component: Label,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="workspace">Workspace name</Label>
      <input
        id="workspace"
        className="h-9 rounded-md border bg-background px-3 text-sm"
        placeholder="Acme Design"
      />
    </div>
  ),
}

export const DisabledControl: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="organization">Organization</Label>
      <input
        id="organization"
        className="peer h-9 rounded-md border bg-muted px-3 text-sm"
        value="Naneware Labs"
        disabled
        readOnly
      />
    </div>
  ),
}
