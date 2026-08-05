import * as ComponentModule from "./label"
import { describe, expect, it } from "vitest"

describe("Label", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
