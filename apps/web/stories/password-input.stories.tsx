import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, userEvent, within } from "storybook/test"

import { Label } from "@nwl/surfacekit/components/label"
import { PasswordInput } from "@nwl/surfacekit/components/password-input"

function PasswordInputExample({
  autoComplete = "current-password",
  onVisibleChange = fn(),
}: {
  autoComplete?: "current-password" | "new-password"
  onVisibleChange?: (visible: boolean) => void
}) {
  const [value, setValue] = React.useState("")
  const [visible, setVisible] = React.useState(false)
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="storybook-password">
        {autoComplete === "new-password" ? "New password" : "Password"}
      </Label>
      <PasswordInput
        id="storybook-password"
        name="password"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        visible={visible}
        onVisibleChange={(nextVisible) => {
          setVisible(nextVisible)
          onVisibleChange(nextVisible)
        }}
        autoComplete={autoComplete}
      />
    </div>
  )
}

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Password Input",
  component: PasswordInputExample,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A controlled password field with password-manager semantics and a controlled visibility request.",
      },
    },
  },
} satisfies Meta<typeof PasswordInputExample>

export default meta
type Story = StoryObj<typeof meta>

export const CurrentPassword: Story = {
  args: { onVisibleChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText("Password")
    await userEvent.type(input, "correct horse")
    await expect(input).toHaveAttribute("type", "password")
    await userEvent.click(canvas.getByRole("button", { name: "Show password" }))
    await expect(input).toHaveAttribute("type", "text")
    await expect(args.onVisibleChange).toHaveBeenCalledWith(true)
  },
}

export const NewPassword: Story = {
  args: { autoComplete: "new-password" },
}
