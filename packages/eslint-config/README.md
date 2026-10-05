# `@nwl/eslint-config`

Private flat-config presets for the SurfaceKit workspace. Shared exact versions
are managed by the root `pnpm-workspace.yaml` catalog.

## Exports

- `@nwl/eslint-config/base` — ESLint recommended rules, typescript-eslint,
  Prettier compatibility, Turbo environment checks, and repository ignores.
- `@nwl/eslint-config/react-internal` — the base preset plus React, browser,
  service-worker, and Hooks rules for `@nwl/surfacekit`.
- `@nwl/eslint-config/next-js` — the base preset plus React, Hooks, and Next.js
  core-web-vitals rules for `apps/web`.

`base` and `react-internal` export a named `config` array; `next-js` exports a
named `nextJsConfig` array. The root, package, and web ESLint configs import
these workspace presets. `base` also excludes generated `dist`, `.next`,
`.turbo`, and coverage output.

The current lint cohort is ESLint `10.12.0`, `@eslint/js` `10.0.1`,
typescript-eslint `8.71.0`, and `@next/eslint-plugin-next` `16.3.8` on Node
`^20.19.0 || ^22.13.0 || >=24.0.0`.

`eslint-plugin-react@7.37.5` does not yet publish an ESLint 10 peer range. The
presets wrap it with the official `@eslint/compat@2.1.1` rule adapter, and pnpm
allows only that exact plugin/ESLint 10 pairing after the full workspace lint
passes. Remove the adapter and peer exception when the plugin officially
supports ESLint 10; do not broaden the exception to other plugins or versions.

These presets are repository infrastructure, not a supported external package.
Run `pnpm lint` from the root after changing a preset. The primary
`verify.yml` job runs the full gate on Node 20; secondary Node 22/24 jobs run
types, contracts, Next config, license, and consumer gates. That remote matrix
has not yet produced successful jobs.
