import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { DirectionProvider } from "@nwl/surfacekit/components/direction"

const meta: Meta<typeof DirectionProvider> = {
  title: "SurfaceKit/Direction",
  component: DirectionProvider,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof DirectionProvider>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <DirectionProvider {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
