import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"

const meta = {
  title: "SurfaceKit/Components/Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Groups related content, context, actions, and footers in a flexible surface.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Release readiness</CardTitle>
        <CardDescription>
          All package quality gates in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Review tests, stories, accessibility, and coverage.
      </CardContent>
      <CardFooter>Updated a few seconds ago</CardFooter>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Production release</CardTitle>
        <CardDescription>Version 10.5.7 is ready to review.</CardDescription>
        <CardAction>
          <Button size="sm">Review</Button>
        </CardAction>
      </CardHeader>
      <CardContent>53 of 70 browser stories currently pass.</CardContent>
    </Card>
  ),
}

export const Dense: Story = {
  render: () => (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Reduced spacing for dense interfaces.</CardDescription>
      </CardHeader>
      <CardContent>12 checks passed</CardContent>
    </Card>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Enterprise release governance</CardTitle>
        <CardDescription>
          A durable record of component behavior, accessibility expectations,
          visual states, and deployment evidence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p>
          Each release must preserve public imports, pass browser interactions,
          and meet the agreed coverage thresholds.
        </p>
        <p>
          Exceptions are documented with an owner, rationale, and remediation
          date before approval.
        </p>
      </CardContent>
      <CardFooter className="border-t">Policy SK-001</CardFooter>
    </Card>
  ),
}
