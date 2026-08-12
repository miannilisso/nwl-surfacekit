import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { RadioGroup, RadioGroupItem } from "@nwl/surfacekit/components/radio-group"

const meta: Meta<typeof RadioGroup> = {
  title: "SurfaceKit/Radio Group",
  component: RadioGroup,
  args: {
    children: (
      <>
        <RadioGroupItem value="one">One</RadioGroupItem>
        <RadioGroupItem value="two">Two</RadioGroupItem>
      </>
    ),
  },
  render: (args: ComponentProps<typeof RadioGroup>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <RadioGroup {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
