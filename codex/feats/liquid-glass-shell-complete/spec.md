# Feature Spec: Liquid Glass Shell Complete

## Goal

Complete liquid-glass integration in the React shell by fixing import/typing issues and applying theme-aware glass presets to the requested shell elements.

## Scope

1. Fix `liquid-glass-react` import/typing usage to eliminate runtime/export mismatch warnings.
2. Add explicit light/dark glass preset mapping for medium container tint and darker social tint.
3. Apply liquid-glass wrappers to topbar, sidebar, and footer containers.
4. Apply liquid-glass wrappers to social buttons while preserving circular shape and existing size.
5. Add stable fallback styling classes so visuals remain usable when refraction support is limited.
6. Add codex summary and execution log entry for this branch.

## Non-Goals

- No legacy runtime deletion in this branch.
- No deployment workflow changes in this branch.

## Validation

- `npm run build --prefix app`
- No liquid-glass named export warning during build.
- Topbar, sidebar, and footer show medium glass tint.
- Social buttons show darker glass tint and keep 2.9rem circular dimensions.
