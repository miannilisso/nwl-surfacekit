import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"

function Example() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger>Open filters</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Refine the audit log.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>Done</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

describe("Drawer", () => {
  it("opens a named drawer with a swipe handle and composed regions", async () => {
    const user = userEvent.setup()
    const { container } = render(<Example />)
    await user.click(screen.getByRole("button", { name: "Open filters" }))
    expect(
      await screen.findByRole("dialog", {
        name: "Filters",
        description: "Refine the audit log.",
      })
    ).toBeVisible()
    expect(
      container.ownerDocument.querySelector('[data-slot="drawer-swipe-handle"]')
    ).toHaveAttribute("aria-hidden", "true")
    expect(
      container.ownerDocument.querySelector('[data-slot="drawer-footer"]')
    ).toBeInTheDocument()
  })
  it("closes and restores focus", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Open filters" })
    await user.click(trigger)
    await user.click(await screen.findByRole("button", { name: "Done" }))
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it("supports a non-modal horizontal drawer without a swipe handle", () => {
    const { container } = render(
      <Drawer open modal={false} swipeDirection="left">
        <DrawerContent>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Workspace navigation</DrawerDescription>
        </DrawerContent>
      </Drawer>
    )

    expect(screen.getByRole("dialog", { name: "Navigation" })).toBeVisible()
    expect(
      container.ownerDocument.querySelector('[data-slot="drawer-popup"]')
    ).toHaveAttribute("data-swipe-axis", "x")
    expect(
      container.ownerDocument.querySelector('[data-slot="drawer-overlay"]')
    ).not.toBeInTheDocument()
    expect(
      container.ownerDocument.querySelector('[data-slot="drawer-swipe-handle"]')
    ).not.toBeInTheDocument()
  })
})
