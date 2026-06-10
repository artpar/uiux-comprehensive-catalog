# Missing UI/UX Patterns Research

Date: 2026-06-08

## Purpose

The current catalog has a solid interactive seed set, but it is not yet comprehensive. This report compares the current `src/data/patterns` entries against the project taxonomy and source-backed pattern libraries to identify what is missing.

The goal is not to add every component name from every design system. A candidate belongs here when it is a repeatable UI/UX solution with inspectable visual states, interaction behavior, accessibility expectations, and failure modes.

## Current Coverage Snapshot

Current source data contains 30 patterns:

- Navigation And Wayfinding: `bottom-navigation`, `breadcrumbs`, `command-palette`, `pagination`, `tabs`
- Search, Browse, And Discovery: `basic-search`, `faceted-search`, `no-results-recovery`, `search-suggestions`
- Input And Data Entry: `autocomplete`, `inline-validation`
- Selection And Choice: `checkbox-group`, `inaccessible-custom-select`, `multi-select`, `radio-group`, `segmented-control`, `select`
- Feedback, Status, And System State: `dead-end-empty-state`, `disabled-button-no-explanation`, `empty-state`, `error-state`, `infinite-spinner`, `loading-skeleton`, `toast-only-critical-error`
- Error Prevention And Recovery: `confirmation-dialog`, `error-summary`, `undo`
- Disclosure And Attention Management: `icon-only-ambiguous-action`, `modal-dialog`
- AI And Automation UX: `prompt-suggestions`

Categories with no current direct coverage:

- Data Display And Exploration
- Task And Workflow Patterns
- Collaboration And Social Interaction
- Personalization And Preference
- Trust, Safety, And Privacy
- Cross-Device And Physical Interaction

## Source Baseline

Sources checked for this pass:

