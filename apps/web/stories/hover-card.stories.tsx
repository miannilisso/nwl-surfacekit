import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentType } from "react"
import * as ComponentModule from "@nwl/surfacekit/components/hover-card"

const Component = (Object.values(ComponentModule)[0] ?? (() => null)) as ComponentType<Record<string, unknown>>

const meta: Meta<typeof Component> = {
  title: "SurfaceKit/Hover Card",
  component: Component,
  args: {},
  render: (args: Record<string, unknown>) => (
    <Suspense fallback={null}>
      <Component {...args} />
    </Suspense>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
