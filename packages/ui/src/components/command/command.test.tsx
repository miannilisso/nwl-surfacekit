import * as ComponentModule from "./command"
import { describe, expect, it } from "vitest"

describe("Command", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
