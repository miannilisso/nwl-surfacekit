"use client"

import * as React from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@nwl/surfacekit/components/alert"
import { Button } from "@nwl/surfacekit/components/button"

type DemoErrorBoundaryState = { error: Error | null; retryKey: number }

export class DemoErrorBoundary extends React.Component<
  { children: React.ReactNode },
  DemoErrorBoundaryState
> {
  state: DemoErrorBoundaryState = { error: null, retryKey: 0 }

  static getDerivedStateFromError(error: Error): DemoErrorBoundaryState {
    return { error, retryKey: 0 }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("SurfaceKit playground example failed", error, info)
  }

  private retry = () => {
    this.setState(({ retryKey }) => ({ error: null, retryKey: retryKey + 1 }))
  }

  render() {
    if (this.state.error) {
      return (
        <Alert role="alert" variant="destructive">
          <AlertTitle>Example unavailable</AlertTitle>
          <AlertDescription>
            This example failed in isolation. The remaining catalog is still
            available.
          </AlertDescription>
          <Button
            className="mt-3"
            onClick={this.retry}
            size="sm"
            variant="outline"
          >
            Retry example
          </Button>
        </Alert>
      )
    }

    return (
      <React.Fragment key={this.state.retryKey}>
        {this.props.children}
      </React.Fragment>
    )
  }
}
