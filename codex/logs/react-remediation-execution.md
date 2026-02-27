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
- PR: Pending
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
