"use client"

import * as React from "react"
import { Breadcrumb } from "@nwl/surfacekit/components/breadcrumb"
import { Menubar } from "@nwl/surfacekit/components/menubar"
import { Pagination } from "@nwl/surfacekit/components/pagination"
import { Tabs } from "@nwl/surfacekit/components/tabs"
import { Button } from "@nwl/surfacekit/components/button"
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
  { label: "Navigation", href: "/navigation", active: true },
  { label: "Dialogs & Overlays", href: "/dialogs-overlays", active: false },
  { label: "Data Display", href: "/data-display", active: false },
  { label: "Feedback", href: "/feedback", active: false },
  { label: "Layout & Utilities", href: "/layout-utilities", active: false },
  { label: "Patterns", href: "/patterns", active: false },
]

export default function NavigationPage() {
  return (
    <AppShell
      topbar={<AppTopbar title="Navigation" eyebrow="Component Showcase" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Navigation Components</h2>
          <p className="mb-6 text-muted-foreground">
            Components for navigating between pages and sections of your
            application.
          </p>

          <div className="grid gap-6">
            {/* Breadcrumb Component */}
            <Card>
              <CardHeader>
                <CardTitle>Breadcrumb</CardTitle>
                <CardDescription>
                  Shows the navigation path in a hierarchy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Breadcrumb>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Home
                  </button>
                  <span className="mx-2 text-muted-foreground">/</span>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    Components
                  </button>
                  <span className="mx-2 text-muted-foreground">/</span>
                  <span className="text-sm font-medium">Breadcrumb</span>
                </Breadcrumb>
              </CardContent>
            </Card>

            {/* Menubar Component */}
            <Card>
              <CardHeader>
                <CardTitle>Menubar</CardTitle>
                <CardDescription>Top-level navigation menu bar</CardDescription>
              </CardHeader>
              <CardContent>
                <Menubar>
                  <button className="rounded px-3 py-2 text-sm font-medium hover:bg-accent">
                    File
                  </button>
                  <button className="rounded px-3 py-2 text-sm font-medium hover:bg-accent">
                    Edit
                  </button>
                  <button className="rounded px-3 py-2 text-sm font-medium hover:bg-accent">
                    View
                  </button>
                </Menubar>
              </CardContent>
            </Card>

            {/* Pagination Component */}
            <Card>
              <CardHeader>
                <CardTitle>Pagination</CardTitle>
                <CardDescription>
                  Navigate between pages of content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Pagination>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Pagination>
              </CardContent>
            </Card>

            {/* Tabs Component */}
            <Card>
              <CardHeader>
                <CardTitle>Tabs</CardTitle>
                <CardDescription>
                  Organize content into multiple tabs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="tab1">
                  <div className="mb-4 flex border-b">
                    <button className="border-b-2 border-primary px-4 py-2 font-medium">
                      Tab 1
                    </button>
                    <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                      Tab 2
                    </button>
                    <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                      Tab 3
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Content for Tab 1
                  </p>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
