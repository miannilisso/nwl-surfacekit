import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"

function Controlled() {
  const [open, setOpen] = React.useState(false)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsibleContent>Audit details</CollapsibleContent>
    </Collapsible>
  )
}

describe("Collapsible", () => {
  it("toggles content in controlled mode", async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    const trigger = screen.getByRole("button", { name: "Details" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Audit details")).toBeVisible()
  })

  it("does not open when disabled", async () => {
    const user = userEvent.setup()
    render(
      <Collapsible disabled>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Audit details</CollapsibleContent>
      </Collapsible>
    )
    const trigger = screen.getByRole("button", { name: "Details" })
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-disabled", "true")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})
