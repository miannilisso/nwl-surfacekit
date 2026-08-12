import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Sidebar } from "@nwl/surfacekit/components/sidebar"

const meta: Meta<typeof Sidebar> = {
  title: "SurfaceKit/Sidebar",
  component: Sidebar,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Sidebar>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Sidebar {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
