import type { Metadata } from "next"

import { PatternsGallery } from "@/components/playground/patterns-gallery"
import { getSurfacesByCategory } from "@/lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "Patterns | SurfaceKit Playground",
  description:
    "Explore production-ready enterprise shells, permissions, status, validation, and sensitive-action workflows.",
}

export default function PatternsPage() {
  const entries = getSurfacesByCategory("patterns")

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">Pattern catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Patterns
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Explore production-ready enterprise shells, permissions, status,
          validation, and sensitive-action workflows.
        </p>
      </header>
      <PatternsGallery entries={entries} />
    </div>
  )
}
