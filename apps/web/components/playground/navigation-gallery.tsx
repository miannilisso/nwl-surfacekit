"use client"

import dynamic from "next/dynamic"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { DemoGrid, type DemoRegistry } from "./demo-grid"
import { DemoLoading } from "./demo-loading"

const demos = {
  breadcrumb: dynamic(() => import("./demos/breadcrumb-demo"), {
    loading: DemoLoading,
  }),
  menubar: dynamic(() => import("./demos/menubar-demo"), {
    loading: DemoLoading,
  }),
  "navigation-menu": dynamic(() => import("./demos/navigation-menu-demo"), {
    loading: DemoLoading,
  }),
  pagination: dynamic(() => import("./demos/pagination-demo"), {
    loading: DemoLoading,
  }),
  tabs: dynamic(() => import("./demos/tabs-demo"), {
    loading: DemoLoading,
  }),
} satisfies DemoRegistry

export function NavigationGallery({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  return <DemoGrid entries={entries} demos={demos} />
}
