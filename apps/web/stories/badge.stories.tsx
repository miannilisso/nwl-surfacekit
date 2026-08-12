import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Badge } from "@nwl/surfacekit/components/badge"

const meta: Meta<typeof Badge> = {
  title: "SurfaceKit/Badge",
  component: Badge,
  args: { children: "Badge" },
  render: (args: ComponentProps<typeof Badge>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Badge {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
