import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover"

function Example({ controlled = false }: { controlled?: boolean }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover
      open={controlled ? open : undefined}
      onOpenChange={controlled ? setOpen : undefined}
    >
      <PopoverTrigger>Open filters</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Filters</PopoverTitle>
          <PopoverDescription>Refine the audit log.</PopoverDescription>
        </PopoverHeader>
        <button>Apply</button>
      </PopoverContent>
    </Popover>
  )
}

describe("Popover", () => {
  it("opens labeled content and restores focus after Escape", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Open filters" })
    await user.click(trigger)
    expect(
      await screen.findByRole("dialog", {
        name: "Filters",
        description: "Refine the audit log.",
      })
    ).toBeVisible()
    await user.keyboard("{Escape}")
    expect(trigger).toHaveFocus()
  })
  it("supports controlled state and outside dismissal", async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example controlled />
        <button>Outside</button>
      </>
    )
    await user.click(screen.getByRole("button", { name: "Open filters" }))
    expect(await screen.findByText("Refine the audit log.")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Outside" }))
    expect(screen.queryByText("Refine the audit log.")).not.toBeInTheDocument()
  })
})
