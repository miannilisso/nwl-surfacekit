import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Input } from "./input"

describe("Input", () => {
  it("associates with a label and accepts text entry", async () => {
    const user = userEvent.setup()
    render(
      <>
        <label htmlFor="project-name">Project name</label>
        <Input id="project-name" />
      </>
    )

    const input = screen.getByRole("textbox", { name: "Project name" })
    await user.type(input, "SurfaceKit")
    expect(input).toHaveValue("SurfaceKit")
  })

  it("forwards input type and validation state", () => {
    render(<Input aria-label="Work email" type="email" aria-invalid />)

    const input = screen.getByRole("textbox", { name: "Work email" })
    expect(input).toHaveAttribute("type", "email")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("preserves disabled and read-only behavior", async () => {
    const user = userEvent.setup()
    render(
      <>
        <Input aria-label="Disabled field" disabled />
        <Input aria-label="Immutable field" readOnly value="Locked" />
      </>
    )

    expect(
      screen.getByRole("textbox", { name: "Disabled field" })
    ).toBeDisabled()
    const immutable = screen.getByRole("textbox", { name: "Immutable field" })
    await user.type(immutable, " changed")
    expect(immutable).toHaveValue("Locked")
  })
})
