import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nwl/surfacekit/components/select"

const meta: Meta<typeof Select> = {
  title: "SurfaceKit/Select",
  component: Select,
  args: {
    children: (
      <>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Select>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Select {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
