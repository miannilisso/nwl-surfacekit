import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

describe("Tabs", () => {
  it("selects tabs with arrow keys and displays the associated panel", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="activity">Activity panel</TabsContent>
      </Tabs>
    )
    const overview = screen.getByRole("tab", { name: "Overview" })
    await user.click(overview)
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Activity panel")
  })

  it("supports line styling and disabled tabs", () => {
    const { container } = render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace" variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit" disabled>
            Audit
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="audit">Audit panel</TabsContent>
      </Tabs>
    )
    expect(container.querySelector('[data-slot="tabs-list"]')).toHaveAttribute(
      "data-variant",
      "line"
    )
    expect(screen.getByRole("tab", { name: "Audit" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })
})
