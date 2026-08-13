"use client"

import Link from "next/link"
import * as React from "react"

import { Button } from "@nwl/surfacekit/components/button"
import { Input } from "@nwl/surfacekit/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@nwl/surfacekit/components/native-select"

import {
  surfaceCategories,
  type SurfaceCatalogEntry,
  type SurfaceCategory,
} from "../../lib/surfacekit/catalog"

export function CatalogSearch({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<SurfaceCategory | "all">("all")
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = entries.filter((entry) => {
    const matchesCategory = category === "all" || entry.category === category
    const searchable = [entry.name, entry.id, entry.description, entry.category]
      .join(" ")
      .toLowerCase()
    return matchesCategory && searchable.includes(normalizedQuery)
  })

  return (
    <section aria-labelledby="catalog-search-title" className="space-y-5">
      <div className="space-y-1">
        <h2
          id="catalog-search-title"
          className="text-2xl font-semibold tracking-tight"
        >
          Find an example
        </h2>
        <p className="text-sm text-muted-foreground">
          Search every public component and enterprise pattern.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem_auto]">
        <Input
          type="search"
          aria-label="Search SurfaceKit"
          placeholder="Search by name, ID, or capability"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <NativeSelect
          aria-label="Filter by category"
          className="w-full"
          value={category}
          onChange={(event) =>
            setCategory(event.currentTarget.value as SurfaceCategory | "all")
          }
        >
          <NativeSelectOption value="all">All categories</NativeSelectOption>
          {surfaceCategories.map((item) => (
            <NativeSelectOption key={item.id} value={item.id}>
              {item.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <Button
          type="button"
          variant="outline"
          disabled={!query}
          onClick={() => setQuery("")}
        >
          Clear search
        </Button>
      </div>
      <p aria-live="polite" className="text-sm font-medium">
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>
      {filtered.length ? (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((entry) => (
            <li key={entry.id}>
              <Link
                href={`${entry.route}#${entry.id}`}
                className="group block h-full rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <span className="font-medium group-hover:text-primary">
                  {entry.name}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {entry.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No SurfaceKit modules match your filters.
        </p>
      )}
    </section>
  )
}
