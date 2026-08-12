import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group"

describe("InputGroup", () => {
  it("composes prefix, input, suffix text, and an action", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <InputGroup aria-label="Website address">
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Domain" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onClick}>Copy</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )

    await user.type(
      screen.getByRole("textbox", { name: "Domain" }),
      "example.com"
    )
    await user.click(screen.getByRole("button", { name: "Copy" }))
    expect(screen.getByRole("textbox", { name: "Domain" })).toHaveValue(
      "example.com"
    )
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("focuses the input from an addon and supports textarea and disabled controls", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput aria-label="Budget" />
      </InputGroup>
    )
    await user.click(screen.getByText("$"))
    expect(screen.getByRole("textbox", { name: "Budget" })).toHaveFocus()

    rerender(
      <InputGroup>
        <InputGroupTextarea aria-label="Comment" />
        <InputGroupInput aria-label="Unavailable" disabled />
      </InputGroup>
    )
    expect(screen.getByRole("textbox", { name: "Comment" }).tagName).toBe(
      "TEXTAREA"
    )
    expect(screen.getByRole("textbox", { name: "Unavailable" })).toBeDisabled()
  })
})
