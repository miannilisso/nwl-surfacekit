"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@nwl/surfacekit/components/accordion"
import { AspectRatio } from "@nwl/surfacekit/components/aspect-ratio"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@nwl/surfacekit/components/collapsible"
import {
  DirectionProvider,
  useDirection,
} from "@nwl/surfacekit/components/direction"
import { Kbd, KbdGroup } from "@nwl/surfacekit/components/kbd"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@nwl/surfacekit/components/resizable"
import { ScrollArea, ScrollBar } from "@nwl/surfacekit/components/scroll-area"
import { Separator } from "@nwl/surfacekit/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@nwl/surfacekit/components/sidebar"

export function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-xl">
      <AccordionItem value="profile">
        <AccordionTrigger>Profile and access</AccordionTrigger>
        <AccordionContent>
          Manage identity and access controls.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing and invoices</AccordionTrigger>
        <AccordionContent>
          Manage billing contacts and invoices.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="archived" disabled>
        <AccordionTrigger>Archived settings</AccordionTrigger>
        <AccordionContent>Archived workspace settings.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function AspectRatioDemo() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-muted">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center bg-linear-to-br from-primary/15 via-background to-primary/35 font-medium">
          16:9 media frame
        </div>
      </AspectRatio>
    </div>
  )
}

export function CollapsibleDemo() {
  return (
    <Collapsible>
      <CollapsibleTrigger render={<Button variant="outline" />}>
        Audit details
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 max-w-sm rounded-xl border p-4 text-sm">
        Last reviewed by the Security team on 12 August.
      </CollapsibleContent>
    </Collapsible>
  )
}

function DirectionSample() {
  const direction = useDirection()
  return (
    <section dir={direction} className="w-full max-w-sm rounded-2xl border p-4">
      <p className="font-medium">مساحة العمل</p>
      <p className="mt-2 text-sm text-muted-foreground">
        مرحبا بكم في مساحة العمل
      </p>
      <output className="mt-3 block text-xs">Direction: {direction}</output>
    </section>
  )
}

export function DirectionDemo() {
  return (
    <DirectionProvider direction="rtl">
      <DirectionSample />
    </DirectionProvider>
  )
}

export function KbdDemo() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span>Open command menu</span>
      <KbdGroup aria-label="Control plus K">
        <Kbd>Ctrl</Kbd>
        <span aria-hidden="true">+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  )
}

export function ResizableDemo() {
  return (
    <div className="h-72 w-full max-w-2xl overflow-hidden rounded-3xl border">
      <ResizablePanelGroup
        aria-label="Workspace layout"
        orientation="horizontal"
        defaultLayout={{ navigation: 35, content: 65 }}
      >
        <ResizablePanel id="navigation" defaultSize="35%">
          <div className="flex size-full items-center justify-center bg-muted/50 p-4">
            Navigation
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          aria-label="Resize workspace panels"
          aria-valuenow={35}
        />
        <ResizablePanel id="content" defaultSize="65%">
          <div className="flex size-full items-center justify-center p-4">
            Workspace content
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function ScrollAreaDemo() {
  return (
    <ScrollArea
      aria-label="Audit events"
      className="h-72 w-full max-w-xl rounded-3xl border"
    >
      <div className="w-[52rem] p-4">
        <a
          href="#audit-event-1"
          className="mb-3 inline-block text-sm font-medium underline underline-offset-4"
        >
          Review first audit event
        </a>
        {Array.from({ length: 12 }, (_, index) => (
          <article className="mb-2 rounded-xl bg-muted/50 p-3" key={index}>
            <p className="font-medium">Audit event {index + 1}</p>
            <p className="text-sm text-foreground/80">
              Production policy updated with regional approval evidence.
            </p>
          </article>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div>
        <p className="font-medium">SurfaceKit</p>
        <p className="text-sm text-muted-foreground">
          Production UI primitives
        </p>
      </div>
      <Separator aria-label="Package details" />
      <div className="flex h-6 items-center gap-3 text-sm">
        <span>Components</span>
        <Separator orientation="vertical" aria-label="Navigation divider" />
        <span>Patterns</span>
      </div>
    </div>
  )
}

export function SidebarDemo() {
  return (
    <div className="h-80 w-full max-w-3xl overflow-hidden rounded-3xl border">
      <SidebarProvider className="min-h-80">
        <Sidebar collapsible="icon" className="absolute h-80">
          <SidebarHeader className="font-medium">
            Enterprise workspace
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Overview</SidebarMenuButton>
                    <SidebarMenuBadge>4</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Deployments</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Production</SidebarFooter>
        </Sidebar>
        <SidebarInset className="min-h-80" role="presentation">
          <header className="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <h3 className="font-medium">Release governance</h3>
          </header>
          <div className="p-6 text-sm text-muted-foreground">
            Audit evidence and approval status.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
