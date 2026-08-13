"use client"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@nwl/surfacekit/components/alert"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@nwl/surfacekit/components/empty"
import { Skeleton } from "@nwl/surfacekit/components/skeleton"
import { Spinner } from "@nwl/surfacekit/components/spinner"

export function AlertDemo() {
  return (
    <Alert className="w-full max-w-xl">
      <span aria-hidden="true">ⓘ</span>
      <AlertTitle>Policy update</AlertTitle>
      <AlertDescription>
        The access policy changes on September 1.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Review
        </Button>
      </AlertAction>
    </Alert>
  )
}

export function EmptyDemo() {
  return (
    <Empty className="w-full max-w-xl border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <span aria-hidden="true">◇</span>
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Create your first project to start shipping.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create project</Button>
      </EmptyContent>
    </Empty>
  )
}

export function SkeletonDemo() {
  return (
    <div
      aria-label="Loading release card"
      role="status"
      className="w-full max-w-sm space-y-4 rounded-2xl border p-5"
    >
      <Skeleton className="h-5 w-40" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-8 w-24" />
      <span className="sr-only">Loading release data</span>
    </div>
  )
}

export function SpinnerDemo() {
  return (
    <div
      className="flex items-center gap-2"
      role="status"
      aria-label="Publishing release"
    >
      <Spinner aria-hidden="true" />
      <span>Publishing release</span>
    </div>
  )
}
