import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ErrorSummary } from "./error-summary"

describe("ErrorSummary", () => {
  it("announces legacy and linked validation errors", () => {
    render(
      <ErrorSummary
        title="Validation errors"
        messages={["Email is required"]}
        errors={[
          {
            id: "password",
            message: "Password must be 12+ characters",
            href: "#password",
          },
        ]}
      />
    )
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Email is required")
    expect(
      screen.getByRole("link", { name: "Password must be 12+ characters" })
    ).toHaveAttribute("href", "#password")
    expect(alert.querySelectorAll("li")).toHaveLength(2)
  })

  it("renders nothing when there are no errors", () => {
    const { container } = render(
      <ErrorSummary title="Validation errors" messages={[]} />
    )
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
