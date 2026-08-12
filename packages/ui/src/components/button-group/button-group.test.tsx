import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group"

describe("ButtonGroup", () => {
  it("groups related controls in the requested orientation", () => {
    render(
      <ButtonGroup aria-label="Document actions" orientation="vertical">
        <Button>Preview</Button>
        <Button>Publish</Button>
      </ButtonGroup>
    )

    const group = screen.getByRole("group", { name: "Document actions" })
    expect(group).toHaveAttribute("data-orientation", "vertical")
    expect(group).toHaveClass("flex-col")
    expect(screen.getAllByRole("button")).toHaveLength(2)
  })

  it("composes contextual text and a decorative separator", () => {
    const { container } = render(
      <ButtonGroup aria-label="Zoom controls">
        <ButtonGroupText>100%</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button>Reset</Button>
      </ButtonGroup>
    )

    expect(screen.getByText("100%")).toHaveAttribute(
      "data-slot",
      "button-group-text"
    )
    expect(
      container.querySelector('[data-slot="button-group-separator"]')
    ).toHaveAttribute("data-orientation", "vertical")
  })
})
