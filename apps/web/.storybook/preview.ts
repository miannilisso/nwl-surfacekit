import "@nwl/surfacekit/globals.css"
import type { Preview } from "@storybook/react-vite"

const preview: Preview = {
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
  },
}

export default preview
