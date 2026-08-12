import { renderHook } from "@testing-library/react"
import type { PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { DirectionProvider, useDirection } from "./direction"

describe("Direction", () => {
  it("defaults to left-to-right", () => {
    expect(renderHook(() => useDirection()).result.current).toBe("ltr")
  })

  it("supports provider and nested direction overrides", () => {
    const Rtl = ({ children }: PropsWithChildren) => (
      <DirectionProvider direction="rtl">{children}</DirectionProvider>
    )
    expect(
      renderHook(() => useDirection(), { wrapper: Rtl }).result.current
    ).toBe("rtl")

    const Nested = ({ children }: PropsWithChildren) => (
      <DirectionProvider direction="rtl">
        <DirectionProvider direction="ltr">{children}</DirectionProvider>
      </DirectionProvider>
    )
    expect(
      renderHook(() => useDirection(), { wrapper: Nested }).result.current
    ).toBe("ltr")
  })
})
