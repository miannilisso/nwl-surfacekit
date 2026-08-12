import type { Meta, StoryObj } from "@storybook/react"

import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"

const meta = {
  title: "SurfaceKit/Patterns/DataTableToolbar",
  component: DataTableToolbar,
} satisfies Meta<typeof DataTableToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Team access",
  },
}
