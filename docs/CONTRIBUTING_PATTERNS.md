# Contributing Patterns

This catalog accepts UI/UX patterns, not visual styles.

## Accepted Entries

Submit entries that describe a repeatable solution to a user interaction, workflow, decision, recovery, navigation, feedback, collaboration, trust, or automation problem.

Examples:

- Faceted search
- Undo
- Multi-step form
- Command palette
- No-results recovery
- Agent plan preview

## Rejected Entries

Do not submit:

- CSS techniques
- Color palettes
- Typography scales
- Icon sets
- Design-system inventories
- Visual trends
- Screenshot-only inspiration
- Unsourced AI-generated examples

## Minimum Evidence

Every pattern needs at least one source. Strong sources include:

- Accessibility specs
- Platform guidelines
- UX research
- HCI literature
- Public service manuals
- Repeated real-product examples

## Entry Checklist

- The pattern solves a user problem.
- The definition is behavior-first, not visual-first.
- At least one source is linked in `src/data/sources`.
- Source refs use valid source IDs.
- Related pattern IDs exist.
- Comparison IDs exist.
- The entry passes `npm run validate:data`.

## Local Validation

```sh
npm run check
```
