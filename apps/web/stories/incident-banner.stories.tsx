import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"

const meta = {
  title: "SurfaceKit/Patterns/Incident Banner",
  component: IncidentBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Communicates informational, warning, or critical operational incidents with optional action and dismissal callbacks.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[48rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Incident in progress",
    description: "API response times are elevated in the Nairobi region.",
    onAction: fn(),
  },
} satisfies Meta<typeof IncidentBanner>
export default meta
type Story = StoryObj<typeof meta>
export const Info: Story = {
  args: {
    severity: "info",
    title: "Maintenance scheduled",
    description: "A rolling database upgrade begins at 22:00 UTC.",
  },
}
export const Warning: Story = { args: { severity: "warning" } }
export const Critical: Story = {
  args: {
    severity: "critical",
    title: "Production API unavailable",
    description: "Requests are failing and automated recovery is in progress.",
  },
}
export const Dismissible: Story = {
  args: { onDismiss: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Dismiss incident" })
    )
    await expect(args.onDismiss).toHaveBeenCalledOnce()
  },
}
