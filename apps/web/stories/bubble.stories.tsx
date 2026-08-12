import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Bubble } from "@nwl/surfacekit/components/bubble"

const meta: Meta<typeof Bubble> = {
  title: "SurfaceKit/Bubble",
  component: Bubble,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Bubble>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Bubble {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
