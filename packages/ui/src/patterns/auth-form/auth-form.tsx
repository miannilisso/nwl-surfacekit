"use client"

import * as React from "react"

import { Button } from "../../components/button"
import { cn } from "../../lib/utils"

type AuthFormState =
  "idle" | "pending" | "success" | "error" | "locked" | "expired"

interface AuthFormProps extends Omit<
  React.ComponentProps<"form">,
  "title" | "onSubmit"
> {
  title: React.ReactNode
  description?: React.ReactNode
  state?: AuthFormState
  statusMessage?: React.ReactNode
  submitLabel?: React.ReactNode
  pendingLabel?: React.ReactNode
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  alternativeActions?: React.ReactNode
  secondaryActions?: React.ReactNode
  footer?: React.ReactNode
}

const defaultMessages: Partial<Record<AuthFormState, string>> = {
  pending: "Request in progress.",
  success: "Request completed.",
  error:
    "We could not complete that request. Review the details and try again.",
  locked:
    "This request is temporarily unavailable. Try again later or use another recovery option.",
  expired: "This request expired. Start again.",
}

function AuthForm({
  title,
  description,
  state = "idle",
  statusMessage,
  submitLabel = "Continue",
  pendingLabel = "Continuing…",
  onSubmit,
  alternativeActions,
  secondaryActions,
  footer,
  className,
  children,
  ...props
}: AuthFormProps) {
  const titleId = React.useId()
  const descriptionId = React.useId()
  const isPending = state === "pending"
  const isAlert = state === "error" || state === "locked" || state === "expired"
  const message = statusMessage ?? defaultMessages[state]

  return (
    <form
      aria-busy={isPending || undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn("space-y-6", className)}
      onSubmit={(event) => {
        if (isPending) {
          event.preventDefault()
          return
        }
        onSubmit?.(event)
      }}
      {...props}
    >
      <fieldset
        disabled={isPending}
        aria-labelledby={titleId}
        className="space-y-4"
      >
        <legend id={titleId} className="font-heading text-lg font-semibold">
          {title}
        </legend>
        {description ? (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="space-y-4">{children}</div>
        {message ? (
          <p
            role={isAlert ? "alert" : "status"}
            className="text-sm text-muted-foreground"
          >
            {message}
          </p>
        ) : null}
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </fieldset>
      {alternativeActions ? (
        <div className="grid gap-3">{alternativeActions}</div>
      ) : null}
      {secondaryActions ? (
        <div className="flex flex-wrap gap-3">{secondaryActions}</div>
      ) : null}
      {footer ? (
        <footer className="text-sm text-muted-foreground">{footer}</footer>
      ) : null}
    </form>
  )
}

export { AuthForm, type AuthFormProps, type AuthFormState }
