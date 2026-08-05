import * as ComponentModule from "./alert-dialog"
import { describe, expect, it } from "vitest"

describe("Alert Dialog", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
