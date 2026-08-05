import * as ComponentModule from "./menubar"
import { describe, expect, it } from "vitest"

describe("Menubar", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
