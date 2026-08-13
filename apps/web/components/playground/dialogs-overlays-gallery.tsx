"use client"

import dynamic from "next/dynamic"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { DemoGrid, type DemoRegistry } from "./demo-grid"
import { DemoLoading } from "./demo-loading"

const demos = {
  "alert-dialog": dynamic(() => import("./demos/alert-dialog-demo"), {
    loading: DemoLoading,
  }),
  command: dynamic(() => import("./demos/command-demo"), {
    loading: DemoLoading,
  }),
  "context-menu": dynamic(() => import("./demos/context-menu-demo"), {
    loading: DemoLoading,
  }),
  dialog: dynamic(() => import("./demos/dialog-demo"), {
    loading: DemoLoading,
  }),
  drawer: dynamic(() => import("./demos/drawer-demo"), {
    loading: DemoLoading,
  }),
  "dropdown-menu": dynamic(() => import("./demos/dropdown-menu-demo"), {
    loading: DemoLoading,
  }),
  "hover-card": dynamic(() => import("./demos/hover-card-demo"), {
    loading: DemoLoading,
  }),
  popover: dynamic(() => import("./demos/popover-demo"), {
    loading: DemoLoading,
  }),
  sheet: dynamic(() => import("./demos/sheet-demo"), {
    loading: DemoLoading,
  }),
  toast: dynamic(() => import("./demos/toast-demo"), {
    loading: DemoLoading,
  }),
  tooltip: dynamic(() => import("./demos/tooltip-demo"), {
    loading: DemoLoading,
  }),
} satisfies DemoRegistry

export function DialogsOverlaysGallery({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  return <DemoGrid entries={entries} demos={demos} />
}
