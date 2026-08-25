"use client"

import { Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { buttonVariants } from "@nwl/surfacekit/components/button"
import {
  AppShell,
  AppSidebar,
  AppTopbar,
} from "@nwl/surfacekit/patterns/app-shell"

import {
  getSurfaceCounts,
  getSurfacesByCategory,
  surfaceCategories,
} from "../../lib/surfacekit/catalog"

export function PlaygroundShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const counts = getSurfaceCounts()
  const current = surfaceCategories.find(({ route }) => route === pathname)
  const items = [
    {
      label: "Overview",
      href: "/playground",
      active: pathname === "/playground",
      badge: counts.total,
    },
    ...surfaceCategories.map((category) => ({
      label: category.name,
      href: category.route,
      active: pathname === category.route,
      badge: getSurfacesByCategory(category.id).length,
    })),
  ]

  return (
    <AppShell
      topbar={
        <AppTopbar
          eyebrow="SurfaceKit"
          title={current?.name ?? "Component catalog"}
          actions={
            <Link
              href="/playground"
              aria-label="Browse catalog"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Catalog
            </Link>
          }
        />
      }
      footer={
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">SurfaceKit</p>
            <p>Production UI foundations.</p>
          </div>
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "md:hidden",
            })}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      }
      sidebar={
        <AppSidebar
          label="Playground"
          items={items}
          footer={
            <Link
              href="/"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
          }
          renderItem={(item, anchorProps) => (
            <Link {...anchorProps} href={item.href ?? "/playground"} />
          )}
        />
      }
    >
      {children}
    </AppShell>
  )
}
