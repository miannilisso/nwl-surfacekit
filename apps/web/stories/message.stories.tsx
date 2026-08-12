import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Message } from "@nwl/surfacekit/components/message"

const meta: Meta<typeof Message> = {
  title: "SurfaceKit/Message",
  component: Message,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Message>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Message {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
