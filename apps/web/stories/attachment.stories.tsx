import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Attachment } from "@nwl/surfacekit/components/attachment"

const meta: Meta<typeof Attachment> = {
  title: "SurfaceKit/Attachment",
  component: Attachment,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Attachment>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Attachment {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
