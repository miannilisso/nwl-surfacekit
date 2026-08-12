import type { Meta, StoryObj } from "@storybook/react"

import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"

const meta = {
  title: "SurfaceKit/Patterns/ResourceStatus",
  component: ResourceStatus,
} satisfies Meta<typeof ResourceStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Compute usage",
    value: "62%",
    progress: 62,
    detail: "22 of 35 nodes active",
  },
}
