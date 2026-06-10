# Comprehensive UI/UX Pattern Catalog Completion Plan

Date: 2026-06-08

## Goal

Build a comprehensive interactive catalog of UI/UX patterns that helps people and LLM agents choose, inspect, compare, and implement the right pattern for a product problem.

This catalog must distinguish:

- UI: what the interface looks like, including layout, controls, density, visual hierarchy, affordance, state styling, and responsive behavior.
- UX: how the interaction works, including task flow, state transitions, keyboard behavior, recovery, feedback, decision rules, accessibility behavior, and failure modes.

The catalog is not complete when it has many pages. It is complete when each accepted pattern has a live interactive state lab, source-backed decision rules, known misuses, accessibility behavior, and comparison links to adjacent patterns.

## Research Baseline

Sources used for this completion plan:

- WAI-ARIA Authoring Practices Guide patterns: accessible widget and keyboard behavior patterns for accordions, alerts, dialogs, breadcrumbs, buttons, carousel, and many other interactive structures.
- GOV.UK Design System patterns: user-focused task and service patterns such as addresses, dates, check answers, service navigation, validation recovery, confirmation pages, problem pages, and step-by-step navigation.
- Apple Human Interface Guidelines patterns: guidance for common actions, tasks, and experiences including collaboration, drag and drop, data entry, feedback, file management, loading, notification management, modality, onboarding, searching, settings, and undo/redo.
- Material navigation and component guidance: navigation, action, containment, selection, and text-input groupings, including tabs, bottom navigation, drawers, and nested navigation.
- Microsoft Guidelines for Human-AI Interaction: lifecycle guidance for AI systems, including onboarding, interaction, uncertainty, correction, model update, and AI failure handling.
- Existing project taxonomy in `docs/UI_UX_PATTERN_CATALOG_RESEARCH_PLAN.md` and current schema in `src/schemas/catalog.ts`.

## Completion Definition

A pattern is complete only when all of these exist:

1. Structured data entry in `src/data/patterns/<id>.json`.
2. Source evidence in `src/data/sources/*.json`, with at least one source-backed claim.
3. Live interactive demo in `src/components/playgrounds/<PatternDemo>.tsx`.
4. PatternPlayground mapping in `src/components/PatternPlayground.tsx`.
5. UI states: default, hover/focus-visible, disabled/unavailable where relevant, loading/empty/error where relevant, selected/active where relevant, mobile/desktop layout where relevant.
6. UX states: before, during, after, cancellation, recovery, failure, and timeout/commit boundary where relevant.
7. Accessibility and keyboard contract: focus order, role/label semantics, Escape/Enter/Arrow behavior where relevant, screen-reader status updates where relevant.
8. Common misuse panel: what not to generate, not only text but at least one visible bad/edge condition where practical.
9. Comparison coverage: at least one comparison for adjacent or commonly confused patterns.
10. Agent brief coverage: selection rules, required states, interaction contract, implementation checklist, common misuses, critique questions.

## Pattern Admission Rules

Accept a candidate when:

- It solves a repeatable user problem.
- It includes both visual affordance expectations and interaction behavior.
- It has evidence from a spec, platform guideline, service manual, UX research, HCI literature, pattern library, or recurring shipped-product practice.
- It can be made inspectable in a live demo.

Reject or mark as anti-pattern when:

- It is only visual style, for example glassmorphism, gradients, card radius, or a color trend.
- It is a component inventory item with no usage decision, such as "button" without action semantics.
- It hides critical states or relies on unsupported behavior.
- It is known to be risky, deprecated, or context-specific without warnings.

## Target Scope

Target catalog size for a credible first comprehensive release:

- 120 accepted pattern entries.
- 20 anti-pattern entries.
- 40 comparison entries.
- 120 interactive demos or demo variants.
- 20 source entries across specs, platform guidelines, service manuals, research, pattern libraries, and product examples.

Do not try to add all 120 patterns at once. Ship in batches that keep every pattern interactive.

## Taxonomy And Backlog

