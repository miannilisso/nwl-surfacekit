import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp"

function VerificationCode(props: { disabled?: boolean; invalid?: boolean }) {
  return (
    <InputOTP
      maxLength={6}
      aria-label="Verification code"
      disabled={props.disabled}
      aria-invalid={props.invalid}
    >
      <InputOTPGroup>
        {[0, 1, 2].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}

describe("InputOTP", () => {
  it("accepts digits, fills grouped slots, and enforces max length", async () => {
    const user = userEvent.setup()
    const { container } = render(<VerificationCode />)

    const input = screen.getByRole("textbox", { name: "Verification code" })
    await user.type(input, "1234567")
    expect(input).toHaveValue("123456")
    expect(
      container.querySelectorAll('[data-slot="input-otp-slot"]')
    ).toHaveLength(6)
    expect(
      container.querySelector('[data-slot="input-otp-separator"]')
    ).toHaveAttribute("role", "separator")
  })

  it("forwards invalid and disabled states to the input", () => {
    const { rerender } = render(<VerificationCode invalid />)
    expect(
      screen.getByRole("textbox", { name: "Verification code" })
    ).toHaveAttribute("aria-invalid", "true")

    rerender(<VerificationCode disabled />)
    expect(
      screen.getByRole("textbox", { name: "Verification code" })
    ).toBeDisabled()
  })
})
