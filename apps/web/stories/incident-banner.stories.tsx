import type { Meta, StoryObj } from "@storybook/react-vite"

import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"

const meta = {
  title: "SurfaceKit/Patterns/IncidentBanner",
  component: IncidentBanner,
} satisfies Meta<typeof IncidentBanner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Incident in progress",
    description:
      "Our API is currently experiencing degraded performance. We are working on a fix.",
    actionLabel: "Status page",
  },
}
