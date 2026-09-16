"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Button } from "../components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../components/sheet"
import { cn } from "../lib/utils"

interface MobileNavigationOptions {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  routeKey?: React.Key
  title?: string
  triggerLabel?: string
  closeLabel?: string
}

interface MobileNavigationProps {
  navigation: React.ReactNode
  options: MobileNavigationOptions
  defaultTitle: string
  defaultTriggerLabel: string
  triggerClassName?: string
  contentClassName?: string
}

function MobileNavigation({
  navigation,
  options,
  defaultTitle,
  defaultTriggerLabel,
  triggerClassName,
  contentClassName,
}: MobileNavigationProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const isControlled = options.open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    options.defaultOpen ?? false
  )
  const open = isControlled ? options.open : uncontrolledOpen
  const previousOpen = React.useRef(open)
  const onOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen)
      options.onOpenChange?.(nextOpen)
    },
    [isControlled, options]
  )
  const previousRouteKey = React.useRef(options.routeKey)

  React.useEffect(() => {
    const shouldRestoreFocus = previousOpen.current && !open
    previousOpen.current = open
    if (!shouldRestoreFocus) return

    const timeout = window.setTimeout(() => triggerRef.current?.focus(), 0)
    return () => window.clearTimeout(timeout)
  }, [open])

  React.useEffect(() => {
    if (Object.is(previousRouteKey.current, options.routeKey)) return
    previousRouteKey.current = options.routeKey
    if (!open) return

    const frame = requestAnimationFrame(() => onOpenChange(false))
    return () => cancelAnimationFrame(frame)
  }, [onOpenChange, open, options.routeKey])

  const title = options.title ?? defaultTitle

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={
          <Button
            ref={triggerRef}
            aria-label={options.triggerLabel ?? defaultTriggerLabel}
            className={cn("md:hidden", triggerClassName)}
            size="icon"
            variant="ghost"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        finalFocus={triggerRef}
        side="left"
        closeLabel={options.closeLabel ?? `Close ${title.toLowerCase()}`}
        className={cn(
          "h-dvh w-[min(20rem,calc(100%-1rem))] max-w-full overflow-y-auto overscroll-contain p-4 ps-[max(1rem,var(--safe-area-left))] pe-[max(1rem,var(--safe-area-right))] pt-[max(1rem,var(--safe-area-top))] pb-[max(1rem,var(--safe-area-bottom))]",
          contentClassName
        )}
        onClickCapture={(event) => {
          const target = event.target
          if (
            target instanceof Element &&
            target.closest("a[href], [data-mobile-navigation-dismiss]")
          ) {
            onOpenChange(false)
          }
        }}
      >
        <SheetTitle className="pe-12">{title}</SheetTitle>
        <SheetDescription className="sr-only">
          Choose a destination, then the navigation panel will close.
        </SheetDescription>
        <div className="min-h-0 flex-1 pt-6 [&_a[href]]:min-h-11 [&_a[href]]:min-w-11">
          {navigation}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNavigation, type MobileNavigationOptions }
