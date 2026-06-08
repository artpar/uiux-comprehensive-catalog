# UI/UX Pattern Catalog Research Plan

## Scope

This project catalogs UI/UX patterns: repeatable interaction, navigation, task, feedback, input, recovery, collaboration, and decision-support solutions used in digital products.

This project does not catalog design systems, CSS frameworks, colors, typography, spacing scales, icon sets, visual trends, component library inventories, or brand styles. Those may be used only as evidence when they document a pattern's behavior or usage constraints.

## Definition Of A Pattern

A catalog item must describe a reusable solution to a user problem.

Good entries:

- Faceted search
- Undo after destructive action
- Multi-step form
- Progressive disclosure
- Command palette
- Empty state with primary recovery action
- Inline validation
- Bulk selection and batch action
- Approval before an AI agent acts

Bad entries:

- Blue buttons
- 8px radius cards
- Material Design
- Tailwind components
- Glassmorphism
- A specific company's design system
- A CSS layout recipe without a user interaction problem

## Evidence Model

Every entry needs at least one source-backed reason to exist.

Accepted evidence types:

- Accessibility and interaction specs, especially WAI-ARIA APG where applicable
- Platform human-interface guidelines when they describe behavior or task use
- UX research articles, pattern literature, and HCI references
- Public product examples from shipped interfaces
- Domain-specific service manuals and pattern catalogs when focused on task completion
- Observed recurrence across multiple real products

Rejected evidence types:

- Dribbble-style shots without behavior
- Aesthetic trend posts
- Component lists with no usage guidance
- Unverified screenshots
- AI-generated examples pretending to be real products

## Primary Taxonomy

### 1. Navigation And Wayfinding

- Global navigation
- Local navigation
- Utility navigation
- Breadcrumbs
- Side navigation
- Bottom navigation
- Navigation drawer
- Mega menu
- Tabs
- Step navigation
- Pagination
- Anchor / in-page navigation
- Recently viewed
- Related links
- Back link
- Command palette

### 2. Search, Browse, And Discovery

- Basic search
- Search suggestions
- Autocomplete
- Typeahead
- Faceted search
- Filter panel
- Filter chips
- Sort controls
- Saved search
- Search result highlighting
- No-results recovery
- Recommendations
- Browse by category
- Recently searched

### 3. Input And Data Entry

- Single-field form
- Multi-step form
- Wizard
- Inline edit
- Autosave form
- Draft state
- Dependent fields
- Conditional fields
- Input masks
- Character count
- Date entry
- Date range selection
- File upload
- Drag-and-drop upload
- Bulk import
- Review before submit

### 4. Selection And Choice

- Single selection
- Multi-selection
- Select all
- Bulk selection
- Radio group
- Checkbox group
- Segmented control
- Toggle / switch
- Slider
- Range slider
- Combo box
- Listbox
- Transfer list
- Tree selection
- Object picker

### 5. Feedback, Status, And System State

- Toast
- Inline message
- Alert
- Banner
- Notification center
- Loading spinner
- Loading skeleton
- Progress bar
- Step progress
- Empty state
- Error state
- Success confirmation
- Offline state
- Sync state
- Conflict state
- Permission denied state

### 6. Error Prevention And Recovery

- Inline validation
- Error summary
- Confirmation dialog
- Destructive action confirmation
- Undo
- Redo
- Restore from trash
- Autosave recovery
- Conflict resolution
- Retry
- Fallback path
- Graceful degradation
- Exit warning

### 7. Disclosure And Attention Management

- Accordion
- Disclosure / show-hide
- Modal dialog
- Alert dialog
- Drawer
- Sheet
- Popover
- Tooltip
- Context menu
- Action sheet
- Hover card
- Details panel
- Preview panel
- Progressive disclosure

### 8. Data Display And Exploration

- Table
- Data grid
- Tree grid
- Master-detail
- Card list
- Feed
- Timeline
- Activity log
- Calendar view
- Kanban board
- Map view
- Chart drilldown
- Compare view
- Expandable row
- Saved view

### 9. Task And Workflow Patterns

