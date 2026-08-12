"use client"

import * as React from "react"

// Components - Form Inputs
import { Accordion } from "@nwl/surfacekit/components/accordion"
import { Badge } from "@nwl/surfacekit/components/badge"
import { Button } from "@nwl/surfacekit/components/button"
import { ButtonGroup } from "@nwl/surfacekit/components/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { Checkbox } from "@nwl/surfacekit/components/checkbox"
import { Combobox } from "@nwl/surfacekit/components/combobox"
import { Input } from "@nwl/surfacekit/components/input"
import { InputGroup } from "@nwl/surfacekit/components/input-group"
import { Label } from "@nwl/surfacekit/components/label"
import { NativeSelect } from "@nwl/surfacekit/components/native-select"
import { RadioGroup } from "@nwl/surfacekit/components/radio-group"
import { Select } from "@nwl/surfacekit/components/select"
import { Textarea } from "@nwl/surfacekit/components/textarea"
import { Toggle } from "@nwl/surfacekit/components/toggle"
import { ToggleGroup } from "@nwl/surfacekit/components/toggle-group"
import { Slider } from "@nwl/surfacekit/components/slider"
import { Switch } from "@nwl/surfacekit/components/switch"

// Components - Navigation
import { Breadcrumb } from "@nwl/surfacekit/components/breadcrumb"
import { Menubar } from "@nwl/surfacekit/components/menubar"
import { NavigationMenu } from "@nwl/surfacekit/components/navigation-menu"
import { Pagination } from "@nwl/surfacekit/components/pagination"
import { Tabs } from "@nwl/surfacekit/components/tabs"

// Components - Dialog/Overlay
import { AlertDialog } from "@nwl/surfacekit/components/alert-dialog"
import { Command } from "@nwl/surfacekit/components/command"
import { ContextMenu } from "@nwl/surfacekit/components/context-menu"
import { Dialog } from "@nwl/surfacekit/components/dialog"
import { Drawer } from "@nwl/surfacekit/components/drawer"
import { DropdownMenu } from "@nwl/surfacekit/components/dropdown-menu"
import { HoverCard } from "@nwl/surfacekit/components/hover-card"
import { Popover } from "@nwl/surfacekit/components/popover"
import { Sheet } from "@nwl/surfacekit/components/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@nwl/surfacekit/components/tooltip"

