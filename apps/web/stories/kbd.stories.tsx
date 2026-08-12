import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Kbd } from "@nwl/surfacekit/components/kbd"

const meta: Meta<typeof Kbd> = {
  title: "SurfaceKit/Kbd",
  component: Kbd,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Kbd>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Kbd {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
