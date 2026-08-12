import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { HoverCard } from "@nwl/surfacekit/components/hover-card"

const meta: Meta<typeof HoverCard> = {
  title: "SurfaceKit/Hover Card",
  component: HoverCard,
  args: {
    children: (
      <button className="rounded-full border px-3 py-1 text-sm">
        Hover me
      </button>
    ),
  },
  render: (args: ComponentProps<typeof HoverCard>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <HoverCard {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
