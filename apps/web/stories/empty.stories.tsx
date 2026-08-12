import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Empty } from "@nwl/surfacekit/components/empty"

const meta: Meta<typeof Empty> = {
  title: "SurfaceKit/Empty",
  component: Empty,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Empty>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Empty {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
