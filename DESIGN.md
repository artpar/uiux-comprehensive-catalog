---
name: UI/UX Pattern Catalog
description: A calm, source-backed product interface for choosing and reviewing UI/UX patterns.
colors:
  workbench-bg: "#f4f6f5"
  page-bg: "#f7f8f7"
  panel: "#ffffff"
  panel-soft: "#fafbfa"
  ink: "#17191c"
  heading: "#111416"
  muted: "#5f6770"
  line: "#d7ddd9"
  line-strong: "#b9c4be"
  accent: "#0b6b5f"
  accent-strong: "#073d37"
  accent-soft: "#e7f4f1"
  danger: "#9b2d22"
  danger-soft: "#fff0ee"
  focus: "#1f66d1"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)"
    fontWeight: 860
    lineHeight: 0.98
    letterSpacing: "0"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(1.4rem, 2.4vw, 2.15rem)"
    fontWeight: 820
    lineHeight: 1.08
    letterSpacing: "0"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 820
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.52
    letterSpacing: "0"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "8px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.panel}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
    height: "42px"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.accent-strong}"
    rounded: "{rounded.pill}"
    padding: "10px 14px"
    height: "42px"
  input-search:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "48px"
  chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-strong}"
    rounded: "{rounded.pill}"
    padding: "5px 8px"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "18px"
---

# Design System: UI/UX Pattern Catalog

## 1. Overview

**Creative North Star: "The Calm Workbench"**

The interface is a restrained product workbench for source-backed UI decisions. It should feel like a clear desk with well-labeled tools: quiet enough for repeated use, structured enough for comparison, and confident enough to teach by example. The system is not trying to impress with decoration; it earns trust through hierarchy, spacing, state clarity, and readable guidance.

The dominant rhythm is list-first and task-first. Use cards only for repeated objects that need a frame, and use rows or section bands when content needs scanning. The catalog and the lab must feel related but distinct: the catalog is calm reading and navigation; the lab is a denser decision workspace.

This system explicitly rejects the PRODUCT.md anti-references: cluttered, claustrophobic, scary, content-vomit pages; generic AI/SaaS template aesthetics; decorative trend surfaces; and any page that claims UX leadership while making the catalog hard to scan, compare, or trust.

**Key Characteristics:**

- Restrained teal accent on cool neutral surfaces.
- Inter/system typography with high weight contrast but no decorative font changes.
- 8px frames for real cards and fields; pill shapes only for nav, chips, and compact controls.
- Tonal layering, hairline separators, and occasional light shadows instead of heavy boxes.
- Dense enough for expert work, but never wall-of-text dense.

## 2. Colors

The palette is a restrained product palette: cool neutrals carry the surface, deep teal carries decisions and selection, and semantic red appears only for risk.

### Primary

- **Workbench Teal** (`#0b6b5f`): primary action, selected controls, active pattern state, and important links. It should remain rare.
- **Deep Evidence Teal** (`#073d37`): stronger text on accent surfaces, active navigation, and high-confidence primary actions.
- **Soft Teal Wash** (`#e7f4f1`): selected backgrounds, hover states, chips, and quiet emphasis.

### Secondary

- **Review Red** (`#9b2d22`): destructive or anti-pattern states only.
- **Review Red Wash** (`#fff0ee`): non-blocking danger backgrounds and warning surfaces.
- **Focus Blue** (`#1f66d1`): focus outline only. Do not reuse it as decorative color.

### Neutral

- **Workbench Field** (`#f4f6f5`): global body background.
- **Page Field** (`#f7f8f7`): softened page/header background after the minimal visual pass.
- **Panel White** (`#ffffff`): content panels, cards, popovers, inputs, and search results.
- **Soft Panel** (`#fafbfa`): quiet form and toolbar surfaces.
- **Ink** (`#17191c`): default text.
- **Display Ink** (`#111416`): large headings and high-impact title text.
- **Muted Steel** (`#5f6770`): supporting text, metadata, and captions.
- **Hairline** (`#d7ddd9`): primary dividers and soft borders.
- **Strong Hairline** (`#b9c4be`): input outlines and stronger separators.

### Named Rules

**The <=10% Accent Rule.** Teal is for active decisions, primary actions, links, and current state. If teal becomes decorative wallpaper, the page stops feeling like a tool.

**The Evidence First Rule.** Neutrals must preserve readable contrast. Muted text is allowed for metadata, not for essential instructions or decision rules.

**The Red Means Risk Rule.** Red is reserved for destructive actions, anti-patterns, and genuine risk. Never use it as a brand accent.

## 3. Typography

**Display Font:** Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
**Body Font:** Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
**Label/Mono Font:** no separate label or mono family in the current system

**Character:** Single-family product typography. It should feel familiar, precise, and unshowy: strong headings for wayfinding, calm body text for source-backed guidance, compact labels for controls and metadata.

### Hierarchy

- **Display** (820-860, `clamp(2.25rem, 4.4vw, 4.25rem)`, `0.98-1.03`): landing and major page headlines only.
- **Headline** (800-840, `clamp(1.4rem, 2.4vw, 2.15rem)`, `1.08`): section headers and major subpage headings.
- **Title** (780-820, `1rem-1.08rem`, `1.25-1.3`): card titles, comparison row titles, category row labels.
- **Body** (400-650, `1rem`, `1.45-1.56`): guidance, descriptions, decision rules, and explanatory copy. Cap long prose at roughly 65-75ch.
- **Label** (760-820, `0.72rem-0.88rem`, `1.2-1.35`): form labels, metadata, status pills, counts, and compact controls.

