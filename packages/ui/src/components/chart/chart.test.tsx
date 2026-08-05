import * as ComponentModule from "./chart"
import { describe, expect, it } from "vitest"

describe("Chart", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
