import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@nwl/surfacekit/components/dialog"

const meta: Meta<typeof Dialog> = {
  title: "SurfaceKit/Dialog",
  component: Dialog,
  args: {
    defaultOpen: true,
    children: (
      <>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>This is the dialog content.</DialogDescription>
        </DialogContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof Dialog>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Dialog {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
