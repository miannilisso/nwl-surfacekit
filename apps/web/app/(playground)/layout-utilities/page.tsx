import type { Metadata } from "next"

import { LayoutUtilitiesGallery } from "../../../components/playground/layout-utilities-gallery"
import { getSurfacesByCategory } from "../../../lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "Layout & Utilities | SurfaceKit Playground",
  description:
    "Explore disclosure, direction, proportions, overflow, and responsive workspace structure.",
}

export default function LayoutUtilitiesPage() {
  const entries = getSurfacesByCategory("layout-utilities")

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">Component catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Layout & Utilities
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Explore disclosure, direction, proportions, overflow, and responsive
          workspace structure.
        </p>
      </header>
      <LayoutUtilitiesGallery entries={entries} />
    </div>
  )
}
