import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@nwl/surfacekit/components/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@nwl/surfacekit/components/message"

function ChatMessage({
  outgoing = false,
  long = false,
}: {
  outgoing?: boolean
  long?: boolean
}) {
  return (
    <Message align={outgoing ? "end" : "start"}>
      <MessageAvatar aria-label={outgoing ? "You" : "Amina"}>
        {outgoing ? "Y" : "A"}
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>{outgoing ? "You" : "Amina N."}</MessageHeader>
        <BubbleGroup>
          <Bubble
            align={outgoing ? "end" : "start"}
            variant={outgoing ? "default" : "secondary"}
          >
            <BubbleContent>
              {long
                ? "The release evidence includes browser interactions, accessibility results, visual regression snapshots, package contracts, and a traceable production approval record for every supported component and pattern."
                : outgoing
                  ? "The release is approved."
                  : "Is the release evidence ready?"}
            </BubbleContent>
          </Bubble>
        </BubbleGroup>
        <MessageFooter>09:41 · Delivered</MessageFooter>
      </MessageContent>
    </Message>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Message",
  component: ChatMessage,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Structures conversational identity, metadata, grouped bubble content, direction, and delivery status.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[42rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatMessage>
export default meta
type Story = StoryObj<typeof meta>
export const Incoming: Story = {}
export const Outgoing: Story = { args: { outgoing: true } }
export const Thread: Story = {
  render: () => (
    <MessageGroup aria-label="Release conversation">
      <ChatMessage />
      <ChatMessage outgoing />
      <ChatMessage />
    </MessageGroup>
  ),
}
export const LongContent: Story = { args: { long: true } }
