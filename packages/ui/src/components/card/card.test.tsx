import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

describe("Card", () => {
  it("composes every card region without changing its content semantics", () => {
    const { container } = render(
      <Card size="sm" aria-labelledby="release-title">
        <CardHeader>
          <CardTitle id="release-title">August release</CardTitle>
          <CardDescription>Production readiness update</CardDescription>
          <CardAction>
            <button type="button">Open menu</button>
          </CardAction>
        </CardHeader>
        <CardContent>70 catalog entries verified.</CardContent>
        <CardFooter>Published today</CardFooter>
      </Card>
    )

    const card = screen.getByLabelText("August release")
    expect(card).toHaveAttribute("data-size", "sm")
    expect(
      screen.getByRole("heading", { name: "August release" })
    ).toHaveAttribute("data-slot", "card-title")
    for (const slot of [
      "card-header",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`)
      ).toBeInTheDocument()
    }
  })
})
