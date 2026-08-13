import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { IncidentBanner } from "./incident-banner"

describe("IncidentBanner", () => {
  it("uses status semantics for information and invokes actions", async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onDismiss = vi.fn()
    render(
      <IncidentBanner
        title="Maintenance scheduled"
        description="No interruption expected."
        severity="info"
        onAction={onAction}
        onDismiss={onDismiss}
      />
    )
    expect(screen.getByRole("status")).toHaveAttribute("data-severity", "info")
    await user.click(screen.getByRole("button", { name: "View status" }))
    await user.click(screen.getByRole("button", { name: "Dismiss incident" }))
    expect(onAction).toHaveBeenCalledOnce()
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it.each(["warning", "critical"] as const)(
    "announces %s incidents assertively",
    (severity) => {
      render(
        <IncidentBanner
          title="Service degraded"
          description="Response times are elevated."
          severity={severity}
        />
      )
      expect(screen.getByRole("alert")).toHaveAttribute(
        "data-severity",
        severity
      )
    }
  )
})
