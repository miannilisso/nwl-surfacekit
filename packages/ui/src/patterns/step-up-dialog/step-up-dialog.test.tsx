import { render, screen } from "@testing-library/react"
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
})
