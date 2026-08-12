import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@nwl/surfacekit/components/context-menu"

const meta: Meta<typeof ContextMenu> = {
  title: "SurfaceKit/Context Menu",
  component: ContextMenu,
  args: {
    children: (
      <>
        <ContextMenuTrigger>
          <button className="rounded-xl border px-3 py-1 text-sm">
            Right click me
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item one</ContextMenuItem>
          <ContextMenuItem>Item two</ContextMenuItem>
        </ContextMenuContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof ContextMenu>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <ContextMenu {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
