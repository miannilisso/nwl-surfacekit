import type { Meta, StoryObj } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { Switch } from "@nwl/surfacekit/components/switch"

const meta: Meta<typeof Switch> = {
  title: "SurfaceKit/Switch",
  component: Switch,
  args: { defaultChecked: true },
  render: (args: ComponentProps<typeof Switch>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Switch {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
