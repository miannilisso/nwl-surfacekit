"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@nwl/surfacekit/components/attachment"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@nwl/surfacekit/components/avatar"
import { Badge } from "@nwl/surfacekit/components/badge"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@nwl/surfacekit/components/bubble"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@nwl/surfacekit/components/carousel"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@nwl/surfacekit/components/chart"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@nwl/surfacekit/components/item"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@nwl/surfacekit/components/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@nwl/surfacekit/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@nwl/surfacekit/components/message-scroller"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@nwl/surfacekit/components/progress"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@nwl/surfacekit/components/table"

export function AttachmentDemo() {
  const [status, setStatus] = React.useState("Ready")
  return (
    <div className="grid gap-3">
      <Attachment state="done">
        <AttachmentMedia variant="icon">
          <span aria-hidden="true">PDF</span>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
          <AttachmentDescription>
            2.4 MB · Upload complete
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentTrigger
          aria-label="Open quarterly report"
          onClick={() => setStatus("Report opened")}
        />
        <AttachmentActions>
          <AttachmentAction
            aria-label="Remove quarterly report"
            onClick={() => setStatus("Report removed")}
          >
            ×
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {status}
      </p>
    </div>
  )
}

export function AvatarDemo() {
  return (
    <AvatarGroup role="group" aria-label="Release team">
      <Avatar role="img" aria-label="Amina N., online">
        <AvatarFallback>AN</AvatarFallback>
        <AvatarBadge aria-hidden="true" className="bg-emerald-500" />
      </Avatar>
      <Avatar role="img" aria-label="Grace H.">
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <Avatar role="img" aria-label="Hedy L.">
        <AvatarFallback>HL</AvatarFallback>
      </Avatar>
      <AvatarGroupCount role="img" aria-label="4 more team members">
        +4
      </AvatarGroupCount>
    </AvatarGroup>
  )
}

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Production</Badge>
      <Badge variant="secondary">Approved</Badge>
      <Badge variant="outline">v10.5.7</Badge>
      <Badge variant="destructive">Action required</Badge>
    </div>
  )
}

export function BubbleDemo() {
  return (
    <BubbleGroup aria-label="Release conversation" className="w-full max-w-xl">
      <Bubble align="start" variant="secondary">
        <BubbleContent>Can you review the release evidence?</BubbleContent>
      </Bubble>
      <Bubble align="end" variant="default">
        <BubbleContent>The release is approved for production.</BubbleContent>
        <BubbleReactions>
          <button type="button">👍 3</button>
        </BubbleReactions>
      </Bubble>
    </BubbleGroup>
  )
}

export function CardDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Production release</CardTitle>
        <CardDescription>Version 10.5.7 is ready to review.</CardDescription>
        <CardAction>
          <Button size="sm">Review</Button>
        </CardAction>
      </CardHeader>
      <CardContent>All package and browser quality gates pass.</CardContent>
      <CardFooter>Updated a few seconds ago</CardFooter>
    </Card>
  )
}

