import type { Metadata, Viewport } from "next"

import "@nwl/surfacekit/globals.css"
import "./reference-fonts.css"
import "./reference-app.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PwaRegistrar } from "@/components/pwa-registrar"

export const metadata: Metadata = {
  title: {
    default: "SurfaceKit | Naneware Labs",
    template: "%s | Naneware Labs",
  },
  description: "Naneware Labs component system playground and marketing shell.",
  applicationName: "NWL SurfaceKit",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicons/nwl-surfacekit.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/favicons/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#002630" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans antialiased">
      <body>
        <div className="root min-h-svh">
          <ThemeProvider>{children}</ThemeProvider>
        </div>
        <PwaRegistrar />
      </body>
    </html>
  )
}