### 1. Navigation And Wayfinding

Current coverage:

- Bottom navigation

Add:

- Global navigation
- Side navigation
- Navigation drawer
- Tabs
- Breadcrumbs
- Step navigation
- Pagination
- Back link
- In-page anchor navigation
- Command palette
- Recently viewed
- Related links
- Mega menu
- Utility navigation
- Nested navigation

Interactive requirements:

- Active/current destination state.
- Keyboard traversal.
- Overflow behavior.
- Mobile collapse behavior.
- Deep-link/restored state.
- Bad variants: too many destinations, hidden current location, command mixed into navigation.

Priority comparisons:

- Tabs vs segmented control vs pagination.
- Command palette vs global search.
- Side navigation vs navigation drawer.
- Breadcrumbs vs back link.
- Bottom navigation vs tabs.

### 2. Search, Browse, And Discovery

Current coverage:

- Faceted search
- No-results recovery

Add:

- Basic search
- Search suggestions
- Autocomplete
- Typeahead
- Filter panel
- Filter chips
- Sort controls
- Saved search
- Search result highlighting
- Browse by category
- Recommendations
- Recently searched
- Advanced search
- Query correction
- Search history

Interactive requirements:

- Query entry and clear.
- Debounced results.
- Suggestion keyboard navigation.
- Empty, loading, error, and partial-result states.
- Applied filters and clear-all.
- Bad variants: filters that silently hide results, suggestions that trap focus, no recovery from zero results.

Priority comparisons:

- Search suggestions vs autocomplete vs typeahead.
- Filters vs facets.
- No-results recovery vs empty state.
- Saved search vs saved filter.

### 3. Input And Data Entry

Current coverage:

- None

Add:

- Single-field form
- Multi-step form
- Wizard
- Inline edit
- Autosave form
- Draft state
- Conditional fields
- Dependent fields
- Input mask
- Character count
- Date entry
- Date range selection
- File upload
- Drag-and-drop upload
- Bulk import
- Review before submit
- Check answers
- Address entry
- Payment card entry
- Password creation

Interactive requirements:

- Field focus, validation, error summary, disabled/submitting states.
- Save, autosave, draft recovery.
- Back/next behavior for multi-step flows.
- Conditional reveal without losing entered data.
- Bad variants: validation only after submit, destructive reset, hidden required fields.

Priority comparisons:

- Wizard vs single-page form.
- Inline edit vs edit page.
- Autosave vs explicit save.
- Date picker vs text date entry.
- File upload vs drag-and-drop upload.

### 4. Selection And Choice

Current coverage:

- Confirmation dialog overlaps this category but belongs primarily to recovery/prevention.

Add:

- Radio group
- Checkbox group
- Single select
- Combo box
- Listbox
- Multi-select
- Select all
- Bulk selection
- Segmented control
- Toggle switch
- Slider
- Range slider
- Transfer list
- Tree selection
- Object picker
- Chip selection

Interactive requirements:

- Selected, focus, disabled, indeterminate where relevant.
- Keyboard arrow behavior for composite widgets.
- Selection count and bulk action availability.
- Bad variants: toggle used for delayed submit, radio used for independent choices, hidden selection state.

Priority comparisons:

- Radio group vs select.
- Checkbox group vs multi-select.
- Toggle vs checkbox.
- Segmented control vs tabs.
- Object picker vs search.

### 5. Feedback, Status, And System State

Current coverage:

- Toast-only critical error as anti-pattern

Add:

- Toast notification
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
- Permission denied
- Service unavailable
- Page not found

Interactive requirements:

- Live regions where needed.
- Transient vs persistent behavior.
- Retry/recovery affordances.
- Loading-to-success/failure transitions.
- Bad variants: toast-only critical failure, spinner with no timeout, success that hides next action.

Priority comparisons:

- Toast vs alert vs banner vs inline message.
- Loading spinner vs skeleton vs progress bar.
- Empty state vs no-results recovery vs error state.
- Notification center vs toast.

### 6. Error Prevention And Recovery

