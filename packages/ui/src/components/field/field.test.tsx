import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Input } from "../input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field"

describe("Field", () => {
  it("associates labels, descriptions, and errors with a control", () => {
    render(
      <Field data-invalid="true">
        <FieldLabel htmlFor="team-name">Team name</FieldLabel>
        <Input
          id="team-name"
          aria-describedby="team-help team-error"
          aria-invalid
        />
        <FieldDescription id="team-help">
          Visible to workspace members.
        </FieldDescription>
        <FieldError
          id="team-error"
          errors={[{ message: "Name is required" }]}
        />
      </Field>
    )

    expect(
      screen.getByRole("textbox", { name: "Team name" })
    ).toHaveAccessibleDescription(
      "Visible to workspace members. Name is required"
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Name is required")
  })

  it("composes a fieldset, legend, grouped content, and horizontal layout", () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal" aria-label="Profile summary">
            <FieldContent>
              <FieldTitle>Owner</FieldTitle>
              <FieldDescription>Primary account owner</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    )

    expect(screen.getByRole("group", { name: "Profile" })).toBeInTheDocument()
    expect(
      screen.getByRole("group", { name: "Profile summary" })
    ).toHaveAttribute("data-orientation", "horizontal")
    expect(
      container.querySelector('[data-slot="field-content"]')
    ).toBeInTheDocument()
  })

  it("deduplicates multiple validation messages", () => {
    render(
      <FieldError
        errors={[
          { message: "Required" },
          { message: "Required" },
          { message: "Must be unique" },
        ]}
      />
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
  })

  it("supports separators and explicit or empty error content", () => {
    const { container } = render(
      <FieldGroup>
        <FieldSeparator>Or continue with</FieldSeparator>
        <FieldSeparator />
        <FieldError>Service unavailable</FieldError>
        <FieldError errors={[]} />
      </FieldGroup>
    )

    expect(screen.getByText("Or continue with")).toHaveAttribute(
      "data-slot",
      "field-separator-content"
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Service unavailable")
    expect(
      container.querySelectorAll('[data-slot="field-separator"]')
    ).toHaveLength(2)
  })
})
