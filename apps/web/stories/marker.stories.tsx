import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@nwl/surfacekit/components/marker"

function MarkerExample({
  variant = "default",
  content = "Today",
}: {
  variant?: "default" | "separator" | "border"
  content?: string
}) {
  return (
    <Marker variant={variant}>
      <MarkerIcon>●</MarkerIcon>
      <MarkerContent>{content}</MarkerContent>
    </Marker>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Marker",
  component: MarkerExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Labels a point, boundary, or section in a timeline with decorative icon and separator variants.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MarkerExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Variants: Story = {
  render: () => (
    <div className="space-y-5">
      <MarkerExample />
      <MarkerExample variant="separator" />
      <MarkerExample variant="border" />
    </div>
  ),
}
export const WithContent: Story = {
  args: { variant: "separator", content: "Unread messages" },
}
