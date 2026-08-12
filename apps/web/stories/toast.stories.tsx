import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Toaster } from "@nwl/surfacekit/components/toast"

const meta: Meta<typeof Toaster> = {
  title: "SurfaceKit/Toast",
  component: Toaster,
  args: { children: "Toast preview" },
  render: (args: ComponentProps<typeof Toaster>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Toaster {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
