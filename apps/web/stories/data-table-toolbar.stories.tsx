import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, fn, userEvent, within } from "storybook/test"

import { DataTableToolbar } from "@nwl/surfacekit/patterns/data-table-toolbar"

function ToolbarExample({
  initialValue = "",
  count = 24,
  busy = false,
  onCreate = fn(),
  onFilter = fn(),
  onExport = fn(),
}: {
  initialValue?: string
  count?: number
  busy?: boolean
  onCreate?: () => void
  onFilter?: () => void
  onExport?: () => void
}) {
  const [searchValue, setSearchValue] = React.useState(initialValue)
  return (
    <div className="w-[48rem] max-w-[calc(100vw-2rem)]">
      <DataTableToolbar
        title="Team access"
        count={count}
        searchLabel="Search team access"
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onCreate={onCreate}
        onFilter={onFilter}
        onExport={onExport}
        busy={busy}
      />
    </div>
  )
}
const meta = {
  title: "SurfaceKit/Patterns/Data Table Toolbar",
  component: ToolbarExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Coordinates controlled search, result count, filtering, export, creation, and busy state above enterprise data tables.",
      },
    },
  },
} satisfies Meta<typeof ToolbarExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  args: { onCreate: fn(), onFilter: fn(), onExport: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Search team access" }),
      "amina"
    )
    await expect(
      canvas.getByRole("textbox", { name: "Search team access" })
    ).toHaveValue("amina")
    await userEvent.click(canvas.getByRole("button", { name: "Filter" }))
    await expect(args.onFilter).toHaveBeenCalledOnce()
  },
}
export const Filtered: Story = {
  args: { initialValue: "administrator", count: 4 },
}
export const Empty: Story = { args: { initialValue: "no-match", count: 0 } }
export const Busy: Story = { args: { busy: true } }
