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
import {
  AppShell,
  AppTopbar,
  AppSidebar,
} from "@nwl/surfacekit/patterns/app-shell"

const navItems = [
  { label: "Overview", href: "/playground", active: false },
  { label: "Form Inputs", href: "/form-inputs", active: false },
  { label: "Navigation", href: "/navigation", active: false },
  { label: "Dialogs & Overlays", href: "/dialogs-overlays", active: true },
  { label: "Data Display", href: "/data-display", active: false },
  { label: "Feedback", href: "/feedback", active: false },
  { label: "Layout & Utilities", href: "/layout-utilities", active: false },
  { label: "Patterns", href: "/patterns", active: false },
]

export default function DialogsOverlaysPage() {
  const [showDialog, setShowDialog] = React.useState(false)
  const [showDrawer, setShowDrawer] = React.useState(false)

  return (
    <AppShell
      topbar={
        <AppTopbar title="Dialogs & Overlays" eyebrow="Component Showcase" />
      }
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Dialogs & Overlays</h2>
          <p className="mb-6 text-muted-foreground">
            Modal and overlay components for displaying content in dialogs,
            drawers, and popovers.
          </p>

          <div className="grid gap-6">
            {/* Dialog Component */}
            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
                <CardDescription>
                  Modal dialog for user interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowDialog(true)} size="sm">
                  Open Dialog
                </Button>
                {showDialog && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="max-w-sm rounded-lg bg-background p-6 shadow-lg">
                      <h2 className="mb-2 font-semibold">Dialog Title</h2>
                      <p className="mb-4 text-sm text-muted-foreground">
                        This is a dialog component. Click outside or the button
                        to close.
                      </p>
                      <Button onClick={() => setShowDialog(false)} size="sm">
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Drawer Component */}
            <Card>
              <CardHeader>
                <CardTitle>Drawer</CardTitle>
                <CardDescription>
                  Side panel that slides in from the edge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowDrawer(true)} size="sm">
                  Open Drawer
                </Button>
                {showDrawer && (
                  <>
                    <div
                      className="fixed inset-0 z-50 bg-black/50"
                      onClick={() => setShowDrawer(false)}
                    />
                    <div className="fixed top-0 right-0 z-50 h-full w-64 bg-background p-6 shadow-lg">
                      <h2 className="mb-4 font-semibold">Drawer Title</h2>
                      <p className="mb-4 text-sm text-muted-foreground">
                        This is a drawer that slides in from the right.
                      </p>
                      <Button
                        onClick={() => setShowDrawer(false)}
                        size="sm"
                        className="w-full"
                      >
                        Close
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Sheet Component */}
            <Card>
              <CardHeader>
                <CardTitle>Sheet</CardTitle>
                <CardDescription>Expandable content panel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" disabled>
                  Open Sheet
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Sheet component example (disabled for demo)
                </p>
              </CardContent>
            </Card>

            {/* Tooltip Component */}
            <Card>
              <CardHeader>
                <CardTitle>Tooltip</CardTitle>
                <CardDescription>Information hint on hover</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative inline-block">
                  <button className="rounded-md border border-input px-3 py-2 hover:bg-accent">
                    Hover me
                  </button>
                  <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform rounded bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background">
                    Tooltip text
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* HoverCard Component */}
            <Card>
              <CardHeader>
                <CardTitle>Hover Card</CardTitle>
                <CardDescription>Expandable card on hover</CardDescription>
              </CardHeader>
              <CardContent>
                <button className="text-sm text-primary hover:underline">
                  Hover over this text
                </button>
              </CardContent>
            </Card>

            {/* Popover Component */}
            <Card>
              <CardHeader>
                <CardTitle>Popover</CardTitle>
                <CardDescription>Floating popover panel</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline">
                  Open Popover
                </Button>
              </CardContent>
            </Card>

            {/* DropdownMenu Component */}
            <Card>
              <CardHeader>
                <CardTitle>Dropdown Menu</CardTitle>
                <CardDescription>Menu that opens on click</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline">
                  Menu ▼
                </Button>
              </CardContent>
            </Card>

            {/* AlertDialog Component */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Dialog</CardTitle>
                <CardDescription>Dialog for important alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="destructive">
                  Show Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
