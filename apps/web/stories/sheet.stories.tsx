import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@nwl/surfacekit/components/sheet"

const meta: Meta<typeof Sheet> = {
  title: "SurfaceKit/Sheet",
  component: Sheet,
  args: {
    defaultOpen: true,
    children: (
      <>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent>Sheet content preview.</SheetContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Sheet>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Sheet {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
