import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Label } from "@nwl/surfacekit/components/label"

const meta: Meta<typeof Label> = {
  title: "SurfaceKit/Label",
  component: Label,
  args: { children: "Label" },
  render: (args: ComponentProps<typeof Label>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Label {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
