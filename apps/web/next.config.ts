import type { NextConfig } from "next"

const legacyPlaygroundRedirects = [
  ["/form-inputs", "/playground/form-inputs"],
  ["/navigation", "/playground/navigation"],
  ["/dialogs-overlays", "/playground/dialogs-overlays"],
  ["/data-display", "/playground/data-display"],
  ["/feedback", "/playground/feedback"],
  ["/layout-utilities", "/playground/layout-utilities"],
  ["/patterns", "/playground/patterns"],
] as const

const nextConfig: NextConfig = {
  transpilePackages: ["@nwl/surfacekit"],
  async redirects() {
    return legacyPlaygroundRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))
  },
}

export default nextConfig
