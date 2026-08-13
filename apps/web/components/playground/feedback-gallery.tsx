"use client"

import dynamic from "next/dynamic"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { DemoGrid, type DemoRegistry } from "./demo-grid"
import { DemoLoading } from "./demo-loading"

const demos = {
  alert: dynamic(() => import("./demos/alert-demo"), {
    loading: DemoLoading,
  }),
  empty: dynamic(() => import("./demos/empty-demo"), {
    loading: DemoLoading,
  }),
  skeleton: dynamic(() => import("./demos/skeleton-demo"), {
    loading: DemoLoading,
  }),
  spinner: dynamic(() => import("./demos/spinner-demo"), {
    loading: DemoLoading,
  }),
} satisfies DemoRegistry

export function FeedbackGallery({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  return <DemoGrid entries={entries} demos={demos} />
}
