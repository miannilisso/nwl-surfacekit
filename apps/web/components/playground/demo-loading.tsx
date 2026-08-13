import { Skeleton } from "@nwl/surfacekit/components/skeleton"
import * as React from "react"

export function DemoLoading() {
  return (
    <div role="status" aria-label="Loading example" className="space-y-3">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-24 w-full" />
      <span className="sr-only">Loading example</span>
    </div>
  )
}
