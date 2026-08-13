"use client"

import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@nwl/surfacekit/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  elementRef,
  "aria-valuenow": ariaValueNow = 50,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  const observerRef = React.useRef<MutationObserver | null>(null)
  const setElementRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect()
      observerRef.current = null

      if (node) {
        const ensureValue = () => {
          if (!node.hasAttribute("aria-valuenow")) {
            node.setAttribute("aria-valuenow", String(ariaValueNow))
          }
        }
        ensureValue()
        observerRef.current = new MutationObserver(ensureValue)
        observerRef.current.observe(node, {
          attributes: true,
          attributeFilter: ["aria-valuenow"],
        })
      }
      if (typeof elementRef === "function") elementRef(node)
      else if (elementRef) {
        ;(elementRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node
      }
    },
    [ariaValueNow, elementRef]
  )

  React.useEffect(() => () => observerRef.current?.disconnect(), [])

  return (
    <ResizablePrimitive.Separator
      elementRef={setElementRef}
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:inset-s-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:inset-s-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 rtl:after:translate-x-1/2 rtl:aria-[orientation=horizontal]:after:translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
