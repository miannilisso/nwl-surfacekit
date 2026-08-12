import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { Button } from "@nwl/surfacekit/components/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@nwl/surfacekit/components/item"

function ProjectItem({
  media = false,
  actions = false,
  onArchive = fn(),
}: {
  media?: boolean
  actions?: boolean
  onArchive?: () => void
}) {
  return (
    <Item variant="outline">
      <ItemHeader>
        <span>Active</span>
        <span>Production</span>
      </ItemHeader>
      {media && (
        <ItemMedia variant="icon" aria-hidden="true">
          ◇
        </ItemMedia>
      )}
      <ItemContent>
        <ItemTitle>SurfaceKit</ItemTitle>
        <ItemDescription>
          Accessible components for enterprise product teams.
        </ItemDescription>
      </ItemContent>
      {actions && (
        <ItemActions>
          <Button size="sm" variant="outline" onClick={onArchive}>
            Archive
          </Button>
        </ItemActions>
      )}
      <ItemFooter>
        <span>Updated today</span>
        <span>v4.8.0</span>
      </ItemFooter>
    </Item>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Item",
  component: ProjectItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composes list rows, links, media, metadata, actions, headers, and footers across dense enterprise collections.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[38rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectItem>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const WithMedia: Story = { args: { media: true } }
export const WithActions: Story = {
  args: { actions: true, onArchive: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Archive" })
    )
    await expect(args.onArchive).toHaveBeenCalledOnce()
  },
}
export const Group: Story = {
  render: () => (
    <ItemGroup aria-label="Projects">
      <ProjectItem media />
      <ItemSeparator />
      <ProjectItem actions />
    </ItemGroup>
  ),
}
