import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { DemoErrorBoundary } from "./demo-error-boundary"

describe("DemoErrorBoundary", () => {
  it("isolates a failed example and retries it", async () => {
    const user = userEvent.setup()
    let shouldThrow = true
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    function Example() {
      if (shouldThrow) throw new Error("demo failed")
      return <p>Recovered example</p>
    }

    render(
      <DemoErrorBoundary>
        <Example />
      </DemoErrorBoundary>,
      { onCaughtError: () => undefined }
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Example unavailable")
    shouldThrow = false
    await user.click(screen.getByRole("button", { name: "Retry example" }))
    expect(screen.getByText("Recovered example")).toBeVisible()
    expect(consoleError).toHaveBeenCalledOnce()
    consoleError.mockRestore()
  })
})
