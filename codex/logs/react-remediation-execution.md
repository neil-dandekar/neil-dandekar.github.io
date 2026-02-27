# React Remediation Execution Log

## 2026-02-27 - Branch 1

- Branch: `feature/pages-react-cutover`
- PR: [#5](https://github.com/neil-dandekar/neil-dandekar.github.io/pull/5)
- Scope delivered:
  - Added deterministic app lockfile and dependency baseline updates.
  - Added GitHub Pages Actions deploy workflow for `app/dist`.
  - Added clean URL SPA fallback (`404.html` redirect + `?p=` restoration in `app/index.html`).
  - Updated root entry redirects to clean React paths (`/`, `/thoughts/`, `/experience/`).
- Validation evidence:
  - `npm ci --prefix app` passed.
  - `npm run build --prefix app` passed.
- Risks / follow-ups:
  - Liquid Glass import warning persists and is scheduled for Branch 3.
  - Pages project settings should use GitHub Actions as deployment source.

## 2026-02-27 - Branch 2

- Branch: `feature/react-no-flicker-theme-content`
- PR: [#6](https://github.com/neil-dandekar/neil-dandekar.github.io/pull/6)
- Scope delivered:
  - Bootstrapped site content, entry index, and entry HTML before first React render.
  - Replaced effect-driven async page content updates with synchronous context reads.
  - Added prepaint theme initialization and state synchronization in React shell.
  - Ported home Vanta animation into React with loader + cleanup behavior.
  - Normalized source content asset paths to `/assets/...`.
- Validation evidence:
  - `npm run build --prefix app` passed.
- Risks / follow-ups:
  - Startup now preloads all entry HTML; watch payload size as entries grow.
  - Liquid Glass export warning remains and is addressed in Branch 3.

## 2026-02-27 - Branch 3

- Branch: `feature/liquid-glass-shell-complete`
- PR: [#7](https://github.com/neil-dandekar/neil-dandekar.github.io/pull/7)
- Scope delivered:
  - Fixed `liquid-glass-react` import/type usage (default export path).
  - Added explicit theme-aware glass presets for container and social variants.
  - Applied glass wrappers to topbar/sidebar/footer and darker glass wrappers to social buttons.
  - Added fallback glass styling classes for partial browser support.
  - Stabilized local TS ambient-type resolution for repeatable build checks.
- Validation evidence:
  - `npm run build --prefix app` passed.
  - LiquidGlass named export warning no longer appears.
- Risks / follow-ups:
  - Needs visual QA in Safari/Firefox for reduced displacement behavior.

## 2026-02-27 - Branch 4

- Branch: `chore/remove-legacy-runtime`
- PR: Pending
- Scope delivered:
  - Removed deprecated legacy runtime directories (`app/core`, `app/legacy`, `app/pages`).
  - Removed deprecated root runtime JS/CSS and old thoughts HTML runtime file.
  - Updated repo docs to define React-only runtime boundaries.
  - Added PR CI workflow with app build verification and runtime guard checks.
- Validation evidence:
  - `npm run build --prefix app` passed.
  - Local runtime guard checks passed.
- Risks / follow-ups:
  - Rollback to legacy runtime requires git history instead of in-tree files.
  - CI guard assumptions should be updated if architecture policy changes.
