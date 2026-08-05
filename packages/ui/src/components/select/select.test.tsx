import * as ComponentModule from "./select"
import { describe, expect, it } from "vitest"

describe("Select", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
