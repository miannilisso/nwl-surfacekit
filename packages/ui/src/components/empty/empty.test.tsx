import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty"

describe("Empty", () => {
  it("provides heading and paragraph semantics with an actionable recovery", () => {
    const onCreate = vi.fn()
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">+</EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            Create a project to start shipping.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button type="button" onClick={onCreate}>
            Create project
          </button>
        </EmptyContent>
      </Empty>
    )
    expect(
      screen.getByRole("heading", { name: "No projects yet" })
    ).toBeVisible()
    expect(
      container.querySelector('[data-slot="empty-description"]')?.tagName
    ).toBe("P")
    expect(container.querySelector('[data-slot="empty-icon"]')).toHaveAttribute(
      "data-variant",
      "icon"
    )
    fireEvent.click(screen.getByRole("button", { name: "Create project" }))
    expect(onCreate).toHaveBeenCalledOnce()
  })

  it("supports a compact custom presentation", () => {
    render(
      <Empty className="compact-state">
        <EmptyTitle>No results</EmptyTitle>
      </Empty>
    )
    expect(
      screen
        .getByRole("heading", { name: "No results" })
        .closest('[data-slot="empty"]')
    ).toHaveClass("compact-state")
  })
})
