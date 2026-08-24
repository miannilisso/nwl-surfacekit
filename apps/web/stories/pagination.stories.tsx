import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@nwl/surfacekit/components/pagination"

function PaginationExample({ page = 3 }: { page?: number }) {
  const firstVisiblePage = Math.min(Math.max(page - 1, 1), 10)
  const visiblePages = Array.from(
    { length: 3 },
    (_, index) => firstVisiblePage + index
  )

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`#page-${Math.max(1, page - 1)}`}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        {page > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {visiblePages.map((value) => {
          return (
            <PaginationItem key={value}>
              <PaginationLink
                href={`#page-${value}`}
                isActive={value === page}
                aria-label={`Page ${value}`}
              >
                {value}
              </PaginationLink>
            </PaginationItem>
          )
        })}
        {page < 11 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href={`#page-${Math.min(12, page + 1)}`}
            aria-disabled={page === 12}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

const meta = {
  title: "SurfaceKit/Components/Navigation & Disclosure/Pagination",
  component: PaginationExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Navigates paged collections with link semantics, explicit current-page state, boundaries, and compact gaps.",
      },
    },
  },
} satisfies Meta<typeof PaginationExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const MiddlePage: Story = { args: { page: 6 } }
export const FirstPage: Story = {
  args: { page: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const page of [1, 2, 3]) {
      await expect(
        canvas.getAllByRole("link", { name: `Page ${page}` })
      ).toHaveLength(1)
    }
  },
}
export const LastPage: Story = {
  args: { page: 12 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const page of [10, 11, 12]) {
      await expect(
        canvas.getAllByRole("link", { name: `Page ${page}` })
      ).toHaveLength(1)
    }
  },
}
