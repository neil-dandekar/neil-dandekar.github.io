# Feature Summary: Remove Legacy Runtime

## Objective

Remove obsolete legacy runtime paths and enforce a React-only architecture with CI checks that prevent reintroduction of deprecated runtime files/directories.

## Branch Name

`chore/remove-legacy-runtime`

## Implementation Steps Taken

1. Removed deprecated legacy runtime directories:
   - `app/core/`
   - `app/legacy/`
   - `app/pages/`
2. Removed deprecated root runtime files and legacy thoughts HTML runtime assets.
3. Updated `README.md` to document the active React runtime and deployment model.
4. Updated `codex/DEVELOPMENT_GUIDE.md` with explicit React-only runtime boundaries and checklist guard.
5. Added `.github/workflows/pr-checks.yml` with:
   - Pull-request app build verification
   - Runtime guard checks for deprecated directories/files and shell duplication indicator

## Files Touched

- Removed: `app/core/*`, `app/legacy/*`, `app/pages/*`
- Removed: `content.js`, `entry.js`, `home-vanta.js`, `layout.js`, `site.js`, `styles.css`, `theme-core.js`, `theme.js`, `thoughts/index.html`, `tsconfig.json`
- Added: `.github/workflows/pr-checks.yml`
- Updated: `README.md`
- Updated: `codex/DEVELOPMENT_GUIDE.md`
- Added: `codex/feats/remove-legacy-runtime/spec.md`
- Added: `codex/feature-summaries/remove-legacy-runtime.md`
- Updated: `codex/logs/react-remediation-execution.md`

## Validation Evidence

- `npm run build --prefix app` passed.
- Runtime guard checks passed locally (legacy directories/files absent; one active topbar shell definition).

## Tradeoffs

- This removes rollback convenience to legacy runtime files in-repo; rollback now relies on git history/branches.
- Guard checks are intentionally opinionated and can fail if architecture policy changes later.

## Follow-ups

- If needed, extend CI with preview/deploy smoke tests against route deep links.
- Consider adding visual regression checks for glass/theme styling.

## Maintainer Checklist Confirmation

- [x] No root bloat introduced.
- [x] No duplicate layout shells introduced.
- [x] Feature summary exists and is complete.
- [x] Tradeoffs and follow-ups are documented.
