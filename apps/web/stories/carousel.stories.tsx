import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Carousel } from "@nwl/surfacekit/components/carousel"

const meta: Meta<typeof Carousel> = {
  title: "SurfaceKit/Carousel",
  component: Carousel,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Carousel>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Carousel {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
