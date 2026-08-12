"use client"

import * as React from "react"
import { Collapsible } from "@nwl/surfacekit/components/collapsible"
import { Message } from "@nwl/surfacekit/components/message"
import {
  MessageScroller,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
} from "@nwl/surfacekit/components/message-scroller"
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
  { label: "Data Display", href: "/data-display", active: true },
  { label: "Feedback", href: "/feedback", active: false },
  { label: "Layout & Utilities", href: "/layout-utilities", active: false },
  { label: "Patterns", href: "/patterns", active: false },
]

export default function DataDisplayPage() {
  return (
    <AppShell
      topbar={<AppTopbar title="Data Display" eyebrow="Component Showcase" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Data Display Components</h2>
          <p className="mb-6 text-muted-foreground">
            Components for displaying and visualizing data in various formats.
          </p>

          <div className="grid gap-6">
            {/* Table Component */}
            <Card>
              <CardHeader>
                <CardTitle>Table</CardTitle>
                <CardDescription>Structured data presentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">Email</th>
                        <th className="py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">John Doe</td>
                        <td className="py-2">john@example.com</td>
                        <td className="py-2">Active</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Jane Smith</td>
                        <td className="py-2">jane@example.com</td>
                        <td className="py-2">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Carousel Component */}
            <Card>
              <CardHeader>
                <CardTitle>Carousel</CardTitle>
                <CardDescription>Rotating content display</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-48 items-center justify-center rounded-lg bg-muted">
                  <p className="text-muted-foreground">
                    Carousel content would display here
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Collapsible Component */}
            <Card>
              <CardHeader>
                <CardTitle>Collapsible</CardTitle>
                <CardDescription>
                  Expandable/collapsible content section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Collapsible>
                  <button className="text-sm font-medium text-primary hover:underline">
                    Click to expand...
                  </button>
                  <div className="mt-2 hidden text-sm text-muted-foreground">
                    This content is hidden until expanded
                  </div>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Calendar Component */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Date selection calendar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="inline-block rounded-lg border p-4">
                    <div className="mb-2 text-sm font-medium">January 2024</div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: 31 }).map((_, i) => (
                        <div
                          key={i}
                          className="cursor-pointer rounded p-1 hover:bg-accent"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message Component */}
            <Card>
              <CardHeader>
                <CardTitle>Message</CardTitle>
                <CardDescription>Chat/message display</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Message>
                    <div className="text-sm">Hello, how can I help you?</div>
                  </Message>
                  <Message>
                    <div className="text-sm">
                      I have a question about the product
                    </div>
                  </Message>
                </div>
              </CardContent>
            </Card>

            {/* MessageScroller Component */}
            <Card>
              <CardHeader>
                <CardTitle>Message Scroller</CardTitle>
                <CardDescription>Scrollable message list</CardDescription>
              </CardHeader>
              <CardContent>
                <MessageScrollerProvider>
                  <MessageScrollerViewport>
                    <MessageScrollerContent>
                      <MessageScrollerItem>Message 1</MessageScrollerItem>
                      <MessageScrollerItem>Message 2</MessageScrollerItem>
                      <MessageScrollerItem>Message 3</MessageScrollerItem>
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                </MessageScrollerProvider>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
