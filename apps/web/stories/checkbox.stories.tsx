import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Checkbox } from "@nwl/surfacekit/components/checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "SurfaceKit/Checkbox",
  component: Checkbox,
  args: { defaultChecked: true },
  render: (args: ComponentProps<typeof Checkbox>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Checkbox {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
