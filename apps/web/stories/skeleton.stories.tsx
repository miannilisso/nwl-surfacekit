import type { Meta, StoryObj } from "@storybook/react-vite"

import { Skeleton } from "@nwl/surfacekit/components/skeleton"

const meta = {
  title: "SurfaceKit/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  render: () => (
    <div aria-label="Loading content" role="status" className="w-72 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
}

export const Avatar: Story = {
  render: () => (
    <div
      aria-label="Loading profile"
      role="status"
      className="flex items-center gap-3"
    >
      <Skeleton className="size-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  ),
}

export const CardLoading: Story = {
  render: () => (
    <div
      aria-label="Loading release card"
      role="status"
      className="w-80 space-y-4 rounded-lg border p-5"
    >
      <Skeleton className="h-5 w-40" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  ),
}
