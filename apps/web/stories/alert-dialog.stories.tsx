import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@nwl/surfacekit/components/alert-dialog"

const meta: Meta<typeof AlertDialog> = {
  title: "SurfaceKit/Alert Dialog",
  component: AlertDialog,
  args: {
    defaultOpen: true,
    children: (
      <>
        <AlertDialogTrigger>Open dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Dialog title</AlertDialogTitle>
          <AlertDialogDescription>This is the dialog content.</AlertDialogDescription>
        </AlertDialogContent>
      </>
    ),
  },
  render: (args: ComponentProps<typeof AlertDialog>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <AlertDialog {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
