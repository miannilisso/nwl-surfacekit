import * as ComponentModule from "./radio-group"
import { describe, expect, it } from "vitest"

describe("Radio Group", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
