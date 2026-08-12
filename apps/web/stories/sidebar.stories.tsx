import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@nwl/surfacekit/components/sidebar"

function Navigation({
  nested = false,
  loading = false,
}: {
  nested?: boolean
  loading?: boolean
}) {
  return (
    <>
      <SidebarHeader>
        <SidebarInput aria-label="Search navigation" placeholder="Search" />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add workspace">+</SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                Array.from({ length: 5 }, (_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Overview</SidebarMenuButton>
                    <SidebarMenuBadge>4</SidebarMenuBadge>
                    <SidebarMenuAction aria-label="Overview options">
                      …
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Deployments</SidebarMenuButton>
                    {nested && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton href="#production" isActive>
                            Production
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton href="#staging">
                            Staging
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>Enterprise workspace</SidebarFooter>
    </>
  )
}
function SidebarExample({
  collapsed = false,
  mobile = false,
  nested = false,
  loading = false,
}: {
  collapsed?: boolean
  mobile?: boolean
  nested?: boolean
  loading?: boolean
}) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: mobile ? 500 : 1024,
  })
  return (
    <SidebarProvider defaultOpen={!collapsed}>
      <Sidebar collapsible="icon">
        <Navigation nested={nested} loading={loading} />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-[32rem]">
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <h2 className="font-heading font-medium">Production workspace</h2>
        </header>
        <main className="p-6">
          <p className="text-sm text-muted-foreground">
            Release governance and audit evidence.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
const meta = {
  title: "SurfaceKit/Components/Advanced/Sidebar",
  component: SidebarExample,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Provides responsive desktop and mobile navigation state with composable headers, groups, menus, submenus, actions, badges, loading states, and inset content.",
      },
    },
  },
} satisfies Meta<typeof SidebarExample>
export default meta
type Story = StoryObj<typeof meta>
export const Desktop: Story = {}
export const Collapsed: Story = { args: { collapsed: true } }
export const Mobile: Story = {
  args: { mobile: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: "Toggle Sidebar" })
    )
    const body = within(canvasElement.ownerDocument.body)
    await waitFor(() =>
      expect(body.getByRole("dialog", { name: "Sidebar" })).toBeVisible()
    )
  },
}
export const NestedMenu: Story = { args: { nested: true } }
export const Loading: Story = { args: { loading: true } }
