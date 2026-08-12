import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { NavigationMenu } from "@nwl/surfacekit/components/navigation-menu"

const meta: Meta<typeof NavigationMenu> = {
  title: "SurfaceKit/Navigation Menu",
  component: NavigationMenu,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof NavigationMenu>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <NavigationMenu {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
