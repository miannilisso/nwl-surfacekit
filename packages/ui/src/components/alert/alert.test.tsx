import * as ComponentModule from "./alert"
import { describe, expect, it } from "vitest"

describe("Alert", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
