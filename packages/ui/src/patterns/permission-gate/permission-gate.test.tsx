import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PermissionGate } from "./permission-gate"

describe("PermissionGate", () => {
  it("renders the gate message and action", () => {
    render(
      <PermissionGate
        title="Restricted workspace"
        description="Request elevated permissions to continue."
      />
    )

    expect(screen.getByText("Restricted workspace")).toBeInTheDocument()
    expect(
      screen.getByText("Request elevated permissions to continue.")
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Request access" })
    ).toBeInTheDocument()
  })
})
