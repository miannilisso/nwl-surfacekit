import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@nwl/surfacekit/components/menubar"

const meta: Meta<typeof Menubar> = {
  title: "SurfaceKit/Menubar",
  component: Menubar,
  args: {
    children: (
      <>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Menubar>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Menubar {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
