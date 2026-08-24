"use client"

import { buttonVariants } from "@nwl/surfacekit/components/button"
import { ThemeSwitcher } from "@nwl/surfacekit/patterns/app-shell"
import Link from "next/link"

export function WebShellActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeSwitcher />
      <Link
        href="/playground"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Playground
      </Link>
    </div>
  )
}
