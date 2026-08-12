import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useDirection } from "@nwl/surfacekit/components/direction"

import { surfaceWrapper } from "../../packages/ui/src/test/render"

describe("SurfaceKit test environment", () => {
  it("provides deterministic browser APIs", () => {
    expect(window.matchMedia("(min-width: 768px)").matches).toBe(false)
    expect(globalThis.ResizeObserver).toBeTypeOf("function")
    expect(Element.prototype.scrollIntoView).toBeTypeOf("function")
    expect(document.elementFromPoint).toBeTypeOf("function")
  })

  it("wraps components in the default direction provider", () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: surfaceWrapper,
    })

    expect(result.current).toBe("ltr")
  })
})
