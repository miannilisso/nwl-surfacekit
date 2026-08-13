import type { Meta, StoryObj } from "@storybook/react-vite"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"

const meta = {
  title: "SurfaceKit/Patterns/Resource Status",
  component: ResourceStatus,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Summarizes a resource value and detail with labeled determinate or indeterminate progress and operational tone.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Compute usage",
    value: "62%",
    detail: "22 of 35 nodes active",
  },
} satisfies Meta<typeof ResourceStatus>
export default meta
type Story = StoryObj<typeof meta>
export const Healthy: Story = { args: { tone: "healthy", progress: 62 } }
export const Warning: Story = {
  args: {
    tone: "warning",
    progress: 84,
    value: "84%",
    detail: "6 nodes remaining",
  },
}
export const Critical: Story = {
  args: {
    tone: "critical",
    progress: 97,
    value: "97%",
    detail: "Capacity action required",
  },
}
export const Indeterminate: Story = {
  args: {
    progress: undefined,
    value: "Provisioning",
    detail: "Capacity is being allocated",
  },
}
