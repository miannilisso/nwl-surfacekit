import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"

import { RadioGroup, RadioGroupItem } from "./radio-group"

function Plans(props: React.ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      <RadioGroupItem value="starter" aria-label="Starter" />
      <RadioGroupItem value="growth" aria-label="Growth" />
      <RadioGroupItem value="enterprise" aria-label="Enterprise" disabled />
    </RadioGroup>
  )
}

function ControlledPlans() {
  const [value, setValue] = React.useState("starter")
  return <Plans value={value} onValueChange={setValue} />
}

describe("RadioGroup", () => {
  it("uses arrow keys to select within a labeled group", async () => {
    const user = userEvent.setup()
    render(<Plans defaultValue="starter" />)

    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument()
    const starter = screen.getByRole("radio", { name: "Starter" })
    starter.focus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("radio", { name: "Growth" })).toBeChecked()
  })

  it("supports controlled selection and disabled items", async () => {
    const user = userEvent.setup()
    render(<ControlledPlans />)

    await user.click(screen.getByRole("radio", { name: "Growth" }))
    expect(screen.getByRole("radio", { name: "Growth" })).toBeChecked()
    expect(screen.getByRole("radio", { name: "Enterprise" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })
})
