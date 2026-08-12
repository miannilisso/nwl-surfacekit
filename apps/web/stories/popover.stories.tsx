import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
  PopoverTitle,
} from "@nwl/surfacekit/components/popover"

const meta: Meta<typeof Popover> = {
  title: "SurfaceKit/Popover",
  component: Popover,
  args: {
    children: (
      <>
        <PopoverTrigger>
          <button className="rounded-xl border px-3 py-1 text-sm">Show</button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Popover title</PopoverTitle>
          <PopoverDescription>Popover description text.</PopoverDescription>
        </PopoverContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Popover>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Popover {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
