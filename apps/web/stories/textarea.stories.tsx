import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@nwl/surfacekit/components/label"
import { Textarea } from "@nwl/surfacekit/components/textarea"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Collects multiline text with validation, disabled, and read-only states.",
      },
    },
  },
  args: { placeholder: "Describe this release…" },
  render: (args) => (
    <div className="grid w-80 max-w-[calc(100vw-2rem)] gap-2">
      <Label htmlFor="release-notes-textarea">Release notes</Label>
      <Textarea id="release-notes-textarea" {...args} />
    </div>
  ),
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Invalid: Story = {
  args: { "aria-invalid": true, "aria-describedby": "notes-error" },
  render: (args) => (
    <div className="grid w-80 max-w-[calc(100vw-2rem)] gap-2">
      <Label htmlFor="invalid-notes">Release notes</Label>
      <Textarea id="invalid-notes" {...args} />
      <p id="notes-error" className="text-sm text-destructive">
        Add a release summary.
      </p>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, value: "Release is locked.", readOnly: true },
}

export const LongContent: Story = {
  args: {
    readOnly: true,
    value:
      "SurfaceKit now includes a complete component catalog, browser-verified Storybook examples, accessibility gates, and production release evidence.\n\nThis field demonstrates multiline overflow and content sizing.",
  },
}
