import type { Metadata } from "next"

import { NavigationGallery } from "../../../components/playground/navigation-gallery"
import { getSurfacesByCategory } from "../../../lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "Navigation | SurfaceKit Playground",
  description:
    "Explore hierarchy, application menus, pagination, and stateful navigation.",
}

export default function NavigationPage() {
  const entries = getSurfacesByCategory("navigation")

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">Component catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Navigation
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Explore hierarchy, application menus, pagination, and stateful
          navigation.
        </p>
      </header>
      <NavigationGallery entries={entries} />
    </div>
  )
}
