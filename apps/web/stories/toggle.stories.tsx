import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Toggle } from "@nwl/surfacekit/components/toggle"

const meta: Meta<typeof Toggle> = {
  title: "SurfaceKit/Toggle",
  component: Toggle,
  args: { children: "Toggle" },
  render: (args: ComponentProps<typeof Toggle>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Toggle {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