- [WAI-ARIA Authoring Practices Guide patterns](https://wai-website.netlify.app/aria/apg/patterns/): accordion, alert, alert dialog, button, carousel, combobox, disclosure, feed, grid, listbox, menu, menu button, meter, slider, spinbutton, switch, table, tabs, toolbar, tooltip, tree view, treegrid, window splitter.
- [GOV.UK Design System components](https://design-system.service.gov.uk/components/) and [patterns](https://design-system.service.gov.uk/patterns/): accordion, back link, character count, cookie banner, date input, details, file upload, notification banner, password input, service navigation, task list, warning text, addresses, bank details, dates, email addresses, payment card details, check answers, complete multiple tasks, confirmation pages, page not found, service unavailable, step-by-step navigation.
- [USWDS components](https://designsystem.digital.gov/components/overview/) and [patterns](https://designsystem.digital.gov/patterns/): accordion, alert, banner, button group, card, collection, combo box, data visualizations, date picker, date range picker, file input, header, in-page navigation, input mask, language selector, memorable date, process list, range slider, side navigation, site alert, step indicator, summary box, table, time picker, tooltip, validation, create user profile, complete complex form, select a language.
- [Carbon Design System patterns](https://carbondesignsystem.com/patterns/overview/): common actions, dialogs, disabled states, disclosures, empty states, filtering, forms, global header, loading, login, notifications, search, text toolbar.
- [Microsoft Human-AI Interaction guidelines](https://www.microsoft.com/en-us/research/articles/guidelines-for-human-ai-interaction-eighteen-best-practices-for-human-centered-ai-design/): make capabilities clear, show how well the system can do them, support invocation/dismissal/correction, scope services when uncertain, explain why the system did something, update cautiously over time.

## High-Priority Missing Patterns

These should be the next catalog expansion target because they cover large gaps, have strong external evidence, and are common in generated UI.

### Navigation And Wayfinding

- Global navigation
- Header / top app bar
- Side navigation
- Navigation drawer
- Service navigation
- Back link
- In-page anchor navigation
- Step navigation / step indicator
- Process list / step-by-step navigation
- Mega menu
- Utility navigation
- Related links
- Recently viewed
- Skip link

Why this matters: current navigation coverage handles tabs, pagination, breadcrumbs, bottom navigation, and command palette, but not the core page/app shell patterns used to orient users across a product.

First comparisons:

- Side navigation vs navigation drawer
- Breadcrumbs vs back link
- Step indicator vs task list
- Global navigation vs service navigation
- Command palette vs global search

### Search, Browse, And Discovery

- Filter panel
- Filter chips
- Sort controls
- Saved search
- Saved filter
- Search result highlighting
- Search scope selector
- Advanced search
- Browse by category
- Recommendations
- Recently searched
- Query correction
- Search history
- Typeahead, separated from autocomplete

Why this matters: current search coverage has search, suggestions, autocomplete, facets, and no-results recovery, but misses the surrounding browse/refine system that makes search usable in large data sets.

First comparisons:

- Filter panel vs faceted search
- Saved search vs saved filter
- Search suggestions vs typeahead vs autocomplete
- Sort vs filter
- Recommendations vs search results

### Input And Data Entry

- Text input
- Textarea
- Single-question page
- Single-page form
- Multi-step form
- Wizard
- Complete complex form
- Inline edit
- Autosave form
- Draft state
- Dependent fields
- Conditional reveal fields
- Input mask
- Input prefix/suffix
- Character count
- Date input
- Date picker
- Date range picker
- Time picker
- File upload
- Drag-and-drop upload
- Bulk import
- Review before submit / check answers
- Address entry
- Bank details
- Payment card entry
- Password input
- Password creation
- Email address entry
- Phone number entry
- Name entry

Why this matters: forms are one of the largest practical gaps. The catalog currently has validation behaviors and autocomplete, but not the form/page patterns that determine task flow, data preservation, review, and recovery.

First comparisons:

- Single-question page vs single-page form
- Wizard vs task list
- Date input vs date picker
- File upload vs drag-and-drop upload
- Autosave vs explicit save
- Check answers vs confirmation page

### Selection And Choice

- Toggle switch
- Slider
- Range slider
- Spinbutton / numeric stepper
- Combobox
- Listbox
- Menu button
- Menu / menubar
- Transfer list
- Tree selection
- Object picker
- Chip selection
- Button group
- Action menu

Why this matters: the current catalog covers basic grouped choices, select, segmented control, and multi-select, but not composite widgets and selection mechanisms that have specialized keyboard contracts.

First comparisons:

- Toggle vs checkbox
- Select vs combobox vs listbox
- Menu button vs select
- Slider vs spinbutton
- Object picker vs search

### Feedback, Status, And System State

- Toast notification
- Inline message
- Alert
- Banner
- Notification banner
- Site alert
- Notification center
- Warning text
- Success confirmation
- Confirmation page
- Loading spinner
- Progress bar
- Meter
- Step progress
- Offline state
- Sync state
- Conflict state
- Permission denied state
- Service unavailable page
- Page not found page
- Cookie banner
- Phase / beta banner

Why this matters: current feedback coverage is mostly empty/error/loading anti-patterns and skeletons. It lacks the difference between transient, persistent, blocking, and page-level status communication.

First comparisons:

- Toast vs alert vs banner vs inline message
- Notification center vs notification banner
- Spinner vs skeleton vs progress bar
- Error state vs service unavailable page
- Confirmation page vs success toast

### Error Prevention And Recovery

- Destructive action confirmation
- Typed confirmation
- Redo
- Restore from trash
- Retry
- Fallback path
- Graceful degradation
- Exit warning
- Session timeout warning
- Autosave recovery
- Conflict resolution
- Merge conflict resolver
- Permission recovery
- Unsaved changes prompt

Why this matters: the current catalog has confirmation dialog, error summary, and undo, but not the broader recovery system around commit boundaries, long-running tasks, and state restoration.

First comparisons:

- Typed confirmation vs standard confirmation
- Undo vs restore from trash
- Retry vs fallback path
- Autosave recovery vs draft state
- Exit warning vs autosave

### Disclosure And Attention Management

- Accordion
- Disclosure / details
- Alert dialog
- Drawer
- Sheet
- Bottom sheet
- Popover
- Tooltip
- Context menu
- Action sheet
- Hover card
- Details panel
- Preview panel
- Progressive disclosure
- Carousel
- Toolbar
- Window splitter
- Full-screen takeover

Why this matters: modal dialog is not enough. The missing patterns here are exactly where generated UI often overuses modals, hides essential text in tooltips, or breaks focus/escape behavior.

First comparisons:

- Modal vs drawer vs popover vs sheet
- Tooltip vs popover
- Accordion vs disclosure
- Details panel vs separate page
- Toolbar vs action menu

### Data Display And Exploration

- Table
- Data grid
- Tree grid
- List view
- Collection
- Card list
- Card grid
- Master-detail
- Feed
- Timeline
- Activity log
- Calendar view
- Kanban board
- Map view
- Data visualization
- Chart drilldown
- Compare view
- Expandable row
- Saved view
- Dashboard layout
- Summary box
- Tag / status tag

Why this matters: this is a zero-coverage category. Any serious product catalog needs ways to show, compare, scan, filter, select, and drill into information.

First comparisons:

- Table vs data grid
- List vs card grid
- Master-detail vs separate detail page
- Timeline vs activity log
- Dashboard vs report page
- Tree grid vs tree view

### Task And Workflow Patterns

- Onboarding
- Start page
- Account creation
- Create user profile
- Sign in
- Login
- Password reset
- Two-factor authentication
- Confirm email
- Confirm phone
- Checkout
- Payment collection
- Profile setup
- Settings management
- Invite user
- Approval workflow
- Review queue
- Publish workflow
- Scheduling
- Booking
- Complete multiple tasks
- Task list
- Question page

Why this matters: workflow patterns connect controls into a task. The current catalog mostly covers widgets and states, not real end-to-end task structures.

First comparisons:

- Onboarding vs start page
- Task list vs wizard
- Review queue vs approval workflow
- Checkout vs payment collection
- Confirmation page vs check answers

### Collaboration And Social Interaction

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
- Handoff summary

Why this matters: this is a zero-coverage category and is essential for multi-user products, document tools, dashboards, and review workflows.

First comparisons:

- Comments vs threaded discussion
- Activity feed vs notification center
- Share dialog vs permission settings
- Version history vs audit log
- Assignment vs approval workflow

### Personalization And Preference

- Preference center
- Settings page
- Saved filters
- Custom dashboard
- Pinned items
- Favorites
- Recently used
- Recommended next action
- Adaptive defaults
- User-controlled density
- User-controlled layout
- Language selector
- Notification preferences

Why this matters: current catalog has no durable preference or personalization patterns, yet these decisions control repeat-use workflows and user agency.

First comparisons:

- Favorites vs pinned items
- Saved filter vs saved search
- Custom dashboard vs saved view
- Adaptive default vs explicit preference
- Preference center vs settings page

### AI And Automation UX

- Prompt box
- Chat interface
- Streaming response
- Citation display
- Source grounding display
- Confidence / uncertainty display
- Human approval gate
- Agent plan preview
- Agent progress trace
- Tool-use visibility
- Editable AI output
- Regenerate / retry
- Correction feedback
- Scope clarification
- Escalate to human
- Handoff summary
- Automation rule builder
- Model update notice
- AI limitation onboarding
- AI output audit trail

Why this matters: current AI coverage is only prompt suggestions. Modern AI UX needs patterns for capability framing, uncertainty, correction, human control, and auditability.

First comparisons:

- Prompt suggestions vs prompt box
- Chat interface vs inline AI action
- Agent plan preview vs progress trace
- Citation display vs confidence display
- Human approval gate vs undo

### Trust, Safety, And Privacy

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
- Exit this page quickly
- Official-site banner
- Cookie consent
- Dangerous-action review

Why this matters: this is a zero-coverage category. These patterns determine whether users understand risk, consent, authority, privacy, and irreversible outcomes.

First comparisons:

- Consent prompt vs legal acceptance
- Permission request vs privacy settings
- Audit log vs activity feed
- Delete account vs destructive confirmation
- Session timeout vs exit warning

### Cross-Device And Physical Interaction

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
- Responsive navigation adaptation
- Offline mobile retry

Why this matters: this is a zero-coverage category. It matters when the same product workflow spans desktop, mobile, touch, keyboard, camera, location, or offline contexts.

First comparisons:

- Swipe action vs visible row action
- Drag and drop vs file upload
- Keyboard shortcut vs command palette
- Location permission flow vs generic permission request
- Pull to refresh vs retry button

## Anti-Patterns Missing

The current anti-pattern set is useful but small. Add these because they recur in generated UI:

- Toast-only success for completed transaction
- Tooltip-only required information
- Modal for nonblocking content
- Drawer with no close or return path
- Filter reset that clears unrelated search
- Pagination without current page
- Infinite scroll with no footer access
- Carousel auto-advance without pause
- Required field hidden by conditional logic
- Validation that clears user input
- Confirmation fatigue
- Fake undo
- Disabled controls without recovery
- Ambiguous destructive action copy
- AI answer without sources
- AI confidence shown as fake precision
- AI agent acts without approval
- Permission prompt with no context
- Dark-pattern consent
- Hidden destructive account deletion

## Recommended Implementation Batches

### Batch 1: Core Product UI Coverage

Add these first because they fill the largest everyday app gaps:

- Global navigation
- Side navigation
- Back link
- Accordion
- Disclosure
- Tooltip
- Popover
- Table
- Data grid
- Card list
- Toast notification
- Alert
- Banner
- Progress bar
- Toggle switch
- Slider
- Combobox
- Listbox
- Date input
- File upload

### Batch 2: Forms And Workflow Coverage

- Single-question page
- Multi-step form
- Wizard
- Check answers
- Confirmation page
- Task list
- Character count
- Input mask
- Date picker
- Date range picker
- Payment card entry
- Address entry
- Password reset
- Two-factor authentication
- Onboarding
- Start page
- Settings page
- Invite user
- Approval workflow
- Review queue

### Batch 3: Search, Data, And Recovery Depth

- Filter panel
- Filter chips
- Sort controls
- Saved search
- Search result highlighting
- Advanced search
- Query correction
- Loading spinner
- Offline state
- Sync state
- Conflict state
- Retry
- Fallback path
- Restore from trash
- Autosave recovery
- Conflict resolution
- Master-detail
- Timeline
- Activity log

### Batch 4: Collaboration, Trust, And AI

- Comments
- Mentions
- Presence
- Share dialog
- Permission sharing
- Version history
- Preference center
- Favorites
- Pinned items
- Consent prompt
- Permission request
- Sensitive-data reveal
- Audit log
- AI prompt box
- AI chat interface
- Streaming response
- Citation display
- Human approval gate
- Agent plan preview
- Tool-use visibility
- Correction feedback

## Admission Notes

Some source catalogs list low-level components like buttons, links, typography, icons, and cards. These should not automatically become catalog entries unless the entry captures a user problem and interaction contract. For example:

- Accept `button group` when it explains grouped related actions and selection/priority behavior.
- Do not accept `button` as a standalone pattern unless the catalog frames action semantics, destructive state, loading state, and submit/cancel behavior.
- Accept `card list` or `card grid` when it covers scanning, comparison, selection, responsive behavior, and bad hidden-criteria variants.
- Do not accept visual-only card styling as a pattern.

## Evidence Summary

This research pass indicates the catalog should grow from 30 entries to roughly:

- 120 to 150 accepted patterns
- 20 to 30 anti-patterns
- 50 or more comparison pages

The biggest missing areas are not small components; they are complete families:

1. Data display and exploration
2. Task and workflow patterns
3. Form and data-entry flows
4. Collaboration and sharing
5. Trust, safety, and privacy
6. AI control, correction, and auditability
7. Cross-device interaction
