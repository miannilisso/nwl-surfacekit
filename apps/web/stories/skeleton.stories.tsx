import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Skeleton } from "@nwl/surfacekit/components/skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "SurfaceKit/Skeleton",
  component: Skeleton,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Skeleton>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Skeleton {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
