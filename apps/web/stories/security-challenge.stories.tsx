import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, userEvent, within } from "storybook/test"

import {
  SecurityChallenge,
  type SecurityChallengeMethod,
  type SecurityChallengeState,
} from "@nwl/surfacekit/patterns/security-challenge"

function SecurityChallengeExample({
  initialMethod = "otp",
  state = "idle",
  statusMessage,
  onSubmit = fn(),
  onResend = fn(),
}: {
  initialMethod?: SecurityChallengeMethod
  state?: SecurityChallengeState
  statusMessage?: string
  onSubmit?: () => void
  onResend?: () => void
}) {
  const [method, setMethod] = React.useState(initialMethod)
  const [values, setValues] = React.useState({
    otp: "",
    "recovery-code": "RECOVERY7",
  })
  return (
    <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-sm">
      <SecurityChallenge
        method={method}
        methods={["otp", "recovery-code"]}
        onMethodChange={setMethod}
        value={values[method]}
        onValueChange={(value) =>
          setValues((current) => ({ ...current, [method]: value }))
        }
        state={state}
        statusMessage={statusMessage}
        onSubmit={onSubmit}
        onResend={onResend}
        footer="The consuming application validates codes and handles the resulting request."
      />
    </div>
  )
}

const meta = {
  title: "SurfaceKit/Patterns/Security Challenge",
  component: SecurityChallengeExample,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A controlled OTP and recovery-code request surface with accessible switching, paste normalization, and live states.",
      },
    },
  },
} satisfies Meta<typeof SecurityChallengeExample>

export default meta
type Story = StoryObj<typeof meta>

export const OTP: Story = { args: { onSubmit: fn(), onResend: fn() } }
export const RecoveryCode: Story = { args: { initialMethod: "recovery-code" } }
export const MethodSwitching: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Use a recovery code" })
    )
    await expect(canvas.getByLabelText("Recovery code")).toHaveFocus()
    await expect(canvas.getByLabelText("Recovery code")).toHaveValue(
      "RECOVERY7"
    )
  },
}
export const Pending: Story = {
  args: { state: "pending", statusMessage: "Checking the request…" },
}
export const Success: Story = {
  args: { state: "success", statusMessage: "Challenge request completed." },
}
export const Error: Story = {
  args: {
    state: "error",
    statusMessage: "That code could not be accepted. Try again.",
  },
}
export const Locked: Story = {
  args: {
    state: "locked",
    statusMessage: "This challenge is temporarily unavailable.",
  },
}
export const Expired: Story = {
  args: {
    state: "expired",
    statusMessage: "This challenge expired. Start again.",
  },
}
