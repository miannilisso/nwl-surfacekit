import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { Avatar, AvatarFallback } from "@nwl/surfacekit/components/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@nwl/surfacekit/components/hover-card"

function HoverCardExample({
  rich = false,
  delayed = false,
}: {
  rich?: boolean
  delayed?: boolean
}) {
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={delayed ? 700 : 0}
        closeDelay={0}
        render={
          <a
            href="#platform-owner"
            className="font-medium underline underline-offset-4"
          />
        }
      >
        Platform owner
      </HoverCardTrigger>
      <HoverCardContent>
        {rich ? (
          <div className="flex gap-3">
            <Avatar>
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div>
              <strong className="block">Amina N.</strong>
              <p className="text-muted-foreground">
                Owns production access reviews and release policy.
              </p>
            </div>
          </div>
        ) : (
          "Owns production access reviews."
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
const meta = {
  title: "SurfaceKit/Components/Overlays & Dialogs/Hover Card",
  component: HoverCardExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Previews contextual information from pointer hover or keyboard focus without interrupting navigation.",
      },
    },
  },
} satisfies Meta<typeof HoverCardExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("link", {
      name: "Platform owner",
    })
    await userEvent.hover(trigger)
    const content = within(canvasElement.ownerDocument.body).getByText(
      "Owns production access reviews."
    )
    await waitFor(() => expect(content).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(content).not.toBeInTheDocument())
  },
}
export const RichContent: Story = { args: { rich: true } }
export const Delayed: Story = { args: { delayed: true } }
