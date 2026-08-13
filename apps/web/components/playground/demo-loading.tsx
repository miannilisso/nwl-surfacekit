import { Skeleton } from "@nwl/surfacekit/components/skeleton"
import * as React from "react"

export function DemoLoading() {
  return (
    <div
      role="status"
      aria-label="Loading example"
      className="space-y-3 rounded-2xl border border-dashed p-4"
    >
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <span className="sr-only">Loading example</span>
    </div>
  )
}
