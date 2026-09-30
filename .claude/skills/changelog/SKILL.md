---
name: changelog
description: Create or update CHANGELOG.md at the git repo root, grouping commits under date headings (## YYYY-MM-DD). Use when the user asks to update the changelog or invokes this before merging a branch. On first run (no CHANGELOG.md) it builds the full history from git commits; on later runs it appends only commits made since the last run.
---

# Changelog maintenance

Maintain a hand-readable `CHANGELOG.md` at the **git repo root**, with one
`## YYYY-MM-DD` heading per date and a bullet per commit. This skill is invoked
manually, typically right before merging a branch, so the changelog captures the
work about to land.

"Project root" here means the git repository root — resolve it with
`git rev-parse --show-toplevel` and operate on `<root>/CHANGELOG.md`. Do not
create per-subdirectory changelogs.

## How it decides what to add

The file carries a hidden cursor marking the last commit already recorded:

```
<!-- changelog-cursor: <full-commit-sha> -->
```

1. **Resolve paths.** `ROOT=$(git rev-parse --show-toplevel)`; the file is
   `$ROOT/CHANGELOG.md`. `HEAD=$(git rev-parse HEAD)`.
2. **Pick the commit range:**
   - **No `CHANGELOG.md`** → first run. Range is the entire history: all commits
     reachable from `HEAD`.
   - **File has a cursor** → range is `<cursor>..HEAD` (commits since last run).
   - **File exists but has no cursor** (hand-written earlier) → find the newest
     `## YYYY-MM-DD` heading already present; take commits with an author date on
     or after that date, and skip any whose subject is already listed under its
     date heading (avoid duplicates). Add a cursor going forward.
   - If the range is empty (nothing new since the cursor), report "changelog is
     already up to date" and make no edits.
3. **List the commits** in the range, newest first, excluding merge commits:

   ```bash
   git -C "$ROOT" log --no-merges --date=short \
     --pretty=format:'%H%x09%ad%x09%h%x09%s' <range>
   ```

   Each line is: `full-sha <TAB> YYYY-MM-DD <TAB> short-sha <TAB> subject`.
   Optionally drop commits that only touch `CHANGELOG.md` itself.

## How to write the entries

- Group the commits by their date (the `YYYY-MM-DD` field).
- Newest date at the top of the file; within a date, newest commit first.
- Each bullet: `` - <subject> (`<short-sha>`) ``.
- If a `## <date>` heading already exists, insert the new bullets at the top of
  that section rather than creating a duplicate heading.
- Preserve everything already in the file — only add, never rewrite existing
  entries.
- Update the cursor marker to the current `HEAD` sha.

## File shape

A fresh file looks like:

```markdown
# Changelog

All notable changes to this project, grouped by date. Newest first.

<!-- changelog-cursor: 0123456789abcdef0123456789abcdef01234567 -->

## 2026-09-30
- Combine roadmap phases 2-5 into a new Phase 2 (`cf64c3b`)
- Make responsive design a product-wide baseline (`32cff5f`)

## 2026-03-30
- feature specification (`350f9bb`)
```

## Finishing

- Save the file. Do **not** commit or merge — leave that to the user, since this
  runs as a pre-merge step and the user controls the merge.
- Report a short summary: which dates/commits were added, and that the cursor was
  advanced to `HEAD`. If nothing was new, say so.
