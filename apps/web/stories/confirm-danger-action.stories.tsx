import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@nwl/surfacekit/components/button"
import { ConfirmDangerAction } from "@nwl/surfacekit/patterns/confirm-danger-action"

function DangerHarness({
  disabled = false,
  state = "idle",
  onCancel = fn(),
  onConfirm = fn(),
}: {
  disabled?: boolean
  state?: "idle" | "pending" | "error"
  onCancel?: () => void
  onConfirm?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const close = (callback: () => void) => {
    callback()
    setOpen(false)
    requestAnimationFrame(() => trigger.current?.focus())
  }
  return (
    <div className="w-[34rem] max-w-[calc(100vw-2rem)]">
      <Button ref={trigger} onClick={() => setOpen(true)}>
        Delete project
      </Button>
      {open && (
        <div className="mt-4">
          <ConfirmDangerAction
            title="Delete production project?"
            description="This permanently removes deployments, audit history, and access policies."
            confirmLabel="Delete project"
            disabled={disabled}
            state={state}
            onCancel={() => close(onCancel)}
            onConfirm={() => close(onConfirm)}
          />
        </div>
      )}
    </div>
  )
}
const meta = {
  title: "SurfaceKit/Patterns/Confirm Danger Action",
  component: DangerHarness,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Requires explicit confirmation for irreversible work, with cancel, pending, disabled, and focus-restoration behavior.",
      },
    },
  },
} satisfies Meta<typeof DangerHarness>
export default meta
type Story = StoryObj<typeof meta>
export const DeleteProject: Story = {
  args: { onCancel: fn(), onConfirm: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Delete project" })
    await userEvent.click(trigger)
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }))
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.click(trigger)
    await userEvent.click(
      canvas.getAllByRole("button", { name: "Delete project" })[1]!
    )
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const DisabledConfirm: Story = { args: { disabled: true } }
export const Processing: Story = { args: { state: "pending" } }
