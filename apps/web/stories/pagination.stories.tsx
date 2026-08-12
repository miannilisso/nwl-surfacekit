import type { Meta, StoryObj } from "@storybook/react"
import { Suspense, type ComponentProps } from "react"
import { Pagination } from "@nwl/surfacekit/components/pagination"

const meta: Meta<typeof Pagination> = {
  title: "SurfaceKit/Pagination",
  component: Pagination,
  args: { children: "SurfaceKit Component" },
  render: (args: ComponentProps<typeof Pagination>) => (
    <div className="p-4">
      <Suspense fallback={null}>
        <Pagination {...args} />
      </Suspense>
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default = {}
