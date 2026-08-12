import type { Meta } from "@storybook/react-vite"
import { Suspense, type ComponentProps } from "react"
import { InputOTP } from "@nwl/surfacekit/components/input-otp"

const meta: Meta<typeof InputOTP> = {
  title: "SurfaceKit/Input Otp",
  component: InputOTP,
  args: { defaultValue: ["1", "2", "3", "4"] },
  render: (args: ComponentProps<typeof InputOTP>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <InputOTP {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

export const Default = {}
