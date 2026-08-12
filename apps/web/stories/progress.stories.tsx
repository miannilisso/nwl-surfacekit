import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@nwl/surfacekit/components/progress"

function ProgressExample({
  value = 62,
  labeled = false,
}: {
  value?: number | null
  labeled?: boolean
}) {
  return (
    <Progress
      value={value}
      aria-label={labeled ? undefined : "Release progress"}
    >
      {labeled && <ProgressLabel>Release progress</ProgressLabel>}
      {labeled && <ProgressValue />}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Progress",
  component: ProgressExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Communicates determinate or indeterminate task completion with native progress semantics and composable labels and values.",
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
} satisfies Meta<typeof ProgressExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Complete: Story = { args: { value: 100 } }
export const Indeterminate: Story = { args: { value: null } }
export const Labeled: Story = {
  args: { labeled: true, value: 64 },
  play: async ({ canvasElement }) => {
    const progress = within(canvasElement).getByRole("progressbar", {
      name: "Release progress",
    })
    await expect(progress).toHaveAttribute("aria-valuenow", "64")
    await expect(progress).toHaveTextContent("64%")
  },
}
