import type { Metadata } from "next"

import { FeedbackGallery } from "@/components/playground/feedback-gallery"
import { getSurfacesByCategory } from "@/lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "Feedback | SurfaceKit Playground",
  description:
    "Explore status messaging, empty states, and resilient loading indicators.",
}

export default function FeedbackPage() {
  const entries = getSurfacesByCategory("feedback")

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">Component catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Feedback
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Explore status messaging, empty states, and resilient loading
          indicators.
        </p>
      </header>
      <FeedbackGallery entries={entries} />
    </div>
  )
}
