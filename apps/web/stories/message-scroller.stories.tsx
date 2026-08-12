import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"

import { Button } from "@nwl/surfacekit/components/button"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@nwl/surfacekit/components/message-scroller"

function Thread({
  initialCount = 3,
  loading = false,
  addControl = false,
}: {
  initialCount?: number
  loading?: boolean
  addControl?: boolean
}) {
  const [messages, setMessages] = React.useState(() =>
    Array.from(
      { length: initialCount },
      (_, index) => `Release message ${index + 1}`
    )
  )
  return (
    <div className="w-[34rem] max-w-[calc(100vw-2rem)]">
      <div className="h-80 overflow-hidden rounded-3xl border bg-card">
        <MessageScrollerProvider defaultScrollPosition="end">
          <MessageScroller>
            <MessageScrollerViewport aria-label="Release conversation">
              <MessageScrollerContent className="p-4">
                {loading && (
                  <MessageScrollerItem messageId="loading">
                    <p className="text-center text-sm text-muted-foreground">
                      Loading earlier history…
                    </p>
                  </MessageScrollerItem>
                )}
                {messages.map((message, index) => (
                  <MessageScrollerItem
                    messageId={`message-${index + 1}`}
                    scrollAnchor={index === messages.length - 1}
                    key={`${message}-${index}`}
                  >
                    <article className="rounded-2xl bg-muted p-3">
                      <p className="text-xs font-medium">
                        Amina · {9 + index}:4{index}
                      </p>
                      <p className="mt-1 text-sm">{message}</p>
                    </article>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton direction="start" />
            <MessageScrollerButton direction="end" />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
      {addControl && (
        <Button
          className="mt-3"
          onClick={() =>
            setMessages((current) => [
              ...current,
              `Release message ${current.length + 1}`,
            ])
          }
        >
          Add new message
        </Button>
      )}
    </div>
  )
}
const meta = {
  title: "SurfaceKit/Components/Advanced/Message Scroller",
  component: Thread,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Maintains conversational scroll position, visible anchors, history prepends, and accessible jump-to-edge controls.",
      },
    },
  },
} satisfies Meta<typeof Thread>
export default meta
type Story = StoryObj<typeof meta>
export const ShortThread: Story = {}
export const Overflow: Story = { args: { initialCount: 14 } }
export const NewMessage: Story = {
  args: { initialCount: 8, addControl: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Add new message" })
    )
    await expect(canvas.getByText("Release message 9")).toBeVisible()
  },
}
export const LoadingHistory: Story = {
  args: { initialCount: 8, loading: true },
}
