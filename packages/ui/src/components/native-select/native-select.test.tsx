import * as ComponentModule from "./native-select"
import { describe, expect, it } from "vitest"

describe("Native Select", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
