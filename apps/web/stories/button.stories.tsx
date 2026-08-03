import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@nwl/surfacekit/components/button"

const meta = {
  title: "SurfaceKit/Button",
  component: Button,
  args: {
    children: "SurfaceKit Button",
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outline: Story = {
  args: {
    variant: "outline",
  },
}

export const Destructive: Story = {
  args: {
    children: "Delete record",
    variant: "destructive",
  },
}
