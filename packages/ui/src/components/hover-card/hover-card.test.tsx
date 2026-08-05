import * as ComponentModule from "./hover-card"
import { describe, expect, it } from "vitest"

describe("Hover Card", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
