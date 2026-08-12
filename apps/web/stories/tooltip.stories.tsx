import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@nwl/surfacekit/components/tooltip"

const meta: Meta<typeof Tooltip> = {
  title: "SurfaceKit/Tooltip",
  component: Tooltip,
  args: {
    children: (
      <>
        <TooltipTrigger>
          <button className="rounded-xl border px-3 py-1 text-sm">
            Hover me
          </button>
        </TooltipTrigger>
        <TooltipContent>Tooltip preview</TooltipContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Tooltip>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Tooltip {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
