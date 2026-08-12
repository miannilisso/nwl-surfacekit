import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert"

describe("Alert", () => {
  it("announces its title and description and supports an action", () => {
    const onDismiss = vi.fn()
    render(
      <Alert>
        <AlertTitle>Deployment complete</AlertTitle>
        <AlertDescription>
          Production is serving the new release.
        </AlertDescription>
        <AlertAction>
          <button type="button" onClick={onDismiss}>
            Dismiss
          </button>
        </AlertAction>
      </Alert>
    )

    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Deployment complete")
    expect(alert).toHaveTextContent("Production is serving the new release.")
    expect(alert).toHaveClass("bg-card")
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("applies the destructive visual contract", () => {
    render(<Alert variant="destructive">Payment failed</Alert>)
    expect(screen.getByRole("alert")).toHaveClass("text-destructive")
  })
})
