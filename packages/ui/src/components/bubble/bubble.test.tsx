import * as ComponentModule from "./bubble"
import { describe, expect, it } from "vitest"

describe("Bubble", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
