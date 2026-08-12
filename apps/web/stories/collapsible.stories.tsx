import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@nwl/surfacekit/components/collapsible"

const meta: Meta<typeof Collapsible> = {
  title: "SurfaceKit/Collapsible",
  component: Collapsible,
  args: {
    children: (
      <>
        <CollapsibleTrigger>Toggle content</CollapsibleTrigger>
        <CollapsibleContent>Collapsible content preview.</CollapsibleContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Collapsible>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Collapsible {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
