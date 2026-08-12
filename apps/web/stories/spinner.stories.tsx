import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Spinner } from "@nwl/surfacekit/components/spinner"

const meta: Meta<typeof Spinner> = {
  title: "SurfaceKit/Spinner",
  component: Spinner,
  args: { className: "text-primary" },
  render: (args: ComponentProps<typeof Spinner>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Spinner {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
