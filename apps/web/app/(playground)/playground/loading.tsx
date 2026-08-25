import { Skeleton } from "@nwl/surfacekit/components/skeleton"
import * as React from "react"

export default function Loading() {
  return (
    <div role="status" aria-label="Loading playground" className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-6">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="space-y-4 rounded-3xl border p-6" key={index}>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading playground</span>
    </div>
  )
}
