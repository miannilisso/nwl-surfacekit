import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Progress } from "@nwl/surfacekit/components/progress"

const meta: Meta<typeof Progress> = {
  title: "SurfaceKit/Progress",
  component: Progress,
  args: { value: 62 },
  render: (args: ComponentProps<typeof Progress>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Progress {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