- Onboarding
- Account creation
- Sign in
- Password reset
- Two-factor authentication
- Checkout
- Payment collection
- Address entry
- Profile setup
- Settings management
- Invite user
- Approval workflow
- Review queue
- Publish workflow
- Scheduling
- Booking

### 10. Collaboration And Social Interaction

- Comments
- Threaded discussion
- Mentions
- Presence
- Live cursors
- Share dialog
- Permission sharing
- Activity feed
- Assignment
- Reactions
- Follow / subscribe
- Notification preferences
- Version history
- Change review

### 11. Personalization And Preference

- Preference center
- Saved filters
- Custom dashboard
- Pinned items
- Favorites
- Recently used
- Recommended next action
- Adaptive defaults
- User-controlled density or layout

### 12. AI And Automation UX

- Prompt box
- Prompt suggestions
- Chat interface
- Streaming response
- Citation display
- Confidence / uncertainty display
- Human approval gate
- Agent plan preview
- Agent progress trace
- Tool-use visibility
- Editable AI output
- Regenerate / retry
- Correction feedback
- Escalate to human
- Handoff summary
- Automation rule builder

### 13. Trust, Safety, And Privacy

- Consent prompt
- Permission request
- Sensitive-data reveal
- Security warning
- Session timeout
- Audit log
- Data export
- Delete account
- Privacy settings
- Report abuse
- Block / mute
- Age gate
- Legal acceptance

### 14. Cross-Device And Physical Interaction

- Touch gesture
- Pull to refresh
- Swipe action
- Long press
- Drag and drop
- Keyboard shortcut
- Focus traversal
- Voice command
- Camera capture
- Location permission flow
- QR scan
- Haptic feedback
- Wearable glance

## Entry Schema

Each pattern should be stored as structured data.

```json
{
  "id": "faceted-search",
  "name": "Faceted search",
  "aliases": ["filters", "guided filtering"],
  "category": "Search, Browse, And Discovery",
  "problem": "Users need to narrow a large result set using multiple attributes.",
  "solution": "Expose meaningful filter dimensions near the result set and show applied constraints clearly.",
  "useWhen": [],
  "avoidWhen": [],
  "variants": [],
  "accessibility": [],
  "failureModes": [],
  "examples": [],
  "sources": [],
  "maturity": "established",
  "lastVerified": "2026-06-08"
}
```

## Research Process

1. Source scan: collect pattern names and usage guidance from specs, HCI literature, platform guidelines, service manuals, and shipped products.
2. Candidate extraction: record every candidate with source URL, exact source label, source type, and date checked.
3. Normalization: merge aliases and split overloaded terms. For example, "dialog", "modal", "alert dialog", and "sheet" need separate definitions.
4. Pattern admission: accept only entries that solve a user problem and have evidence beyond visual appearance.
5. Classification: assign one primary category and optional secondary categories.
6. Example gathering: attach real product examples separately from the canonical pattern definition.
7. Review: mark maturity as standard, established, emerging, domain-specific, deprecated, or anti-pattern.

## First Research Milestone

Produce a seed catalog with:

- 150 raw pattern candidates
- 80 normalized pattern entries
- 20 comparison pages
- 10 anti-pattern entries
- Source notes for every accepted item

## Comparison Pages

Comparison pages should explain pattern choice rather than showcase visuals.

Initial comparisons:

- Modal vs drawer vs popover vs sheet
- Tabs vs segmented control vs pagination
- Table vs data grid vs card list
- Toast vs alert vs banner vs inline message
- Wizard vs single-page form
- Autocomplete vs combobox vs select
- Undo vs confirmation dialog
- Infinite scroll vs pagination
- Filters vs facets vs search
- Command palette vs global search
- Empty state vs error state vs loading state
- AI chat vs AI assistant panel vs inline AI action

## GitHub Pages Product Shape

The site should open directly into the catalog.

Core screens:

- Pattern browser
- Search and filter
- Pattern detail
- Comparison view
- Source index
- Example gallery
- Anti-patterns
- Contribution guide

The value of the site is not visual inspiration. The value is helping someone choose the right interaction pattern for a real product problem.
