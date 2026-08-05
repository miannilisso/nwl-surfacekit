import * as ComponentModule from "./toggle-group"
import { describe, expect, it } from "vitest"

describe("Toggle Group", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
