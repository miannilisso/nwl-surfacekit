import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Alert } from "@nwl/surfacekit/components/alert"

const meta: Meta<typeof Alert> = {
  title: "SurfaceKit/Alert",
  component: Alert,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Alert>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Alert {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
