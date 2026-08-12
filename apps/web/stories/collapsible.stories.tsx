import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"

import { Button } from "@nwl/surfacekit/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@nwl/surfacekit/components/collapsible"

function CollapsibleExample({
  defaultOpen = false,
  disabled = false,
  controlled = false,
}: {
  defaultOpen?: boolean
  disabled?: boolean
  controlled?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <Collapsible
      open={controlled ? open : undefined}
      onOpenChange={controlled ? setOpen : undefined}
      defaultOpen={!controlled ? defaultOpen : undefined}
      disabled={disabled}
    >
      <CollapsibleTrigger render={<Button variant="outline" />}>
        Audit details
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 max-w-sm rounded-xl border p-4 text-sm">
        Last reviewed by the Security team on 12 August.
      </CollapsibleContent>
    </Collapsible>
  )
}

const meta = {
  title: "SurfaceKit/Components/Navigation & Disclosure/Collapsible",
  component: CollapsibleExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shows or hides a single region while preserving explicit expanded and controlled-state semantics.",
      },
    },
  },
} satisfies Meta<typeof CollapsibleExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Audit details",
    })
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  },
}
export const Closed: Story = {}
export const Open: Story = { args: { defaultOpen: true } }
export const Controlled: Story = { args: { controlled: true } }
export const Disabled: Story = { args: { disabled: true } }
