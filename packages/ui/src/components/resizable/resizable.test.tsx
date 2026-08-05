import * as ComponentModule from "./resizable"
import { describe, expect, it } from "vitest"

describe("Resizable", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
