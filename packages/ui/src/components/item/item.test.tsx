import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item"

describe("Item", () => {
  it("composes all regions inside a semantic list", () => {
    const onArchive = vi.fn()
    const { container } = render(
      <ItemGroup aria-label="Projects">
        <Item variant="outline">
          <ItemHeader>Active</ItemHeader>
          <ItemMedia variant="icon">P</ItemMedia>
          <ItemContent>
            <ItemTitle>SurfaceKit</ItemTitle>
            <ItemDescription>Design system</ItemDescription>
          </ItemContent>
          <ItemActions>
            <button type="button" onClick={onArchive}>
              Archive
            </button>
          </ItemActions>
          <ItemFooter>Updated today</ItemFooter>
        </Item>
        <ItemSeparator />
      </ItemGroup>
    )
    expect(screen.getByRole("list", { name: "Projects" })).toBeVisible()
    expect(screen.getByRole("listitem")).toHaveAttribute("data-slot", "item")
    for (const slot of [
      "item-header",
      "item-media",
      "item-content",
      "item-title",
      "item-description",
      "item-actions",
      "item-footer",
      "item-separator",
    ]) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`)
      ).toBeInTheDocument()
    }
    expect(
      container.querySelector('[data-slot="item-separator"]')
    ).toHaveAttribute("role", "presentation")
    fireEvent.click(screen.getByRole("button", { name: "Archive" }))
    expect(onArchive).toHaveBeenCalledOnce()
  })

  it("composes the item root as a native link", () => {
    render(
      <Item render={<a href="/projects/surfacekit" />}>
        <ItemTitle>Open SurfaceKit</ItemTitle>
      </Item>
    )
    const link = screen.getByRole("link", { name: "Open SurfaceKit" })
    expect(link).toHaveAttribute("href", "/projects/surfacekit")
    expect(link).toHaveAttribute("data-slot", "item")
  })
})
