"use client"

import * as React from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@nwl/surfacekit/components/alert"
import { Button } from "@nwl/surfacekit/components/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Alert role="alert" variant="destructive" className="max-w-2xl">
      <AlertTitle>Playground unavailable</AlertTitle>
      <AlertDescription>
        This route could not render. Reference: {error.digest ?? "local"}
      </AlertDescription>
      <Button className="mt-3" onClick={reset} size="sm" variant="outline">
        Try again
      </Button>
    </Alert>
  )
}
