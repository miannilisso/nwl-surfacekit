import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { Button } from "@nwl/surfacekit/components/button"

const meta = {
  title: "SurfaceKit/Button",
  component: Button,
  parameters: { layout: "centered" },
  args: {
    children: "Save changes",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Save changes" }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {["default", "outline", "secondary", "ghost", "destructive", "link"].map(
        (variant) => (
          <Button
            key={variant}
            variant={variant as React.ComponentProps<typeof Button>["variant"]}
          >
            {variant}
          </Button>
        )
      )}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  args: { children: "Saving…", disabled: true },
}

export const AsLink: Story = {
  render: () => (
    <Button render={<a href="#documentation" />} nativeButton={false}>
      View documentation
    </Button>
  ),
}

export const Destructive: Story = {
  args: { children: "Delete workspace", variant: "destructive" },
}
