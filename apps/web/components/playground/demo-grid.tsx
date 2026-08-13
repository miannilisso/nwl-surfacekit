"use client"

import * as React from "react"
import type { ComponentType } from "react"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { ComponentPreview } from "./component-preview"
import { DemoErrorBoundary } from "./demo-error-boundary"

export type DemoRegistry = Readonly<Record<string, ComponentType>>

export function DemoGrid({
  entries,
  demos,
}: {
  entries: readonly SurfaceCatalogEntry[]
  demos: DemoRegistry
}) {
  return (
    <div className="grid gap-6">
      {entries.map((entry) => {
        const Demo = demos[entry.id]
        if (!Demo) throw new Error(`Missing playground demo: ${entry.id}`)

        return (
          <DemoErrorBoundary key={entry.id}>
            <ComponentPreview entry={entry}>
              <Demo />
            </ComponentPreview>
          </DemoErrorBoundary>
        )
      })}
    </div>
  )
}
