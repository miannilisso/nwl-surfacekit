import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { Checkbox } from "./checkbox"

function ControlledCheckbox() {
  const [checked, setChecked] = React.useState(false)
  return (
    <Checkbox
      aria-label="Accept terms"
      checked={checked}
      onCheckedChange={setChecked}
    />
  )
}

describe("Checkbox", () => {
  it("toggles an accessible uncontrolled checkbox", async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="Enable notifications" />)

    const checkbox = screen.getByRole("checkbox", {
      name: "Enable notifications",
    })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it("supports controlled state", async () => {
    const user = userEvent.setup()
    render(<ControlledCheckbox />)

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it("exposes mixed and disabled states", () => {
    render(
      <>
        <Checkbox aria-label="Select page" indeterminate />
        <Checkbox aria-label="Unavailable option" disabled />
      </>
    )

    expect(
      screen.getByRole("checkbox", { name: "Select page" })
    ).toHaveAttribute("aria-checked", "mixed")
    expect(
      screen.getByRole("checkbox", { name: "Unavailable option" })
    ).toHaveAttribute("aria-disabled", "true")
  })
})
