import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@nwl/surfacekit/components/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@nwl/surfacekit/components/native-select"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Native Select",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Provides a styled native select with platform behavior and grouped options.",
      },
    },
  },
  args: { defaultValue: "ke" },
  render: (args) => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="country-select">Country</Label>
      <NativeSelect id="country-select" {...args}>
        <NativeSelectOption value="ke">Kenya</NativeSelectOption>
        <NativeSelectOption value="ug">Uganda</NativeSelectOption>
        <NativeSelectOption value="tz">Tanzania</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Groups: Story = {
  render: (args) => (
    <NativeSelect aria-label="Deployment region" {...args}>
      <NativeSelectOptGroup label="Africa">
        <NativeSelectOption value="nairobi">Nairobi</NativeSelectOption>
        <NativeSelectOption value="cape-town">Cape Town</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Europe">
        <NativeSelectOption value="frankfurt">Frankfurt</NativeSelectOption>
        <NativeSelectOption value="london">London</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const Invalid: Story = {
  args: { "aria-invalid": true, "aria-describedby": "country-error" },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="invalid-country">Country</Label>
      <NativeSelect id="invalid-country" {...args}>
        <NativeSelectOption value="">Choose a country</NativeSelectOption>
      </NativeSelect>
      <p id="country-error" className="text-sm text-destructive">
        Select a country.
      </p>
    </div>
  ),
}
