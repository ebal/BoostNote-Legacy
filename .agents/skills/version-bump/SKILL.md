---
name: version-bump
description: >
  Handles the full version bump workflow for BoostNote-Legacy. When the user
  says "bump to version X.Y.Z" or "bump version to X.Y.Z", this skill reads the
  current version, analyzes git log since the last bump, and updates all
  required files (package.json, CHANGELOG.md, readme.md, optionally UPGRADE.md).
  Trigger: "bump version", "bump to", "new version", "release X.Y.Z".
---

# Version Bump Workflow

## Steps

### 1. Read current version

Read `package.json` and record the current `"version"` field. Compute the new version from the user's request.

### 2. Analyze git log since last bump

```bash
git log --oneline --no-decorate HEAD
```

Find the most recent commit matching `chore: bump version to` — that's the last bump. Collect commits between that bump and HEAD.

### 3. Classify commits into changelog sections

Use these mapping rules:

| Commit prefix | CHANGELOG section |
|---|---|
| `feat:` | `### Added` |
| `feat!:`, `BREAKING:` | `### Removed` (note the breaking change) |
| `fix:` | `### Fixed` |
| `docs:`, `chore:`, `refactor:` | `### Changed` |
| `security:` | `### Security` |

Skip commits matching `chore: bump version to` entirely — they are not user-facing.

Format each entry as:
```
- Description of change ([`<short-sha>`](../../commit/<sha>)).
```

Use the commit subject line as the description (reword if it's a terse hash prefix like `(0.16.6)`). Group entries under their section heading. Omit any section that has no entries.

### 4. Update `package.json`

Edit the `"version"` field to the new version.

### 5. Update `CHANGELOG.md`

Insert a new block at the top (after the introductory paragraph, before the first `##`):

```markdown
## [NEW_VER] - YYYY-MM-DD

### Added / Changed / Fixed / Removed (only sections with entries)

- entries from step 3
```

At the **bottom** of the file, add a comparison link:

```markdown
[NEW_VER]: ../../compare/vOLD_VER...vNEW_VER
```

### 6. Update `readme.md`

Prepend a new row to the "Recent updates (v0.16.x)" table:

```markdown
| NEW_VER | Short description of the main change |
```

Keep the table in reverse chronological order (newest first).

### 7. Optionally update `UPGRADE.md`

Only if the bump involves a significant change (Electron version, build system, major feature removal). If updating:
- Add a row to the "Known versions" table
- Add a new "Iterations" section documenting source/target versions, changed files, build/test commands, verification

### 8. Commit

Stage all changed files and commit with the standard message:

```
chore: bump version to NEW_VER
```

Do NOT push. Do NOT create a tag.

## Rules

- Run on the **host** (not inside Docker) — this only edits text files and runs git.
- Do NOT invent changelog content — use actual commit subjects from the git log.
- Do NOT include the bump commit itself in the changelog.
- Do NOT include changes already listed in the previous release's changelog.
