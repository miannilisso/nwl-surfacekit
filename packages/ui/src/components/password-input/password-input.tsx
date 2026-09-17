"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../input-group"

type PasswordAutocomplete = "current-password" | "new-password"

interface PasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange" | "autoComplete"
> {
  name: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  autoComplete: PasswordAutocomplete
  showLabel?: string
  hideLabel?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      value,
      onChange,
      visible,
      onVisibleChange,
      autoComplete,
      showLabel = "Show password",
      hideLabel = "Hide password",
      disabled,
      ...props
    },
    ref
  ) {
    const label = visible ? hideLabel : showLabel
    return (
      <InputGroup data-disabled={disabled || undefined}>
        <InputGroupInput
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label={label}
            aria-pressed={visible}
            disabled={disabled}
            onClick={() => onVisibleChange(!visible)}
            size="icon-xs"
          >
            {visible ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
  }
)

export { PasswordInput, type PasswordAutocomplete, type PasswordInputProps }
