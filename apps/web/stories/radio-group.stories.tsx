import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import { Label } from "@nwl/surfacekit/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@nwl/surfacekit/components/radio-group"

const options = ["Starter", "Growth", "Enterprise"]

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Selects one mutually exclusive option with pointer and arrow-key navigation.",
      },
    },
  },
  args: { defaultValue: "starter", "aria-label": "Subscription plan" },
  render: (args) => (
    <RadioGroup {...args}>
      {options.map((option) => {
        const value = option.toLowerCase()
        return (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem id={`plan-${value}`} value={value} />
            <Label htmlFor={`plan-${value}`}>{option}</Label>
          </div>
        )
      })}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const starter = canvas.getByRole("radio", { name: "Starter" })
    starter.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(canvas.getByRole("radio", { name: "Growth" })).toBeChecked()
  },
}

export const Horizontal: Story = {
  args: { className: "grid-flow-col", "aria-label": "Billing interval" },
  render: (args) => (
    <RadioGroup {...args}>
      {[
        ["monthly", "Monthly"],
        ["annual", "Annual"],
      ].map(([value, label]) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem id={value} value={value} />
          <Label htmlFor={value}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
}

export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="starter-disabled-story" value="starter" />
        <Label htmlFor="starter-disabled-story">Starter</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem
          id="enterprise-disabled-story"
          value="enterprise"
          disabled
        />
        <Label htmlFor="enterprise-disabled-story">
          Enterprise (unavailable)
        </Label>
      </div>
    </RadioGroup>
  ),
}

export const Invalid: Story = {
  args: { "aria-invalid": true, "aria-describedby": "plan-error" },
  render: (args) => (
    <div className="grid gap-2">
      {meta.render(args)}
      <p id="plan-error" className="text-sm text-destructive">
        Choose a subscription plan.
      </p>
    </div>
  ),
}
