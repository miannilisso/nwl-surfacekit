import type { Metadata } from "next"

import { DialogsOverlaysGallery } from "../../../components/playground/dialogs-overlays-gallery"
import { getSurfacesByCategory } from "../../../lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "Dialogs & Overlays | SurfaceKit Playground",
  description:
    "Explore focused tasks, contextual actions, disclosure surfaces, and notifications.",
}

export default function DialogsOverlaysPage() {
  const entries = getSurfacesByCategory("dialogs-overlays")

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">Component catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Dialogs & Overlays
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Explore focused tasks, contextual actions, disclosure surfaces, and
          notifications.
        </p>
      </header>
      <DialogsOverlaysGallery entries={entries} />
    </div>
  )
}
