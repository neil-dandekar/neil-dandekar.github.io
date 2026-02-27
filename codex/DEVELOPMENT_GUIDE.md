# Development Guide

## Repo Structure Rules

Keep the repository organized by ownership and runtime role:

- `app/`: Application runtime code (UI components, route logic, feature modules, shared utilities used by the running app).
- `content/`: Source content and editorial data (markdown, YAML, structured text, authored copy).
- `public/`: Static assets served directly (images, icons, downloadable files, static manifests).
- `codex/`: Engineering process artifacts (specs, implementation notes, migration docs, and feature summaries).

### Runtime Boundary (React-Only)

- Active runtime code lives in `app/src/` and build/deploy config in `app/`.
- Do **not** reintroduce legacy runtime directories:
  - `app/core/`
  - `app/legacy/`
  - `app/pages/`
- Do **not** reintroduce deprecated root runtime files (`content.js`, `site.js`, `layout.js`, `theme.js`, etc.).

### Placement Requirements

- Do **not** add feature implementation files at repository root.
- Root should remain limited to core entry/config/build files.
- Place new documentation for implementation decisions in `codex/`.
- Place one-off scripts either under the owning feature module in `app/` or under a clearly named tooling folder (not at root).

## Naming and Module Conventions

- Use descriptive, domain-driven names (`experience-card`, `thought-entry-list`, `site-shell`) instead of vague names (`utils2`, `temp`, `new-layout`).
- Keep modules cohesive:
  - One primary responsibility per module.
  - Move shared logic into explicit shared modules rather than copy-pasting.
- Prefer stable naming across feature lifecycles:
  - Avoid churn from unnecessary file renames.
  - Keep import paths predictable and grouped by domain.
- For feature documentation under `codex/feature-summaries/`, use kebab-case filenames matching feature scope.

## Performance Guardrails

- Avoid layout shift (CLS regressions):
  - Reserve space for media where possible (set dimensions/aspect ratio).
  - Prevent late-loading UI elements from pushing existing content.
- Enforce a shared layout shell:
  - Reuse a single shared layout structure for pages/views.
  - Do not introduce duplicate layout wrappers that reimplement header/nav/footer scaffolding.
- Prefer incremental rendering changes over full-page shell rewrites unless explicitly required by a migration plan.

## Feature Workflow

1. **Branching**
   - Create a dedicated branch per feature using `feature/<scope>` or `chore/<scope>`.
2. **Planning**
   - Add/update a spec in `codex/feats/<feature>/` before implementation when scope is non-trivial.
3. **Implementation**
   - Make changes in small, reviewable commits.
   - Keep structure and naming aligned with rules above.
4. **Feature Summary (Required)**
   - Add a summary file in `codex/feature-summaries/<feature>.md`.
   - Include: objective, branch name, implementation steps, files touched, tradeoffs, and follow-ups.
5. **Pre-merge Review**
   - Complete the checklist below before opening/merging PRs.

## Pre-Merge Maintainer Checklist (Required)

- [ ] No root bloat introduced (new files are placed in appropriate subdirectories).
- [ ] No duplicate layout shells were introduced; shared layout remains single-source.
- [ ] No deprecated runtime paths/files were reintroduced (`app/core`, `app/legacy`, `app/pages`, root legacy JS/CSS runtime files).
- [ ] Feature summary exists in `codex/feature-summaries/` and is complete.
- [ ] Any tradeoffs and follow-ups are documented.
