import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Breadcrumb } from "@nwl/surfacekit/components/breadcrumb"

const meta: Meta<typeof Breadcrumb> = {
  title: "SurfaceKit/Breadcrumb",
  component: Breadcrumb,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Breadcrumb>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Breadcrumb {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
