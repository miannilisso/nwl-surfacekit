"use client"

import * as React from "react"

import { Button } from "../../components/button"
import { Input } from "../../components/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../components/input-otp"
import { Label } from "../../components/label"
import { cn } from "../../lib/utils"

type SecurityChallengeMethod = "otp" | "recovery-code"
type SecurityChallengeState =
  "idle" | "pending" | "success" | "error" | "locked" | "expired"

const defaultMessages: Partial<Record<SecurityChallengeState, string>> = {
  pending: "Checking the request…",
  success: "The request may continue.",
  error: "That code could not be accepted. Try again.",
  locked: "This challenge is temporarily unavailable.",
  expired: "This challenge expired. Start again.",
}

interface SecurityChallengeProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> {
  method: SecurityChallengeMethod
  methods?: readonly SecurityChallengeMethod[]
  onMethodChange: (method: SecurityChallengeMethod) => void
  value: string
  onValueChange: (value: string) => void
  state?: SecurityChallengeState
  statusMessage?: React.ReactNode
  name?: string
  otpLength?: number
  onSubmit?: () => void
  onResend?: () => void
  footer?: React.ReactNode
}

function normalizeOtp(value: string, length: number) {
  return value.replace(/\D/g, "").slice(0, length)
}

function normalizeRecoveryCode(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "")
}

function SecurityChallenge({
  method,
  methods = ["otp", "recovery-code"],
  onMethodChange,
  value,
  onValueChange,
  state = "idle",
  statusMessage,
  name,
  otpLength = 6,
  onSubmit,
  onResend,
  footer,
  className,
  ...props
}: SecurityChallengeProps) {
  const controlRef = React.useRef<HTMLInputElement>(null)
  const isPending = state === "pending"
  const isAlert = state === "error" || state === "locked" || state === "expired"
  const message = statusMessage ?? defaultMessages[state]
  const previousMethod = React.useRef(method)

  React.useEffect(() => {
    if (previousMethod.current === method) return
    previousMethod.current = method
    controlRef.current?.focus()
  }, [method])

  const slots = Array.from({ length: otpLength }, (_, index) => index)
  const split = Math.ceil(otpLength / 2)

  return (
    <form
      aria-label="Security challenge"
      aria-busy={isPending || undefined}
      className={cn("space-y-4", className)}
      onSubmit={(event) => {
        event.preventDefault()
        if (!isPending) onSubmit?.()
      }}
      {...props}
    >
      <fieldset disabled={isPending} className="space-y-4">
        <legend className="font-heading text-lg font-semibold">
          Security challenge
        </legend>
        {methods.length > 1 ? (
          <div className="flex flex-wrap gap-3" aria-label="Challenge method">
            {methods.map((availableMethod) => (
              <Button
                key={availableMethod}
                type="button"
                variant={availableMethod === method ? "secondary" : "outline"}
                aria-pressed={availableMethod === method}
                onClick={() => onMethodChange(availableMethod)}
              >
                {availableMethod === "otp"
                  ? "Use a verification code"
                  : "Use a recovery code"}
              </Button>
            ))}
          </div>
        ) : null}
        <div className="space-y-2">
          {method === "otp" ? (
            <>
              <Label htmlFor="security-challenge-otp">Verification code</Label>
              <InputOTP
                ref={controlRef}
                id="security-challenge-otp"
                aria-label="Verification code"
                name={name ?? "verificationCode"}
                value={value}
                onChange={(nextValue) =>
                  onValueChange(normalizeOtp(nextValue, otpLength))
                }
                pasteTransformer={(pasted) => normalizeOtp(pasted, otpLength)}
                maxLength={otpLength}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              >
                <InputOTPGroup>
                  {slots.slice(0, split).map((index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
                {slots.length > 1 ? <InputOTPSeparator /> : null}
                <InputOTPGroup>
                  {slots.slice(split).map((index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </>
          ) : (
            <>
              <Label htmlFor="security-challenge-recovery">Recovery code</Label>
              <Input
                ref={controlRef}
                id="security-challenge-recovery"
                aria-label="Recovery code"
                name={name ?? "recoveryCode"}
                value={value}
                onChange={(event) =>
                  onValueChange(
                    normalizeRecoveryCode(event.currentTarget.value)
                  )
                }
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
              />
            </>
          )}
        </div>
        {message ? (
          <p
            role={isAlert ? "alert" : "status"}
            className="text-sm text-muted-foreground"
          >
            {message}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Continuing…" : "Continue"}
          </Button>
          {method === "otp" && onResend ? (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onResend}
            >
              Send another code
            </Button>
          ) : null}
        </div>
      </fieldset>
      {footer ? (
        <footer className="text-sm text-muted-foreground">{footer}</footer>
      ) : null}
    </form>
  )
}

export {
  SecurityChallenge,
  type SecurityChallengeMethod,
  type SecurityChallengeProps,
  type SecurityChallengeState,
}
