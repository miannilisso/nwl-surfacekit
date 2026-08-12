import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { AspectRatio } from "@nwl/surfacekit/components/aspect-ratio"

const meta: Meta<typeof AspectRatio> = {
  title: "SurfaceKit/Aspect Ratio",
  component: AspectRatio,
  args: { ratio: 1.78 },
  render: (args: ComponentProps<typeof AspectRatio>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <AspectRatio {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
