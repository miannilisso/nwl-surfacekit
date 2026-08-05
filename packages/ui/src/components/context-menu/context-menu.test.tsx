import * as ComponentModule from "./context-menu"
import { describe, expect, it } from "vitest"

describe("Context Menu", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
