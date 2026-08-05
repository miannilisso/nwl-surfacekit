import * as ComponentModule from "./sidebar"
import { describe, expect, it } from "vitest"

describe("Sidebar", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
