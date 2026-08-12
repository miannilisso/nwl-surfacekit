import type { Meta, StoryObj } from "@storybook/react-vite"

import { AspectRatio } from "@nwl/surfacekit/components/aspect-ratio"

const meta = {
  title: "SurfaceKit/Components/Layout & Utilities/Aspect Ratio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Constrains responsive content to a caller-defined ratio.",
      },
    },
  },
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-lg border bg-muted">
      <AspectRatio {...args}>
        <div className="flex size-full items-center justify-center bg-linear-to-br from-primary/15 via-background to-primary/35 font-medium">
          {args.ratio}:1
        </div>
      </AspectRatio>
    </div>
  ),
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Square: Story = {
  args: { ratio: 1 },
}

export const Portrait: Story = {
  args: { ratio: 3 / 4 },
  render: (args) => (
    <div className="w-48 overflow-hidden rounded-lg border bg-muted">
      <AspectRatio {...args}>
        <div className="flex size-full items-center justify-center bg-linear-to-b from-primary/20 to-primary/5 font-medium">
          Portrait
        </div>
      </AspectRatio>
    </div>
  ),
}