Current coverage:

- Confirmation dialog
- Undo

Add:

- Inline validation
- Error summary
- Destructive action confirmation
- Typed confirmation
- Restore from trash
- Redo
- Autosave recovery
- Conflict resolution
- Retry
- Fallback path
- Graceful degradation
- Exit warning
- Session recovery

Interactive requirements:

- Pre-action warning vs post-action recovery.
- Commit boundary.
- Retry success/failure.
- Conflict merge resolution.
- Bad variants: confirmation fatigue, fake undo, validation without field focus.

Priority comparisons:

- Undo vs confirmation dialog.
- Typed confirmation vs standard confirmation.
- Inline validation vs error summary.
- Restore from trash vs undo.
- Retry vs fallback path.

### 7. Disclosure And Attention Management

Current coverage:

- Modal dialog

Add:

- Accordion
- Disclosure
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
- Full-screen takeover

Interactive requirements:

- Open/close state.
- Focus management.
- Escape and outside-click behavior.
- Modality/blocking behavior.
- Bad variants: tooltip with essential information, modal for nonblocking content, drawer with no return path.

Priority comparisons:

- Modal vs drawer vs popover vs sheet.
- Tooltip vs popover.
- Accordion vs tabs.
- Details panel vs navigation.

### 8. Data Display And Exploration

Current coverage:

- None

Add:

- Table
- Data grid
- Tree grid
- List view
- Card grid
- Master-detail
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
- Dashboard layout

Interactive requirements:

- Sort, filter, selection, density, responsive collapse.
- Empty/loading/error states.
- Keyboard navigation for grids.
- Bad variants: table for heterogeneous content, card grid with hidden comparison criteria, inaccessible data grid.

Priority comparisons:

- Table vs data grid vs list vs card grid.
- Master-detail vs separate detail page.
- Timeline vs activity log.
- Dashboard vs report page.

### 9. Task And Workflow Patterns

Current coverage:

- None

Add:

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
- Start page
- Confirmation page
- Check answers
- Multi-task completion

Interactive requirements:

- Step state.
- Save/resume.
- Back/cancel.
- Completion confirmation.
- Error recovery.
- Bad variants: no progress visibility, dead-end confirmation, forced account creation too early.

Priority comparisons:

- Wizard vs task list.
- Review queue vs approval workflow.
- Checkout vs payment collection.
- Confirmation page vs success toast.

### 10. Collaboration And Social Interaction

Current coverage:

- None

Add:

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
- Follow/subscribe
- Notification preferences
- Version history
- Change review
- Handoff summary

Interactive requirements:

- Add/edit/delete comment.
- Mention autocomplete.
- Presence state.
- Permission levels.
- Notification opt-in/out.
- Bad variants: unclear audience, hidden permission changes, unannounced edits.

Priority comparisons:

- Comments vs threaded discussion.
- Activity feed vs notification center.
- Share dialog vs permission settings.
- Version history vs audit log.

### 11. Personalization And Preference

Current coverage:

- None

Add:

- Preference center
- Saved filters
- Custom dashboard
- Pinned items
- Favorites
- Recently used
- Recommended next action
- Adaptive defaults
- User-controlled density
- User-controlled layout
- Notification preferences

Interactive requirements:

- Save/apply/reset preferences.
- Default vs customized state.
- Clear undo/reset path.
- Bad variants: personalization without visibility, irreversible preference changes, hidden automation.

Priority comparisons:

- Favorites vs pinned items.
- Saved filter vs saved search.
- Custom dashboard vs saved view.
- Adaptive default vs explicit preference.

### 12. AI And Automation UX

Current coverage:

- Prompt suggestions

Add:

- Prompt box
- Chat interface
- Streaming response
- Citation display
- Confidence/uncertainty display
- Human approval gate
- Agent plan preview
- Agent progress trace
- Tool-use visibility
- Editable AI output
- Regenerate/retry
- Correction feedback
- Escalate to human
- Handoff summary
- Automation rule builder
- Safety boundary notice
- Model update notice
- AI failure recovery

