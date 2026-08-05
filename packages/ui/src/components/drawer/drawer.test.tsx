import * as ComponentModule from "./drawer"
import { describe, expect, it } from "vitest"

describe("Drawer", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
