import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Calendar } from "@nwl/surfacekit/components/calendar"

const meta: Meta<typeof Calendar> = {
  title: "SurfaceKit/Calendar",
  component: Calendar,
  args: { buttonVariant: "ghost" },
  render: (args: ComponentProps<typeof Calendar>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Calendar {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
