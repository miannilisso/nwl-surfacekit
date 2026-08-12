import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { ScrollArea } from "@nwl/surfacekit/components/scroll-area"

const meta: Meta<typeof ScrollArea> = {
  title: "SurfaceKit/Scroll Area",
  component: ScrollArea,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof ScrollArea>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <ScrollArea {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
