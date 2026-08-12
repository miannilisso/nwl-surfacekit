import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { MessageScroller } from "@nwl/surfacekit/components/message-scroller"

const meta: Meta<typeof MessageScroller> = {
  title: "SurfaceKit/Message Scroller",
  component: MessageScroller,
  args: {
    children: (
      <div className="h-36 w-full bg-muted/30 p-4">Scroll content preview</div>
    ),
  },
  render: (args: ComponentProps<typeof MessageScroller>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <MessageScroller {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
