# Feature Spec: React Production Cutover + GitHub Pages Actions

## Goal

Switch production serving to the React/Vite app, deploy through GitHub Pages Actions, and support clean URL deep links with an SPA fallback.

## Scope

1. Add deterministic npm lockfile for the React app.
2. Add GitHub Actions Pages workflow to build `app/` and deploy `app/dist`.
3. Add SPA deep-link fallback handling (`404.html` redirect + index restoration).
4. Stop routing root entry pages to `/app/pages/*`; route to clean React paths.
5. Add required codex logging artifacts for this branch.

## Non-Goals

- No Liquid Glass theming changes in this branch.
- No legacy runtime deletions in this branch.
- No content-loading/flicker fixes in this branch.

## Validation

- `npm ci --prefix app`
- `npm run build --prefix app`
- Confirm fallback path restoration logic exists for:
  - `/`
  - `/experience/`
  - `/thoughts/`
  - `/thoughts/<slug>/`
