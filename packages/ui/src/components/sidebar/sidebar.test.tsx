import { fireEvent, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

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
  useSidebar,
} from "./sidebar"

function SidebarState() {
  const { state, isMobile, openMobile } = useSidebar()
  return (
    <output data-testid="sidebar-state">{`${state}:${isMobile}:${openMobile}`}</output>
  )
}

function Example({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarState />
      <SidebarTrigger />
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarInput aria-label="Search navigation" />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction aria-label="Add workspace">
              +
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Overview</SidebarMenuButton>
                  <SidebarMenuBadge>4</SidebarMenuBadge>
                  <SidebarMenuAction aria-label="More options">
                    …
                  </SidebarMenuAction>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="/reports">
                        Reports
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Account</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>Workspace content</SidebarInset>
    </SidebarProvider>
  )
}

describe("Sidebar", () => {
  it("guards its hook and toggles desktop state by trigger and shortcut", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)
    expect(() => renderHook(() => useSidebar())).toThrow(/SidebarProvider/)
    consoleError.mockRestore()
    const user = userEvent.setup()
    const { container } = render(<Example />)
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "expanded:false:false"
    )
    await user.click(
      screen.getAllByRole("button", { name: "Toggle Sidebar" })[0]!
    )
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "collapsed:false:false"
    )
    await user.keyboard("{Control>}b{/Control}")
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "expanded:false:false"
    )
    for (const slot of [
      "sidebar",
      "sidebar-header",
      "sidebar-input",
      "sidebar-separator",
      "sidebar-content",
      "sidebar-group",
      "sidebar-group-label",
      "sidebar-group-action",
      "sidebar-group-content",
      "sidebar-menu",
      "sidebar-menu-item",
      "sidebar-menu-button",
      "sidebar-menu-badge",
      "sidebar-menu-action",
      "sidebar-menu-sub",
      "sidebar-menu-sub-item",
      "sidebar-menu-sub-button",
      "sidebar-menu-skeleton",
      "sidebar-footer",
      "sidebar-rail",
      "sidebar-inset",
    ])
      expect(
        container.querySelector(`[data-slot="${slot}"]`)
      ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="sidebar-menu-action"]')
    ).toHaveClass("w-6")
  })

  it("honors the controlled state callback", () => {
    const onOpenChange = vi.fn()
    render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <SidebarTrigger />
      </SidebarProvider>
    )
    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("opens the mobile sheet through the shared trigger", async () => {
    const originalWidth = window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 500,
    })
    const user = userEvent.setup()
    render(<Example />)
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent(
      "expanded:true:false"
    )
    await user.click(screen.getByRole("button", { name: "Toggle Sidebar" }))
    expect(await screen.findByRole("dialog", { name: "Sidebar" })).toBeVisible()
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalWidth,
    })
  })
})
