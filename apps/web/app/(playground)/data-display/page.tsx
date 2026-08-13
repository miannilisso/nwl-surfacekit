import type { Metadata } from "next"

import { DataDisplayGallery } from "../../../components/playground/data-display-gallery"
import { getSurfacesByCategory } from "../../../lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "Data Display | SurfaceKit Playground",
  description:
    "Explore structured records, conversational content, progress, charts, and rich media.",
}

export default function DataDisplayPage() {
  const entries = getSurfacesByCategory("data-display")

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">Component catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Data Display
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Explore structured records, conversational content, progress, charts,
          and rich media.
        </p>
      </header>
      <DataDisplayGallery entries={entries} />
    </div>
  )
}
