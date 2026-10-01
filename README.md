# CandidateFlow

A hiring pipeline dashboard built with React 19 and Vite. Review candidates across
five hiring stages, search and filter the board, and move candidates between
stages with drag and drop. All changes persist to `localStorage` — there is no
backend.

## Features

- **Pipeline board** — Applied, Screening, Technical Test, Interview, and Hired
  columns with live counts and per-stage accent colours.
- **Dashboard summary** — Total Candidates, In Screening, Interviews, and Hired,
  derived from the full candidate set (never affected by search or filters).
- **Search** — real-time, case-insensitive matching across name, role, and
  location. Clear with the `×` button or focus the field with `⌘K` / `Ctrl+K`.
- **Filters** — filter by hiring stage (multi-select) and minimum years of
  experience. Search and filters combine, and can be reset from three places.
- **Drag and drop** — move candidates between stages; counts, cards, and
  persisted state update immediately.
- **Add, edit, delete** — modal form with validation, a delete confirmation step,
  and keyboard/focus-trap support.
- **Theming** — light and dark palettes that follow the system preference, plus
  reduced-motion support.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

## Deployment

The app is a static single-page app and is configured for Netlify via
`netlify.toml`:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 22 |

It can also be deployed to any static host — run `npm run build` and publish
`dist`. Because routing is client-side only, the host must rewrite unknown paths
to `index.html` (already configured in `netlify.toml`).

## Data model

State lives in `localStorage` under the key `candidateflow:pipeline:v1`:

```json
{
  "added": [],
  "overrides": {},
  "deleted": []
}
```

- `added` — candidates created in the app.
- `overrides` — per-candidate edits to seeded data, keyed by candidate id.
- `deleted` — ids of seeded candidates that were removed.

Earlier shapes (a bare array, or `{ added, moves }`) are migrated automatically
on load, and unreadable data falls back to the seed set in `src/data/pipeline.js`.

## Project structure

```
src/
  App.jsx                 dashboard composition, search/filter state
  components/             Topbar, FilterMenu, PipelineColumn, CandidateCard,
                          CandidateModal, StatCard, Icon
  data/pipeline.js        stage definitions and seed candidates
  hooks/usePipeline.js    store, persistence, migrations, mutations
  lib/dragState.js        in-flight drag tracking
  lib/filters.js          search and experience matchers
```