"use client"

import * as React from "react"

import { Button } from "../../components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog"
import { cn } from "../../lib/utils"

interface StepUpDialogProps extends React.ComponentProps<"div"> {
  headline: string
  description: string
  primaryLabel?: string
  secondaryLabel?: string
  state?: "idle" | "pending" | "error"
  errorMessage?: string
  onCancel?: () => void
  onVerify?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialFocus?: React.ComponentProps<typeof DialogContent>["initialFocus"]
  finalFocus?: React.ComponentProps<typeof DialogContent>["finalFocus"]
}

function StepUpDialog({
  headline,
  description,
  primaryLabel = "Verify now",
  secondaryLabel = "Later",
  state = "idle",
  errorMessage,
  onCancel,
  onVerify,
  open,
  onOpenChange,
  initialFocus,
  finalFocus,
  className,
  children,
  ...props
}: StepUpDialogProps) {
  const pending = state === "pending"
  return (
    <Dialog
      open={open}
      defaultOpen={open === undefined ? true : undefined}
      disablePointerDismissal={pending}
      onOpenChange={(nextOpen, details) => {
        if (pending && !nextOpen) {
          details.cancel()
          return
        }
        onOpenChange?.(nextOpen)
      }}
    >
      <DialogContent
        aria-modal="true"
        data-slot="step-up-dialog"
        data-state={state}
        showCloseButton={!pending}
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        className={cn("max-h-[calc(100dvh-2rem)] overflow-y-auto", className)}
        {...props}
      >
        <DialogHeader>
          <DialogTitle>{headline}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        {state === "error" && errorMessage && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <DialogFooter>
          <DialogClose
            render={
              <Button
                variant="secondary"
                disabled={pending}
                onClick={onCancel}
              />
            }
          >
            {secondaryLabel}
          </DialogClose>
          <Button type="button" disabled={pending} onClick={onVerify}>
            {pending ? "Verifying…" : primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { StepUpDialog }
