# Version and Release Policy

SurfaceKit follows Semantic Versioning. Breaking public API, peer dependency,
or behavior changes require a major version; backwards-compatible features use
a minor version; compatible fixes use a patch version.

The current package is `0.1.0` in a private repository. No stable release,
1.0 tag, or downloadable release tarball exists. The intended first external
distribution is the `surfacekit-v1.0.0` GitHub Release tarball; npm publication
is outside this workflow. `CHANGELOG.md` records work as Unreleased until a
release has actually been accepted.

## Release acceptance

The checked-in workflows are a proposed gate, not evidence that GitHub has run
it. Before creating the version tag, set the package to `1.0.0` in a separate
release-preparation change, review the changelog, and obtain a real successful
main-push `verification-required` job from `verify.yml`. Configure classic
`main` branch protection to require that job, a protected
`surfacekit-v1-release` environment, an active tag ruleset that prevents
updates and deletion without exclusions, and immutable releases. The preflight
also needs an administrator-read-capable `RELEASE_POLICY_TOKEN`. Verify these
settings and the exact tag commit before release. The [GitHub branch protection
guide](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule),
[ruleset guide](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository),
and [immutable releases guide](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)
describe those remote controls.

The release workflow checks version, ancestry, remote policy, and the latest
successful main workflow with real jobs. It then builds one tarball, records
SHA-256, generates SPDX/CycloneDX SBOMs and attestations, transfers and checks
the same bytes in clean Next/Vite consumers, and drafts a release with the
tarball (containing `NOTICE`), checksum, changelog, SBOMs, and attestation
bundles. After
the protected environment, it rechecks tag and immutable-release policy,
publishes the draft, and checks the published asset digest. GitHub documents
the [draft-first publication sequence](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases).

Consumers should download the release tarball and `SHA256SUMS`, run
`sha256sum -c SHA256SUMS` in a directory containing both files, then install
the verified `.tgz` alongside compatible React and React DOM 19 peers. A local
`pnpm pack` output is only a test artifact. If a release gate fails, keep the
tag/release unpublished and inspect the failed check or draft before retrying.

Once a stable release exists, the latest stable line receives security fixes;
older lines receive support only when their release notes say so. See
[SUPPORT.md](SUPPORT.md) and [SECURITY.md](SECURITY.md).
