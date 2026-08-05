import * as ComponentModule from "./field"
import { describe, expect, it } from "vitest"

describe("Field", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
