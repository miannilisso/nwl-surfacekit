import * as ComponentModule from "./tooltip"
import { describe, expect, it } from "vitest"

describe("Tooltip", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
