import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import { StepUpDialog } from "@nwl/surfacekit/patterns/step-up-dialog"

function StepUpHarness({
  state = "idle",
  errorMessage,
  onCancel = fn(),
  onVerify = fn(),
}: {
  state?: "idle" | "pending" | "error"
  errorMessage?: string
  onCancel?: () => void
  onVerify?: () => void
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
        Edit security policy
      </Button>
      {open && (
        <div className="mt-4">
          <StepUpDialog
            headline="Action authorization required"
            description="Verify your identity before editing sensitive settings."
            secondaryLabel="Cancel"
            state={state}
            errorMessage={errorMessage}
            onCancel={() => close(onCancel)}
            onVerify={() => close(onVerify)}
          />
        </div>
      )}
    </div>
  )
}
const meta = {
  title: "SurfaceKit/Patterns/Step Up Dialog",
  component: StepUpHarness,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Requests additional identity verification before sensitive work, with cancel, verify, pending, error, and focus-restoration states.",
      },
    },
  },
} satisfies Meta<typeof StepUpHarness>
export default meta
type Story = StoryObj<typeof meta>
export const Verification: Story = {
  args: { onCancel: fn(), onVerify: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole("button", { name: "Edit security policy" })
    await userEvent.click(trigger)
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }))
    await expect(args.onCancel).toHaveBeenCalledOnce()
    await waitFor(() => expect(trigger).toHaveFocus())
    await userEvent.click(trigger)
    await userEvent.click(canvas.getByRole("button", { name: "Verify now" }))
    await expect(args.onVerify).toHaveBeenCalledOnce()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
export const Error: Story = {
  args: {
    state: "error",
    errorMessage: "Verification code expired. Request a new code.",
  },
}
export const Processing: Story = { args: { state: "pending" } }
