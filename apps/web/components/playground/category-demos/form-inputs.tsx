"use client"

import * as React from "react"

import { Button } from "@nwl/surfacekit/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@nwl/surfacekit/components/button-group"
import { Calendar } from "@nwl/surfacekit/components/calendar"
import { Checkbox } from "@nwl/surfacekit/components/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@nwl/surfacekit/components/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@nwl/surfacekit/components/field"
import { Input } from "@nwl/surfacekit/components/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@nwl/surfacekit/components/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@nwl/surfacekit/components/input-otp"
import { Label } from "@nwl/surfacekit/components/label"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@nwl/surfacekit/components/native-select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@nwl/surfacekit/components/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@nwl/surfacekit/components/select"
import { Slider } from "@nwl/surfacekit/components/slider"
import { Switch } from "@nwl/surfacekit/components/switch"
import { Textarea } from "@nwl/surfacekit/components/textarea"
import { Toggle } from "@nwl/surfacekit/components/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@nwl/surfacekit/components/toggle-group"

export function ButtonDemo() {
  const [saved, setSaved] = React.useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setSaved(true)}>Save changes</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="destructive">Delete</Button>
      <span aria-live="polite" className="text-sm text-muted-foreground">
        {saved ? "Changes saved" : "Ready"}
      </span>
    </div>
  )
}

export function ButtonGroupDemo() {
  return (
    <ButtonGroup aria-label="Zoom controls">
      <Button variant="outline" aria-label="Zoom out">
        −
      </Button>
      <ButtonGroupText aria-live="polite">100%</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline" aria-label="Zoom in">
        +
      </Button>
    </ButtonGroup>
  )
}

export function CalendarDemo() {
  const [selected, setSelected] = React.useState<Date | undefined>(
    new Date(2026, 7, 13)
  )
  return (
    <Calendar
      mode="single"
      month={new Date(2026, 7, 1)}
      selected={selected}
      onSelect={setSelected}
    />
  )
}

export function CheckboxDemo() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="playground-release-notes"
          aria-label="Include release notes"
          defaultChecked
        />
        <Label htmlFor="playground-release-notes">Include release notes</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="playground-approval"
          aria-label="Partial approval"
          indeterminate
        />
        <Label htmlFor="playground-approval">Partial approval</Label>
      </div>
    </div>
  )
}

export function ComboboxDemo() {
  return (
    <Combobox>
      <ComboboxInput
        aria-label="Framework"
        placeholder="Search frameworks"
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>Frameworks</ComboboxLabel>
            <ComboboxItem value="React">React</ComboboxItem>
            <ComboboxItem value="Vue">Vue</ComboboxItem>
            <ComboboxItem value="Svelte">Svelte</ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
        <ComboboxEmpty>No framework found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}

export function FieldDemo() {
  return (
    <Field data-invalid="true" className="max-w-md">
      <FieldLabel htmlFor="playground-project-name">Project name</FieldLabel>
      <Input
        id="playground-project-name"
        aria-invalid
        aria-describedby="playground-project-help playground-project-error"
      />
      <FieldDescription id="playground-project-help">
        Visible to every workspace member.
      </FieldDescription>
      <FieldError id="playground-project-error">
        Project name is required.
      </FieldError>
    </Field>
  )
}

export function InputDemo() {
  return (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="playground-email">Work email</Label>
      <Input
        id="playground-email"
        type="email"
        placeholder="name@company.com"
      />
    </div>
  )
}

export function InputGroupDemo() {
  return (
    <InputGroup className="max-w-md">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Workspace domain"
        placeholder="acme.example"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Copy</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export function InputOtpDemo() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="playground-code">Verification code</Label>
      <InputOTP
        id="playground-code"
        aria-label="Verification code"
        maxLength={6}
      >
        <InputOTPGroup>
          {[0, 1, 2].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          {[3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}

export function LabelDemo() {
  return (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="playground-labeled-input">Workspace name</Label>
      <Input id="playground-labeled-input" placeholder="Acme Design" />
    </div>
  )
}

export function NativeSelectDemo() {
  return (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="playground-region">Deployment region</Label>
      <NativeSelect id="playground-region" defaultValue="nairobi">
        <NativeSelectOptGroup label="Africa">
          <NativeSelectOption value="nairobi">Nairobi</NativeSelectOption>
          <NativeSelectOption value="cape-town">Cape Town</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Europe">
          <NativeSelectOption value="frankfurt">Frankfurt</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  )
}

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="growth" aria-label="Subscription plan">
      {["Starter", "Growth", "Enterprise"].map((name) => {
        const value = name.toLowerCase()
        return (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem
              id={`playground-${value}`}
              value={value}
              aria-label={name}
            />
            <Label htmlFor={`playground-${value}`}>{name}</Label>
          </div>
        )
      })}
    </RadioGroup>
  )
}

export function SelectDemo() {
  return (
    <Select defaultValue="Growth">
      <SelectTrigger aria-label="Plan" className="w-64">
        <SelectValue placeholder="Choose a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Available plans</SelectLabel>
          <SelectItem value="Starter">Starter</SelectItem>
          <SelectItem value="Growth">Growth</SelectItem>
          <SelectItem value="Enterprise">Enterprise</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="Legacy" disabled>
          Legacy
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export function SliderDemo() {
  return (
    <div className="grid max-w-md gap-3">
      <Label>Deployment capacity</Label>
      <Slider
        defaultValue={[35, 75]}
        getThumbAriaLabel={(index) =>
          index === 0 ? "Minimum capacity" : "Maximum capacity"
        }
      />
    </div>
  )
}

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="playground-alerts"
        aria-label="Enable deployment alerts"
        defaultChecked
      />
      <Label htmlFor="playground-alerts">Enable deployment alerts</Label>
    </div>
  )
}

export function TextareaDemo() {
  return (
    <div className="grid max-w-md gap-2">
      <Label htmlFor="playground-release-summary">Release summary</Label>
      <Textarea
        id="playground-release-summary"
        placeholder="Describe the production changes"
      />
    </div>
  )
}

export function ToggleDemo() {
  return (
    <Toggle aria-label="Bold" variant="outline">
      Bold
    </Toggle>
  )
}

export function ToggleGroupDemo() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  )
}
