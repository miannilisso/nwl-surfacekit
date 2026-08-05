import * as ComponentModule from "./attachment"
import { describe, expect, it } from "vitest"

describe("Attachment", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
