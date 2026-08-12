import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AspectRatio } from "./aspect-ratio"

describe("AspectRatio", () => {
  it("preserves its child and exposes the requested ratio to CSS", () => {
    render(
      <AspectRatio ratio={16 / 9} className="preview-frame">
        <span>Preview</span>
      </AspectRatio>
    )

    const ratio = screen.getByText("Preview").parentElement
    expect(ratio).toHaveAttribute("data-slot", "aspect-ratio")
    expect(ratio).toHaveClass("aspect-(--ratio)", "preview-frame")
    expect((ratio as HTMLElement).style.getPropertyValue("--ratio")).toBe(
      String(16 / 9)
    )
  })
})
