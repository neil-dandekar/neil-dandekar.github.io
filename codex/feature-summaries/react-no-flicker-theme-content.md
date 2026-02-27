# Feature Summary: React No-Flicker Theme Content

## Objective

Eliminate delayed post-render content swaps in the React runtime, apply theme before first paint, preserve animated home background behavior, and normalize content asset paths.

## Branch Name

`feature/react-no-flicker-theme-content`

## Implementation Steps Taken

1. Replaced effect-based content fetching with bootstrap loading in `main.tsx` before initial render.
2. Added `AppDataProvider` context so page and shell components consume fully loaded content/entries synchronously.
3. Removed entry `Loading...` flash by precomputing markdown HTML per entry slug during bootstrap.
4. Added prepaint theme boot in `app/index.html` and synchronized shell theme state to preboot theme.
5. Ported home Vanta background into React via a dedicated `HomeBackground` component with script-loader guards and cleanup.
6. Normalized authored asset paths from `/public/assets/...` to `/assets/...` in source content.

## Files Touched

- `app/src/lib/content.ts`
- `app/src/lib/hooks.tsx`
- `app/src/main.tsx`
- `app/src/pages/ThoughtEntryPage.tsx`
- `app/index.html`
- `app/src/components/Shell.tsx`
- `app/src/components/HomeBackground.tsx`
- `app/src/styles.css`
- `content/site.yaml`
- `content/small-systems-stable-habits.md`
- `app/public/content/small-systems-stable-habits.md`
- `codex/feature-summaries/react-no-flicker-theme-content.md`
- `codex/logs/react-remediation-execution.md`

## Validation Evidence

- `npm run build --prefix app` passed.
- Entry content is bootstrapped before render (no per-entry async fetch effect in `ThoughtEntryPage`).
- Theme attribute is set in `app/index.html` before app mount.

## Tradeoffs

- Bootstrap now preloads all entry markdown HTML up front, which increases startup work but removes visible entry-loading flash.
- Vanta scripts remain CDN-backed and async; if external scripts fail, background gracefully does not render.

## Follow-ups

- Branch 3 will fix the current liquid-glass import warning and complete requested glass theming.
- Consider migrating from runtime YAML fetch to build-generated typed JSON if startup payload grows.

## Maintainer Checklist Confirmation

- [x] No root bloat introduced (changes are in `app/`, `content/`, and `codex/`).
- [x] No duplicate layout shells were introduced in this feature.
- [x] Feature summary exists in `codex/feature-summaries/` and is complete.
- [x] Tradeoffs and follow-ups are documented.
