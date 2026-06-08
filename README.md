# UI/UX Comprehensive Catalog

A source-backed catalog of practical UI/UX patterns.

This project catalogs interaction and workflow patterns, not visual design systems, CSS recipes, color palettes, typography, or trend galleries. The primary output is agent-usable guidance that helps LLMs choose better UI/UX patterns before generating code.

## Run Locally

```sh
npm install
npm run dev
```

## Verify

```sh
npm run check
```

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
