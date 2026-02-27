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
