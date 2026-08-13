import type { Meta, StoryObj } from "@storybook/react-vite"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"

const meta = {
  title: "SurfaceKit/Patterns/Error Summary",
  component: ErrorSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Announces one or more validation failures and optionally links each error to its invalid field.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[38rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
  args: { title: "Submission failed", messages: [] },
} satisfies Meta<typeof ErrorSummary>
export default meta
type Story = StoryObj<typeof meta>
export const SingleError: Story = {
  args: { messages: ["Billing address is required"] },
}
export const MultipleErrors: Story = {
  args: {
    messages: [
      "Billing address is required",
      "Payment method must be verified",
      "Plan selection is invalid",
    ],
  },
}
export const LinkedErrors: Story = {
  args: {
    errors: [
      {
        id: "billing",
        message: "Review billing address",
        href: "#billing-address",
      },
      {
        id: "payment",
        message: "Verify payment method",
        href: "#payment-method",
      },
    ],
  },
}
export const LongLabels: Story = {
  args: {
    messages: [
      "The organization billing address must include a valid locality, administrative region, postal code, and supported invoicing country before this annual enterprise plan can be activated.",
    ],
  },
}
