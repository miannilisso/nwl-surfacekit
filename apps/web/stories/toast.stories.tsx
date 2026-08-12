import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import { Toaster, createToastManager } from "@nwl/surfacekit/components/toast"

type Kind = "success" | "error" | "action" | "multiple"
function ToastExample({ kind = "success" }: { kind?: Kind }) {
  const [manager] = React.useState(() => createToastManager())
  const show = () => {
    if (kind === "multiple") {
      manager.add({
        title: "Workspace saved",
        description: "Configuration is live.",
        type: "success",
        timeout: 0,
      })
      manager.add({
        title: "Invite sent",
        description: "Amina will receive an email.",
        type: "info",
        timeout: 0,
      })
      manager.add({ title: "Audit export ready", type: "success", timeout: 0 })
      return
    }
    manager.add({
      title: kind === "error" ? "Deployment failed" : "Changes saved",
      description:
        kind === "error"
          ? "Review the build logs and retry."
          : "Your workspace configuration is live.",
      type: kind === "error" ? "error" : "success",
      timeout: 0,
      actionProps: kind === "action" ? { children: "Undo" } : undefined,
    })
  }
  return (
    <>
      <Button onClick={show}>
        {kind === "multiple" ? "Show notifications" : "Show notification"}
      </Button>
      <Toaster toastManager={manager} limit={3} />
    </>
  )
}
const meta = {
  title: "SurfaceKit/Components/Command & Menus/Toast",
  component: ToastExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Queues accessible transient notifications through a typed manager with update, action, dismissal, severity, and limit support.",
      },
    },
  },
} satisfies Meta<typeof ToastExample>
export default meta
type Story = StoryObj<typeof meta>
export const Success: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Show notification" })
    )
    const body = within(canvasElement.ownerDocument.body)
    await expect(
      body.getByRole("dialog", { name: "Changes saved" })
    ).toBeVisible()
    await userEvent.click(body.getByLabelText("Close toast"))
    await waitFor(() =>
      expect(body.queryByText("Changes saved")).not.toBeInTheDocument()
    )
  },
}
export const Error: Story = { args: { kind: "error" } }
export const WithAction: Story = { args: { kind: "action" } }
export const Multiple: Story = { args: { kind: "multiple" } }
