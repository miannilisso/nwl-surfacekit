import type { Meta, StoryObj } from "@storybook/react-vite"

import { ScrollArea, ScrollBar } from "@nwl/surfacekit/components/scroll-area"

function ScrollAreaExample({
  horizontal = false,
  both = false,
}: {
  horizontal?: boolean
  both?: boolean
}) {
  const isWide = horizontal || both
  return (
    <ScrollArea
      aria-label="Audit events"
      className="h-72 w-[34rem] max-w-[calc(100vw-2rem)] rounded-3xl border"
    >
      <div className={isWide ? "w-[64rem] p-4" : "p-4"}>
        {Array.from({ length: both ? 20 : horizontal ? 5 : 20 }, (_, index) => (
          <article className="mb-2 rounded-xl bg-muted/50 p-3" key={index}>
            <p className="font-medium">Audit event {index + 1}</p>
            <p className="text-sm text-foreground/80">
              Production policy updated by workspace administrator{" "}
              {isWide
                ? "with complete traceability metadata and regional approval evidence."
                : "with approval evidence."}
            </p>
          </article>
        ))}
      </div>
      {isWide && <ScrollBar orientation="horizontal" />}
    </ScrollArea>
  )
}
const meta = {
  title: "SurfaceKit/Components/Advanced/Scroll Area",
  component: ScrollAreaExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Contains long or wide content in a focus-visible viewport with touch-friendly vertical and horizontal scrollbars.",
      },
    },
  },
} satisfies Meta<typeof ScrollAreaExample>
export default meta
type Story = StoryObj<typeof meta>
export const Vertical: Story = {}
export const Horizontal: Story = { args: { horizontal: true } }
export const BothAxes: Story = { args: { both: true } }
