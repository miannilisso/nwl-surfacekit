# Dependency modernization and packaging evidence

Date: 2026-08-24

Repository baseline: [`ede7b4f5de4f835023f99281ee6118950102a566`](https://github.com/miannilisso/nwl-surfacekit/tree/ede7b4f5de4f835023f99281ee6118950102a566)

Status: historical compatibility snapshot. The candidate versions and
actionable constraints below record the August decision point; they are not
the current repository pins. The 2026-10-05 toolchain, verification results,
and intentional compatibility holds are recorded in the
[current enterprise-readiness audit](2026-08-24-surfacekit-enterprise-readiness.md).

Scope: dependency compatibility and the `@nwl/surfacekit` package contract; no dependency or configuration changes are made by this document.

## Executive conclusion

The proposed dependency set is mostly compatible when it is treated as coordinated cohorts rather than unrelated upgrades:

- ESLint `10.9.0`, `@eslint/js` `10.0.1`, and typescript-eslint `8.67.0` agree on ESLint 10, while typescript-eslint requires TypeScript `>=4.8.4 <6.1.0`. Therefore TypeScript `5.9.3` should remain pinned for this migration rather than following the registry's newer TypeScript major. ([ESLint metadata](https://registry.npmjs.org/eslint/10.9.0), [`@eslint/js` metadata](https://registry.npmjs.org/@eslint%2fjs/10.0.1), [typescript-eslint compatibility](https://typescript-eslint.io/users/dependency-versions/), [typescript-eslint `8.67.0` metadata](https://registry.npmjs.org/typescript-eslint/8.67.0))
- Vite `8.2.2`, `@vitejs/plugin-react` `6.1.0`, Storybook `10.5.10`, and Vitest `4.1.11` publish mutually compatible peer ranges. The Vitest companion packages peer on the exact `4.1.11` patch, while the Storybook add-ons accept `^10.5.10`; align each cohort to the selected patch to avoid a mixed release surface. ([Vite metadata](https://registry.npmjs.org/vite/8.2.2), [`@vitejs/plugin-react` metadata](https://registry.npmjs.org/@vitejs%2fplugin-react/6.1.0), [`@storybook/react-vite` metadata](https://registry.npmjs.org/@storybook%2freact-vite/10.5.10), [Storybook a11y addon metadata](https://registry.npmjs.org/@storybook%2faddon-a11y/10.5.10), [Storybook Vitest addon metadata](https://registry.npmjs.org/@storybook%2faddon-vitest/10.5.10), [Vitest metadata](https://registry.npmjs.org/vitest/4.1.11), [Vitest browser metadata](https://registry.npmjs.org/@vitest%2fbrowser-playwright/4.1.11))
- Next.js `16.3.2` is a bug-fix backport release, supports React 19, and requires Node `>=20.9.0`. It does not add a new major-version migration beyond the Next 16 rules already applicable to the baseline. ([Next.js `16.3.2` release](https://github.com/vercel/next.js/releases/tag/v16.3.2), [Next.js `16.3.2` metadata](https://registry.npmjs.org/next/16.3.2))
- The supported runtime intersection is ESLint's narrower Node range, `^20.19.0 || ^22.13.0 || >=24`. The baseline repository declaration `>=20.19.0` is too broad because it admits Node 21, Node 23, and Node 22.0-22.12, which ESLint 10 does not support. ([baseline root manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/package.json), [ESLint 10 release requirements](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/), [Vite 8 Node support](https://vite.dev/blog/announcing-vite8#node-js-support))
- One peer-contract blocker remains: the latest `eslint-plugin-react@7.37.5` declares ESLint only through `^9.7`, not ESLint 10. A successful forced install would not turn that undeclared combination into a supported one. The migration must either wait for/choose a plugin version that declares ESLint 10, replace/remove that plugin, or retain ESLint 9 until this is resolved. ([`eslint-plugin-react@7.37.5` metadata](https://registry.npmjs.org/eslint-plugin-react/7.37.5))
- The baseline `@nwl/surfacekit` manifest is not publication-ready: it is private, has no `files` allowlist, emits no build artifacts, exports raw TypeScript/TSX source paths, has no root `"."` export, and installs React/React DOM as ordinary dependencies. A package contract and tarball-consumer gate are required before publication. ([baseline UI manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/ui/package.json), [npm package manifest rules](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/), [Node package entry points](https://nodejs.org/api/packages.html#package-entry-points))

## Verified repository baseline and target set

The working tree was clean on `main...origin/main` when the baseline was recorded. The exact baseline values below are permanently anchored to commit `ede7b4f`; this avoids confusing them with dependency edits made later in the shared working tree. The catalog and package layout are primary repository evidence. ([baseline catalog](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/pnpm-workspace.yaml), [baseline root manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/package.json))

| Cohort             | Baseline                                                       | Registry-verified candidate                                                                                                                                | Compatibility status                                                                                        |
| ------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ESLint             | `eslint` / `@eslint/js` `9.39.4`                               | [`eslint@10.9.0`](https://registry.npmjs.org/eslint/10.9.0) / [`@eslint/js@10.0.1`](https://registry.npmjs.org/@eslint%2fjs/10.0.1)                        | Pair is compatible; `eslint-plugin-react` blocks a fully supported stack.                                   |
| Type-aware linting | typescript-eslint, parser, plugin `8.66.0`; TypeScript `5.9.3` | [`8.67.0`](https://github.com/typescript-eslint/typescript-eslint/releases/tag/v8.67.0); retain TypeScript `5.9.3`                                         | Supports ESLint 10 and TypeScript `<6.1.0`.                                                                 |
| Vite/React plugin  | Vite `6.4.3`; plugin `4.7.0`                                   | [`vite@8.2.2`](https://registry.npmjs.org/vite/8.2.2); [`@vitejs/plugin-react@6.1.0`](https://registry.npmjs.org/@vitejs%2fplugin-react/6.1.0)             | Compatible pair; this is a bundler/compiler migration, not a routine patch.                                 |
| Next.js            | Next and Next ESLint plugin `16.3.0`                           | [`next@16.3.2`](https://registry.npmjs.org/next/16.3.2); [`@next/eslint-plugin-next@16.3.2`](https://registry.npmjs.org/@next%2feslint-plugin-next/16.3.2) | Compatible with React 19; patch release.                                                                    |
| Storybook          | core, React-Vite, a11y, Vitest addon `10.5.7`                  | [`10.5.10`](https://github.com/storybookjs/storybook/releases/tag/v10.5.10) for the full cohort                                                            | Compatible with Vite 8, React 19, and Vitest 4; keep versions aligned.                                      |
| Vitest             | core, browser-playwright, coverage-v8 `4.1.10`                 | [`4.1.11`](https://github.com/vitest-dev/vitest/releases/tag/v4.1.11) for the full cohort                                                                  | Compatible with Vite 8; companions require exact `4.1.11`.                                                  |
| React              | React / React DOM `19.2.8`                                     | retain `19.2.8`                                                                                                                                            | Supported by Next `16.3.2` and Storybook `10.5.10`; packaging placement must change for a reusable library. |

## ESLint 10 and typescript-eslint constraints

ESLint 10 removes eslintrc support, changes configuration lookup to start from each linted file, updates `eslint:recommended`, and removes deprecated rule/plugin APIs. It also requires Node `^20.19.0 || ^22.13.0 || >=24`. These are user-visible and plugin-visible breaking changes, so a green install alone is not sufficient evidence. ([ESLint 10 release](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/), [ESLint 10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0))

The package lint tasks already use flat config arrays and import `js.configs.recommended`, which avoids the removed legacy format for those tasks. The repository still contains a root `.eslintrc.js`; ESLint 10 will ignore it, so confirm that no direct root invocation depended on its ignore-only settings. The updated recommended rules can also legitimately change lint results. The new per-file lookup makes it important to execute lint through the package-level configs, as the Turborepo scripts currently do. ([baseline shared base config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/eslint-config/base.js), [baseline Next config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/eslint-config/next.js), [baseline root eslintrc](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/.eslintrc.js), [baseline root scripts](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/package.json))

Peer contracts for the existing lint stack are not uniform:

- `@eslint/js@10.0.1` explicitly peers on `eslint ^10.0.0`, so the two packages must move together. ([package metadata](https://registry.npmjs.org/@eslint%2fjs/10.0.1))
- `typescript-eslint`, its parser, and its plugin at `8.67.0` support ESLint 8.57, 9, and 10, and support TypeScript `>=4.8.4 <6.1.0`. All three first-party packages should remain on the identical patch. ([official compatibility page](https://typescript-eslint.io/users/dependency-versions/), [`typescript-eslint` metadata](https://registry.npmjs.org/typescript-eslint/8.67.0), [parser metadata](https://registry.npmjs.org/@typescript-eslint%2fparser/8.67.0), [plugin metadata](https://registry.npmjs.org/@typescript-eslint%2feslint-plugin/8.67.0))
- `eslint-plugin-react-hooks@7.1.1` declares ESLint 10 support; `eslint-config-prettier@10.1.8` accepts ESLint 7 and later; `eslint-plugin-turbo@2.10.11` accepts ESLint later than 6.6. ([React Hooks plugin metadata](https://registry.npmjs.org/eslint-plugin-react-hooks/7.1.1), [Prettier config metadata](https://registry.npmjs.org/eslint-config-prettier/10.1.8), [Turbo plugin metadata](https://registry.npmjs.org/eslint-plugin-turbo/2.10.11))
- `eslint-plugin-react@7.37.5` stops at ESLint `^9.7`. Because the repository consumes its flat recommended config in both React and Next shared configs, this is a direct migration blocker, not an unused transitive warning. ([plugin metadata](https://registry.npmjs.org/eslint-plugin-react/7.37.5), [baseline React config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/eslint-config/react-internal.js), [baseline Next config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/eslint-config/next.js))

Actionable constraint: retain TypeScript `5.9.3`, align all typescript-eslint packages at `8.67.0`, align ESLint and `@eslint/js` on major 10, and do not call the ESLint migration supported until the React plugin peer gap is resolved and the full lint task is green without ignored peer errors.

## Vite 8, plugin-react 6, Storybook, and Vitest constraints

Vite 8 replaces Rollup/esbuild internals with Rolldown/Oxc. It requires Node 20.19+ or 22.12+, defaults to newer browser targets, changes CommonJS interop, and deprecates `build.rollupOptions` in favor of `build.rolldownOptions`. Compatibility shims cover many existing options, but the migration guide explicitly calls for review of these behavior changes. ([Vite 8 announcement](https://vite.dev/blog/announcing-vite8), [Vite 8 migration guide](https://vite.dev/guide/migration))

`@vitejs/plugin-react` 6 uses Oxc for React Refresh and no longer depends on Babel by default. Its `6.1.0` manifest peers specifically on Vite `^8.0.0`; optional Babel/React Compiler packages are needed only when those opt-in paths are used. The current Storybook config calls `react()` without Babel or compiler options, so no new compiler peer is indicated by the repository configuration. ([Vite 8 plugin announcement](https://vite.dev/blog/announcing-vite8#vitejsplugin-react-v6), [plugin `6.1.0` metadata](https://registry.npmjs.org/@vitejs%2fplugin-react/6.1.0), [baseline Storybook config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/apps/web/.storybook/main.ts))

The same Storybook config uses `build.rollupOptions.onwarn`. Vite 8's compatibility layer may keep it operational, but `build.rollupOptions` is deprecated and the warning model now comes from Rolldown. Treat the existing warning suppression as a focused regression point: verify that only the intended Storybook `EVAL` warning is suppressed, and migrate the option based on the Vite 8 API rather than assuming Rollup behavior. ([baseline Storybook config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/apps/web/.storybook/main.ts), [Vite migration guide](https://vite.dev/guide/migration#rolldown))

Storybook `10.5.10` is already on the same major/minor as the baseline and is a patch cohort. Its release fixes tsconfig path-alias handling, bumps an internal Vitest dependency for a disclosed issue, and includes React metadata fixes. `@storybook/react-vite@10.5.10` accepts Vite 5-8, React/React DOM 16.8-19, TypeScript 4.9+, and Storybook `^10.5.10`; the add-ons peer on Storybook `^10.5.10`. ([Storybook `10.5.10` release](https://github.com/storybookjs/storybook/releases/tag/v10.5.10), [React-Vite metadata](https://registry.npmjs.org/@storybook%2freact-vite/10.5.10), [a11y addon metadata](https://registry.npmjs.org/@storybook%2faddon-a11y/10.5.10), [Vitest addon metadata](https://registry.npmjs.org/@storybook%2faddon-vitest/10.5.10))

Vitest `4.1.11` accepts Vite 6-8 and requires Node 20, 22, or 24+. Its browser Playwright and V8 coverage packages peer on exact Vitest `4.1.11`, so `vitest`, `@vitest/browser-playwright`, and `@vitest/coverage-v8` must be updated atomically. The release itself is a patch containing lifecycle, browser, and mocker fixes. ([Vitest metadata](https://registry.npmjs.org/vitest/4.1.11), [browser Playwright metadata](https://registry.npmjs.org/@vitest%2fbrowser-playwright/4.1.11), [coverage metadata](https://registry.npmjs.org/@vitest%2fcoverage-v8/4.1.11), [Vitest `4.1.11` release](https://github.com/vitest-dev/vitest/releases/tag/v4.1.11))

Actionable constraint: update each Storybook package to `10.5.10` and each Vitest package to `4.1.11` in one lockfile operation; then run component coverage, Storybook browser tests, and a production Storybook build. Vite 8's Rolldown/Oxc changes also require the production application and Storybook outputs to be exercised, not just typechecked.

## Next.js 16.3.2 constraints and bundled documentation

The installed dependency now resolves to Next.js `16.3.2`, and version-matched documentation is present under `apps/web/node_modules/next/dist/docs/`, including:

- `01-app/02-guides/upgrading/version-16.md`
- `01-app/03-api-reference/05-config/03-eslint.md`

Those bundled documents were read as required by the repository's `AGENTS.md`. Their canonical online counterparts are the [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) and [Next.js ESLint guide](https://nextjs.org/docs/app/api-reference/config/eslint).

The guide establishes Node `20.9.0` and TypeScript `5.1.0` minimums, Turbopack as the default for `next dev` and `next build`, and removal of `next lint` in favor of the ESLint CLI. The baseline application already uses `next dev`, `next build`, and `eslint`, and its Next config has no custom webpack override, so these major-version requirements are already reflected in the repository shape. ([Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), [baseline web manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/apps/web/package.json), [baseline Next config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/apps/web/next.config.ts))

Next `16.3.2` requires Node `>=20.9.0` and accepts React/React DOM 18.2 or 19. The release note describes only backported bug fixes, including several Turbopack corrections; aligning `@next/eslint-plugin-next` to `16.3.2` keeps framework lint rules on the same patch. ([Next.js package metadata](https://registry.npmjs.org/next/16.3.2), [Next.js release](https://github.com/vercel/next.js/releases/tag/v16.3.2), [Next ESLint plugin metadata](https://registry.npmjs.org/@next%2feslint-plugin-next/16.3.2))

Actionable constraint: treat this as a patch upgrade, but verify `next build` and production Playwright because the patch specifically changes Turbopack behavior. Keep React and React DOM aligned at the same `19.2.8` patch.

## React 19 and the publishable package contract

React 19 is stable, and the React team explicitly describes libraries shipping Server Components as targeting React 19 through a peer dependency. Independently, npm defines `peerDependencies` as the mechanism for expressing compatibility with a host library without installing a private copy of that host. ([React 19 release](https://react.dev/blog/2024/12/05/react-19), [npm peer dependency rules](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#peerdependencies))

The baseline `@nwl/surfacekit` package puts `react` and `react-dom` in `dependencies`. For a reusable component library, the supported packaging contract should instead expose compatible React 19 ranges as peers while retaining React/React DOM as development dependencies for local builds and tests. This is an inference from the package's role and the official host-library contract; the exact lower bound should reflect the component code's tested API usage. Next `16.3.2` and Storybook `10.5.10` both publish peer ranges that include React 19. ([baseline UI manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/ui/package.json), [Next metadata](https://registry.npmjs.org/next/16.3.2), [Storybook React-Vite metadata](https://registry.npmjs.org/@storybook%2freact-vite/10.5.10))

The baseline package also has the following publication blockers:

1. `"private": true` causes npm to refuse publication. It should remain until the package contract is intentionally approved. ([baseline UI manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/ui/package.json), [npm `private` documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#private))
2. There is no `files` allowlist. npm's default is effectively all eligible files, so tests, internal docs, lint configuration, and source support files are candidates for the tarball. ([baseline UI manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/ui/package.json), [npm `files` documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#files))
3. The build script is `tsc --noEmit`, while exports point at raw `.ts`, `.tsx`, and CSS source. There are no JavaScript or declaration artifacts and no `main`/root `"."` entry point. Node's `exports` field encapsulates the package to only declared subpaths, and importers cannot use unlisted entry points. ([baseline UI manifest](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/packages/ui/package.json), [Node exports documentation](https://nodejs.org/api/packages.html#package-entry-points))
4. The export paths are currently tested through repository aliases that resolve directly to `packages/ui/src`, which does not prove that an installed tarball resolves or executes correctly. ([baseline Vitest config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/vitest.config.ts), [baseline Storybook Vitest config](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/vitest.storybook.config.ts))

A read-only `pnpm --filter @nwl/surfacekit pack --dry-run --json` confirmed the broad package surface: raw source, every `*.test.tsx`, internal documentation, and lint/TypeScript configuration were listed, with no emitted `dist` JavaScript or declarations. pnpm documents `--dry-run` as executing the packing flow without writing the tarball, specifically for inspecting contents. ([pnpm pack documentation](https://pnpm.io/cli/pack#--dry-run))

Catalog references are not themselves a publication blocker: pnpm replaces `catalog:` specifications with ordinary version ranges during pack/publish, just as it rewrites `workspace:` references. The packed manifest must still be inspected to confirm the chosen ranges are appropriate for consumers. ([pnpm catalog publishing](https://pnpm.io/catalogs#publishing), [pnpm workspace publishing](https://pnpm.io/workspaces#publishing-workspace-packages))

Actionable packaging constraint: define an explicit emitted-artifact contract (`files`, JavaScript format, declarations, CSS/config assets, root/subpath exports, and React peers), then verify the packed artifact rather than the source workspace. Do not clear `private` until that gate passes.

## Required migration and verification gates

1. Set the repository Node engine/CI matrix to the supported intersection `^20.19.0 || ^22.13.0 || >=24`; test at least the lowest supported Node 20 and the active LTS line. ([ESLint engine](https://registry.npmjs.org/eslint/10.9.0), [Vite engine](https://registry.npmjs.org/vite/8.2.2), [Next engine](https://registry.npmjs.org/next/16.3.2))
2. Keep TypeScript `5.9.3`; update `typescript-eslint`, parser, and plugin together to `8.67.0`. Do not adopt TypeScript 6.1+ until the selected typescript-eslint release declares it supported. ([typescript-eslint compatibility](https://typescript-eslint.io/users/dependency-versions/))
3. Resolve the `eslint-plugin-react` peer gap before accepting ESLint 10. Then run the full repository lint, checking both new `eslint:recommended` findings and config lookup from each package. ([ESLint migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0), [React plugin metadata](https://registry.npmjs.org/eslint-plugin-react/7.37.5))
4. Update Vite/plugin-react, all Storybook packages, and all Vitest packages as coherent cohorts. Review the Vite 8 migration guide and the Storybook `rollupOptions.onwarn` customization before relying on compatibility shims. ([Vite migration](https://vite.dev/guide/migration), [Storybook config baseline](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/apps/web/.storybook/main.ts))
5. Align Next and its ESLint plugin on `16.3.2`; verify with the locally bundled Next docs, `next build`, and production browser tests. ([Next release](https://github.com/vercel/next.js/releases/tag/v16.3.2), [Next 16 guide](https://nextjs.org/docs/app/guides/upgrading/version-16))
6. Run the repository's complete `verify:ci` gate after a frozen-lockfile install. Focused lint, Storybook, Vitest, or Next results are useful diagnostics but do not substitute for the aggregate gate. ([baseline verification script](https://github.com/miannilisso/nwl-surfacekit/blob/ede7b4f5de4f835023f99281ee6118950102a566/package.json))
7. For packaging, inspect `pnpm --filter @nwl/surfacekit pack --dry-run --json`, create a real tarball in a temporary directory only after the manifest is ready, and install that tarball into a clean consumer fixture. Test every documented export, CSS/config loading, type declarations, React singleton behavior, and both build-time and runtime resolution. ([pnpm pack](https://pnpm.io/cli/pack), [Node exports](https://nodejs.org/api/packages.html#package-entry-points))

## Decision record

- **Compatible now:** Next `16.3.2` + React `19.2.8`; Vite `8.2.2` + plugin-react `6.1.0`; Storybook `10.5.10` + Vite 8 + React 19; Vitest `4.1.11` + Vite 8; typescript-eslint `8.67.0` + ESLint 10 + TypeScript `5.9.3`.
- **Blocked:** declaring the whole ESLint 10 stack supported while `eslint-plugin-react@7.37.5` excludes ESLint 10 from its peer range.
- **Must remain pinned:** TypeScript below `6.1.0` for typescript-eslint `8.67.0`.
- **Not publishable yet:** `@nwl/surfacekit` until its emitted files, exports, types, React peers, tarball contents, and clean-consumer behavior are made explicit and verified.

Every compatibility statement above is based on first-party documentation, official project release notes, official registry manifests, or the repository's immutable baseline commit.

## Implementation note

The current implementation uses `@eslint/compat@2.1.1` to adapt
`eslint-plugin-react@7.37.5` to ESLint 10 and a pnpm `allowedVersions` rule
scoped to that exact plugin/version pair. `pnpm peers check` and the full
workspace lint pass with this configuration. This is an empirical repository
compatibility exception, not upstream peer support, and remains tracked until
`eslint-plugin-react` publishes an ESLint 10 range.

Source inspection also corrected the original unused-dependency assumption for
`@shadcn/react`: `message-scroller.tsx` imports
`@shadcn/react/message-scroller`, so the dependency was retained and upgraded
to `0.3.1`. The unused direct `date-fns` and `zod` declarations were removed.
