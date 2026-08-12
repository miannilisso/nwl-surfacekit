import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { ChartContainer } from "@nwl/surfacekit/components/chart"

const meta: Meta<typeof ChartContainer> = {
  title: "SurfaceKit/Chart",
  component: ChartContainer,
  args: {
    config: {},
    children: "Chart preview",
  },
  render: (args: ComponentProps<typeof ChartContainer>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <ChartContainer {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
