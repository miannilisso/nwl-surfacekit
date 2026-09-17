import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { PasswordInput } from "./password-input"

describe("PasswordInput", () => {
  it("forwards a named controlled password input and its native attributes", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const ref = React.createRef<HTMLInputElement>()
    render(
      <PasswordInput
        ref={ref}
        name="password"
        aria-label="Password"
        value="secret"
        onChange={onChange}
        visible={false}
        onVisibleChange={() => undefined}
        autoComplete="current-password"
        required
      />
    )

    const input = screen.getByLabelText("Password")
    expect(input).toHaveAttribute("name", "password")
    expect(input).toHaveAttribute("type", "password")
    expect(input).toHaveAttribute("autocomplete", "current-password")
    expect(input).toBeRequired()
    expect(ref.current).toBe(input)
    await user.type(input, "x")
    expect(onChange).toHaveBeenCalled()
  })

  it("requests visibility changes without retaining the credential", async () => {
    const user = userEvent.setup()
    const onVisibleChange = vi.fn()
    const { rerender } = render(
      <PasswordInput
        name="newPassword"
        aria-label="New password"
        value="new-secret"
        onChange={() => undefined}
        visible={false}
        onVisibleChange={onVisibleChange}
        autoComplete="new-password"
      />
    )

    const toggle = screen.getByRole("button", { name: "Show password" })
    expect(toggle).toHaveAttribute("type", "button")
    expect(toggle).toHaveAttribute("aria-pressed", "false")
    await user.click(toggle)
    expect(onVisibleChange).toHaveBeenCalledWith(true)

    rerender(
      <PasswordInput
        name="newPassword"
        aria-label="New password"
        value="new-secret"
        onChange={() => undefined}
        visible
        onVisibleChange={onVisibleChange}
        autoComplete="new-password"
      />
    )
    expect(screen.getByLabelText("New password")).toHaveAttribute(
      "type",
      "text"
    )
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toHaveAttribute("aria-pressed", "true")
  })
})
