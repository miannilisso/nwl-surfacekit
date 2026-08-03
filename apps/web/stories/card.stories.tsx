import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"

const meta = {
  title: "SurfaceKit/Card",
  component: Card,
  args: {
    children: "SurfaceKit Card",
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>A short description for the card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card body content.</p>
      </CardContent>
      <CardFooter>Footer content</CardFooter>
    </Card>
  ),
}
