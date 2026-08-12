"use client"

import * as React from "react"
import { Alert, AlertDescription } from "@nwl/surfacekit/components/alert"
import { Empty } from "@nwl/surfacekit/components/empty"
import { Progress } from "@nwl/surfacekit/components/progress"
import { Skeleton } from "@nwl/surfacekit/components/skeleton"
import { Spinner } from "@nwl/surfacekit/components/spinner"
import { Badge } from "@nwl/surfacekit/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import {
  AppShell,
  AppTopbar,
  AppSidebar,
} from "@nwl/surfacekit/patterns/app-shell"

const navItems = [
  { label: "Overview", href: "/playground", active: false },
  { label: "Form Inputs", href: "/form-inputs", active: false },
  { label: "Navigation", href: "/navigation", active: false },
  { label: "Dialogs & Overlays", href: "/dialogs-overlays", active: false },
  { label: "Data Display", href: "/data-display", active: false },
  { label: "Feedback", href: "/feedback", active: true },
  { label: "Layout & Utilities", href: "/layout-utilities", active: false },
  { label: "Patterns", href: "/patterns", active: false },
]

export default function FeedbackPage() {
  return (
    <AppShell
      topbar={<AppTopbar title="Feedback" eyebrow="Component Showcase" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Feedback Components</h2>
          <p className="mb-6 text-muted-foreground">
            Components for providing user feedback and status information.
          </p>

          <div className="grid gap-6">
            {/* Alert Component */}
            <Card>
              <CardHeader>
                <CardTitle>Alert</CardTitle>
                <CardDescription>Important status or message</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    This is an informational alert message.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Progress Component */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Visual progress indicator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Progress: 65%
                  </label>
                  <Progress value={65} />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">
                    Progress: 100%
                  </label>
                  <Progress value={100} />
                </div>
              </CardContent>
            </Card>

            {/* Skeleton Component */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton</CardTitle>
                <CardDescription>Loading placeholder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>

            {/* Spinner Component */}
            <Card>
              <CardHeader>
                <CardTitle>Spinner</CardTitle>
                <CardDescription>Loading animation</CardDescription>
              </CardHeader>
              <CardContent className="flex h-24 items-center justify-center">
                <Spinner />
              </CardContent>
            </Card>

            {/* Empty Component */}
            <Card>
              <CardHeader>
                <CardTitle>Empty</CardTitle>
                <CardDescription>No content state</CardDescription>
              </CardHeader>
              <CardContent>
                <Empty>
                  <p>No items to display</p>
                </Empty>
              </CardContent>
            </Card>

            {/* Badge Component */}
            <Card>
              <CardHeader>
                <CardTitle>Badge</CardTitle>
                <CardDescription>Small status indicators</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
