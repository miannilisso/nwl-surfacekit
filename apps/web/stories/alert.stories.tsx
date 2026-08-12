import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@nwl/surfacekit/components/alert"
import { Button } from "@nwl/surfacekit/components/button"

function AlertExample({
  kind = "info",
  action = false,
}: {
  kind?: "info" | "success" | "warning" | "destructive"
  action?: boolean
}) {
  const content = {
    info: ["ⓘ", "Policy update", "The access policy changes on September 1."],
    success: [
      "✓",
      "Deployment complete",
      "Production is serving version 4.8.0.",
    ],
    warning: [
      "!",
      "Certificate expires soon",
      "Rotate the signing certificate within 14 days.",
    ],
    destructive: [
      "×",
      "Deployment failed",
      "The release was rolled back automatically.",
    ],
  }[kind]
  return (
    <Alert variant={kind === "destructive" ? "destructive" : "default"}>
      <span aria-hidden="true">{content[0]}</span>
      <AlertTitle>{content[1]}</AlertTitle>
      <AlertDescription>{content[2]}</AlertDescription>
      {action && (
        <AlertAction>
          <Button size="xs" variant="outline">
            Review
          </Button>
        </AlertAction>
      )}
    </Alert>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Alert",
  component: AlertExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Announces important contextual status with a title, supporting detail, severity, and optional recovery action.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AlertExample>
export default meta
type Story = StoryObj<typeof meta>
export const Info: Story = {}
export const Success: Story = { args: { kind: "success" } }
export const Warning: Story = { args: { kind: "warning" } }
export const Destructive: Story = { args: { kind: "destructive" } }
export const WithAction: Story = {
  args: { action: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Review" }))
    await expect(canvas.getByRole("button", { name: "Review" })).toHaveFocus()
  },
}
