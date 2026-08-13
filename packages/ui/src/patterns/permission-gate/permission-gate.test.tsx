import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { PermissionGate } from "./permission-gate"

describe("PermissionGate", () => {
  it("renders protected content only when permission is granted", () => {
    const props = {
      title: "Billing access required",
      description: "Ask an owner to grant billing permissions.",
      fallback: <p>Custom access guidance</p>,
    }
    const { rerender } = render(
      <PermissionGate {...props}>
        <p>Billing controls</p>
      </PermissionGate>
    )
    expect(screen.getByText("Custom access guidance")).toBeVisible()
    expect(screen.queryByText("Billing controls")).not.toBeInTheDocument()
    rerender(
      <PermissionGate {...props} allowed>
        <p>Billing controls</p>
      </PermissionGate>
    )
    expect(screen.getByText("Billing controls")).toBeVisible()
    expect(screen.queryByText("Custom access guidance")).not.toBeInTheDocument()
  })

  it("requests access and exposes a loading state", async () => {
    const user = userEvent.setup()
    const onRequestAccess = vi.fn()
    const { rerender } = render(
      <PermissionGate
        title="Restricted"
        description="Request access."
        onRequestAccess={onRequestAccess}
      />
    )
    await user.click(screen.getByRole("button", { name: "Request access" }))
    expect(onRequestAccess).toHaveBeenCalledOnce()
    rerender(
      <PermissionGate
        title="Restricted"
        description="Request access."
        loading
      />
    )
    expect(
      screen.getByRole("status", { name: "Checking permissions" })
    ).toBeVisible()
  })
})
