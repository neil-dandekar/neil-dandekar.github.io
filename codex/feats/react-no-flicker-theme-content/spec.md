# Feature Spec: React No-Flicker Content + Theme Boot + Home Animation

## Goal

Remove post-paint content swaps and theme flashes by loading data before initial React render, preserve the animated home background in React, and normalize content asset URLs.

## Scope

1. Introduce React bootstrap loading for site content, entry index, and entry markdown HTML cache.
2. Replace effect-driven content hooks with synchronous context-driven access.
3. Apply theme at prepaint time in `app/index.html` and sync React state to that initial value.
4. Port Vanta clouds background behavior into a React component used on the home route.
5. Normalize authored content asset paths from `/public/assets/...` to `/assets/...`.
6. Update codex summary and execution log for this branch.

## Non-Goals

- No liquid-glass component redesign (handled in Branch 3).
- No legacy runtime deletion (handled in Branch 4).

## Validation

- `npm run build --prefix app`
- No placeholder/fallback text swapping in topbar/footer after render.
- No `Loading...` flash for known thought entries.
- Theme is set before first paint and stays in sync when toggled.
