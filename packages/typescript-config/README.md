# `@nwl/typescript-config`

Private TypeScript configurations for the workspace. Consumers extend the JSON
file through the workspace package; the files are not public npm exports.

## Configs

- `base.json` is the shared strict baseline.
- `nextjs.json` is used by the Next.js app.
- `react-library.json` is extended by `packages/ui/tsconfig.json` and its
  distribution build config. It uses `moduleResolution: "Bundler"` with
  `module: "ESNext"` and `jsx: "react-jsx"`.

The current compiler is TypeScript `6.0.3`. This is an explicit compatibility
hold because [typescript-eslint supports TypeScript versions below
`6.1.0`](https://typescript-eslint.io/users/dependency-versions/); do not adopt
TypeScript 7 until the lint
toolchain declares it supported and the full verification matrix passes.

The configs enable strict checking, `noUncheckedIndexedAccess`, declaration
metadata, and modern ES2022/DOM libraries. They are private workspace presets,
not published consumer configurations. `@nwl/surfacekit` runs `tsc --noEmit`
for type checks and a separate `tsconfig.build.json` for compiled JavaScript,
declarations, and maps. The latter excludes tests and resolves public exports
to `dist` through the package build. Run `pnpm typecheck` and
`pnpm --filter @nwl/surfacekit build` after changing a shared preset.
