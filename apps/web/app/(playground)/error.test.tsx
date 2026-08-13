import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { vi } from "vitest"

import ErrorPage from "./error"

describe("playground route error", () => {
  it("reports a stable reference and retries the route", async () => {
    const user = userEvent.setup()
    const reset = vi.fn()
    const error = Object.assign(new Error("route failed"), {
      digest: "route-01",
    })

    render(<ErrorPage error={error} reset={reset} />)

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Playground unavailable"
    )
    expect(screen.getByRole("alert")).toHaveTextContent("route-01")
    await user.click(screen.getByRole("button", { name: "Try again" }))
    expect(reset).toHaveBeenCalledOnce()
  })
})
