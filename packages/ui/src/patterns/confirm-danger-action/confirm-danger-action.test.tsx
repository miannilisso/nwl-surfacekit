import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ConfirmDangerAction } from "./confirm-danger-action"

describe("ConfirmDangerAction", () => {
  it("invokes cancel and destructive confirmation callbacks", async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(
      <ConfirmDangerAction
        title="Delete project"
        description="This action cannot be undone."
        confirmLabel="Delete project"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    )
    expect(screen.getByText("This action cannot be undone.")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    await user.click(screen.getByRole("button", { name: "Delete project" }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it("prevents duplicate confirmation while disabled or pending", () => {
    const { rerender } = render(
      <ConfirmDangerAction
        title="Delete project"
        description="Permanent."
        disabled
      />
    )
    expect(screen.getByRole("button", { name: "Confirm" })).toBeDisabled()
    rerender(
      <ConfirmDangerAction
        title="Delete project"
        description="Permanent."
        state="pending"
      />
    )
    expect(screen.getByRole("button", { name: "Processing…" })).toBeDisabled()
    expect(
      screen
        .getByText("Delete project")
        .closest('[data-slot="confirm-danger-action"]')
    ).toHaveAttribute("data-state", "pending")
  })
})
