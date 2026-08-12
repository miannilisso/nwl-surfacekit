import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@nwl/surfacekit/components/badge"

const meta = {
  title: "SurfaceKit/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  args: { children: "Production" },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {["default", "secondary", "destructive", "outline", "ghost", "link"].map(
        (variant) => (
          <Badge
            key={variant}
            variant={variant as React.ComponentProps<typeof Badge>["variant"]}
          >
            {variant}
          </Badge>
        )
      )}
    </div>
  ),
}

export const AsLink: Story = {
  render: () => (
    <Badge render={<a href="#release-notes" />} variant="outline">
      Read release notes
    </Badge>
  ),
}
