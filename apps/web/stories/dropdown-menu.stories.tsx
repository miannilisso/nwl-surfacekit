import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nwl/surfacekit/components/dropdown-menu"

const meta: Meta<typeof DropdownMenu> = {
  title: "SurfaceKit/Dropdown Menu",
  component: DropdownMenu,
  args: {
    children: (
      <>
        <DropdownMenuTrigger>
          <button className="rounded-xl border px-3 py-1 text-sm">Open</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof DropdownMenu>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <DropdownMenu {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
