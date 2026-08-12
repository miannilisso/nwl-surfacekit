import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Textarea } from "@nwl/surfacekit/components/textarea"

const meta: Meta<typeof Textarea> = {
  title: "SurfaceKit/Textarea",
  component: Textarea,
  args: { placeholder: "Write here" },
  render: (args: ComponentProps<typeof Textarea>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Textarea {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
