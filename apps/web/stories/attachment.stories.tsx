import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@nwl/surfacekit/components/attachment"

function FileAttachment({
  state = "done",
  image = false,
  onOpen = fn(),
  onRemove = fn(),
}: {
  state?: "idle" | "uploading" | "processing" | "error" | "done"
  image?: boolean
  onOpen?: () => void
  onRemove?: () => void
}) {
  return (
    <Attachment state={state}>
      <AttachmentMedia variant={image ? "image" : "icon"}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- The story exercises the consumer-provided image slot outside Next.js rendering.
          <img
            alt="Quarterly revenue chart preview"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%235b6ee1'/%3E%3Cpath d='M12 60L30 42l13 9 25-30' fill='none' stroke='white' stroke-width='6'/%3E%3C/svg%3E"
          />
        ) : (
          <span aria-hidden="true">PDF</span>
        )}
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
        <AttachmentDescription>
          {state === "uploading"
            ? "Uploading · 64%"
            : state === "error"
              ? "Upload failed"
              : "2.4 MB"}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentTrigger aria-label="Open quarterly report" onClick={onOpen} />
      <AttachmentActions>
        <AttachmentAction
          aria-label="Remove quarterly report"
          onClick={onRemove}
        >
          ×
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}

const meta = {
  title: "SurfaceKit/Components/Content & Status/Attachment",
  component: FileAttachment,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Presents file metadata, preview, lifecycle state, and layered open/remove actions in horizontal or grouped layouts.",
      },
    },
  },
} satisfies Meta<typeof FileAttachment>
export default meta
type Story = StoryObj<typeof meta>
export const File: Story = {
  args: { onOpen: fn(), onRemove: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Open quarterly report" })
    )
    await expect(args.onOpen).toHaveBeenCalledOnce()
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove quarterly report" })
    )
    await expect(args.onRemove).toHaveBeenCalledOnce()
  },
}
export const Image: Story = { args: { image: true } }
export const Group: Story = {
  render: () => (
    <AttachmentGroup aria-label="Release files">
      <FileAttachment />
      <FileAttachment image />
      <FileAttachment />
    </AttachmentGroup>
  ),
}
export const Uploading: Story = { args: { state: "uploading" } }
export const Error: Story = { args: { state: "error" } }
