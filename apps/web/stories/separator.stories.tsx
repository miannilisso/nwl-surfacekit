import type { Meta, StoryObj } from "@storybook/react-vite"

import { Separator } from "@nwl/surfacekit/components/separator"

const meta = {
  title: "SurfaceKit/Separator",
  component: Separator,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <div>
        <p className="font-medium">SurfaceKit</p>
        <p className="text-sm text-muted-foreground">
          Production UI primitives
        </p>
      </div>
      <Separator aria-label="Package details" />
      <p className="text-sm">70 components and patterns</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Components</span>
      <Separator orientation="vertical" aria-label="Navigation divider" />
      <span>Patterns</span>
      <Separator orientation="vertical" aria-label="Navigation divider" />
      <span>Releases</span>
    </div>
  ),
}
