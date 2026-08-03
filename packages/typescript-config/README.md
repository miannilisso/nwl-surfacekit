# `@nwl/typescript-config`

Shared typescript configuration for the workspace.

## Configs

- `base.json` is the shared strict baseline.
- `nextjs.json` is used by the Next.js app.
- `react-library.json` is used by `@nwl/surfacekit` and now uses `moduleResolution: "Bundler"` with `module: "ESNext"` so workspace TypeScript source resolves cleanly in Next/Turbopack and Storybook/Vite.
