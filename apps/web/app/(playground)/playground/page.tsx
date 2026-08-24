import type { Metadata } from "next"
import Link from "next/link"

import { Badge } from "@nwl/surfacekit/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"

import { CatalogSearch } from "@/components/playground/catalog-search"
import {
  getSurfaceCounts,
  getSurfacesByCategory,
  surfaceCatalog,
  surfaceCategories,
} from "@/lib/surfacekit/catalog"

export const metadata: Metadata = {
  title: "SurfaceKit Playground",
  description:
    "Browse live, production-oriented examples for every SurfaceKit component and pattern.",
}

export default function PlaygroundPage() {
  const counts = getSurfaceCounts()

  return (
    <div className="mx-auto max-w-7xl space-y-12">
      <header className="space-y-4">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Component playground
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          Build production interfaces from one verified catalog. Explore real
          APIs, accessible interactions, resilient states, and enterprise
          compositions for all {counts.total} public SurfaceKit modules.
        </p>
        <div className="flex flex-wrap gap-2" aria-label="Catalog inventory">
          <Badge variant="secondary">{counts.components} components</Badge>
          <Badge variant="secondary">{counts.patterns} patterns</Badge>
          <Badge>{counts.total} live examples</Badge>
        </div>
      </header>

      <section aria-labelledby="category-title" className="space-y-5">
        <div className="space-y-1">
          <h2
            id="category-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Browse by category
          </h2>
          <p className="text-sm text-muted-foreground">
            Each route loads only the examples assigned to that category.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {surfaceCategories.map((category) => {
            const entries = getSurfacesByCategory(category.id)
            return (
              <Link key={category.id} href={category.route} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      {entries.length} live examples
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    {entries
                      .slice(0, 4)
                      .map((entry) => entry.name)
                      .join(", ")}
                    {entries.length > 4 ? ", and more." : "."}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <CatalogSearch entries={surfaceCatalog} />
    </div>
  )
}
