import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Avatar } from "@nwl/surfacekit/components/avatar"

const meta: Meta<typeof Avatar> = {
  title: "SurfaceKit/Avatar",
  component: Avatar,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Avatar>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Avatar {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
