---
name: Frontend test runtime
description: Runtime compatibility note for DOM-based frontend tests in this workspace.
---

DOM-based Vitest tests need a jsdom major compatible with the workspace Node runtime; newer jsdom releases can fail before tests start when they depend on unavailable webidl APIs.

**Why:** The newest jsdom release failed while initializing Vitest, before any test could run.

**How to apply:** When adding or upgrading DOM test dependencies, verify the test runner starts in the workspace runtime before keeping the upgrade.