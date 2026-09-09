import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@nwl/surfacekit/components/accordion"

type ExampleProps = { multiple?: boolean; disabled?: boolean; long?: boolean }

function AccordionExample({ multiple, disabled, long }: ExampleProps) {
  return (
    <Accordion
      multiple={multiple}
      defaultValue={multiple ? ["profile", "billing"] : undefined}
      className="w-[34rem] max-w-[calc(100vw-2rem)]"
    >
      <AccordionItem value="profile">
        <AccordionTrigger>Profile and access</AccordionTrigger>
        <AccordionContent>
          {long
            ? "Review identity providers, session controls, role mappings, access reviews, and regional authentication policies for every workspace in your organization."
            : "Manage identity and access controls."}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing and invoices</AccordionTrigger>
        <AccordionContent>
          Manage billing contacts and invoices.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="archived" disabled={disabled}>
        <AccordionTrigger>Archived settings</AccordionTrigger>
        <AccordionContent>Archived workspace settings.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const meta = {
  title: "SurfaceKit/Components/Navigation & Disclosure/Accordion",
  component: AccordionExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Progressively discloses related sections with single or multiple expansion and full keyboard semantics.",
      },
    },
  },
} satisfies Meta<typeof AccordionExample>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Profile and access",
    })
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  },
}
export const Single: Story = {}
export const Multiple: Story = { args: { multiple: true } }
export const Disabled: Story = { args: { disabled: true } }
export const LongContent: Story = { args: { long: true } }
