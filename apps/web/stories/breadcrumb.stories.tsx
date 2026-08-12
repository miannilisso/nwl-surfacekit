import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@nwl/surfacekit/components/breadcrumb"

function BreadcrumbExample({
  collapsed = false,
  long = false,
}: {
  collapsed?: boolean
  long?: boolean
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {collapsed && (
          <>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {long && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="#organization">Organization</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#security">Security</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>Access policies</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const meta = {
  title: "SurfaceKit/Components/Navigation & Disclosure/Breadcrumb",
  component: BreadcrumbExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Communicates the current page's position in a navigational hierarchy with accessible landmarks and current-page state.",
      },
    },
  },
} satisfies Meta<typeof BreadcrumbExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Collapsed: Story = { args: { collapsed: true } }
export const LongPath: Story = { args: { long: true } }
