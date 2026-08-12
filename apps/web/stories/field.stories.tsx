import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@nwl/surfacekit/components/input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet as FieldSetRoot,
  FieldTitle,
} from "@nwl/surfacekit/components/field"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composes labels, controls, help text, and validation into consistent accessible form rows.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="name">Project name</FieldLabel>
      <Input id="name" />
      <FieldDescription>Visible to all members.</FieldDescription>
    </Field>
  ),
}
export const Required: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="required-name">
        Project name <span aria-hidden="true">*</span>
      </FieldLabel>
      <Input id="required-name" required />
    </Field>
  ),
}
export const Invalid: Story = {
  render: () => (
    <Field data-invalid="true">
      <FieldLabel htmlFor="invalid-name">Project name</FieldLabel>
      <Input id="invalid-name" aria-invalid aria-describedby="field-error" />
      <FieldError id="field-error">Project name is required.</FieldError>
    </Field>
  ),
}
export const FieldSet: Story = {
  render: () => (
    <FieldSetRoot>
      <FieldLegend>Organization profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="org">Organization</FieldLabel>
          <Input id="org" />
        </Field>
        <Field>
          <FieldLabel htmlFor="role">Role</FieldLabel>
          <Input id="role" />
        </Field>
      </FieldGroup>
    </FieldSetRoot>
  ),
}
export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>Workspace URL</FieldTitle>
        <FieldDescription>Used for member sign-in.</FieldDescription>
      </FieldContent>
      <Input aria-label="Workspace URL" className="max-w-40" />
    </Field>
  ),
}
