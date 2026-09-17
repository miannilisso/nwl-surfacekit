export type SurfaceKind = "component" | "pattern"

export type SurfaceCategory =
  | "form-inputs"
  | "navigation"
  | "dialogs-overlays"
  | "data-display"
  | "feedback"
  | "layout-utilities"
  | "patterns"

export type SurfaceCatalogEntry = {
  readonly id: string
  readonly name: string
  readonly kind: SurfaceKind
  readonly category: SurfaceCategory
  readonly route: string
  readonly description: string
  readonly storyTitle: string
}

export const surfaceCategories = [
  {
    id: "form-inputs",
    name: "Form Inputs",
    route: "/playground/form-inputs",
  },
  { id: "navigation", name: "Navigation", route: "/playground/navigation" },
  {
    id: "dialogs-overlays",
    name: "Dialogs & Overlays",
    route: "/playground/dialogs-overlays",
  },
  {
    id: "data-display",
    name: "Data Display",
    route: "/playground/data-display",
  },
  { id: "feedback", name: "Feedback", route: "/playground/feedback" },
  {
    id: "layout-utilities",
    name: "Layout & Utilities",
    route: "/playground/layout-utilities",
  },
  { id: "patterns", name: "Patterns", route: "/playground/patterns" },
] as const satisfies ReadonlyArray<{
  id: SurfaceCategory
  name: string
  route: string
}>

type SurfaceSeed = readonly [
  id: string,
  name: string,
  description: string,
  storyTitle: string,
]

function group(
  category: SurfaceCategory,
  kind: SurfaceKind,
  entries: readonly SurfaceSeed[]
): SurfaceCatalogEntry[] {
  const route = surfaceCategories.find((item) => item.id === category)?.route
  if (!route) throw new Error(`Unknown SurfaceKit category: ${category}`)

  return entries.map(([id, name, description, storyTitle]) => ({
    id,
    name,
    kind,
    category,
    route,
    description,
    storyTitle,
  }))
}

