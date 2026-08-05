import * as ComponentModule from "./input-group"
import { describe, expect, it } from "vitest"

describe("Input Group", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
