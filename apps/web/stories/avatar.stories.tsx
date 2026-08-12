import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@nwl/surfacekit/components/avatar"

const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%235b5bd6'/%3E%3Ccircle cx='48' cy='38' r='18' fill='%23fff'/%3E%3Cpath d='M16 96c3-25 16-36 32-36s29 11 32 36' fill='%23fff'/%3E%3C/svg%3E"

const meta = {
  title: "SurfaceKit/Components/Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Represents a person or entity with an image, initials, grouping, and status.",
      },
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Avatar role="img" aria-label="Ada Lovelace">
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
}

export const Image: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src={portrait} alt="Profile of Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: () => (
    <Avatar role="img" aria-label="Grace Hopper">
      <AvatarFallback>GH</AvatarFallback>
    </Avatar>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup role="group" aria-label="Release team">
      {[
        ["AL", "Ada Lovelace"],
        ["GH", "Grace Hopper"],
        ["HM", "Hedy Lamarr"],
      ].map(([initials, name]) => (
        <Avatar key={initials} role="img" aria-label={name}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount role="img" aria-label="4 more team members">
        +4
      </AvatarGroupCount>
    </AvatarGroup>
  ),
}

export const Status: Story = {
  render: () => (
    <Avatar size="lg" role="img" aria-label="Ada Lovelace, online">
      <AvatarFallback>AL</AvatarFallback>
      <AvatarBadge aria-hidden="true" className="bg-emerald-500" />
    </Avatar>
  ),
}
