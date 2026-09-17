import * as React from "react"
import { renderToString } from "react-dom/server"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { SecurityChallenge } from "./security-challenge"

function Harness({ onSubmit = vi.fn(), onResend = vi.fn() }) {
  const [method, setMethod] = React.useState<"otp" | "recovery-code">("otp")
  const [values, setValues] = React.useState({
    otp: "",
    "recovery-code": "KEEP7",
  })
  return (
    <SecurityChallenge
      method={method}
      methods={["otp", "recovery-code"]}
      onMethodChange={setMethod}
      value={values[method]}
      onValueChange={(value) =>
        setValues((current) => ({ ...current, [method]: value }))
      }
      onSubmit={onSubmit}
      onResend={onResend}
    />
  )
}

describe("SecurityChallenge", () => {
  it("uses unique labelled control ids for multiple DOM and SSR instances", () => {
    const pair = (
      <>
        <SecurityChallenge
          method="otp"
          methods={["otp"]}
          onMethodChange={() => undefined}
          value=""
          onValueChange={() => undefined}
        />
        <SecurityChallenge
          method="otp"
          methods={["otp"]}
          onMethodChange={() => undefined}
          value=""
          onValueChange={() => undefined}
        />
      </>
    )

    function expectUniqueAssociations(container: ParentNode) {
      const labels = [...container.querySelectorAll("label")]
      const inputs = [...container.querySelectorAll<HTMLInputElement>("input")]
      expect(labels).toHaveLength(2)
      expect(inputs).toHaveLength(2)
      expect(inputs[0]?.id).toBeTruthy()
      expect(inputs[1]?.id).toBeTruthy()
      expect(inputs[0]?.id).not.toBe(inputs[1]?.id)
      expect(labels[0]?.htmlFor).toBe(inputs[0]?.id)
      expect(labels[1]?.htmlFor).toBe(inputs[1]?.id)
    }

    const serverContainer = document.createElement("div")
    serverContainer.innerHTML = renderToString(pair)
    expectUniqueAssociations(serverContainer)

    const { container } = render(pair)
    expectUniqueAssociations(container)
  })

  it("normalizes OTP typing and paste into a named one-time-code control", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const input = screen.getByRole("textbox", { name: "Verification code" })
    expect(input).toHaveAttribute("name", "verificationCode")
    expect(input).toHaveAttribute("autocomplete", "one-time-code")
    expect(input).toHaveAttribute("inputmode", "numeric")
    await user.click(input)
    await user.paste("12 a3-4567")
    expect(input).toHaveValue("123456")
  })

  it("switches methods, focuses the new control, and preserves caller-owned values", async () => {
    const user = userEvent.setup()
    render(<Harness />)
    expect(
      screen.getByRole("group", { name: "Challenge method" })
    ).toBeVisible()
    await user.click(
      screen.getByRole("button", { name: "Use a recovery code" })
    )
    const recovery = screen.getByRole("textbox", { name: "Recovery code" })
    expect(recovery).toHaveFocus()
    expect(recovery).toHaveValue("KEEP7")
    expect(recovery).toHaveAttribute("name", "recoveryCode")
    expect(recovery).toHaveAttribute("spellcheck", "false")
    expect(recovery).toHaveAttribute("autocapitalize", "none")
  })

  it("submits and resends as requests while announcing controlled states", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onResend = vi.fn()
    const { rerender } = render(
      <Harness onSubmit={onSubmit} onResend={onResend} />
    )
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.click(screen.getByRole("button", { name: "Send another code" }))
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onResend).toHaveBeenCalledOnce()

    rerender(
      <SecurityChallenge
        method="otp"
        methods={["otp", "recovery-code"]}
        onMethodChange={() => undefined}
        value="123456"
        onValueChange={() => undefined}
        state="error"
        statusMessage="That code could not be accepted. Try again."
      />
    )
    expect(screen.getByRole("alert")).toHaveTextContent(
      "That code could not be accepted. Try again."
    )
  })

  it.each([
    ["pending", "Checking the request…", "status"],
    ["success", "Challenge request completed.", "status"],
    ["error", "That code could not be accepted. Try again.", "alert"],
    ["locked", "This challenge is temporarily unavailable.", "alert"],
    ["expired", "This challenge expired. Start again.", "alert"],
  ] as const)(
    "provides a non-enumerating %s announcement",
    (state, message, role) => {
      render(
        <SecurityChallenge
          method="otp"
          methods={["otp"]}
          onMethodChange={() => undefined}
          value=""
          onValueChange={() => undefined}
          state={state}
        />
      )
      expect(screen.getByRole(role)).toHaveTextContent(message)
    }
  )

  it("blocks challenge requests while pending", () => {
    const onSubmit = vi.fn()
    render(
      <SecurityChallenge
        method="otp"
        methods={["otp"]}
        onMethodChange={() => undefined}
        value="123456"
        onValueChange={() => undefined}
        onSubmit={onSubmit}
        state="pending"
      />
    )

    const form = screen.getByRole("form", { name: "Security challenge" })
    expect(form).toHaveAttribute("aria-busy", "true")
    fireEvent.submit(form)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it.each(["locked", "expired"] as const)(
    "blocks submit and resend while %s and leaves restart actions available",
    (state) => {
      const onSubmit = vi.fn()
      const onResend = vi.fn()
      render(
        <SecurityChallenge
          method="otp"
          methods={["otp", "recovery-code"]}
          onMethodChange={() => undefined}
          value="123456"
          onValueChange={() => undefined}
          onSubmit={onSubmit}
          onResend={onResend}
          state={state}
          footer={<button type="button">Restart challenge</button>}
        />
      )

      const form = screen.getByRole("form", { name: "Security challenge" })
      const submit = screen.getByRole("button", { name: "Continue" })
      const resend = screen.getByRole("button", { name: "Send another code" })
      expect(submit).toBeDisabled()
      expect(resend).toBeDisabled()
      expect(
        screen.getByRole("button", { name: "Restart challenge" })
      ).toBeEnabled()
      fireEvent.submit(form)
      fireEvent.click(resend)
      expect(onSubmit).not.toHaveBeenCalled()
      expect(onResend).not.toHaveBeenCalled()
    }
  )
})
