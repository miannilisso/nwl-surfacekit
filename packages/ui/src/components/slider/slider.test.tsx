import * as ComponentModule from "./slider"
import { describe, expect, it } from "vitest"

describe("Slider", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
