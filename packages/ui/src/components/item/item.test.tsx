import * as ComponentModule from "./item"
import { describe, expect, it } from "vitest"

describe("Item", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
