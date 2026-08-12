import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { ResizablePanelGroup } from "@nwl/surfacekit/components/resizable"

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "SurfaceKit/Resizable",
  component: ResizablePanelGroup,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof ResizablePanelGroup>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <ResizablePanelGroup {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
