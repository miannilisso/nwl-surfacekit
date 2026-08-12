import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@nwl/surfacekit/components/navigation-menu"

function NavigationExample({
  content = true,
  active = false,
  compact = false,
}: {
  content?: boolean
  active?: boolean
  compact?: boolean
}) {
  return (
    <NavigationMenu aria-label="Primary navigation">
      <NavigationMenuList className={compact ? "gap-0" : "gap-1"}>
        {content && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-80 gap-1 p-2">
                <NavigationMenuLink href="#platform">
                  <span>
                    <strong className="block">Platform</strong>
                    <span className="text-muted-foreground">
                      Operate every workspace from one control plane.
                    </span>
                  </span>
                </NavigationMenuLink>
                <NavigationMenuLink href="#security">
                  Security controls
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
            <NavigationMenuIndicator />
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" active={active}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const meta = {
  title: "SurfaceKit/Components/Navigation & Disclosure/Navigation Menu",
  component: NavigationExample,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Presents primary navigation links and rich disclosure panels with keyboard navigation and active-link state.",
      },
    },
  },
} satisfies Meta<typeof NavigationExample>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: "Products",
    })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
  },
}
export const WithContent: Story = {}
export const ActiveLink: Story = { args: { active: true } }
export const Compact: Story = { args: { compact: true } }
