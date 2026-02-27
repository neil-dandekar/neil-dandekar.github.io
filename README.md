# neil-dandekar.github.io

## Project layout and editing responsibilities

- **Content authors** edit copy and metadata in `content/`:
  - Markdown entries in `content/*.md`
  - Site and entry index YAML in `content/site.yaml` and `content/entries.yaml`
- **Developers** edit behavior and UI implementation in `app/`:
  - Core runtime scripts + styles in `app/core/`
  - Legacy page-specific scripts in `app/legacy/`
  - HTML page templates in `app/pages/`
- **Static assets** are stored in `public/assets/`.
- **Feature specs and process docs** live in `codex/`.

Root-level HTML files are lightweight redirects so existing links keep working while templates live under `app/pages/`.
