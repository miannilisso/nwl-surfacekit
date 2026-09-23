export default {
  build: {
    outDir: "dist-button",
    lib: {
      entry: "src/button-entry.ts",
      formats: ["es"],
      fileName: "button",
    },
    minify: true,
    rolldownOptions: {
      external: [/^react(?:-dom)?(?:\/.*)?$/],
      output: { minify: true },
    },
  },
}
