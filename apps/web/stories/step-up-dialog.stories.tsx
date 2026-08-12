import type { Meta, StoryObj } from "@storybook/react"

import { StepUpDialog } from "@nwl/surfacekit/patterns/step-up-dialog"

const meta = {
  title: "SurfaceKit/Patterns/StepUpDialog",
  component: StepUpDialog,
} satisfies Meta<typeof StepUpDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    headline: "Action authorization required",
    description:
      "For security reasons, please verify your identity before editing sensitive settings.",
    primaryLabel: "Verify now",
    secondaryLabel: "Remind me later",
  },
}
