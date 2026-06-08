# Implementation, CI, And Catalog Schema Plan

## Goal

Build a GitHub Pages site for a source-backed catalog of UI/UX patterns. The first shipped version should be useful as a research and decision tool, not a visual inspiration gallery.

## Implementation Approach

Use a static-first architecture:

- Astro for static routing and content pages
- React only for interactive catalog controls
- TypeScript for schema safety
- Static JSON or content collections for pattern data
- GitHub Pages for hosting
- GitHub Actions for build and deploy

Astro is a good fit because pattern detail pages, comparison pages, source pages, and contribution docs are mostly content, while the catalog browser needs client-side filtering and search.

## Repository Structure

```txt
.
├── .github/
│   └── workflows/
│       └── pages.yml
├── docs/
│   ├── UI_UX_PATTERN_CATALOG_RESEARCH_PLAN.md
│   ├── IMPLEMENTATION_CI_CS_PLAN.md
│   └── CONTRIBUTING_PATTERNS.md
├── public/
│   └── examples/
├── src/
│   ├── components/
│   ├── data/
│   │   ├── patterns/
│   │   ├── comparisons/
│   │   ├── sources/
│   │   └── taxonomy.ts
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── patterns/
│   │   ├── compare/
│   │   ├── sources/
│   │   └── anti-patterns/
│   ├── schemas/
│   └── styles/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Core Product Screens

### Catalog Browser

The home page is the catalog. It should support:

- Keyword search
- Category filtering
- Platform filtering
- Maturity filtering
- Source-type filtering
- Anti-pattern toggle
- Sort by name, category, maturity, or recently verified

### Pattern Detail

Each pattern page should show:

- Definition
- User problem
- Pattern solution
- Use when
- Avoid when
- Variants
- Accessibility and keyboard behavior
- Failure modes
- Related patterns
- Comparisons
- Sources
- Real product examples
- Last verified date

### Comparison Pages

Comparison pages should help choose between similar patterns:

- Modal vs drawer vs popover vs sheet
- Toast vs alert vs banner vs inline message
- Table vs data grid vs card list
- Wizard vs single-page form
- Undo vs confirmation dialog
- Pagination vs infinite scroll

### Source Index

The source index should make provenance inspectable:

- Source name
- Source type
- URL
- Date checked
- Patterns supported by that source
- Notes on source quality

### Anti-Patterns

Anti-patterns should be first-class entries, not scattered notes:

- Hidden destructive action
- Ambiguous disabled button
- Mystery meat navigation
- Unrecoverable form loss
- Toast-only critical error
- Infinite scroll without location recovery

## Catalog Schema

Create strict schemas before adding bulk content.

### Pattern

```ts
export type PatternMaturity =
  | "standard"
  | "established"
  | "emerging"
  | "domain-specific"
  | "deprecated"
  | "anti-pattern";

export type PatternEntry = {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  secondaryCategories: string[];
  platforms: string[];
  problem: string;
  solution: string;
  useWhen: string[];
  avoidWhen: string[];
  variants: string[];
  accessibility: string[];
  keyboardBehavior: string[];
  failureModes: string[];
  relatedPatterns: string[];
  comparisons: string[];
  examples: PatternExample[];
  sources: SourceRef[];
  maturity: PatternMaturity;
  lastVerified: string;
};
```

### Source

```ts
export type SourceType =
  | "spec"
  | "platform-guideline"
  | "ux-research"
  | "service-manual"
  | "product-example"
  | "hci-literature"
  | "pattern-library";

export type SourceEntry = {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  publisher?: string;
  checkedAt: string;
  notes: string;
};
```

### Example

```ts
export type PatternExample = {
  product: string;
  url?: string;
  platform: string;
  notes: string;
  screenshot?: string;
  checkedAt: string;
};
```

## Content System

Use data files, not hand-coded pages.

Initial format:

- `src/data/patterns/*.json`
- `src/data/sources/*.json`
- `src/data/comparisons/*.json`

Validation:

- Use Zod schemas in `src/schemas/`
- Validate every data file during CI
- Fail CI on missing source refs, duplicate IDs, invalid dates, broken internal relations, or empty required arrays

Content rules:

- No pattern without source evidence
- No example without product name and checked date
- No visual-only entries
- No design-system-only entries
- No AI-generated examples unless clearly marked as illustrative, and illustrative examples should not count as evidence

## Seed Content Plan

Phase 1 seed:

- 80 normalized pattern entries
- 20 comparison entries
- 10 anti-pattern entries
- 25 source entries

Suggested first categories:

- Navigation and wayfinding
- Search, browse, and discovery
- Input and data entry
- Feedback, status, and system state
- Error prevention and recovery
- Disclosure and attention management
- AI and automation UX

## CI Plan

GitHub Actions should run on every push and pull request.

Checks:

- Install dependencies
- Typecheck
- Validate catalog data
- Build static site
- Check generated routes
- Optional link check for external URLs on schedule only

Do not run external link checks on every PR because source sites can rate-limit or fail independently of our code.

### Workflow Jobs

`validate`

- `npm ci`
- `npm run typecheck`
- `npm run validate:data`

`build`

- `npm run build`
- Upload Pages artifact

`deploy`

- Only on default branch
- Deploy to GitHub Pages

`scheduled-link-check`

- Weekly
- Validate external source URLs
- Produce a report
- Do not automatically delete sources

## Commands

```sh
npm run dev
npm run build
npm run typecheck
npm run validate:data
npm run check
```

`npm run check` should run all local verification that must pass before deploy.

## GitHub Pages Deployment

Use GitHub Actions Pages deployment, not manual `gh-pages` branch publishing.

Required setup:

- Repository initialized with git
- GitHub Pages source set to GitHub Actions
- `astro.config.mjs` configured with the repository base path if the repo is not served from a custom domain

Deployment workflow:

1. Build Astro output into `dist/`
2. Upload Pages artifact
3. Deploy artifact to GitHub Pages

## Implementation Phases

### Phase 0: Repo Setup

- Initialize git repo
- Scaffold Astro + TypeScript
- Add GitHub Pages config
- Add base layout
- Add CI workflow

### Phase 1: Data Contract

- Add schemas
- Add taxonomy constants
- Add source registry
- Add validation script
- Add 5 sample pattern entries
- Add 2 comparison entries

### Phase 2: Catalog UI

- Build homepage catalog browser
- Add search and filters
- Add pattern cards with category, maturity, platforms, source count, and last verified date
- Add detail route generation

### Phase 3: Research Seed

- Add 80 pattern entries
- Add 20 comparisons
- Add 10 anti-patterns
- Add source index

### Phase 4: Quality Gates

- Add duplicate alias detection
- Add orphan source detection
- Add related-pattern validation
- Add route smoke checks
- Add scheduled link checker

### Phase 5: Contribution Workflow

- Add contribution guide
- Add pattern entry template
- Add source quality rubric
- Add issue templates for new pattern, correction, and source update

## Acceptance Criteria

The first release is acceptable when:

- The site builds and deploys through GitHub Actions
- The homepage is an interactive catalog
- Every pattern has at least one source
- Every source is visible in the source index
- Data validation fails on malformed entries
- Pattern detail pages are generated from data
- Comparison pages are generated from data
- The project clearly excludes visual style catalogs and design system inventories

## First Build Target

The immediate implementation target should be:

- Astro app
- Data schema
- Data validation script
- 5 pattern entries
- 2 comparison entries
- Browser page
- Detail pages
- CI and Pages deploy

After that, research content can scale without changing the site architecture.
