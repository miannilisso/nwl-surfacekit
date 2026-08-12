import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@nwl/surfacekit/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@nwl/surfacekit/components/empty"

function EmptyExample({
  kind = "default",
  compact = false,
}: {
  kind?: "default" | "search" | "permission"
  compact?: boolean
}) {
  const copy = {
    default: [
      "◇",
      "No projects yet",
      "Create your first project to start shipping.",
    ],
    search: [
      "⌕",
      "No matching results",
      "Try another search or clear the active filters.",
    ],
    permission: [
      "🔒",
      "Access required",
      "Ask a workspace administrator for permission.",
    ],
  }[kind]
  return (
    <Empty className={compact ? "p-6" : "border"}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <span aria-hidden="true">{copy[0]}</span>
        </EmptyMedia>
        <EmptyTitle>{copy[1]}</EmptyTitle>
        <EmptyDescription>{copy[2]}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size={compact ? "sm" : "default"}>
          {kind === "search"
            ? "Clear filters"
            : kind === "permission"
              ? "Request access"
              : "Create project"}
        </Button>
      </EmptyContent>
    </Empty>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Empty",
  component: EmptyExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Explains an empty, filtered, or restricted state with semantic heading content and a clear next action.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Search: Story = { args: { kind: "search" } }
export const Permission: Story = { args: { kind: "permission" } }
export const Compact: Story = { args: { compact: true } }
