import * as ComponentModule from "./input-otp"
import { describe, expect, it } from "vitest"

describe("Input Otp", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
