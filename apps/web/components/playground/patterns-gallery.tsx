"use client"

import dynamic from "next/dynamic"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { DemoGrid, type DemoRegistry } from "./demo-grid"
import { DemoLoading } from "./demo-loading"

const demos = {
  "app-shell": dynamic(() => import("./demos/app-shell-demo"), {
    loading: DemoLoading,
  }),
  "auth-shell": dynamic(() => import("./demos/auth-shell-demo"), {
    loading: DemoLoading,
  }),
  "auth-form": dynamic(() => import("./demos/auth-form-demo"), {
    loading: DemoLoading,
  }),
  "confirm-danger-action": dynamic(
    () => import("./demos/confirm-danger-action-demo"),
    {
      loading: DemoLoading,
    }
  ),
  "data-table-toolbar": dynamic(
    () => import("./demos/data-table-toolbar-demo"),
    {
      loading: DemoLoading,
    }
  ),
  "error-summary": dynamic(() => import("./demos/error-summary-demo"), {
    loading: DemoLoading,
  }),
  "incident-banner": dynamic(() => import("./demos/incident-banner-demo"), {
    loading: DemoLoading,
  }),
  "permission-gate": dynamic(() => import("./demos/permission-gate-demo"), {
    loading: DemoLoading,
  }),
  "resource-status": dynamic(() => import("./demos/resource-status-demo"), {
    loading: DemoLoading,
  }),
  "security-challenge": dynamic(
    () => import("./demos/security-challenge-demo"),
    { loading: DemoLoading }
  ),
  "step-up-dialog": dynamic(() => import("./demos/step-up-dialog-demo"), {
    loading: DemoLoading,
  }),
  "web-shell": dynamic(() => import("./demos/web-shell-demo"), {
    loading: DemoLoading,
  }),
} satisfies DemoRegistry

export function PatternsGallery({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  return <DemoGrid entries={entries} demos={demos} />
}
