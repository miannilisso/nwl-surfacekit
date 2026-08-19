import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

function Example({
  side = "right" as const,
}: {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <Sheet>
      <SheetTrigger>Open panel</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>Manage workspace policy.</SheetDescription>
        </SheetHeader>
        <SheetFooter>Footer actions</SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

describe("Sheet", () => {
  it("opens a named side variant and closes from its control", async () => {
    const user = userEvent.setup()
    const { container } = render(<Example side="left" />)
    await user.click(screen.getByRole("button", { name: "Open panel" }))
    expect(
      await screen.findByRole("dialog", {
        name: "Workspace settings",
        description: "Manage workspace policy.",
      })
    ).toHaveAttribute("data-side", "left")
    expect(
      container.ownerDocument.querySelector('[data-slot="sheet-footer"]')
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Close" }))
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
  })
  it("restores focus after Escape dismissal", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Open panel" })
    await user.click(trigger)
    await screen.findByRole("dialog")
    await user.keyboard("{Escape}")
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
