import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Field } from "@nwl/surfacekit/components/field"

const meta: Meta<typeof Field> = {
  title: "SurfaceKit/Field",
  component: Field,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Field>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Field {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
