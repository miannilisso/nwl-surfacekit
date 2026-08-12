import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { InputGroup } from "@nwl/surfacekit/components/input-group"

const meta: Meta<typeof InputGroup> = {
  title: "SurfaceKit/Input Group",
  component: InputGroup,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof InputGroup>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <InputGroup {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
