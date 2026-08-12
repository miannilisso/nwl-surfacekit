"use client"

import * as React from "react"
import { AspectRatio } from "@nwl/surfacekit/components/aspect-ratio"
import { Attachment } from "@nwl/surfacekit/components/attachment"
import { Avatar } from "@nwl/surfacekit/components/avatar"
import { Bubble } from "@nwl/surfacekit/components/bubble"
import { Kbd } from "@nwl/surfacekit/components/kbd"
import { ScrollArea } from "@nwl/surfacekit/components/scroll-area"
import { Separator } from "@nwl/surfacekit/components/separator"
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
  { label: "Feedback", href: "/feedback", active: false },
  { label: "Layout & Utilities", href: "/layout-utilities", active: true },
  { label: "Patterns", href: "/patterns", active: false },
]

export default function LayoutUtilitiesPage() {
  return (
    <AppShell
      topbar={
        <AppTopbar title="Layout & Utilities" eyebrow="Component Showcase" />
      }
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            Layout & Utility Components
          </h2>
          <p className="mb-6 text-muted-foreground">
            Components for building layouts and utility purposes.
          </p>

          <div className="grid gap-6">
            {/* AspectRatio Component */}
            <Card>
              <CardHeader>
                <CardTitle>Aspect Ratio</CardTitle>
                <CardDescription>Maintains fixed aspect ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={16 / 9}>
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                    <span className="text-muted-foreground">
                      16:9 Aspect Ratio
                    </span>
                  </div>
                </AspectRatio>
              </CardContent>
            </Card>

            {/* Avatar Component */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>User profile images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Avatar>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
                      JD
                    </div>
                  </Avatar>
                  <Avatar>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-semibold text-white">
                      JS
                    </div>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            {/* Separator Component */}
            <Card>
              <CardHeader>
                <CardTitle>Separator</CardTitle>
                <CardDescription>Visual content separator</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Content above</p>
                <Separator />
                <p className="text-sm">Content below</p>
              </CardContent>
            </Card>

            {/* Attachment Component */}
            <Card>
              <CardHeader>
                <CardTitle>Attachment</CardTitle>
                <CardDescription>File attachment display</CardDescription>
              </CardHeader>
              <CardContent>
                <Attachment>
                  <div className="text-sm">document.pdf</div>
                  <div className="text-xs text-muted-foreground">2.4 MB</div>
                </Attachment>
              </CardContent>
            </Card>

            {/* Bubble Component */}
            <Card>
              <CardHeader>
                <CardTitle>Bubble</CardTitle>
                <CardDescription>Floating bubble element</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-24 items-center justify-center">
                  <Bubble>
                    <span className="text-sm">💬</span>
                  </Bubble>
                </div>
              </CardContent>
            </Card>

            {/* Kbd Component */}
            <Card>
              <CardHeader>
                <CardTitle>Kbd</CardTitle>
                <CardDescription>Keyboard key display</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Kbd>Ctrl</Kbd>
                <span>+</span>
                <Kbd>S</Kbd>
              </CardContent>
            </Card>

            {/* ScrollArea Component */}
            <Card>
              <CardHeader>
                <CardTitle>Scroll Area</CardTitle>
                <CardDescription>Custom scrollable area</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 rounded border p-2">
                  <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="text-sm">
                        Item {i + 1}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Resizable Component */}
            <Card>
              <CardHeader>
                <CardTitle>Resizable</CardTitle>
                <CardDescription>Resizable panels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex overflow-hidden rounded border">
                  <div className="flex-1 border-r bg-muted/50 p-4">
                    <p className="text-sm">Panel 1</p>
                  </div>
                  <div className="flex-1 bg-muted p-4">
                    <p className="text-sm">Panel 2</p>
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
