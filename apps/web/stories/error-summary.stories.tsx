import type { Meta, StoryObj } from "@storybook/react"

import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"

const meta = {
  title: "SurfaceKit/Patterns/ErrorSummary",
  component: ErrorSummary,
} satisfies Meta<typeof ErrorSummary>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Submission failed",
    messages: [
      "Billing address is required",
      "Payment method must be verified",
      "Plan selection is invalid",
    ],
  },
}
