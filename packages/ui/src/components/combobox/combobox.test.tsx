import * as ComponentModule from "./combobox"
import { describe, expect, it } from "vitest"

describe("Combobox", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
