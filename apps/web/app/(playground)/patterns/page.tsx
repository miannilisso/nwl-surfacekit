"use client"

import * as React from "react"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { BarChart3 } from "lucide-react"
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
  { label: "Feedback", href: "/feedback", active: false },
  { label: "Layout & Utilities", href: "/layout-utilities", active: false },
  { label: "Patterns", href: "/patterns", active: true },
]

export default function PatternsPage() {
  return (
    <AppShell
      topbar={<AppTopbar title="Patterns" eyebrow="Component Showcase" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Design Patterns</h2>
          <p className="mb-6 text-muted-foreground">
            Enterprise patterns for building complete user experiences.
          </p>

          <div className="grid gap-6">
            {/* AppShell Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>App Shell</CardTitle>
                <CardDescription>
                  Complete application layout with topbar and sidebar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  The AppShell pattern provides a complete layout structure
                  with:
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Fixed topbar with title and actions</li>
                  <li>Collapsible sidebar navigation</li>
                  <li>Main content area with proper scrolling</li>
                  <li>Responsive breakpoints</li>
                </ul>
              </CardContent>
            </Card>

            {/* AppTopbar Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>App Topbar</CardTitle>
                <CardDescription>
                  Fixed top navigation bar with actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The AppTopbar component displays the page title, breadcrumb
                  context, and quick actions like notifications, search, and
                  settings.
                </p>
              </CardContent>
            </Card>

            {/* AppSidebar Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>App Sidebar</CardTitle>
                <CardDescription>
                  Vertical navigation sidebar with active states
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The AppSidebar component provides a navigation menu with
                  icons, labels, and optional badges for notifications and
                  status.
                </p>
              </CardContent>
            </Card>

            {/* DataTableToolbar Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Data Table Toolbar</CardTitle>
                <CardDescription>
                  Search, filter, and export controls for data tables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  The DataTableToolbar pattern includes:
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Search/filter input with icon</li>
                  <li>Filter and export buttons</li>
                  <li>Item count display</li>
                  <li>Responsive layout</li>
                </ul>
              </CardContent>
            </Card>

            {/* AuthShell Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Auth Shell</CardTitle>
                <CardDescription>
                  Sign-in and authentication layout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  The AuthShell pattern demonstrates:
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Two-column authentication layout</li>
                  <li>Benefits/features callout</li>
                  <li>Sign-in form area</li>
                  <li>Brand differentiation</li>
                </ul>
              </CardContent>
            </Card>

            {/* WebShell Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Web Shell</CardTitle>
                <CardDescription>
                  Marketing website layout with header and footer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">
                  The WebShell pattern provides:
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Fixed top navigation bar</li>
                  <li>Main content area</li>
                  <li>Footer with multiple column links</li>
                  <li>Marketing-friendly structure</li>
                </ul>
              </CardContent>
            </Card>

            {/* Dashboard Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Layout</CardTitle>
                <CardDescription>
                  Analytics and metrics dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded bg-muted p-4 text-center">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-xs text-muted-foreground">
                      Active Users
                    </div>
                  </div>
                  <div className="rounded bg-muted p-4 text-center">
                    <div className="text-2xl font-bold">$1.2K</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empty State Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Empty State</CardTitle>
                <CardDescription>
                  Graceful handling of no content scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 text-muted-foreground">
                    <BarChart3 className="h-12 w-12" />
                  </div>
                  <h3 className="mb-1 font-medium">No data available</h3>
                  <p className="text-sm text-muted-foreground">
                    Get started by creating your first item
                  </p>
                  <Button size="sm" className="mt-4">
                    Create Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Error State Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Error State</CardTitle>
                <CardDescription>
                  Clear error messaging and recovery paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 rounded border border-red-200 bg-red-50 p-4">
                  <div className="mt-0.5 text-red-600">!</div>
                  <div>
                    <h3 className="font-medium text-red-800">
                      Something went wrong
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      Please try again or contact support
                    </p>
                    <Button size="sm" variant="outline" className="mt-3">
                      Retry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
