import * as ComponentModule from "./carousel"
import { describe, expect, it } from "vitest"

describe("Carousel", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
