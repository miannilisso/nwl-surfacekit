import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@nwl/surfacekit/components/command"

const meta: Meta<typeof Command> = {
  title: "SurfaceKit/Command",
  component: Command,
  args: {
    children: (
      <>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandItem value="one">First item</CommandItem>
          <CommandItem value="two">Second item</CommandItem>
        </CommandList>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Command>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Command {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