export const surfaceCatalog: readonly SurfaceCatalogEntry[] = [
  ...group("form-inputs", "component", [
    [
      "button",
      "Button",
      "Triggers a clear user action with accessible states and variants.",
      "SurfaceKit/Components/Form Inputs/Button",
    ],
    [
      "button-group",
      "Button Group",
      "Groups related actions into a unified control surface.",
      "SurfaceKit/Components/Form Inputs/Button Group",
    ],
    [
      "calendar",
      "Calendar",
      "Supports keyboard-accessible date selection and navigation.",
      "SurfaceKit/Components/Form Inputs/Calendar",
    ],
    [
      "checkbox",
      "Checkbox",
      "Captures binary or indeterminate choices with accessible state.",
      "SurfaceKit/Components/Form Inputs/Checkbox",
    ],
    [
      "combobox",
      "Combobox",
      "Filters and selects values from a searchable option list.",
      "SurfaceKit/Components/Form Inputs/Combobox",
    ],
    [
      "field",
      "Field",
      "Composes labels, help text, controls, and validation messages.",
      "SurfaceKit/Components/Form Inputs/Field",
    ],
    [
      "input",
      "Input",
      "Collects a single line of typed user input.",
      "SurfaceKit/Components/Form Inputs/Input",
    ],
    [
      "input-group",
      "Input Group",
      "Combines an input with contextual actions and adornments.",
      "SurfaceKit/Components/Form Inputs/Input Group",
    ],
    [
      "input-otp",
      "Input OTP",
      "Collects segmented one-time verification codes.",
      "SurfaceKit/Components/Form Inputs/Input OTP",
    ],
    [
      "password-input",
      "Password Input",
      "Collects a current or new password with controlled visibility.",
      "SurfaceKit/Components/Form Inputs/Password Input",
    ],
    [
      "label",
      "Label",
      "Provides an accessible name for a form control.",
      "SurfaceKit/Components/Form Inputs/Label",
    ],
    [
      "native-select",
      "Native Select",
      "Uses platform-native selection behavior with SurfaceKit styling.",
      "SurfaceKit/Components/Form Inputs/Native Select",
    ],
    [
      "radio-group",
      "Radio Group",
      "Selects one value from a mutually exclusive set.",
      "SurfaceKit/Components/Form Inputs/Radio Group",
    ],
    [
      "select",
      "Select",
      "Selects one option from an accessible popup list.",
      "SurfaceKit/Components/Form Inputs/Select",
    ],
    [
      "slider",
      "Slider",
      "Adjusts a numeric value within a bounded range.",
      "SurfaceKit/Components/Form Inputs/Slider",
    ],
    [
      "switch",
      "Switch",
      "Toggles an immediate setting on or off.",
      "SurfaceKit/Components/Form Inputs/Switch",
    ],
    [
      "textarea",
      "Textarea",
      "Collects longer, multiline user input.",
      "SurfaceKit/Components/Form Inputs/Textarea",
    ],
    [
      "toggle",
      "Toggle",
      "Represents a pressable on-or-off formatting choice.",
      "SurfaceKit/Components/Form Inputs/Toggle",
    ],
    [
      "toggle-group",
      "Toggle Group",
      "Coordinates one or more related toggle choices.",
      "SurfaceKit/Components/Form Inputs/Toggle Group",
    ],
  ]),
  ...group("navigation", "component", [
    [
      "breadcrumb",
      "Breadcrumb",
      "Shows hierarchy and the user’s current location.",
      "SurfaceKit/Components/Navigation & Disclosure/Breadcrumb",
    ],
    [
      "menubar",
      "Menubar",
      "Organizes application commands into keyboard-navigable menus.",
      "SurfaceKit/Components/Navigation & Disclosure/Menubar",
    ],
    [
      "navigation-menu",
      "Navigation Menu",
      "Presents structured site navigation with rich disclosures.",
      "SurfaceKit/Components/Navigation & Disclosure/Navigation Menu",
    ],
    [
      "pagination",
      "Pagination",
      "Moves through a bounded collection of result pages.",
      "SurfaceKit/Components/Navigation & Disclosure/Pagination",
    ],
    [
      "tabs",
      "Tabs",
      "Switches between related panels without leaving the page.",
      "SurfaceKit/Components/Navigation & Disclosure/Tabs",
    ],
  ]),
  ...group("dialogs-overlays", "component", [
    [
      "alert-dialog",
      "Alert Dialog",
      "Requires an explicit decision for a consequential action.",
      "SurfaceKit/Components/Overlays & Dialogs/Alert Dialog",
    ],
    [
      "command",
      "Command",
      "Filters and invokes commands from a keyboard-first palette.",
      "SurfaceKit/Components/Command & Menus/Command",
    ],
    [
      "context-menu",
      "Context Menu",
      "Offers contextual actions from a pointer gesture.",
      "SurfaceKit/Components/Command & Menus/Context Menu",
    ],
    [
      "dialog",
      "Dialog",
      "Focuses attention on a modal task or decision.",
      "SurfaceKit/Components/Overlays & Dialogs/Dialog",
    ],
    [
      "drawer",
      "Drawer",
      "Reveals a touch-friendly task surface from a viewport edge.",
      "SurfaceKit/Components/Overlays & Dialogs/Drawer",
    ],
    [
      "dropdown-menu",
      "Dropdown Menu",
      "Presents actions and choices from a compact trigger.",
      "SurfaceKit/Components/Command & Menus/Dropdown Menu",
    ],
    [
      "hover-card",
      "Hover Card",
      "Previews supplemental content on hover or keyboard focus.",
      "SurfaceKit/Components/Overlays & Dialogs/Hover Card",
    ],
    [
      "popover",
      "Popover",
      "Places contextual interactive content beside a trigger.",
      "SurfaceKit/Components/Overlays & Dialogs/Popover",
    ],
    [
      "sheet",
      "Sheet",
      "Opens a modal panel from the side of the viewport.",
      "SurfaceKit/Components/Overlays & Dialogs/Sheet",
    ],
    [
      "toast",
      "Toast",
      "Announces transient outcomes without interrupting the workflow.",
      "SurfaceKit/Components/Command & Menus/Toast",
    ],
    [
      "tooltip",
      "Tooltip",
      "Explains a control through concise hover and focus content.",
      "SurfaceKit/Components/Overlays & Dialogs/Tooltip",
    ],
  ]),
  ...group("data-display", "component", [
    [
      "attachment",
      "Attachment",
      "Displays file metadata with download and removal actions.",
      "SurfaceKit/Components/Content & Status/Attachment",
    ],
    [
      "avatar",
      "Avatar",
      "Represents a person or entity with image and fallback states.",
      "SurfaceKit/Components/Data Display/Avatar",
    ],
    [
      "badge",
      "Badge",
      "Highlights compact metadata, status, or categorization.",
      "SurfaceKit/Components/Data Display/Badge",
    ],
    [
      "bubble",
      "Bubble",
      "Frames inbound and outbound conversational content.",
      "SurfaceKit/Components/Content & Status/Bubble",
    ],
    [
      "card",
      "Card",
      "Groups related content and actions on one surface.",
      "SurfaceKit/Components/Data Display/Card",
    ],
    [
      "carousel",
      "Carousel",
      "Navigates a sequenced collection of visual items.",
      "SurfaceKit/Components/Advanced/Carousel",
    ],
    [
      "chart",
      "Chart",
      "Visualizes quantitative data with accessible legends and tooltips.",
      "SurfaceKit/Components/Advanced/Chart",
    ],
    [
      "item",
      "Item",
      "Composes structured list content, metadata, and actions.",
      "SurfaceKit/Components/Content & Status/Item",
    ],
    [
      "marker",
      "Marker",
      "Annotates content with a compact semantic indicator.",
      "SurfaceKit/Components/Content & Status/Marker",
    ],
    [
      "message",
      "Message",
      "Structures authored conversational content and metadata.",
      "SurfaceKit/Components/Content & Status/Message",
    ],
    [
      "message-scroller",
      "Message Scroller",
      "Keeps streaming messages readable with jump-to-latest behavior.",
      "SurfaceKit/Components/Advanced/Message Scroller",
    ],
    [
      "progress",
      "Progress",
      "Communicates determinate or indeterminate task completion.",
      "SurfaceKit/Components/Content & Status/Progress",
    ],
    [
      "table",
      "Table",
      "Presents structured records with semantic headers and summaries.",
      "SurfaceKit/Components/Content & Status/Table",
    ],
  ]),
  ...group("feedback", "component", [
    [
      "alert",
      "Alert",
      "Communicates important informational or destructive feedback.",
      "SurfaceKit/Components/Content & Status/Alert",
    ],
    [
      "empty",
      "Empty",
      "Explains an empty state and offers a next action.",
      "SurfaceKit/Components/Content & Status/Empty",
    ],
    [
      "skeleton",
      "Skeleton",
      "Reserves layout while content is loading.",
      "SurfaceKit/Components/Feedback/Skeleton",
    ],
    [
      "spinner",
      "Spinner",
      "Signals an active operation with indeterminate progress.",
      "SurfaceKit/Components/Feedback/Spinner",
    ],
  ]),
  ...group("layout-utilities", "component", [
    [
      "accordion",
      "Accordion",
      "Reveals sections of content through accessible disclosure controls.",
      "SurfaceKit/Components/Navigation & Disclosure/Accordion",
    ],
    [
      "aspect-ratio",
      "Aspect Ratio",
      "Maintains a stable proportional media frame.",
      "SurfaceKit/Components/Layout & Utilities/Aspect Ratio",
    ],
    [
      "collapsible",
      "Collapsible",
      "Shows or hides a single region of supporting content.",
      "SurfaceKit/Components/Navigation & Disclosure/Collapsible",
    ],
    [
      "direction",
      "Direction",
      "Applies left-to-right or right-to-left reading direction.",
      "SurfaceKit/Components/Advanced/Direction",
    ],
    [
      "kbd",
      "Kbd",
      "Displays keyboard shortcuts with consistent semantics.",
      "SurfaceKit/Components/Layout & Utilities/Kbd",
    ],
    [
      "resizable",
      "Resizable",
      "Lets users resize adjacent content panels.",
      "SurfaceKit/Components/Advanced/Resizable",
    ],
    [
      "scroll-area",
      "Scroll Area",
      "Provides bounded, styled overflow navigation.",
      "SurfaceKit/Components/Advanced/Scroll Area",
    ],
    [
      "separator",
      "Separator",
      "Visually and semantically divides related content.",
      "SurfaceKit/Components/Layout & Utilities/Separator",
    ],
    [
      "sidebar",
      "Sidebar",
      "Composes responsive application navigation and supporting controls.",
      "SurfaceKit/Components/Advanced/Sidebar",
    ],
  ]),
  ...group("patterns", "pattern", [
    [
      "app-shell",
      "App Shell",
      "Provides an enterprise application frame with topbar and navigation.",
      "SurfaceKit/Patterns/App Shell",
    ],
    [
      "auth-shell",
      "Auth Shell",
      "Frames provider-neutral sign-in and verification workflows.",
      "SurfaceKit/Patterns/Auth Shell",
    ],
    [
      "auth-form",
      "Auth Form",
      "Composes controlled sign-in, signup, recovery, and request states.",
      "SurfaceKit/Patterns/Auth Form",
    ],
    [
      "confirm-danger-action",
      "Confirm Danger Action",
      "Confirms destructive operations with pending and error states.",
      "SurfaceKit/Patterns/Confirm Danger Action",
    ],
    [
      "data-table-toolbar",
      "Data Table Toolbar",
      "Coordinates search, filters, export, and creation actions.",
      "SurfaceKit/Patterns/Data Table Toolbar",
    ],
    [
      "error-summary",
      "Error Summary",
      "Collects validation failures into an actionable summary.",
      "SurfaceKit/Patterns/Error Summary",
    ],
    [
      "incident-banner",
      "Incident Banner",
      "Announces operational incidents with severity-aware actions.",
      "SurfaceKit/Patterns/Incident Banner",
    ],
    [
      "permission-gate",
      "Permission Gate",
      "Explains and controls access to permission-protected content.",
      "SurfaceKit/Patterns/Permission Gate",
    ],
    [
      "resource-status",
      "Resource Status",
      "Summarizes resource health and progress states.",
      "SurfaceKit/Patterns/Resource Status",
    ],
    [
      "security-challenge",
      "Security Challenge",
      "Collects controlled verification or recovery codes without proving identity.",
      "SurfaceKit/Patterns/Security Challenge",
    ],
    [
      "step-up-dialog",
      "Step Up Dialog",
      "Requests additional verification before a sensitive action.",
      "SurfaceKit/Patterns/Step Up Dialog",
    ],
    [
      "web-shell",
      "Web Shell",
      "Frames public marketing and documentation content.",
      "SurfaceKit/Patterns/Web Shell",
    ],
  ]),
]

export function getSurfaceById(id: string) {
  return surfaceCatalog.find((entry) => entry.id === id)
}

export function getSurfacesByCategory(category: SurfaceCategory) {
  return surfaceCatalog.filter((entry) => entry.category === category)
}

export function getSurfaceCounts() {
  const components = surfaceCatalog.filter(
    (entry) => entry.kind === "component"
  ).length
  const patterns = surfaceCatalog.length - components
  return { components, patterns, total: surfaceCatalog.length }
}
