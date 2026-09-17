"use client"

import dynamic from "next/dynamic"

import type { SurfaceCatalogEntry } from "../../lib/surfacekit/catalog"
import { DemoGrid, type DemoRegistry } from "./demo-grid"
import { DemoLoading } from "./demo-loading"

const demos = {
  button: dynamic(() => import("./demos/button-demo"), {
    loading: DemoLoading,
  }),
  "button-group": dynamic(() => import("./demos/button-group-demo"), {
    loading: DemoLoading,
  }),
  calendar: dynamic(() => import("./demos/calendar-demo"), {
    loading: DemoLoading,
  }),
  checkbox: dynamic(() => import("./demos/checkbox-demo"), {
    loading: DemoLoading,
  }),
  combobox: dynamic(() => import("./demos/combobox-demo"), {
    loading: DemoLoading,
  }),
  field: dynamic(() => import("./demos/field-demo"), {
    loading: DemoLoading,
  }),
  input: dynamic(() => import("./demos/input-demo"), {
    loading: DemoLoading,
  }),
  "input-group": dynamic(() => import("./demos/input-group-demo"), {
    loading: DemoLoading,
  }),
  "input-otp": dynamic(() => import("./demos/input-otp-demo"), {
    loading: DemoLoading,
  }),
  "password-input": dynamic(() => import("./demos/password-input-demo"), {
    loading: DemoLoading,
  }),
  label: dynamic(() => import("./demos/label-demo"), {
    loading: DemoLoading,
  }),
  "native-select": dynamic(() => import("./demos/native-select-demo"), {
    loading: DemoLoading,
  }),
  "radio-group": dynamic(() => import("./demos/radio-group-demo"), {
    loading: DemoLoading,
  }),
  select: dynamic(() => import("./demos/select-demo"), {
    loading: DemoLoading,
  }),
  slider: dynamic(() => import("./demos/slider-demo"), {
    loading: DemoLoading,
  }),
  switch: dynamic(() => import("./demos/switch-demo"), {
    loading: DemoLoading,
  }),
  textarea: dynamic(() => import("./demos/textarea-demo"), {
    loading: DemoLoading,
  }),
  toggle: dynamic(() => import("./demos/toggle-demo"), {
    loading: DemoLoading,
  }),
  "toggle-group": dynamic(() => import("./demos/toggle-group-demo"), {
    loading: DemoLoading,
  }),
} satisfies DemoRegistry

export function FormInputsGallery({
  entries,
}: {
  entries: readonly SurfaceCatalogEntry[]
}) {
  return <DemoGrid entries={entries} demos={demos} />
}
