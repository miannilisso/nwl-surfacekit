import { Geist, Geist_Mono, Outfit } from "next/font/google"

import "@nwl/surfacekit/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@nwl/surfacekit/lib/utils"

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable, geistHeading.variable)}
    >
      <body>
        <div className="root">
          <ThemeProvider>{children}</ThemeProvider>
        </div>
      </body>
    </html>
  )
}