### Named Rules

**The One Typeface Rule.** This is a product interface; do not introduce a display font or decorative pairing unless the whole brand system is intentionally revised.

**The No Tight Tracking Rule.** Letter spacing stays at `0` for headings. Do not use negative display tracking.

**The Scan Before Read Rule.** Titles and labels must make a page understandable before the body text is read.

## 4. Elevation

The system is flat by default and layered only when interaction requires it. Depth comes first from spacing, separators, background tone, and sticky positioning. Shadows appear on dropdowns, elevated media, hover cards, and workbench panels where the user needs to understand stacking.

### Shadow Vocabulary

- **Hairline Header** (`0 1px 0 rgba(23, 25, 28, 0.06)`): sticky header separation without a box.
- **Quiet Card** (`0 1px 3px rgba(23, 25, 28, 0.04)`): resting card lift where a border alone is too flat.
- **Hover Card** (`0 8px 22px rgba(23, 25, 28, 0.07)`): card hover and lightweight raised state.
- **Overlay Panel** (`0 16px 40px rgba(23, 25, 28, 0.14)`): search result popovers and floating panels.
- **Hero Media** (`0 18px 48px rgba(18, 26, 24, 0.16)`): primary media surface only.

### Named Rules

**The Flat Until Needed Rule.** Surfaces are flat at rest. Use a shadow when it explains hover, overlay, sticky, or media elevation; do not pair every border with a large soft shadow.

**The Separator Is Enough Rule.** Dense catalog rows usually need hairlines, not cards.

## 5. Components

### Buttons

- **Shape:** pill for commands and compact controls (`999px`), with 8px rectangular buttons allowed inside form-like surfaces.
- **Primary:** Deep Evidence Teal background (`#073d37` or `#0b6b5f`), white text, strong weight (`820`), minimum height `42px`.
- **Hover / Focus:** hover shifts to Soft Teal Wash for quiet controls or keeps deep teal for primary actions; focus uses the global 3px Focus Blue outline.
- **Secondary / Ghost:** white or soft neutral background with Deep Evidence Teal text. Secondary actions must not compete with primary decisions.

### Chips

- **Style:** pill shape (`999px`), soft teal or neutral background, compact padding (`4px-8px`), high-weight label text.
- **State:** selected chips use Soft Teal Wash and Deep Evidence Teal. Unselected chips use low-contrast neutral fills and Muted Steel text.

### Cards / Containers

- **Corner Style:** gently curved (`8px`). Cards must not exceed 16px radius.
- **Background:** Panel White for content; Soft Panel for form/tool surfaces.
- **Shadow Strategy:** quiet resting shadow only when the card must separate from a similar background; otherwise use a border or separator.
- **Border:** Hairline or Strong Hairline only. Avoid thick side stripes.
- **Internal Padding:** `14px-22px`, depending on density. Dense rows use vertical rhythm and separators instead of boxed padding.

### Inputs / Fields

- **Style:** 8px rectangle, white or Soft Panel background, inset 1px outline from neutral hairlines.
- **Focus:** global Focus Blue outline (`3px solid #1f66d1`, 2px offset). Do not hide browser focus.
- **Error / Disabled:** errors use Review Red and Review Red Wash; disabled controls must reduce opacity and keep a recovery explanation nearby when relevant.

### Navigation

- **Style:** sticky top header, visible brand text, pill active nav state, muted inactive labels.
- **Active State:** Soft Teal Wash background and Deep Evidence Teal text.
- **Mobile Treatment:** wrap navigation labels instead of clipping them. Horizontal scrolling nav should be avoided unless the affordance is unmistakable.

### Search And Result Lists

- **Search:** large 48px input, clear label, white panel, absolute results popover with Overlay Panel elevation.
- **Rows:** comparison and category lists use separators and max-width text measures. Do not turn every row into a full-width slab card.

### Workbench Panels

Interactive lab panels can be denser than catalog pages. Use white panels, 8px radii, compact labels, segmented controls, and skeleton loading where data is pending. Maintain consistent button and chip vocabulary across lab, compare, and catalog screens.

## 6. Do's and Don'ts

### Do:

- **Do** use the restrained teal palette for decisions, selection, and primary actions only.
- **Do** keep catalog pages readable before they are exhaustive: headings, rows, and metadata should create a clear scan path.
- **Do** use 8px cards and fields, pill chips and nav, and hairline separators for dense lists.
- **Do** preserve keyboard focus with the 3px Focus Blue outline.
- **Do** keep the lab and catalog distinct: readable browsing for catalog pages, denser controls for the lab.
- **Do** use source-backed copy that is direct, practical, and approachable.

### Don't:

- **Don't** create cluttered, claustrophobic, scary, content-vomit pages.
- **Don't** use generic AI/SaaS template aesthetics, gradient hero scaffolds, glassmorphism, or decorative trend surfaces.
- **Don't** claim UX leadership while making the catalog difficult to scan, compare, or trust.
- **Don't** use cards for every row. Rows, separators, and grouped sections are often the better product pattern.
- **Don't** use border-left or border-right greater than 1px as colored accents on cards, list items, callouts, or alerts.
- **Don't** use negative heading letter spacing, decorative font pairings, or display fonts inside UI labels.
- **Don't** pair a 1px border with a wide decorative shadow on every card or button.
- **Don't** exceed 16px card radius. Reserve full pills for chips, nav, and compact controls.
