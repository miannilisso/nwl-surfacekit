import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Separator } from "@nwl/surfacekit/components/separator"

const meta: Meta<typeof Separator> = {
  title: "SurfaceKit/Separator",
  component: Separator,
  args: { orientation: "horizontal" },
  render: (args: ComponentProps<typeof Separator>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Separator {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
