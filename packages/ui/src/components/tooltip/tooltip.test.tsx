import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"

function Example() {
  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger render={<button />}>Deploy</TooltipTrigger>
        <TooltipContent>Deploy to production</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe("Tooltip", () => {
  it("provides an accessible description on hover", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Deploy" })
    await user.hover(trigger)
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Deploy to production"
    )
    expect(trigger).toHaveAccessibleDescription("Deploy to production")
  })
  it("opens from keyboard focus and dismisses with Escape", async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    expect(await screen.findByRole("tooltip")).toBeVisible()
    await user.keyboard("{Escape}")
    await waitFor(() =>
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    )
  })
})
