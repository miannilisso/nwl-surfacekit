import type { Meta, StoryObj } from "@storybook/react"

import { ConfirmDangerAction } from "@nwl/surfacekit/patterns/confirm-danger-action"

const meta = {
  title: "SurfaceKit/Patterns/ConfirmDangerAction",
  component: ConfirmDangerAction,
} satisfies Meta<typeof ConfirmDangerAction>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Delete account",
    description: "This action is permanent and will remove all related data.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  },
}
