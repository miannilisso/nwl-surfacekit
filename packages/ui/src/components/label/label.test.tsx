import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Label } from "./label"

describe("Label", () => {
  it("provides an accessible name for its associated control", () => {
    render(
      <div>
        <Label htmlFor="workspace-name">Workspace name</Label>
        <input id="workspace-name" />
      </div>
    )

    expect(
      screen.getByRole("textbox", { name: "Workspace name" })
    ).toHaveAttribute("id", "workspace-name")
  })

  it("retains peer-disabled styling and custom classes", () => {
    render(
      <div>
        <input id="locked" disabled className="peer" />
        <Label htmlFor="locked" className="locked-label">
          Locked field
        </Label>
      </div>
    )

    expect(screen.getByText("Locked field")).toHaveClass(
      "peer-disabled:opacity-50",
      "locked-label"
    )
  })
})
