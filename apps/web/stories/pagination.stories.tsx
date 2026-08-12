import type { Meta, StoryObj } from "@storybook/react-vite"

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
        {[1, 2, 3].map((offset) => {
          const value = Math.min(12, Math.max(1, page + offset - 2))
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
export const FirstPage: Story = { args: { page: 1 } }
export const LastPage: Story = { args: { page: 12 } }
