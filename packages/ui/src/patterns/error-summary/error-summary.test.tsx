import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ErrorSummary } from "./error-summary"

describe("ErrorSummary", () => {
  it("renders a list of errors", () => {
    render(
      <ErrorSummary
        title="Validation errors"
        messages={["Email is required", "Password must be 8+ characters"]}
      />
    )

    expect(screen.getByText("Validation errors")).toBeInTheDocument()
    expect(screen.getByText("Email is required")).toBeInTheDocument()
    expect(
      screen.getByText("Password must be 8+ characters")
    ).toBeInTheDocument()
  })
})
