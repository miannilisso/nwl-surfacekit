import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { StepUpDialog } from "./step-up-dialog"

describe("StepUpDialog", () => {
  it("renders the dialog with primary and secondary actions", () => {
    render(
      <StepUpDialog
        headline="Confirm auth"
        description="A second factor is required."
      />
    )

    expect(screen.getByText("Confirm auth")).toBeInTheDocument()
    expect(screen.getByText("A second factor is required.")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Verify now" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Later" })).toBeInTheDocument()
  })
})
