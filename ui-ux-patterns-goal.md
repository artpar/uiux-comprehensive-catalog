Goal: Implement the missing UI/UX patterns in the catalog.

  Patterns to implement:

  Navigation: Global navigation, Header / top app bar, Side navigation, Navigation drawer, Service navigation, Back link, In-page anchor navigation, Step navigation / step indicator, Process
  list / step-by-step navigation, Mega menu, Utility navigation, Related links, Recently viewed, Skip link.

  Search and discovery: Filter panel, Filter chips, Sort controls, Saved search, Saved filter, Search result highlighting, Search scope selector, Advanced search, Browse by category,
  Recommendations, Recently searched, Query correction, Search history, Typeahead.

  Input and data entry: Text input, Textarea, Single-question page, Single-page form, Multi-step form, Wizard, Complete complex form, Inline edit, Autosave form, Draft state, Dependent
  fields, Conditional reveal fields, Input mask, Input prefix/suffix, Character count, Date input, Date picker, Date range picker, Time picker, File upload, Drag-and-drop upload, Bulk import,
  Review before submit / check answers, Address entry, Bank details, Payment card entry, Password input, Password creation, Email address entry, Phone number entry, Name entry.

  Selection and choice: Toggle switch, Slider, Range slider, Spinbutton / numeric stepper, Combobox, Listbox, Menu button, Menu / menubar, Transfer list, Tree selection, Object picker, Chip
  selection, Button group, Action menu.

  Feedback and system state: Toast notification, Inline message, Alert, Banner, Notification banner, Site alert, Notification center, Warning text, Success confirmation, Confirmation page,
  Loading spinner, Progress bar, Meter, Step progress, Offline state, Sync state, Conflict state, Permission denied state, Service unavailable page, Page not found page, Cookie banner,
  Phase / beta banner.

  Error prevention and recovery: Destructive action confirmation, Typed confirmation, Redo, Restore from trash, Retry, Fallback path, Graceful degradation, Exit warning, Session timeout
  warning, Autosave recovery, Conflict resolution, Merge conflict resolver, Permission recovery, Unsaved changes prompt.

  Disclosure and attention: Accordion, Disclosure / details, Alert dialog, Drawer, Sheet, Bottom sheet, Popover, Tooltip, Context menu, Action sheet, Hover card, Details panel, Preview panel,
  Progressive disclosure, Carousel, Toolbar, Window splitter, Full-screen takeover.

  Data display and exploration: Table, Data grid, Tree grid, List view, Collection, Card list, Card grid, Master-detail, Feed, Timeline, Activity log, Calendar view, Kanban board, Map view,
  Data visualization, Chart drilldown, Compare view, Expandable row, Saved view, Dashboard layout, Summary box, Tag / status tag.

  Task and workflow: Onboarding, Start page, Account creation, Create user profile, Sign in, Login, Password reset, Two-factor authentication, Confirm email, Confirm phone, Checkout, Payment
  collection, Profile setup, Settings management, Invite user, Approval workflow, Review queue, Publish workflow, Scheduling, Booking, Complete multiple tasks, Task list, Question page.

  Collaboration and social: Comments, Threaded discussion, Mentions, Presence, Live cursors, Share dialog, Permission sharing, Activity feed, Assignment, Reactions, Follow / subscribe,
  Notification preferences, Version history, Change review, Handoff summary.

  Personalization and preference: Preference center, Settings page, Saved filters, Custom dashboard, Pinned items, Favorites, Recently used, Recommended next action, Adaptive defaults, User-
  controlled density, User-controlled layout, Language selector, Notification preferences.

  AI and automation UX: Prompt box, Chat interface, Streaming response, Citation display, Source grounding display, Confidence / uncertainty display, Human approval gate, Agent plan preview,
  Agent progress trace, Tool-use visibility, Editable AI output, Regenerate / retry, Correction feedback, Scope clarification, Escalate to human, Handoff summary, Automation rule builder,
  Model update notice, AI limitation onboarding, AI output audit trail.

  Trust, safety, and privacy: Consent prompt, Permission request, Sensitive-data reveal, Security warning, Session timeout, Audit log, Data export, Delete account, Privacy settings, Report
  abuse, Block / mute, Age gate, Legal acceptance, Exit this page quickly, Official-site banner, Cookie consent, Dangerous-action review.

  Cross-device and physical interaction: Touch gesture, Pull to refresh, Swipe action, Long press, Drag and drop, Keyboard shortcut, Focus traversal, Voice command, Camera capture, Location
  permission flow, QR scan, Haptic feedback, Wearable glance, Responsive navigation adaptation, Offline mobile retry.

  Anti-patterns: Toast-only success for completed transaction, Tooltip-only required information, Modal for nonblocking content, Drawer with no close or return path, Filter reset that clears
  unrelated search, Pagination without current page, Infinite scroll with no footer access, Carousel auto-advance without pause, Required field hidden by conditional logic, Validation that
  clears user input, Confirmation fatigue, Fake undo, Disabled controls without recovery, Ambiguous destructive action copy, AI answer without sources, AI confidence shown as fake precision,
  AI agent acts without approval, Permission prompt with no context, Dark-pattern consent, Hidden destructive account deletion.

  For each pattern:
  - Add a complete schema-valid pattern entry.
  - Add or reuse source-backed evidence.
  - Add related patterns and comparison entries where useful.
  - Add a real inspectable pattern page.
  - The live example must separately show Good UI, Bad UI, Good UX, and Bad UX.
  - UI means layout, labels, spacing, hierarchy, contrast, affordance, visual states.
  - UX means flow, keyboard/focus behavior, validation, recovery, feedback, reversibility, edge cases, task completion.
  - Keep text minimal and demos interactive.
  - Anti-pattern pages must compare the broken version against the corrected version.
  - Run check/build.
  - Generate and inspect screenshots for every added pattern.
  - Report what was added, what remains weak, and which patterns are still missing.
