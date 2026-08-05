import * as ComponentModule from "./calendar"
import { describe, expect, it } from "vitest"

describe("Calendar", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
