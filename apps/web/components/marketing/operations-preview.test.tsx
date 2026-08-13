import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"

import { OperationsPreview } from "./operations-preview"

describe("OperationsPreview", () => {
  it("connects search and toolbar actions to visible feedback", async () => {
    const user = userEvent.setup()
    render(<OperationsPreview />)

    await user.type(
      screen.getByRole("textbox", { name: "Search projects" }),
      "atlas"
    )
    expect(screen.getByText(/Showing results for atlas/)).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Export" }))
    expect(screen.getByRole("status")).toHaveTextContent("Export prepared")
  })
})
