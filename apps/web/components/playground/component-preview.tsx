import { Badge } from "@nwl/surfacekit/components/badge"
import * as React from "react"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"

export function ComponentPreview({
  entry,
  children,
}: {
  entry: SurfaceCatalogEntry
  children: React.ReactNode
}) {
  const titleId = `${entry.id}-title`

  return (
    <section
      id={entry.id}
      aria-labelledby={titleId}
      className="scroll-mt-24 space-y-4 rounded-3xl border bg-card p-4 shadow-sm sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl space-y-1">
          <h2 id={titleId} className="text-xl font-semibold tracking-tight">
            {entry.name}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {entry.description}
          </p>
        </div>
        <Badge variant="secondary">{entry.kind}</Badge>
      </header>
      <div
        role="group"
        aria-label={`${entry.name} example`}
        className="min-w-0 rounded-2xl border border-dashed bg-background p-4 sm:p-6"
      >
        {children}
      </div>
    </section>
  )
}