export function CarouselDemo() {
  const releases = ["Identity controls", "Audit exports", "Regional failover"]
  return (
    <Carousel
      aria-label="Release highlights"
      className="w-full max-w-[34rem] px-10"
      opts={{ align: "start" }}
    >
      <CarouselContent>
        {releases.map((release, index) => (
          <CarouselItem
            aria-label={`${index + 1} of ${releases.length}`}
            key={release}
          >
            <article className="grid h-44 place-items-center rounded-3xl border bg-card p-6 text-center">
              <div>
                <p className="text-xs text-muted-foreground">
                  Release {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-medium">{release}</h3>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  )
}

const chartData = [
  { month: "Jan", requests: 4200, errors: 72 },
  { month: "Feb", requests: 5100, errors: 61 },
  { month: "Mar", requests: 6800, errors: 48 },
  { month: "Apr", requests: 7400, errors: 39 },
]
const chartConfig = {
  requests: { label: "API requests", color: "#5b6ee1" },
  errors: { label: "Errors", color: "#c0262d" },
} satisfies ChartConfig

export function ChartDemo() {
  return (
    <figure className="w-full max-w-2xl rounded-3xl border bg-card p-5">
      <figcaption className="mb-4">
        <h3 className="text-lg font-medium">Production traffic</h3>
        <p className="text-sm text-muted-foreground">
          Requests and errors by month
        </p>
      </figcaption>
      <ChartContainer
        config={chartConfig}
        className="h-72 w-full"
        initialDimension={{ width: 640, height: 288 }}
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="requests" fill="var(--color-requests)" radius={8} />
          <Bar dataKey="errors" fill="var(--color-errors)" radius={8} />
        </BarChart>
      </ChartContainer>
    </figure>
  )
}

export function ItemDemo() {
  return (
    <Item variant="outline" className="w-full max-w-xl">
      <ItemHeader>
        <span>Active</span>
        <span>Production</span>
      </ItemHeader>
      <ItemMedia variant="icon" aria-hidden="true">
        ◇
      </ItemMedia>
      <ItemContent>
        <ItemTitle>SurfaceKit</ItemTitle>
        <ItemDescription>
          Accessible components for enterprise product teams.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Archive
        </Button>
      </ItemActions>
      <ItemFooter>
        <span>Updated today</span>
        <span>v10.5.7</span>
      </ItemFooter>
    </Item>
  )
}

export function MarkerDemo() {
  return (
    <div className="w-full max-w-md space-y-5">
      <Marker variant="default">
        <MarkerIcon>●</MarkerIcon>
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>●</MarkerIcon>
        <MarkerContent>Unread messages</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>●</MarkerIcon>
        <MarkerContent>Release approved</MarkerContent>
      </Marker>
    </div>
  )
}

export function MessageDemo() {
  return (
    <Message align="start" className="w-full max-w-xl">
      <MessageAvatar aria-label="Amina">A</MessageAvatar>
      <MessageContent>
        <MessageHeader>Amina N.</MessageHeader>
        <BubbleGroup>
          <Bubble align="start" variant="secondary">
            <BubbleContent>Is the release evidence ready?</BubbleContent>
          </Bubble>
        </BubbleGroup>
        <MessageFooter>09:41 · Delivered</MessageFooter>
      </MessageContent>
    </Message>
  )
}

export function MessageScrollerDemo() {
  return (
    <div className="h-72 w-full max-w-xl overflow-hidden rounded-3xl border bg-card">
      <MessageScrollerProvider defaultScrollPosition="end">
        <MessageScroller>
          <MessageScrollerViewport aria-label="Release conversation">
            <MessageScrollerContent className="p-4">
              {Array.from({ length: 10 }, (_, index) => (
                <MessageScrollerItem
                  messageId={`release-message-${index + 1}`}
                  scrollAnchor={index === 9}
                  key={index}
                >
                  <article className="mb-2 rounded-2xl bg-muted p-3 text-sm">
                    Release evidence update {index + 1}
                  </article>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

export function ProgressDemo() {
  return (
    <Progress value={64} className="w-full max-w-md">
      <ProgressLabel>Release progress</ProgressLabel>
      <ProgressValue />
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  )
}

export function TableDemo() {
  const rows = [
    ["Production API", "Healthy", "99.99%", "Nairobi"],
    ["Customer portal", "Healthy", "99.97%", "Frankfurt"],
    ["Audit exports", "Degraded", "98.82%", "Virginia"],
  ]
  return (
    <Table>
      <TableCaption>
        Service health for the current reporting window.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Region</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(([service, status, availability, region]) => (
          <TableRow key={service}>
            <TableCell className="font-medium">{service}</TableCell>
            <TableCell>{status}</TableCell>
            <TableCell>{availability}</TableCell>
            <TableCell>{region}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Fleet average</TableCell>
          <TableCell>99.59%</TableCell>
          <TableCell>Global</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
