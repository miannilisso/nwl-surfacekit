import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Slider } from "@nwl/surfacekit/components/slider"

const meta: Meta<typeof Slider> = {
  title: "SurfaceKit/Slider",
  component: Slider,
  args: { defaultValue: [50] },
  render: (args: ComponentProps<typeof Slider>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Slider {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
