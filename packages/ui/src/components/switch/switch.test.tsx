import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { Switch } from "./switch"

function ControlledSwitch() {
  const [checked, setChecked] = React.useState(false)
  return (
    <Switch
      aria-label="Enable alerts"
      checked={checked}
      onCheckedChange={setChecked}
    />
  )
}

describe("Switch", () => {
  it("toggles controlled state with an accessible name", async () => {
    const user = userEvent.setup()
    render(<ControlledSwitch />)

    const control = screen.getByRole("switch", { name: "Enable alerts" })
    expect(control).not.toBeChecked()
    await user.click(control)
    expect(control).toBeChecked()
  })

  it("preserves checked and disabled states", () => {
    render(<Switch aria-label="Automatic updates" defaultChecked disabled />)

    const control = screen.getByRole("switch", { name: "Automatic updates" })
    expect(control).toBeChecked()
    expect(control).toHaveAttribute("aria-disabled", "true")
  })
})
