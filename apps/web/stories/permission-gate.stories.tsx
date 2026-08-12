import type { Meta, StoryObj } from "@storybook/react-vite"

import { PermissionGate } from "@nwl/surfacekit/patterns/permission-gate"

const meta = {
  title: "SurfaceKit/Patterns/PermissionGate",
  component: PermissionGate,
} satisfies Meta<typeof PermissionGate>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Access restricted",
    description:
      "Your current role does not allow changes to this workspace. Request access to continue with administrative tasks.",
  },
}
