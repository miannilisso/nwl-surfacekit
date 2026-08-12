import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@nwl/surfacekit/components/button"
import { Spinner } from "@nwl/surfacekit/components/spinner"

const meta = {
  title: "SurfaceKit/Components/Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Communicates indeterminate progress with a contextual accessible name.",
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner aria-label="Saving changes" />
      Saving…
    </Button>
  ),
}

export const Labeled: Story = {
  render: () => (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-label="Publishing release"
    >
      <Spinner aria-hidden="true" />
      <span>Publishing release</span>
    </div>
  ),
}
