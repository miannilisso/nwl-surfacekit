import * as ComponentModule from "./tabs"
import { describe, expect, it } from "vitest"

describe("Tabs", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
