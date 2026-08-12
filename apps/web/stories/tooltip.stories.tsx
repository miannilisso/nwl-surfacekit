import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@nwl/surfacekit/components/tooltip"

type Side = "top" | "right" | "bottom" | "left"
function OneTooltip({
  side = "top",
  long = false,
}: {
  side?: Side
  long?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Deploy
      </TooltipTrigger>
      <TooltipContent side={side}>
        {long
          ? "Deploy the approved release to the production environment"
          : `Deploy to ${side}`}
      </TooltipContent>
    </Tooltip>
  )
}
function TooltipExample({
  sides = false,
  keyboard = false,
  long = false,
}: {
  sides?: boolean
  keyboard?: boolean
  long?: boolean
}) {
  return (
    <TooltipProvider delay={0}>
      <div className="flex flex-wrap gap-3" data-keyboard={keyboard}>
        {sides ? (
          (["top", "right", "bottom", "left"] as const).map((side) => (
            <OneTooltip key={side} side={side} />
          ))
        ) : (
          <OneTooltip long={long} />
        )}
      </div>
    </TooltipProvider>
  )
}
const meta = {
  title: "SurfaceKit/Components/Overlays & Dialogs/Tooltip",
  component: TooltipExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Adds concise, accessible descriptions on hover and focus with provider-level timing and directional placement.",
      },
    },
  },
} satisfies Meta<typeof TooltipExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Deploy",
    })
    await userEvent.hover(trigger)
    await expect(
      within(canvasElement.ownerDocument.body).getByRole("tooltip")
    ).toBeVisible()
    await expect(trigger).toHaveAccessibleDescription("Deploy to top")
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).queryByRole("tooltip")
      ).not.toBeInTheDocument()
    )
  },
}
export const Sides: Story = { args: { sides: true } }
export const KeyboardFocus: Story = {
  args: { keyboard: true },
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    const tooltip = within(canvasElement.ownerDocument.body).getByRole(
      "tooltip"
    )
    await waitFor(() => expect(tooltip).toBeVisible())
    await userEvent.keyboard("{Escape}")
  },
}
export const LongContent: Story = { args: { long: true } }