Interactive requirements:

- Before-generation state.
- Streaming/during state.
- Stop/regenerate/edit.
- Citation inspection.
- Confidence/uncertainty display.
- Approval before external side effects.
- Tool trace visibility.
- Bad variants: fabricated confidence, hidden tool actions, final approval after side effects, no correction path.

Priority comparisons:

- Chat interface vs inline AI action.
- Prompt suggestions vs prompt templates.
- Agent plan preview vs approval gate.
- Citation display vs source list.
- Regenerate vs correction feedback.

### 13. Trust, Safety, And Privacy

Current coverage:

- None

Add:

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
- Block/mute
- Age gate
- Legal acceptance
- Suspicious activity warning
- Recovery codes

Interactive requirements:

- Clear consequence copy.
- Permission grant/deny.
- Timeout warning and extension.
- Sensitive reveal with re-hide.
- Bad variants: dark-pattern consent, hidden permanent deletion, vague security warning.

Priority comparisons:

- Consent prompt vs legal acceptance.
- Permission request vs privacy settings.
- Delete account vs deactivate account.
- Security warning vs confirmation dialog.

### 14. Cross-Device And Physical Interaction

Current coverage:

- None

Add:

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
- Responsive split view

Interactive requirements:

- Pointer/touch/keyboard alternatives.
- Gesture discovery.
- Cancel and recovery.
- Permission and unavailable-device states.
- Bad variants: gesture-only critical action, inaccessible drag and drop, hidden keyboard shortcut.

Priority comparisons:

- Swipe action vs visible row action.
- Drag and drop vs file picker.
- Voice command vs text command.
- Pull to refresh vs explicit refresh.

## Anti-Pattern Backlog

Add at least 20 anti-pattern entries:

- Toast-only critical error
- Fake undo
- Confirmation fatigue
- Hidden destructive action
- Modal stacking
- Tooltip-only essential information
- Infinite spinner
- Dead-end empty state
- No-results dead end
- Filter trap
- Inaccessible custom select
- Icon-only ambiguous action
- Disabled button with no explanation
- Autocomplete focus trap
- Silent autosave failure
- Hidden permission escalation
- AI hallucinated source
- AI acts without approval
- AI confidence without uncertainty
- Dark-pattern consent

Each anti-pattern needs:

- Detection cues.
- Why it fails.
- User harm/risk.
- Safer replacement pattern.
- Live bad vs corrected demo when feasible.

## Implementation Phases

### Phase 1: Core Web/Product Patterns

Goal: Reach 35 high-value patterns with demos.

Add:

- Tabs
- Breadcrumbs
- Side navigation
- Command palette
- Basic search
- Search suggestions
- Filter chips
- Empty state
- Error state
- Loading skeleton
- Inline validation
- Error summary
- Multi-step form
- Review before submit
- Radio group
- Checkbox group
- Toggle switch
- Select/combobox
- Accordion
- Drawer
- Tooltip
- Popover
- Table
- Data grid
- List view
- Card grid
- Master-detail

Also add 10 comparisons and 8 anti-patterns.

### Phase 2: Workflow And Service Patterns

Goal: Add task flows that show UX over time, not only components.

Add:

- Account creation
- Sign in
- Password reset
- Two-factor authentication
- Checkout
- Payment collection
- Address entry
- Settings management
- Invite user
- Approval workflow
- Review queue
- Publish workflow
- Scheduling
- Booking
- Confirmation page
- Service unavailable
- Page not found

Also add GOV.UK-backed task patterns where applicable.

### Phase 3: Collaboration, Personalization, And Data Exploration

Goal: Cover modern SaaS/product interfaces.

Add:

- Comments
- Mentions
- Presence
- Share dialog
- Permission sharing
- Activity feed
- Assignment
- Version history
- Saved filters
- Favorites
- Pinned items
- Custom dashboard
- Notification preferences
- Timeline
- Activity log
- Kanban board
- Calendar view

