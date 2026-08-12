import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@nwl/surfacekit/components/drawer"

const meta: Meta<typeof Drawer> = {
  title: "SurfaceKit/Drawer",
  component: Drawer,
  args: {
    defaultOpen: true,
    children: (
      <>
        <DrawerTrigger>Open drawer</DrawerTrigger>
        <DrawerContent>Drawer content preview.</DrawerContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Drawer>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Drawer {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
