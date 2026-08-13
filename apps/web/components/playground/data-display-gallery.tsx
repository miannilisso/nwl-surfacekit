"use client"

import dynamic from "next/dynamic"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { DemoGrid, type DemoRegistry } from "./demo-grid"
import { DemoLoading } from "./demo-loading"

const demos = {
  attachment: dynamic(() => import("./demos/attachment-demo"), {
    loading: DemoLoading,
  }),
  avatar: dynamic(() => import("./demos/avatar-demo"), {
    loading: DemoLoading,
  }),
  badge: dynamic(() => import("./demos/badge-demo"), {
    loading: DemoLoading,
  }),
  bubble: dynamic(() => import("./demos/bubble-demo"), {
    loading: DemoLoading,
  }),
  card: dynamic(() => import("./demos/card-demo"), {
    loading: DemoLoading,
  }),
  carousel: dynamic(() => import("./demos/carousel-demo"), {
    loading: DemoLoading,
  }),
  chart: dynamic(() => import("./demos/chart-demo"), {
    loading: DemoLoading,
  }),
  item: dynamic(() => import("./demos/item-demo"), {
    loading: DemoLoading,
  }),
  marker: dynamic(() => import("./demos/marker-demo"), {
    loading: DemoLoading,
  }),
  message: dynamic(() => import("./demos/message-demo"), {
    loading: DemoLoading,
  }),
  "message-scroller": dynamic(() => import("./demos/message-scroller-demo"), {
    loading: DemoLoading,
  }),
  progress: dynamic(() => import("./demos/progress-demo"), {
    loading: DemoLoading,
  }),
  table: dynamic(() => import("./demos/table-demo"), {
    loading: DemoLoading,
  }),
} satisfies DemoRegistry

export function DataDisplayGallery({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  return <DemoGrid entries={entries} demos={demos} />
}
