import * as ComponentModule from "./collapsible"
import { describe, expect, it } from "vitest"

describe("Collapsible", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
