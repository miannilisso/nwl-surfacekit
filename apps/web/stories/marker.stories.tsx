import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Marker } from "@nwl/surfacekit/components/marker"

const meta: Meta<typeof Marker> = {
  title: "SurfaceKit/Marker",
  component: Marker,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Marker>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Marker {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
