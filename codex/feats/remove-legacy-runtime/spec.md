# Feature Spec: Remove Legacy Runtime and Enforce React-Only Path

## Goal

Retire obsolete legacy runtime artifacts and add CI guardrails so the repository remains React-only with a single active runtime path.

## Scope

1. Remove obsolete legacy runtime directories (`app/core`, `app/legacy`, `app/pages`).
2. Remove obsolete root legacy runtime files no longer used by the React deployment path.
3. Keep active React runtime under `app/src`, `app/public`, and related Vite config.
4. Update README and development guidance to reflect React-only architecture.
5. Add pull-request CI workflow for build verification and repository structure guardrails.
6. Add codex feature summary and execution log updates.

## Non-Goals

- No new product-facing UI features.
- No route redesign beyond removing dead legacy runtime references.

## Validation

- `npm run build --prefix app`
- No active source files under `app/core`, `app/legacy`, `app/pages`.
- CI workflow exists for PR build + guard checks.
