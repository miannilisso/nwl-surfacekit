import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@nwl/surfacekit/components/bubble"

function BubbleExample({
  outgoing = false,
  grouped = false,
  reactions = false,
  onReact = fn(),
}: {
  outgoing?: boolean
  grouped?: boolean
  reactions?: boolean
  onReact?: () => void
}) {
  const bubble = (
    <Bubble
      align={outgoing ? "end" : "start"}
      variant={outgoing ? "default" : "secondary"}
    >
      <BubbleContent>
        {outgoing
          ? "The release is approved for production."
          : "Can you review the release evidence?"}
      </BubbleContent>
      {reactions && (
        <BubbleReactions>
          <button type="button" onClick={onReact}>
            👍 3
          </button>
        </BubbleReactions>
      )}
    </Bubble>
  )
  return (
    <BubbleGroup aria-label="Conversation">
      {bubble}
      {grouped && (
        <Bubble
          align={outgoing ? "end" : "start"}
          variant={outgoing ? "default" : "secondary"}
        >
          <BubbleContent>I also attached the audit export.</BubbleContent>
        </Bubble>
      )}
    </BubbleGroup>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Bubble",
  component: BubbleExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Groups compact conversational content with direction, surface variants, link composition, and optional reactions.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BubbleExample>
export default meta
type Story = StoryObj<typeof meta>
export const Incoming: Story = {}
export const Outgoing: Story = { args: { outgoing: true } }
export const Group: Story = { args: { grouped: true } }
export const Reactions: Story = {
  args: { reactions: true, onReact: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "👍 3" })
    )
    await expect(args.onReact).toHaveBeenCalledOnce()
  },
}
