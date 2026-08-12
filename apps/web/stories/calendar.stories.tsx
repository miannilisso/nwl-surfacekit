import type { Meta, StoryObj } from "@storybook/react-vite"

import { Calendar } from "@nwl/surfacekit/components/calendar"

const month = new Date(2026, 7, 1)

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Selects single dates, ranges, or multiple dates from an accessible calendar grid.",
      },
    },
  },
  args: { month },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { mode: "single" } }
export const Single: Story = {
  args: { mode: "single", selected: new Date(2026, 7, 13) },
}
export const Range: Story = {
  args: {
    mode: "range",
    selected: { from: new Date(2026, 7, 10), to: new Date(2026, 7, 15) },
  },
}
export const DisabledDates: Story = {
  args: {
    mode: "single",
    disabled: { before: new Date(2026, 7, 10), after: new Date(2026, 7, 24) },
  },
}
export const MultipleMonths: Story = {
  args: { mode: "single", numberOfMonths: 2 },
  parameters: { layout: "fullscreen" },
}
