import "@nwl/surfacekit/globals.css"
import type { Preview } from "@storybook/react"

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      context: "#storybook-root",
      config: {},
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      },
    },
  },
}

export default preview
