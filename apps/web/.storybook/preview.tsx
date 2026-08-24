import "@nwl/surfacekit/globals.css"
import type { Preview } from "@storybook/react-vite"

import { withSurfaceKitTheme } from "./theme-decorator"

const preview: Preview = {
  decorators: [withSurfaceKitTheme],
  globalTypes: {
    theme: {
      description: "Color scheme for every SurfaceKit story",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    controls: { expanded: true },
    a11y: {
      context: "body",
      config: {},
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      },
      test: "error",
    },
    options: {
      storySort: {
        order: ["SurfaceKit", ["Introduction", "Components", "Patterns"]],
      },
    },
  },
}

export default preview
