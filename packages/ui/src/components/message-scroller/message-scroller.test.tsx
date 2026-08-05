import * as ComponentModule from "./message-scroller"
import { describe, expect, it } from "vitest"

describe("Message Scroller", () => {
  it("exports a component module", () => {
    expect(Object.keys(ComponentModule).length).toBeGreaterThan(0)
  })
})
