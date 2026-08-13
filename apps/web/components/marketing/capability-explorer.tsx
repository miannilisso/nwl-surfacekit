"use client"

import Link from "next/link"
import * as React from "react"
import { Badge } from "@nwl/surfacekit/components/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nwl/surfacekit/components/tabs"

import type {
  SurfaceCatalogEntry,
  SurfaceCategory,
} from "../../lib/surfacekit/catalog"

type Category = Readonly<{
  id: SurfaceCategory
  name: string
  route: string
}>

export function CapabilityExplorer({
  categories,
  entries,
}: {
  categories: readonly Category[]
  entries: readonly SurfaceCatalogEntry[]
}) {
  const [selected, setSelected] = React.useState<SurfaceCategory>(
    categories[0]?.id ?? "form-inputs"
  )
  const selectedEntries = entries.filter((entry) => entry.category === selected)

  return (
    <Tabs
      value={selected}
      onValueChange={(value) => setSelected(value as SurfaceCategory)}
      className="space-y-6"
    >
      <div className="overflow-x-auto pb-2">
        <TabsList aria-label="SurfaceKit categories" variant="line">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={selected} className="mt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedEntries.map((entry) => (
            <Card key={entry.id} size="sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>
                    <Link
                      href={`${entry.route}#${entry.id}`}
                      className="rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {entry.name}
                    </Link>
                  </CardTitle>
                  <Badge variant="secondary">{entry.kind}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {entry.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
