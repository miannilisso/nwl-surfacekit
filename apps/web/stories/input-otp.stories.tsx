import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@nwl/surfacekit/components/input-otp"
import { Label } from "@nwl/surfacekit/components/label"

type InputOTPExampleProps = {
  defaultValue?: string
  disabled?: boolean
  grouped?: boolean
  invalid?: boolean
}

function InputOTPExample({
  defaultValue,
  disabled,
  grouped = false,
  invalid,
}: InputOTPExampleProps) {
  const firstSlots = grouped ? [0, 1, 2] : [0, 1, 2, 3, 4, 5]

  return (
    <div className="grid gap-2">
      <Label htmlFor="verification-code">Verification code</Label>
      <InputOTP
        id="verification-code"
        maxLength={6}
        aria-label="Verification code"
        aria-invalid={invalid}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        <InputOTPGroup>
          {firstSlots.map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
        {grouped && (
          <>
            <InputOTPSeparator />
            <InputOTPGroup>
              {[3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </>
        )}
      </InputOTP>
    </div>
  )
}

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Input OTP",
  component: InputOTPExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Collects short verification codes in accessible, visually grouped slots.",
      },
    },
  },
} satisfies Meta<typeof InputOTPExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Verification code",
    })
    await userEvent.type(input, "483921")
    await expect(input).toHaveValue("483921")
  },
}

export const Grouped: Story = { args: { grouped: true } }

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "123456" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "483921" },
}
