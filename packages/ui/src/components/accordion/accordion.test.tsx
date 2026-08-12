import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

function Example({ multiple = false }: { multiple?: boolean }) {
  return (
    <Accordion
      multiple={multiple}
      defaultValue={multiple ? ["billing"] : undefined}
    >
      <AccordionItem value="profile">
        <AccordionTrigger>Profile</AccordionTrigger>
        <AccordionContent>Manage your profile.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionContent>Manage your billing.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled" disabled>
        <AccordionTrigger>Archived</AccordionTrigger>
        <AccordionContent>Archived settings.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe("Accordion", () => {
  it("toggles a single panel and exposes expanded state", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Profile" })

    expect(trigger).toHaveAttribute("aria-expanded", "false")
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Manage your profile.")).toBeVisible()
  })

  it("supports multiple panels, keyboard focus, and disabled items", async () => {
    const user = userEvent.setup()
    render(<Example multiple />)
    const profile = screen.getByRole("button", { name: "Profile" })
    profile.focus()
    await user.keyboard("{Enter}")
    expect(profile).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("button", { name: "Billing" })).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    expect(screen.getByRole("button", { name: "Archived" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })
})
