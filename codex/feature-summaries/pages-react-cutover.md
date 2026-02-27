# Feature Summary: Pages React Cutover

## Objective

Cut production over to the React app deployment path, remove legacy `/app/pages/*` redirects from root entry files, and add Pages deployment + clean URL fallback handling.

## Branch Name

`feature/pages-react-cutover`

## Implementation Steps Taken

1. Added deterministic npm lockfile and completed React dependency resolution updates.
2. Added a GitHub Actions workflow that installs, builds, and deploys `app/dist` to GitHub Pages.
3. Added SPA deep-link fallback support via `app/public/404.html` and fallback restoration logic in `app/index.html`.
4. Updated root entry redirects (`index.html`, `notebook.html`, `experience/index.html`, `entry.html`) to clean React paths instead of `/app/pages/*`.
5. Added codex execution logging artifacts for remediation tracking.

## Files Touched

- `.github/workflows/deploy-pages.yml`
- `app/index.html`
- `app/public/404.html`
- `app/package.json`
- `app/package-lock.json`
- `.gitignore`
- `index.html`
- `notebook.html`
- `experience/index.html`
- `entry.html`
- `codex/feature-summaries/pages-react-cutover.md`
- `codex/logs/react-remediation-execution.md`

## Validation Evidence

- `npm ci --prefix app` succeeded.
- `npm run build --prefix app` succeeded.
- SPA fallback files exist and route restoration is in place.

## Tradeoffs

- This branch introduces GitHub Pages Actions deploy requirements (Pages source must be set to GitHub Actions).
- A non-blocking Liquid Glass export warning still appears during build and is handled in the dedicated glass branch.

## Follow-ups

- Verify production Pages settings are switched to GitHub Actions source.
- Complete no-flicker, liquid-glass, and legacy-removal branches in sequence.

## Maintainer Checklist Confirmation

- [x] No root bloat introduced (new implementation files are under `app/`, `.github/`, and `codex/`).
- [x] No duplicate layout shells were introduced in this feature.
- [x] Feature summary exists in `codex/feature-summaries/` and is complete.
- [x] Tradeoffs and follow-ups are documented.
