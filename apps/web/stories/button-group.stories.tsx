import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@nwl/surfacekit/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@nwl/surfacekit/components/button-group"

const meta = {
  title: "SurfaceKit/Button Group",
  component: ButtonGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <ButtonGroup aria-label="Document actions">
      <Button variant="outline">Preview</Button>
      <Button variant="outline">Publish</Button>
      <Button variant="outline">Archive</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup aria-label="Text alignment" orientation="vertical">
      <Button variant="outline">Align left</Button>
      <Button variant="outline">Align center</Button>
      <Button variant="outline">Align right</Button>
    </ButtonGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <ButtonGroup aria-label="Zoom controls">
      <Button variant="outline" aria-label="Zoom out">
        −
      </Button>
      <ButtonGroupText aria-live="polite">100%</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline" aria-label="Zoom in">
        +
      </Button>
    </ButtonGroup>
  ),
}
