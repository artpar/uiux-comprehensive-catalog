# UI/UX Comprehensive Catalog

A source-backed UI/UX learning site with a guided course, principle chapters, pattern studies, comparisons, and practice tools.

The curriculum connects 20 UX lessons, 14 UI and UX principle chapters, and ordered study routes through 14 pattern families. The reference library includes 298 patterns, 286 comparisons, and source trails. Agent exports provide decision guidance for interface implementation.

## Run Locally

```sh
npm install
npm run dev
```

## Verify

```sh
npm run check
```

This runs type checking, content validation, completion audits, and a production build.

## Learning Content

- `/curriculum/` maps the whole learning route.
- `/learn/` contains the core UX course.
- `/principles/` teaches interface and service principles.
- `/patterns/` groups pattern studies into ordered family routes with browser-local progress.
- `/compare/`, `/practice/`, and `/work/` support application to real decisions.

Course content lives in `src/data/course-content-*.json`, `src/data/ui-principles.ts`, and `src/data/family-guides.ts`. Family sequencing lives in `src/data/family-study-routes.ts`. The research index and collection notes live in `research/`.

## Deployment

Pushing `main` runs `.github/workflows/pages.yml`, which validates, builds, and deploys the static site to GitHub Pages at `https://uxpatternsguide.com`.

## Agent Exports

The build generates static context files in `/agent/`:

- `/agent/patterns.md`
- `/agent/decision-guide.md`
- `/agent/anti-pattern-checklist.md`
- `/agent/patterns.json`

These files are generated from validated pattern data during `npm run build`.

## Content

Pattern data lives in `src/data/patterns`.
Source data lives in `src/data/sources`.
Comparison data lives in `src/data/comparisons`.

Every pattern must have source evidence and pass schema validation.
Every pattern must also include agent decision guidance: selection rules, required states, interaction contract, implementation checklist, common generated-UI mistakes, and critique questions.
