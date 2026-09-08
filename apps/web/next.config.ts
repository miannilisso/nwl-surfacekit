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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "worker-src 'self'",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Service-Worker-Allowed", value: "/" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'; worker-src 'self'",
          },
        ],
      },
    ]
  },
  async redirects() {
    return legacyPlaygroundRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }))
  },
}

export default nextConfig
