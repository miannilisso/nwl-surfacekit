import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Input } from "@nwl/surfacekit/components/input"

const meta: Meta<typeof Input> = {
  title: "SurfaceKit/Input",
  component: Input,
  args: { placeholder: "Type here" },
  render: (args: ComponentProps<typeof Input>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Input {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
