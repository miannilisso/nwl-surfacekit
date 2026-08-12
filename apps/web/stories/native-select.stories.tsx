import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { NativeSelect } from "@nwl/surfacekit/components/native-select"

const meta: Meta<typeof NativeSelect> = {
  title: "SurfaceKit/Native Select",
  component: NativeSelect,
  args: {
    defaultValue: "one",
    children: (
      <>
        <option value="one">One</option>
        <option value="two">Two</option>
      </>
    ),
  },
  render: (args: ComponentProps<typeof NativeSelect>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <NativeSelect {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
