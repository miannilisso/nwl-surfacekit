import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"

function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger delay={0} closeDelay={0} render={<a href="#owner" />}>
        Platform owner
      </HoverCardTrigger>
      <HoverCardContent>Owns production access reviews.</HoverCardContent>
    </HoverCard>
  )
}

describe("HoverCard", () => {
  it("shows preview content on pointer hover and dismisses it", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("link", { name: "Platform owner" })
    await user.hover(trigger)
    expect(
      await screen.findByText("Owns production access reviews.")
    ).toBeVisible()
    await user.hover(document.body)
    await waitFor(() =>
      expect(
        screen.queryByText("Owns production access reviews.")
      ).not.toBeInTheDocument()
    )
  })
  it("shows preview content from keyboard focus", async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    expect(
      await screen.findByText("Owns production access reviews.")
    ).toBeVisible()
    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(
        screen.queryByText("Owns production access reviews.")
      ).not.toBeInTheDocument()
    )
  })
})