### Phase 4: AI And Automation UX

Goal: Make the catalog useful for agentic UI generation.

Add:

- Prompt box
- Chat interface
- Streaming response
- Citation display
- Confidence display
- Agent plan preview
- Agent progress trace
- Tool-use visibility
- Human approval gate
- Editable AI output
- Regenerate/retry
- Correction feedback
- Escalate to human
- Automation rule builder
- AI failure recovery

Also add AI-specific anti-patterns and comparisons.

### Phase 5: Trust, Safety, Privacy, And Cross-Device

Goal: Cover high-risk and nonstandard interaction contexts.

Add:

- Consent prompt
- Permission request
- Sensitive-data reveal
- Session timeout
- Audit log
- Data export
- Delete account
- Privacy settings
- Report abuse
- Touch gesture
- Swipe action
- Long press
- Drag and drop
- Voice command
- Camera capture
- Location permission
- QR scan

## Interactive Demo Standards

Every demo must expose:

- UI surface: the visible layout and controls.
- UX state machine: before, during, after, failure, recovery.
- State controls: toggles/buttons/selects to inspect important conditions.
- Accessibility proof: keyboard instructions or visible focus behavior where relevant.
- Bad-condition mode: at least one misuse, edge case, or unsupported condition.
- Agent notes: required states and "do not generate" constraints.

Examples:

- Tabs demo: keyboard arrow movement, active tab, disabled tab, overflow tab, comparison with segmented control.
- Inline validation demo: empty, typing, valid, invalid, submit with error summary, focus jump to first error.
- Agent approval gate demo: plan preview, risky tool call, approve/reject/edit, post-action audit trail.

## Data And Source Workflow

For every batch:

1. Add or update source entries first.
2. Add pattern JSON entries.
3. Add comparison JSON entries for adjacent choices.
4. Add playground components.
5. Add PatternPlayground mapping.
6. Run `npm run check`.
7. Browser-verify at desktop and mobile.
8. Verify no global-scroll dead zones and no first-viewport text dump.

## Completion Metrics

Track:

- Total accepted patterns.
- Total anti-patterns.
- Patterns with live demos.
- Patterns with comparisons.
- Patterns with source-backed claims.
- Patterns with keyboard/accessibility contracts.
- Categories with fewer than 5 entries.
- Categories without an anti-pattern.
- Demos missing loading/empty/error/recovery states where relevant.

Minimum release target:

- 80 patterns.
- 15 anti-patterns.
- 30 comparisons.
- 80 live demos or variants.
- 100% source-backed.
- 100% schema-valid.
- 100% PatternPlayground mapped.

Comprehensive target:

- 120 patterns.
- 20 anti-patterns.
- 40 comparisons.
- 120 live demos or variants.

## Immediate Next Implementation Batch

Add these 12 first because they unlock many comparisons and improve the catalog's own UI:

1. Tabs
2. Breadcrumbs
3. Command palette
4. Basic search
5. Search suggestions
6. Empty state
7. Error state
8. Loading skeleton
9. Inline validation
10. Error summary
11. Radio group
12. Checkbox group

Add these comparisons with that batch:

1. Tabs vs segmented control vs pagination.
2. Basic search vs command palette.
3. Search suggestions vs autocomplete.
4. Empty state vs no-results recovery vs error state.
5. Inline validation vs error summary.
6. Radio group vs select.
7. Checkbox group vs multi-select.

Add these anti-patterns with that batch:

1. Infinite spinner.
2. Dead-end empty state.
3. Inaccessible custom select.
4. Icon-only ambiguous action.
5. Disabled button with no explanation.

## Product UX Rule For This Catalog

The catalog UI must demonstrate the standard it teaches:

- Do not open with a hero.
- Do not dump guidance into the first viewport.
- Make the live demo the primary object.
- Keep decision details collapsed until needed.
- Use compare as an action, not a document.
- Use sources as claim evidence, not library trivia.
- Use anti-patterns as an audit workflow, not a gallery.
- Keep global scroll only when real content requires it.
