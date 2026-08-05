import * as ComponentModule from "./message"
import { describe, expect, it } from "vitest"

describe("Message", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
