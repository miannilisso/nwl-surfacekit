# Version and Release Policy

SurfaceKit follows Semantic Versioning. Breaking public API, peer dependency,
or behavior changes require a major version; backwards-compatible features use
a minor version; compatible fixes use a patch version.

The 1.0 release is distributed as an immutable GitHub Release tarball. Every
release must be built from a tagged commit, include generated attribution and
integrity artifacts, and pass the documented verification gate before
publication. The latest stable release receives security fixes; older releases
are supported only when explicitly documented in their release notes.
