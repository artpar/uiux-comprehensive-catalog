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

This runs type checking, content validation, completion audits, a production build, and sitemap coverage validation. The build fails if an indexable canonical page is missing from the sitemap or a sitemap URL has no matching page.

Sitemap modification dates come from the Git history of page templates and their content dependencies, including local edits in a working checkout. Builds without Git history omit the optional dates. CI fetches full history so checkout times never become modification dates. Run `npm run test:sitemap` for the coverage and date regression checks.

The same build renders all four example states for every catalog pattern, tests search relevance and active-reading measurement, and enforces a 400 KB limit per JavaScript chunk. Demo implementations live in `src/components/playgrounds/examples`; the loader requests a dedicated pattern module or its generic interaction group. Preserve the four-state and keyboard behavior when editing an example. Editorial drafts belong in `docs/editorial-drafts`, outside the public route tree.

## Visitor measurement

For production QA, visit any page with `?analytics=off` before testing. This stores a browser-local opt-out and prevents loading Umami; `?analytics=on` enables it again. The Privacy page exposes the same choice. Local development does not send events.

- `example_opened`: the selected example begins loading.
- `example_viewed`: its heading enters the viewport.
- `example_ready`: its code and styles have rendered successfully.
- `example_interacted`: the visitor operates a control; loading alone does not count.
- `example_failed`: the code or styles fail to load.
- `active_read`: 10, 30, or 90 seconds while visible and focused, independent of scrolling.
- `read_depth`: 25%, 50%, 75%, or 100% viewport depth, independent of reading time.

Use these events to compare each entry page's view → ready → interaction rates. Existing copy, save, checklist, lesson, and work-tool events provide subsequent actions. These signals do not establish comprehension or task success by themselves. Exclude internal QA and analyze suspicious traffic separately; country alone does not establish automation. Compare weekly qualified interactions and native Umami return visits alongside pageview totals.

Newsletter signup appears after the resources and checklist when `PUBLIC_SUBSCRIBE_ENDPOINT` is configured. It uses the existing launch-list service and does not block access to the resources. The form sends subscription details only to that service; analytics receive the signup surface, without the email address.

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
