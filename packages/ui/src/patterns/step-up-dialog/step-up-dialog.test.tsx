import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { StepUpDialog } from "./step-up-dialog"

describe("StepUpDialog", () => {
  it("invokes verify and cancel callbacks", async () => {
    const user = userEvent.setup()
    const onVerify = vi.fn()
    const onCancel = vi.fn()
    render(
      <StepUpDialog
        headline="Confirm authentication"
        description="A second factor is required."
        onVerify={onVerify}
        onCancel={onCancel}
      />
    )
    await user.click(screen.getByRole("button", { name: "Verify now" }))
    await user.click(screen.getByRole("button", { name: "Later" }))
    expect(onVerify).toHaveBeenCalledOnce()
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it("announces errors and disables verification while pending", () => {
    const { rerender } = render(
      <StepUpDialog
        headline="Confirm authentication"
        description="A second factor is required."
        state="error"
        errorMessage="Verification code expired."
      />
    )
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Verification code expired."
    )
    rerender(
      <StepUpDialog
        headline="Confirm authentication"
        description="A second factor is required."
        state="pending"
      />
    )
    expect(screen.getByRole("button", { name: "Verifying…" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Later" })).toBeDisabled()
  })

  it("renders an initially open labelled modal in a portal and traps focus", async () => {
    const user = userEvent.setup()
    function Example() {
      const inputRef = React.useRef<HTMLInputElement>(null)
      return (
        <StepUpDialog
          headline="Confirm authentication"
          description="A second factor is required."
          initialFocus={inputRef}
        >
          <input ref={inputRef} aria-label="Security code" />
        </StepUpDialog>
      )
    }
    render(<Example />)

    const dialog = await screen.findByRole("dialog", {
      name: "Confirm authentication",
      description: "A second factor is required.",
    })
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(
      document.body.querySelector('[data-slot="dialog-overlay"]')
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.getByRole("textbox", { name: "Security code" })
      ).toHaveFocus()
    )
    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it("supports controlled dismissal and restores focus to the requested target", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    function Example() {
      const [open, setOpen] = React.useState(false)
      const triggerRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <button ref={triggerRef} onClick={() => setOpen(true)}>
            Review transfer
          </button>
          <StepUpDialog
            open={open}
            onOpenChange={(nextOpen) => {
              onOpenChange(nextOpen)
              setOpen(nextOpen)
            }}
            finalFocus={triggerRef}
            headline="Confirm transfer"
            description="Request an additional check."
          />
        </>
      )
    }

    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Review transfer" })
    await user.click(trigger)
    await screen.findByRole("dialog", { name: "Confirm transfer" })
    await user.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("treats verification as a request and leaves controlled completion to the consumer", async () => {
    const user = userEvent.setup()
    const onVerify = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <StepUpDialog
        open
        onOpenChange={onOpenChange}
        headline="Confirm authentication"
        description="A second factor is required."
        onVerify={onVerify}
      />
    )

    await user.click(screen.getByRole("button", { name: "Verify now" }))
    expect(onVerify).toHaveBeenCalledOnce()
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole("dialog")).toBeVisible()
  })

  it("keeps the modal open and suppresses dismissal controls while pending", async () => {
    const user = userEvent.setup()
    render(
      <StepUpDialog
        headline="Confirm authentication"
        description="A second factor is required."
        state="pending"
      />
    )
    await user.keyboard("{Escape}")
    expect(screen.getByRole("dialog")).toBeVisible()
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
    expect(screen.getByRole("button", { name: "Later" })).toBeDisabled()
  })
})
