"use client"

import dynamic from "next/dynamic"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { DemoGrid, type DemoRegistry } from "./demo-grid"
import { DemoLoading } from "./demo-loading"

const demos = {
  accordion: dynamic(() => import("./demos/accordion-demo"), {
    loading: DemoLoading,
  }),
  "aspect-ratio": dynamic(() => import("./demos/aspect-ratio-demo"), {
    loading: DemoLoading,
  }),
  collapsible: dynamic(() => import("./demos/collapsible-demo"), {
    loading: DemoLoading,
  }),
  direction: dynamic(() => import("./demos/direction-demo"), {
    loading: DemoLoading,
  }),
  kbd: dynamic(() => import("./demos/kbd-demo"), {
    loading: DemoLoading,
  }),
  resizable: dynamic(() => import("./demos/resizable-demo"), {
    loading: DemoLoading,
  }),
  "scroll-area": dynamic(() => import("./demos/scroll-area-demo"), {
    loading: DemoLoading,
  }),
  separator: dynamic(() => import("./demos/separator-demo"), {
    loading: DemoLoading,
  }),
  sidebar: dynamic(() => import("./demos/sidebar-demo"), {
    loading: DemoLoading,
  }),
} satisfies DemoRegistry

export function LayoutUtilitiesGallery({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  return <DemoGrid entries={entries} demos={demos} />
}
