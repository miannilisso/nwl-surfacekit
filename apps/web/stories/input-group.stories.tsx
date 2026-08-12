import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@nwl/surfacekit/components/input-group"

const meta = {
  title: "SurfaceKit/Components/Form Inputs/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Combines inputs with contextual prefixes, suffixes, actions, and multiline controls.",
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
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="Search" placeholder="Search…" />
    </InputGroup>
  ),
}
export const Prefix: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Domain" placeholder="example.com" />
    </InputGroup>
  ),
}
export const Suffix: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="Budget" defaultValue="2500" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
}
export const Button: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput aria-label="API key" value="sk_live_••••" readOnly />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Copy</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}
export const Textarea: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea aria-label="Comment" placeholder="Add context…" />
      <InputGroupAddon align="block-end">Markdown supported</InputGroupAddon>
    </InputGroup>
  ),
}
export const Disabled: Story = {
  render: () => (
    <InputGroup data-disabled="true">
      <InputGroupAddon>@</InputGroupAddon>
      <InputGroupInput
        aria-label="Username"
        value="surfacekit"
        readOnly
        disabled
      />
    </InputGroup>
  ),
}
