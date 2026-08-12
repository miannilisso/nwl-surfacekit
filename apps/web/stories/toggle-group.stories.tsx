import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { ToggleGroup } from "@nwl/surfacekit/components/toggle-group"

const meta: Meta<typeof ToggleGroup> = {
  title: "SurfaceKit/Toggle Group",
  component: ToggleGroup,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof ToggleGroup>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <ToggleGroup {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
