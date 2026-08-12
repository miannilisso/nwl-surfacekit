import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Skeleton } from "./skeleton"

describe("Skeleton", () => {
  it("is a presentation-only placeholder with caller-controlled dimensions", () => {
    const { container } = render(
      <Skeleton className="h-8 w-48" data-testid="loading-placeholder" />
    )

    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveAttribute("aria-hidden", "true")
    expect(skeleton).toHaveClass("animate-pulse", "h-8", "w-48")
    expect(skeleton).not.toHaveAttribute("tabindex")
  })
})
