# neil-dandekar.github.io

## Project layout and editing responsibilities

- **Content authors** edit copy and metadata in `content/`:
  - Markdown entries in `content/*.md`
  - Site and entry index YAML in `content/site.yaml` and `content/entries.yaml`
- **Developers** implement runtime behavior in the React app under `app/src/`.
- **Deployment static files** (copied into production build output) live in `app/public/`.
- **Source static assets** are authored in `public/assets/`.
- **Feature specs and process docs** live in `codex/`.

Production deploys through GitHub Pages Actions by building `app/` and publishing `app/dist`.
