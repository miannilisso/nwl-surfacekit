import * as ComponentModule from "./spinner"
import { describe, expect, it } from "vitest"

describe("Spinner", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
