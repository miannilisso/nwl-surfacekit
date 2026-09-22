import { describe, expect, it } from "vitest"

import nextConfig from "./next.config"

describe("next config redirects", () => {
  it("keeps development-only indicators out of product visual baselines", () => {
    expect(nextConfig.devIndicators).toBe(false)
  })

  it("permanently redirects legacy playground category routes", async () => {
    const redirects = await nextConfig.redirects?.()
    const expectedRedirects = [
      ["/form-inputs", "/playground/form-inputs"],
      ["/navigation", "/playground/navigation"],
      ["/dialogs-overlays", "/playground/dialogs-overlays"],
      ["/data-display", "/playground/data-display"],
      ["/feedback", "/playground/feedback"],
      ["/layout-utilities", "/playground/layout-utilities"],
      ["/patterns", "/playground/patterns"],
    ] as const

    expect(redirects).toEqual(
      expectedRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      }))
    )
  })
})
