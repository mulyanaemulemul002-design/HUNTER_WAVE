---
name: Workspace dependency linking
description: Replit workspace dependency state can lag behind declared package and lockfile state.
---

When a package is already declared in a workspace package and present in the lockfile but missing from node_modules, repair the local install with a filtered frozen-lockfile install before changing application code or configuration.

**Why:** The frontend build failed only because the workspace package symlink for an existing test dependency was absent; the lockfile and package manifest were already correct.

**How to apply:** Check the package manifest, lockfile, and package-local node_modules first. Prefer `pnpm install --filter <workspace-package> --frozen-lockfile` for a declared dependency, then rerun the build/test check.