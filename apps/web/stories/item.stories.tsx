import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Item } from "@nwl/surfacekit/components/item"

const meta: Meta<typeof Item> = {
  title: "SurfaceKit/Item",
  component: Item,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Item>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Item {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
