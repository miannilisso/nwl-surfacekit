# `@nwl/typescript-config`

Shared typescript configuration for the workspace.

## Configs

- `base.json` is the shared strict baseline.
- `nextjs.json` is used by the Next.js app.
- `react-library.json` is used by `@nwl/surfacekit` and uses
  `moduleResolution: "Bundler"` with `module: "ESNext"` so workspace TypeScript
  source resolves in Next/Turbopack and Storybook/Vite.

The verified compiler is TypeScript `5.9.3`. This is an explicit compatibility
hold because typescript-eslint `8.67.0` supports TypeScript versions below
`6.1.0`; do not adopt the registry's newer TypeScript major until the lint
toolchain declares it supported and the full verification matrix passes.

The configs enable strict checking, `noUncheckedIndexedAccess`, declaration
metadata, and modern ES2022/DOM libraries. They are private workspace presets,
not published consumer configurations. `@nwl/surfacekit` currently runs
`tsc --noEmit`; declaration emission and distribution require a separate build
configuration that excludes tests and maps output paths to the package exports.
