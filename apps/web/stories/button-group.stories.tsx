import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { ButtonGroup } from "@nwl/surfacekit/components/button-group"

const meta: Meta<typeof ButtonGroup> = {
  title: "SurfaceKit/Button Group",
  component: ButtonGroup,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof ButtonGroup>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <ButtonGroup {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
