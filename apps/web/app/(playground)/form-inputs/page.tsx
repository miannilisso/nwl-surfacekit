import type { Metadata } from "next"

import { FormInputsGallery } from "../../../components/playground/form-inputs-gallery"
import { getSurfacesByCategory } from "../../../lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "Form Inputs | SurfaceKit Playground",
  description:
    "Explore accessible controls for data entry, selection, and form composition.",
}

export default function FormInputsPage() {
  const entries = getSurfacesByCategory("form-inputs")

  return (
    <div className="space-y-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-sm font-medium text-primary">Component catalog</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Form Inputs
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Explore accessible controls for data entry, selection, and form
          composition.
        </p>
      </header>
      <FormInputsGallery entries={entries} />
    </div>
  )
}
