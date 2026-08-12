import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu"

function Example() {
  return (
    <NavigationMenu aria-label="Primary">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/platform">Platform</NavigationMenuLink>
          </NavigationMenuContent>
          <NavigationMenuIndicator />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing" active>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

describe("NavigationMenu", () => {
  it("opens content and exposes links from a labeled navigation menu", async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole("button", { name: "Products" })
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(
      await screen.findByRole("link", { name: "Platform" })
    ).toHaveAttribute("href", "/platform")
  })

  it("supports keyboard opening and active-link state", async () => {
    const user = userEvent.setup()
    const { container } = render(<Example />)
    const trigger = screen.getByRole("button", { name: "Products" })
    trigger.focus()
    await user.keyboard("{Enter}")
    expect(await screen.findByRole("link", { name: "Platform" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "data-active"
    )
    expect(
      container.querySelector('[data-slot="navigation-menu-indicator"]')
    ).toBeInTheDocument()
  })
})