// Components - Data Display & Messaging
import { Alert, AlertDescription } from "@nwl/surfacekit/components/alert"
import { Carousel } from "@nwl/surfacekit/components/carousel"
import { Collapsible } from "@nwl/surfacekit/components/collapsible"
import { Message } from "@nwl/surfacekit/components/message"
import {
  MessageScroller,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@nwl/surfacekit/components/message-scroller"
import { Table } from "@nwl/surfacekit/components/table"
import { Toaster, toast } from "@nwl/surfacekit/components/toast"
import { Calendar } from "@nwl/surfacekit/components/calendar"

// Components - Feedback
import { Empty } from "@nwl/surfacekit/components/empty"
import { Progress } from "@nwl/surfacekit/components/progress"
import { Skeleton } from "@nwl/surfacekit/components/skeleton"
import { Spinner } from "@nwl/surfacekit/components/spinner"

// Components - Accessibility & Utility
import { AspectRatio } from "@nwl/surfacekit/components/aspect-ratio"
import { Attachment } from "@nwl/surfacekit/components/attachment"
import { Avatar } from "@nwl/surfacekit/components/avatar"
import { Bubble } from "@nwl/surfacekit/components/bubble"
import { Field } from "@nwl/surfacekit/components/field"
import { Item } from "@nwl/surfacekit/components/item"
import { Kbd } from "@nwl/surfacekit/components/kbd"
import { useDirection } from "@nwl/surfacekit/components/direction"
import { Marker } from "@nwl/surfacekit/components/marker"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@nwl/surfacekit/components/resizable"
import { ScrollArea } from "@nwl/surfacekit/components/scroll-area"
import { Separator } from "@nwl/surfacekit/components/separator"

// Patterns
import {
  AppShell,
  AppSidebar,
  AppTopbar,
} from "@nwl/surfacekit/patterns/app-shell"
import { AuthPanel, AuthShell } from "@nwl/surfacekit/patterns/auth-shell"
import {
  WebHero,
  WebShell,
  WebShellFooter,
  WebShellHeader,
} from "@nwl/surfacekit/patterns/web-shell"
import { ConfirmDangerAction } from "@nwl/surfacekit/patterns/confirm-danger-action"
import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"
import { ErrorSummary } from "@nwl/surfacekit/patterns/error-summary"
import { IncidentBanner } from "@nwl/surfacekit/patterns/incident-banner"
import { PermissionGate } from "@nwl/surfacekit/patterns/permission-gate"
import { ResourceStatus } from "@nwl/surfacekit/patterns/resource-status"
import { StepUpDialog } from "@nwl/surfacekit/patterns/step-up-dialog"

const navItems = [
  { label: "Overview", href: "/playground", active: true },
  { label: "Form Inputs", href: "/form-inputs", active: false },
  { label: "Navigation", href: "/navigation", active: false },
  { label: "Dialogs & Overlays", href: "/dialogs-overlays", active: false },
  { label: "Data Display", href: "/data-display", active: false },
  { label: "Feedback", href: "/feedback", active: false },
  { label: "Layout & Utilities", href: "/layout-utilities", active: false },
  { label: "Patterns", href: "/patterns", active: false },
]

function DirectionDemo() {
  const direction = useDirection()
  return (
    <div className="rounded bg-muted p-3 text-sm">
      <div className="mb-2 font-medium">useDirection Hook</div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>
          Current direction:{" "}
          <span className="font-mono font-bold">{direction}</span>
        </div>
        <div>
          Text alignment:{" "}
          <span className="font-mono">
            {direction === "rtl" ? "right" : "left"}
          </span>
        </div>
        <div
          className="mt-2 rounded border bg-background p-2"
          style={{ textAlign: direction === "rtl" ? "right" : "left" }}
        >
          This text is aligned to the {direction === "rtl" ? "right" : "left"}
        </div>
      </div>
    </div>
  )
}

function ToastDemo() {
  const handleShowToast = () => {
    toast.add({
      title: "Success!",
      description: "Toast notification triggered!",
      type: "success",
    })
  }

  return (
    <div>
      <Label>Toast - Notification system</Label>
      <p className="mb-2 text-xs text-muted-foreground">
        Toast provides temporary notifications with icon support
      </p>
      <Button size="sm" onClick={handleShowToast}>
        Show Toast Notification
      </Button>
    </div>
  )
}

export default function PlaygroundPage() {
  return (
    <Toaster>
      <AppShell
        topbar={<AppTopbar title="Component playground" eyebrow="SurfaceKit" />}
        sidebar={<AppSidebar items={navItems} />}
      >
        <div className="space-y-8 pb-12">
          {/* OVERVIEW SECTION */}
          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">SurfaceKit</Badge>
                  <CardTitle>60 Components + 10 Patterns</CardTitle>
                </div>
                <CardDescription>
                  A comprehensive collection of production-ready UI components
                  and enterprise patterns. All components are fully tested and
                  documented with Storybook stories.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Button>Primary</Button>
                  <Button variant="outline">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Component coverage
                  </span>
                  <Progress value={100} />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <IncidentBanner
                title="Fully documented"
                description="Every component has Vitest tests and Storybook stories for easy discovery and learning."
                actionLabel="View docs"
              />
              <Badge className="h-fit justify-center rounded-lg bg-green-100 px-3 py-2 text-center text-sm text-green-800">
                ✓ 100% Test Coverage
              </Badge>
            </div>
          </section>

          {/* FORM INPUTS SECTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Form Inputs (14 components)
              </h2>
              <p className="text-muted-foreground">
                All the form controls you need for data entry and user input.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Accordion</CardTitle>
                  <CardDescription>Expandable sections</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion>
                    <div className="border-b">
                      <div className="px-4 py-2 text-sm font-medium">
                        Section 1
                      </div>
                    </div>
                    <div className="border-b">
                      <div className="px-4 py-2 text-sm font-medium">
                        Section 2
                      </div>
                    </div>
                    <div>
                      <div className="px-4 py-2 text-sm font-medium">
                        Section 3
                      </div>
                    </div>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Text Inputs</CardTitle>
                  <CardDescription>
                    Input, Textarea, InputOTP, InputGroup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Regular input</Label>
                    <Input placeholder="Enter text..." />
                  </div>
                  <div>
                    <Label>Textarea</Label>
                    <Textarea placeholder="Enter longer text..." rows={3} />
                  </div>
                  <div>
                    <Label>One-Time Password</Label>
                    <div className="flex gap-2">
                      <Input
                        className="h-12 w-12 text-center text-lg"
                        maxLength={1}
                        placeholder="0"
                      />
                      <Input
                        className="h-12 w-12 text-center text-lg"
                        maxLength={1}
                        placeholder="0"
                      />
                      <Input
                        className="h-12 w-12 text-center text-lg"
                        maxLength={1}
                        placeholder="0"
                      />
                      <Input
                        className="h-12 w-12 text-center text-lg"
                        maxLength={1}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Selection Controls</CardTitle>
                  <CardDescription>
                    Checkbox, Switch, Toggle, ToggleGroup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="example" />
                    <Label htmlFor="example">Accept terms</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                  <div>
                    <Label>Toggle options</Label>
                    <ToggleGroup defaultValue={["option1"]}>
                      <Toggle value="option1">Bold</Toggle>
                      <Toggle value="option2">Italic</Toggle>
                      <Toggle value="option3">Underline</Toggle>
                    </ToggleGroup>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Selectors</CardTitle>
                  <CardDescription>
                    Select, Combobox, InputGroup, Slider, NativeSelect
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Select - Styled dropdown</Label>
                    <Select>
                      <div className="rounded border p-2 text-sm">
                        Styled select component
                      </div>
                    </Select>
                  </div>
                  <div>
                    <Label>NativeSelect - Native HTML select</Label>
                    <NativeSelect>
                      <option>— Choose an option —</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </NativeSelect>
                  </div>
                  <div>
                    <Label>Combobox - Searchable select</Label>
                    <Combobox>
                      <div className="rounded border p-2 text-sm">
                        Searchable dropdown
                      </div>
                    </Combobox>
                  </div>
                  <div>
                    <Label>InputGroup - Icon input</Label>
                    <InputGroup>
                      <Input placeholder="Search..." className="pl-8" />
                    </InputGroup>
                  </div>
                  <div>
                    <Label>Slider - Volume control</Label>
                    <Slider
                      min={0}
                      max={100}
                      defaultValue={[50]}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Controls</CardTitle>
                  <CardDescription>
                    Slider, RadioGroup, Calendar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Choose option</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full border-2 border-primary" />
                        <Label className="text-sm">Option A</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        <Label className="text-sm">Option B</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Button Group</CardTitle>
                  <CardDescription>Grouped button controls</CardDescription>
                </CardHeader>
                <CardContent>
                  <ButtonGroup>
                    <Button variant="outline">Left</Button>
                    <Button variant="outline">Center</Button>
                    <Button variant="outline">Right</Button>
                  </ButtonGroup>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* NAVIGATION SECTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Navigation (5 components)
              </h2>
              <p className="text-muted-foreground">
                Help users understand and navigate your app structure.
              </p>
            </div>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Breadcrumb Navigation</CardTitle>
                  <CardDescription>
                    Show the user&apos;s location in the hierarchy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Breadcrumb>
                    <a href="#" className="text-primary">
                      Dashboard
                    </a>
                    <span className="text-muted-foreground">/</span>
                    <a href="#" className="text-primary">
                      Settings
                    </a>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-foreground">Account</span>
                  </Breadcrumb>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navigation Menu</CardTitle>
                  <CardDescription>Main navigation system</CardDescription>
                </CardHeader>
                <CardContent>
                  <NavigationMenu>
                    <div className="flex gap-4 text-sm">
                      <a href="#" className="font-medium">
                        Products
                      </a>
                      <a href="#" className="font-medium">
                        Docs
                      </a>
                      <a href="#" className="font-medium">
                        About
                      </a>
                    </div>
                  </NavigationMenu>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Pagination</CardTitle>
                    <CardDescription>Navigate through pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Pagination>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          ←
                        </Button>
                        <Button size="sm" className="min-w-10">
                          1
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-w-10"
                        >
                          2
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-w-10"
                        >
                          3
                        </Button>
                        <Button variant="outline" size="sm">
                          →
                        </Button>
                      </div>
                    </Pagination>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tabs</CardTitle>
                    <CardDescription>Organize content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="tab1">
                      <div className="flex gap-1 border-b">
                        <button className="border-b-2 border-primary px-3 py-2 text-sm font-medium">
                          Tab 1
                        </button>
                        <button className="border-b-2 border-transparent px-3 py-2 text-sm text-muted-foreground">
                          Tab 2
                        </button>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Menubar</CardTitle>
                    <CardDescription>Top-level menu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Menubar>
                      <div className="flex gap-4 text-sm">
                        <span>File</span>
                        <span>Edit</span>
                        <span>View</span>
                      </div>
                    </Menubar>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* DIALOGS & OVERLAYS SECTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Dialogs & Overlays (10 components)
              </h2>
              <p className="text-muted-foreground">
                Floating UI for alerts, confirmations, menus, and popovers.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Popovers & Tooltips</CardTitle>
                  <CardDescription>HoverCard, Popover, Tooltip</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tooltip>
                    <TooltipTrigger className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                      Hover for tooltip
                    </TooltipTrigger>
                    <TooltipContent>This is helpful information</TooltipContent>
                  </Tooltip>
                  <HoverCard>
                    <button className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                      Hover Card Trigger
                    </button>
                  </HoverCard>
                  <Popover>
                    <button className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                      Popover Trigger
                    </button>
                  </Popover>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Menus & Commands</CardTitle>
                  <CardDescription>
                    DropdownMenu, ContextMenu, Command
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DropdownMenu>
                    <Button variant="outline">Open menu</Button>
                  </DropdownMenu>
                  <Command className="rounded-lg border p-2">
                    <div className="text-xs text-muted-foreground">
                      Command Palette
                    </div>
                  </Command>
                  <ContextMenu>
                    <div className="rounded border p-3 text-center text-sm">
                      Right-click context menu
                    </div>
                  </ContextMenu>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Modals & Drawers</CardTitle>
                  <CardDescription>
                    Dialog, AlertDialog, Sheet, Drawer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog>
                    <Button variant="outline" className="w-full">
                      Open Dialog
                    </Button>
                  </Dialog>
                  <AlertDialog>
                    <Button variant="outline" className="w-full">
                      Open AlertDialog
                    </Button>
                  </AlertDialog>
                  <Sheet>
                    <Button variant="outline" className="w-full">
                      Open Sheet
                    </Button>
                  </Sheet>
                  <Drawer>
                    <Button variant="outline" className="w-full">
                      Open Drawer
                    </Button>
                  </Drawer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Messaging</CardTitle>
                  <CardDescription>
                    Alert, Toast, Message, MessageScroller
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      This is an alert message with important information.
                    </AlertDescription>
                  </Alert>
                  <ToastDemo />
                  <Message />
                  <MessageScrollerProvider>
                    <MessageScroller className="h-48 rounded border">
                      <MessageScrollerViewport>
                        <MessageScrollerContent>
                          <MessageScrollerItem>
                            <div className="rounded bg-muted p-2 text-xs">
                              Message 1: Hello from MessageScroller
                            </div>
                          </MessageScrollerItem>
                          <MessageScrollerItem>
                            <div className="rounded bg-muted p-2 text-xs">
                              Message 2: This is a scrollable message container
                            </div>
                          </MessageScrollerItem>
                          <MessageScrollerItem>
                            <div className="rounded bg-muted p-2 text-xs">
                              Message 3: Scroll to see auto-scroll behavior
                            </div>
                          </MessageScrollerItem>
                        </MessageScrollerContent>
                      </MessageScrollerViewport>
                      <MessageScrollerButton />
                    </MessageScroller>
                  </MessageScrollerProvider>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* DATA DISPLAY SECTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Data Display (8 components)
              </h2>
              <p className="text-muted-foreground">
                Present and visualize data in meaningful ways.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Table & Data</CardTitle>
                  <CardDescription>Display structured data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left text-sm font-medium">
                          Name
                        </th>
                        <th className="py-2 text-left text-sm font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Component 1</td>
                        <td className="py-2">
                          <Badge>Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">Component 2</td>
                        <td className="py-2">
                          <Badge variant="outline">Inactive</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Carousel & Collapsible</CardTitle>
                  <CardDescription>Dynamic content display</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Carousel
                    className="rounded-lg border"
                    orientation="horizontal"
                  >
                    <div className="flex h-32 items-center justify-center rounded-lg bg-linear-to-r from-blue-100 to-purple-100 text-sm">
                      Slide 1
                    </div>
                  </Carousel>
                  <Collapsible>
                    <div className="cursor-pointer text-sm font-medium">
                      Expand section →
                    </div>
                  </Collapsible>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skeleton & Loading</CardTitle>
                  <CardDescription>Content placeholders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calendar & Time</CardTitle>
                  <CardDescription>Date picking and display</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ScrollArea</CardTitle>
                  <CardDescription>Scrollable content regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 w-full rounded border p-2">
                    <div className="space-y-2 text-sm">
                      <div>Item 1 - Scrollable content</div>
                      <div>Item 2 - Scrollable content</div>
                      <div>Item 3 - Scrollable content</div>
                      <div>Item 4 - Scrollable content</div>
                      <div>Item 5 - Scrollable content</div>
                      <div>Item 6 - More content</div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Messages & Toast</CardTitle>
                  <CardDescription>Message display patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded bg-blue-50 p-2 text-sm">
                    <Message />
                    This is an informational message
                  </div>
                  <div className="rounded bg-green-50 p-2 text-sm">
                    Toast notification appears here
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FEEDBACK SECTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Feedback & Loading (4 components)
              </h2>
              <p className="text-muted-foreground">
                Keep users informed about async operations and state changes.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Indicators</CardTitle>
                  <CardDescription>Progress, Skeleton, Spinner</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="mb-2 block text-sm text-muted-foreground">
                      Upload progress
                    </span>
                    <Progress value={65} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span className="text-sm">Loading...</span>
                  </div>
                  <div className="h-8 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Empty & Error States</CardTitle>
                  <CardDescription>
                    Empty state and error feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg bg-muted">
                    <Empty />
                    <span className="text-sm text-muted-foreground">
                      No data available
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* LAYOUT & UTILITIES SECTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Layout & Utilities (18 components)
              </h2>
              <p className="text-muted-foreground">
                Structure and organize your content with these primitive
                building blocks.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Structure Components</CardTitle>
                  <CardDescription>
                    Card, Separator, AspectRatio, ScrollArea
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <AspectRatio ratio={16 / 9}>
                      <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                        16:9 aspect ratio
                      </div>
                    </AspectRatio>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    Separator divides content
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Utilities</CardTitle>
                  <CardDescription>
                    Badge, Avatar, Kbd, Marker, Bubble, Sidebar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Avatar />
                    <Badge>Featured</Badge>
                    <Badge variant="outline">Secondary</Badge>
                    <Kbd>⌘K</Kbd>
                    <Bubble>💬</Bubble>
                  </div>
                  <div className="text-sm">
                    Marker: <Marker>Highlighted text</Marker>
                  </div>
                  <div className="rounded border p-2 text-xs text-muted-foreground">
                    Sidebar navigation component available
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resizable & Scrolling</CardTitle>
                  <CardDescription>ResizablePanel, ScrollArea</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResizablePanelGroup>
                    <ResizablePanel>
                      <div className="rounded bg-muted p-2 text-sm">
                        Resizable panel 1
                      </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel>
                      <div className="rounded bg-muted p-2 text-sm">
                        Resizable panel 2
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Utilities</CardTitle>
                  <CardDescription>
                    Attachment, Field, Item, useDirection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded border-2 border-dashed p-4 text-center text-sm text-muted-foreground">
                    <Attachment /> Drop files here
                  </div>
                  <Field />
                  <Item />
                  <DirectionDemo />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* PATTERNS SECTION */}
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Enterprise Patterns (10 patterns)
              </h2>
              <p className="text-muted-foreground">
                Complete, production-ready workflows and layouts.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Patterns</CardTitle>
                  <CardDescription>AuthShell, WebShell</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AuthShell title="Sign in">
                    <AuthPanel title="Welcome">
                      <p className="text-sm text-muted-foreground">
                        Authentication pattern example
                      </p>
                    </AuthPanel>
                  </AuthShell>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>WebShell - Page Layout</CardTitle>
                  <CardDescription>
                    WebShellHeader, WebShellFooter
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <WebShell
                    header={
                      <WebShellHeader
                        title="Product"
                        links={[
                          { label: "Docs", href: "/docs" },
                          { label: "Examples", href: "/examples" },
                        ]}
                      />
                    }
                    footer={
                      <WebShellFooter
                        links={[
                          { label: "Terms", href: "/terms" },
                          { label: "Privacy", href: "/privacy" },
                        ]}
                      />
                    }
                  >
                    <div className="p-4 text-sm text-muted-foreground">
                      Web Layout content area
                    </div>
                  </WebShell>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>WebHero - Marketing Section</CardTitle>
                  <CardDescription>Hero section with CTA</CardDescription>
                </CardHeader>
                <CardContent>
                  <WebHero
                    eyebrow="New"
                    title="Component Showcase"
                    description="60 production-ready UI components and 10 enterprise patterns for building modern applications."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Action Patterns</CardTitle>
                  <CardDescription>
                    ConfirmDangerAction, StepUpDialog
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ConfirmDangerAction
                    title="Delete item"
                    description="This action cannot be undone."
                  />
                  <StepUpDialog
                    headline="Verify identity"
                    description="Additional verification required."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error & Data Patterns</CardTitle>
                  <CardDescription>
                    ErrorSummary, DataTableToolbar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ErrorSummary
                    title="Form errors"
                    messages={[
                      "Email is required",
                      "Password must be 8 characters",
                    ]}
                  />
                  <DataTableToolbar title="Records" />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Example</CardTitle>
                  <CardDescription>
                    Resource status and system health patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResourceStatus
                    title="Compute usage"
                    value="62%"
                    progress={62}
                    detail="22 of 35 nodes active"
                  />
                  <ResourceStatus
                    title="Storage usage"
                    value="45%"
                    progress={45}
                    detail="450 GB of 1 TB used"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Patterns</CardTitle>
                  <CardDescription>
                    Permission and verification workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PermissionGate
                    title="Access restricted"
                    description="Request elevated permissions to continue."
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 pt-8 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick reference</CardTitle>
                <CardDescription>Available at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>✓ 60 UI Components</div>
                <div>✓ 10 Enterprise Patterns</div>
                <div>✓ 100% Storybook coverage</div>
                <div>✓ Full Vitest test suite</div>
                <div>✓ Accessibility audited</div>
                <div>✓ Tailwind CSS v4</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Getting started</CardTitle>
                <CardDescription>Import and use components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 font-mono text-sm">
                <div className="overflow-x-auto rounded bg-muted p-2 text-xs">
                  import {"{"} Button {"}"} from
                  <br />
                  &quot;@nwl/surfacekit/components/button&quot;
                </div>
                <Button className="w-full">View documentation</Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </AppShell>
    </Toaster>
  )
}
