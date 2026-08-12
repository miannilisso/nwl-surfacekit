import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("associates with a label and accepts multiline content", async () => {
    const user = userEvent.setup()
    render(
      <>
        <label htmlFor="release-notes">Release notes</label>
        <Textarea id="release-notes" />
      </>
    )

    const textarea = screen.getByRole("textbox", { name: "Release notes" })
    await user.type(textarea, "First line{enter}Second line")
    expect(textarea).toHaveValue("First line\nSecond line")
  })

  it("forwards invalid, disabled, and read-only states", () => {
    render(
      <>
        <Textarea aria-label="Invalid notes" aria-invalid />
        <Textarea aria-label="Disabled notes" disabled />
        <Textarea aria-label="Read-only notes" readOnly value="Approved" />
      </>
    )

    expect(
      screen.getByRole("textbox", { name: "Invalid notes" })
    ).toHaveAttribute("aria-invalid", "true")
    expect(
      screen.getByRole("textbox", { name: "Disabled notes" })
    ).toBeDisabled()
    expect(
      screen.getByRole("textbox", { name: "Read-only notes" })
    ).toHaveAttribute("readonly")
  })
})
