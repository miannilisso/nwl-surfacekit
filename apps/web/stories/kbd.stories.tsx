import type { Meta, StoryObj } from "@storybook/react-vite"

import { Kbd, KbdGroup } from "@nwl/surfacekit/components/kbd"

const meta = {
  title: "SurfaceKit/Kbd",
  component: Kbd,
  parameters: { layout: "centered" },
  args: { children: "K" },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {}

export const ShortcutGroup: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm">
      <span>Open command menu</span>
      <KbdGroup aria-label="Control plus K">
        <Kbd>Ctrl</Kbd>
        <span aria-hidden="true">+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  ),
}
