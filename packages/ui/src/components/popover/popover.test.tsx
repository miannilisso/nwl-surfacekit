import * as ComponentModule from "./popover"
import { describe, expect, it } from "vitest"

describe("Popover", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
