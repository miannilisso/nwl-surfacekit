"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nwl/surfacekit/components/card"
import { Input } from "@nwl/surfacekit/components/input"
import { Label } from "@nwl/surfacekit/components/label"
import { Textarea } from "@nwl/surfacekit/components/textarea"
import { Checkbox } from "@nwl/surfacekit/components/checkbox"
import { RadioGroup } from "@nwl/surfacekit/components/radio-group"
import { Select } from "@nwl/surfacekit/components/select"
import { NativeSelect } from "@nwl/surfacekit/components/native-select"
import { Toggle } from "@nwl/surfacekit/components/toggle"
import { Slider } from "@nwl/surfacekit/components/slider"
import { Switch } from "@nwl/surfacekit/components/switch"
import {
  AppShell,
  AppTopbar,
  AppSidebar,
} from "@nwl/surfacekit/patterns/app-shell"

const navItems = [
  { label: "Overview", href: "/playground", active: false },
  { label: "Form Inputs", href: "/form-inputs", active: true },
  { label: "Navigation", href: "/navigation", active: false },
  { label: "Dialogs & Overlays", href: "/dialogs-overlays", active: false },
  { label: "Data Display", href: "/data-display", active: false },
  { label: "Feedback", href: "/feedback", active: false },
  { label: "Layout & Utilities", href: "/layout-utilities", active: false },
  { label: "Patterns", href: "/patterns", active: false },
]

export default function FormInputsPage() {
  return (
    <AppShell
      topbar={<AppTopbar title="Form Inputs" eyebrow="Component Showcase" />}
      sidebar={<AppSidebar items={navItems} />}
    >
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold">Form Inputs</h2>
          <p className="mb-6 text-muted-foreground">
            Comprehensive collection of form input components for building
            user-friendly forms.
          </p>

          <div className="grid gap-6">
            {/* Input Component */}
            <Card>
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>
                  Text input field for user data entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="input-demo">Email</Label>
                  <Input
                    id="input-demo"
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Textarea Component */}
            <Card>
              <CardHeader>
                <CardTitle>Textarea</CardTitle>
                <CardDescription>
                  Multi-line text input for longer content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="textarea-demo">Message</Label>
                  <Textarea
                    id="textarea-demo"
                    placeholder="Type your message..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Checkbox Component */}
            <Card>
              <CardHeader>
                <CardTitle>Checkbox</CardTitle>
                <CardDescription>Multiple selection input</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkbox-demo" />
                  <Label htmlFor="checkbox-demo">
                    Accept terms and conditions
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* RadioGroup Component */}
            <Card>
              <CardHeader>
                <CardTitle>Radio Group</CardTitle>
                <CardDescription>
                  Single selection from multiple options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="option1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="radio1"
                      name="demo"
                      value="option1"
                      defaultChecked
                    />
                    <Label htmlFor="radio1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="radio2"
                      name="demo"
                      value="option2"
                    />
                    <Label htmlFor="radio2">Option 2</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Select Component */}
            <Card>
              <CardHeader>
                <CardTitle>Select</CardTitle>
                <CardDescription>Dropdown selection component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Choose an option</Label>
                  <Select>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* NativeSelect Component */}
            <Card>
              <CardHeader>
                <CardTitle>Native Select</CardTitle>
                <CardDescription>Native HTML select element</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Choose a category</Label>
                  <NativeSelect>
                    <option>Category A</option>
                    <option>Category B</option>
                    <option>Category C</option>
                  </NativeSelect>
                </div>
              </CardContent>
            </Card>

            {/* Slider Component */}
            <Card>
              <CardHeader>
                <CardTitle>Slider</CardTitle>
                <CardDescription>Range input slider</CardDescription>
              </CardHeader>
              <CardContent>
                <Slider defaultValue={[50]} max={100} step={1} />
              </CardContent>
            </Card>

            {/* Toggle Component */}
            <Card>
              <CardHeader>
                <CardTitle>Toggle</CardTitle>
                <CardDescription>Binary on/off switch</CardDescription>
              </CardHeader>
              <CardContent>
                <Toggle>Toggle me</Toggle>
              </CardContent>
            </Card>

            {/* ToggleGroup Component */}
            <Card>
              <CardHeader>
                <CardTitle>Toggle Group</CardTitle>
                <CardDescription>Group of toggle options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Toggle>Left</Toggle>
                  <Toggle>Center</Toggle>
                  <Toggle>Right</Toggle>
                </div>
              </CardContent>
            </Card>

            {/* Switch Component */}
            <Card>
              <CardHeader>
                <CardTitle>Switch</CardTitle>
                <CardDescription>
                  Toggle switch for boolean values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch id="switch-demo" />
                  <Label htmlFor="switch-demo">Enable feature</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
