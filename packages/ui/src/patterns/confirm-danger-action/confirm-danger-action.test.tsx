import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ConfirmDangerAction } from "./confirm-danger-action"

describe("ConfirmDangerAction", () => {
  it("renders the danger confirmation content", () => {
    render(
      <ConfirmDangerAction
        title="Delete project"
        description="This action cannot be undone."
      />
    )

    expect(screen.getByText("Delete project")).toBeInTheDocument()
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })
})
