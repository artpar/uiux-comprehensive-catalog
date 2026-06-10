import type { PatternEntry } from "@/schemas/catalog";
import QualityPatternDemo from "./playgrounds/QualityPatternDemo";

type PatternPlaygroundProps = {
  pattern: PatternEntry;
  variant?: "detail" | "preview";
};

const playgroundPrompts: Record<string, { title: string; prompt: string }> = {
  "back-link": {
    title: "Return to the previous step",
    prompt: "Enter a value, continue, then use Back and check whether the previous transaction page is restored."
  },
  "bottom-navigation": {
    title: "Switch top-level destinations",
    prompt: "Check whether the active destination and destination content stay in sync."
  },
  "basic-search": {
    title: "Find matching records",
    prompt: "Type a query, inspect the result count, and check how the list responds while narrowing."
  },
  "browse-by-category": {
    title: "Browse a category taxonomy",
    prompt: "Choose categories, drill into child topics, and check whether labels, counts, popular tasks, and empty-category recovery stay clear."
  },
  "advanced-search": {
    title: "Build a precise query",
    prompt: "Add clauses, change Boolean logic, inspect the generated query, and check whether invalid syntax is repaired before search."
  },
  "query-correction": {
    title: "Correct a submitted query",
    prompt: "Submit a misspelled query, compare corrected results with the original query, and check whether the correction can be accepted, edited, or reversed."
  },
  recommendations: {
    title: "Tune recommended items",
    prompt: "Inspect the reason for each recommendation, dismiss one, toggle personalization, and check whether the list updates without pretending items were recently viewed."
  },
  "search-result-highlighting": {
    title: "Inspect highlighted matches",
    prompt: "Change the submitted query, toggle highlighted fields, and check whether result snippets explain exactly why each result matched."
  },
  "search-scope-selector": {
    title: "Choose where search runs",
    prompt: "Switch search scope, keep the query visible, and check whether result counts, unavailable scopes, and summaries update together."
  },
  breadcrumbs: {
    title: "Move through hierarchy",
    prompt: "Step deeper and back up, then check whether the current location remains clear."
  },
  "checkbox-group": {
    title: "Select multiple options",
    prompt: "Toggle independent choices and confirm the selected set is visible."
  },
  "command-palette": {
    title: "Run a global command",
    prompt: "Open the palette, filter commands, and inspect whether actions remain discoverable."
  },
  "menu-button": {
    title: "Open a contextual action menu",
    prompt: "Open the menu, move between menu items, activate a safe item, dismiss with Escape, and inspect focus return plus destructive-action handoff."
  },
  "menu-menubar": {
    title: "Navigate application commands",
    prompt: "Move across top-level menu groups, open a submenu, toggle a checked command, try a disabled item, open the nested Theme submenu, and dismiss with Escape."
  },
  "confirmation-dialog": {
    title: "Confirm a destructive action",
    prompt: "Inspect consequence copy, safe cancellation, focus behavior, and the final outcome."
  },
  "destructive-action-confirmation": {
    title: "Review loss before destructive commit",
    prompt: "Open a destructive delete review, inspect object scope and loss inventory, resolve dependency blocking, acknowledge permanent loss, cancel safely, commit once, and compare vague, default-danger, reversible-action, hidden-scope, post-commit, and double-submit misuse."
  },
  "typed-confirmation": {
    title: "Type the exact target before severe commit",
    prompt: "Type and paste repository names, inspect mismatch and exact-match states, switch targets to clear stale input, resolve dependency blocking, commit once, and compare yes-only, masked field, partial match, stale target, impossible phrase, and logging-risk misuse."
  },
  "dead-end-empty-state": {
    title: "Diagnose a blank dead end",
    prompt: "Switch between empty causes and compare a recoverable state with an inert blank panel."
  },
  "disabled-button-no-explanation": {
    title: "Reveal why an action is blocked",
    prompt: "Change requirements and compare a visible blocked-action path with a grey button that gives no next step."
  },
  "empty-state": {
    title: "Recover from an empty space",
    prompt: "Inspect whether the empty state explains what happened and offers a useful next action."
  },
  "error-state": {
    title: "Recover from a failed state",
    prompt: "Switch into failure and check whether the error stays visible with a retry path."
  },
  "error-summary": {
    title: "Fix form errors from a summary",
    prompt: "Submit the form, follow the summary link, and inspect whether the field error is reachable."
  },
  "faceted-search": {
    title: "Narrow a result set",
    prompt: "Apply facets, inspect counts, remove filters, and recover from zero results."
  },
  "filter-panel": {
    title: "Apply grouped filters",
    prompt: "Open the panel, change draft criteria, apply them, and verify the collapsed count and result summary stay synchronized."
  },
  "filter-chips": {
    title: "Toggle compact filters",
    prompt: "Select chips, remove one active filter, and check whether chip order, result count, query, and sort remain stable."
  },
  "sort-controls": {
    title: "Change result order",
    prompt: "Change the sort option, inspect the announced order, and check whether query, filters, and pagination behave predictably."
  },
  "saved-filter": {
    title: "Save and apply filter presets",
    prompt: "Apply a saved filter, edit its criteria, and check whether query, sort, ownership, and result count remain clear."
  },
  "saved-search": {
    title: "Save and rerun a search",
    prompt: "Name the current query, run a saved search, and check whether criteria, ownership, sharing, and alerts stay clear."
  },
  "global-navigation": {
    title: "Switch product sections",
    prompt: "Move between top-level sections, open overflow, and check whether current state and local drafts are preserved."
  },
  header: {
    title: "Inspect current-view actions",
    prompt: "Switch views, open overflow, enter selection mode, and check whether the title and actions stay scoped to the current view."
  },
  "icon-only-ambiguous-action": {
    title: "Name the action before activation",
    prompt: "Compare labeled row actions with mystery icons, then trigger each path and inspect whether the result is predictable."
  },
  "inaccessible-custom-select": {
    title: "Test custom select parity",
    prompt: "Compare native selection with a fake dropdown and inspect keyboard, selected value, focus, and form-state behavior."
  },
  "inline-validation": {
    title: "Fix a field-level error",
    prompt: "Submit an invalid value and inspect whether the error appears next to the field."
  },
  "infinite-spinner": {
    title: "Bound an unending wait",
    prompt: "Let the wait cross a threshold, then check whether retry, cached data, cancellation, or error recovery appears."
  },
  "loading-spinner": {
    title: "Scope a short loading wait",
    prompt: "Switch between button, region, and overlay spinners; resolve, cancel, or time out the wait; and compare unlabeled, duplicate-submit, mixed-indicator, and stuck-spinner misuse."
  },
  "in-page-anchor-navigation": {
    title: "Jump within the current page",
    prompt: "Choose a section link and check whether the active link, destination heading, and focus marker stay aligned."
  },
  "loading-skeleton": {
    title: "Preview loading structure",
    prompt: "Inspect whether loading preserves layout without pretending content is available."
  },
  "mega-menu": {
    title: "Open a grouped navigation panel",
    prompt: "Open the Products panel, choose a grouped destination, dismiss it, and compare desktop groups with the mobile fallback."
  },
  "utility-navigation": {
    title: "Inspect persistent utility controls",
    prompt: "Open a utility panel, clear notification state, confirm sign out, and verify the primary destination does not change."
  },
  "modal-dialog": {
    title: "Complete a focused modal task",
    prompt: "Open the dialog, test Tab and Escape, then verify focus returns to the opener."
  },
  "multi-select": {
    title: "Choose several values",
    prompt: "Select multiple options and check whether the chosen set can be reviewed before submission."
  },
  listbox: {
    title: "Move focus through visible options",
    prompt: "Move the active option, select it, try typeahead and Home or End, and compare preview focus with selection-follows-focus."
  },
  "transfer-list": {
    title: "Move items between lists",
    prompt: "Select available permissions, move them to the selected pane, remove one, reorder the destination set, and test minimum-count validation."
  },
  "tree-selection": {
    title: "Select within a hierarchy",
    prompt: "Expand a branch, move focus without changing selection, toggle a leaf, select a branch's descendants, typeahead to Audit, and collapse a branch with selected children."
  },
  "object-picker": {
    title: "Resolve an existing object",
    prompt: "Search duplicate records, change scope, move active result focus, select an object, edit the label to clear stale identity, then validate unresolved text."
  },
  "chip-selection": {
    title: "Choose compact chip answers",
    prompt: "Select three interest chips, try adding a fourth, toggle one off, clear the group, and validate the required state without changing chip order."
  },
  "button-group": {
    title: "Choose related task actions",
    prompt: "Save the draft to unlock Continue, run Continue, trigger Reset changes, restore the group, and compare the disabled reason with the bad mixed-action row."
  },
  "action-menu": {
    title: "Operate on a scoped action list",
    prompt: "Switch from one customer to three selected customers, inspect the grouped menu, try the disabled export, run a safe action, and send Delete to review."
  },
  alert: {
    title: "Handle urgent current-task feedback",
    prompt: "Switch alert severity, reveal details, dismiss a safe message, resolve the condition, and check that urgent updates announce without becoming a modal or toast."
  },
  banner: {
    title: "Manage broad interface messaging",
    prompt: "Switch banner scope, move between workspace sections, reveal schedule details, dismiss a safe rollout message, and verify the banner persists only where its scope applies."
  },
  "notification-banner": {
    title: "Place a page-flow service notice",
    prompt: "Switch notification banner type, move between service pages, reveal detail, clear the resolved state, and verify the message appears immediately before the H1 without replacing validation recovery."
  },
  "site-alert": {
    title: "Publish an urgent sitewide notice",
    prompt: "Switch site alert severity, move between site pages, reveal related updates, push a dynamic update, dismiss only a safe notice, and verify the alert remains sitewide rather than page-local."
  },
  "cookie-banner": {
    title: "Collect cookie consent honestly",
    prompt: "Move a service cookie banner through first visit, accept, reject, manage settings, saved confirmation, returning visit, withdrawal, and no-JavaScript states; compare with accept-only, preselected, tracking-before-consent, deceptive contrast, sticky block, and no-withdrawal misuse."
  },
  "phase-beta-banner": {
    title: "Label service maturity and collect feedback",
    prompt: "Move a service phase banner through alpha, private beta, public beta, feedback, phase transition, and live removal states across service routes; compare with stale beta, public alpha, outage misuse, feature badge, route-blind feedback, and dismissible phase misuse."
  },
  "notification-center": {
    title: "Triage durable notifications",
    prompt: "Open the notification center, clear the unseen badge without clearing unread items, filter unread notifications, mark one item read, suppress a toast into the center, and adjust preferences."
  },
  "warning-text": {
    title: "Warn before a severe consequence",
    prompt: "Switch warning consequence, place it before the risky action, reveal accessible warning wording, try irreversible deletion, and compare color-only or after-action misuse."
  },
  "success-confirmation": {
    title: "Confirm a completed action",
    prompt: "Save a draft, upload evidence, copy the receipt reference, view the confirmed receipt, start a new task, and compare vague or premature success misuse."
  },
  "confirmation-page": {
    title: "Close a completed transaction",
    prompt: "Submit an application, copy the reference, save or email the receipt, track the case, revisit from a bookmark, start another application, and compare endpoint misuse."
  },
  "toast-notification": {
    title: "Manage transient status feedback",
    prompt: "Queue export, saved, archive, and sync toasts; dismiss one message; expire the visible stack; and verify important messages remain in history."
  },
  "inline-message": {
    title: "Resolve contextual in-flow feedback",
    prompt: "Select invoice rows, reveal local detail, switch between warning and success messages, add a billing contact, and check that the message stays attached to the affected row."
  },
  "navigation-drawer": {
    title: "Open and dismiss the drawer",
    prompt: "Open the drawer, choose a destination, dismiss it with the scrim, and check whether focus and selected state recover."
  },
  "related-links": {
    title: "Choose a curated onward link",
    prompt: "Select a related link, inspect why it belongs, compare external and file disclosures, and reject the stale catch-all list."
  },
  "recently-viewed": {
    title: "Resume a recently viewed item",
    prompt: "Open items, check whether the newest one moves to the top, remove one entry, and clear the visible history."
  },
  "recently-searched": {
    title: "Reuse a recent search",
    prompt: "Submit searches, confirm newest-first query history, rerun one term, remove a single query, and clear the search history without affecting saved searches."
  },
  "search-history": {
    title: "Manage stored search activity",
    prompt: "Filter history by source, delete one entry, delete a date range, pause future capture, and verify saved searches remain separate."
  },
  "text-input": {
    title: "Enter a short freeform answer",
    prompt: "Type, paste, submit an empty value, restore a valid value, and verify label, hint, error, width, and typed text stay intact."
  },
  "inline-edit": {
    title: "Edit one displayed value in place",
    prompt: "Enter edit mode, change the value, test validation, cancel, click away with a dirty draft, and save without leaving the row."
  },
  "autosave-form": {
    title: "Preserve form progress automatically",
    prompt: "Change fields, trigger autosave, inspect saving and saved timestamps, simulate a failed save, retry it, and test leave-page protection."
  },
  "draft-state": {
    title: "Manage an unpublished version",
    prompt: "Resume a saved draft, compare it with the live version, publish it, discard it, and inspect stale draft-link recovery."
  },
  "dependent-fields": {
    title: "Keep dependent answers valid",
    prompt: "Choose a controlling value, select a dependent option, change the controller, and verify stale dependent answers are cleared or repaired."
  },
  "conditional-reveal-fields": {
    title: "Reveal related follow-up fields",
    prompt: "Choose answers that reveal and hide follow-up fields, validate a required revealed value, and verify hidden stale values are cleared."
  },
  "input-mask": {
    title: "Format a fixed-pattern value",
    prompt: "Type or paste a container reference, inspect grouped formatting and raw canonical value, trigger incomplete-value validation, then compare a rigid broken mask."
  },
  "input-prefix-suffix": {
    title: "Keep a fixed unit outside the typed value",
    prompt: "Switch between prefix and suffix modes, type values with and without the visible affix, inspect canonical payload, and trigger missing-value validation."
  },
  "character-count": {
    title: "Write within a real text limit",
    prompt: "Move from calm maximum guidance to threshold warnings, switch character and word modes, exceed the limit, trim the draft, and submit a valid value."
  },
  "date-input": {
    title: "Enter a known exact date",
    prompt: "Fill day, month, and year parts, type a month name, trigger missing and impossible-date errors, review canonical ISO output, and compare a broken auto-tabbed mask."
  },
  "date-picker": {
    title: "Choose an available calendar date",
    prompt: "Open the calendar, move between months, select an available appointment day, try an unavailable weekend, type a date manually, and review the canonical value."
  },
  "date-range-picker": {
    title: "Select a complete date range",
    prompt: "Set a start date, preview and select an end date, apply a preset, trigger reversed and too-long range errors, and review the canonical start/end payload."
  },
  "time-picker": {
    title: "Choose a schedulable time",
    prompt: "Filter appointment slots, choose a time, change AM/PM and timezone, trigger off-step and out-of-hours errors, then review the canonical time value."
  },
  "file-upload": {
    title: "Attach a required evidence file",
    prompt: "Select a file, inspect filename, type, size, progress, remove and retry states, trigger wrong-type and too-large errors, then submit with the upload attached."
  },
  "drag-and-drop-upload": {
    title: "Drop files into an upload zone",
    prompt: "Drag over the drop zone, leave to cancel, drop multiple files, reject a non-file drag, use the click fallback, remove a file, and inspect upload progress."
  },
  "bulk-import": {
    title: "Import structured records from a spreadsheet",
    prompt: "Upload a CSV, review auto-mapped columns, fix a required mapping, validate rows, inspect duplicates, choose valid-row-only import, confirm counts, run import, and export failed rows."
  },
  "review-before-submit": {
    title: "Check captured answers before committing",
    prompt: "Review grouped answers, change a contact answer, return directly to review, trigger a stale dependent answer, mark an optional answer as not provided, recheck stale evidence, and submit with explicit action copy."
  },
  "address-entry": {
    title: "Capture a complete postal address",
    prompt: "Search by postcode, choose a matching flat, preserve apartment details, switch to manual entry, change country-specific rules, trigger address-part errors, and review the structured payload."
  },
  "bank-details": {
    title: "Capture and verify bank details",
    prompt: "Enter account holder name, sort code, account number, and optional roll number; normalize pasted values, trigger field errors, inspect match outcomes, handle pending micro-deposit verification, and review masked details."
  },
  "payment-card-entry": {
    title: "Capture and tokenize card details",
    prompt: "Paste a card number, inspect brand detection, trigger Luhn, expiry, CVC, and postal-code errors, tokenize the card, try the wallet path, and review only masked card details before charge."
  },
  "password-input": {
    title: "Enter an existing password safely",
    prompt: "Paste from a password manager, toggle show and hide, inspect Caps Lock and failed-login recovery, and confirm the form clears the secret without revealing which credential was wrong."
  },
  "password-creation": {
    title: "Create a strong reusable password",
    prompt: "Paste a generated password, reject common or breached choices, accept a long passphrase, toggle show and hide, and compare against a weak character-class checklist."
  },
  "email-address-entry": {
    title: "Capture a contactable email address",
    prompt: "Paste a plus-addressed email, trigger malformed and provider-typo states, keep or fix the warning, review the exact address, and inspect when confirmation is needed."
  },
  "phone-number-entry": {
    title: "Capture a callable phone number",
    prompt: "Enter local and international numbers, preserve familiar spacing, reject SMS-only assumptions, offer a no-phone contact route, review the dialable value, and inspect confirmation when phone access is required."
  },
  "name-entry": {
    title: "Capture a person's name respectfully",
    prompt: "Enter a full name with punctuation or non-ASCII characters, switch between common and official-name needs, add a preferred form of address, handle previous name wording, and compare against split-field assumptions."
  },
  "toggle-switch": {
    title: "Toggle a binary setting",
    prompt: "Turn a setting on and off, inspect immediate applied state, delayed pending state, disabled dependency, and compare against switches misused for destructive actions or multi-option choices."
  },
  slider: {
    title: "Adjust one value along a range",
    prompt: "Move a single-thumb slider, compare approximate and exact input paths, inspect keyboard increments, warning/error states, and reject binary or over-precise slider misuse."
  },
  "range-slider": {
    title: "Set lower and upper boundaries",
    prompt: "Adjust minimum and maximum handles, try crossing values, type exact endpoints, inspect stable tab order, empty-results warning, disabled state, and compare against single-slider or date-range misuse."
  },
  spinbutton: {
    title: "Adjust a small count",
    prompt: "Increase and decrease a bounded count, type a value directly, try Page-step movement, clear the required field, repair values outside bounds, inspect disabled/read-only states, and compare against identifier or large-range misuse."
  },
  textarea: {
    title: "Write a longer freeform answer",
    prompt: "Add paragraphs, check remaining characters, trigger empty and too-long validation, and verify the draft is preserved."
  },
  "single-question-page": {
    title: "Answer one focused page",
    prompt: "Choose an answer, continue, use Back, trigger validation, and verify the current question preserves its answer."
  },
  accordion: {
    title: "Reveal related page sections",
    prompt: "Open and close policy sections, use expand all and collapse all, reveal a hidden validation summary, preserve section content while toggling, and compare icon-only, hidden-error, single-open, navigation-mixed, and state-loss failures."
  },
  "single-page-form": {
    title: "Submit a short grouped form",
    prompt: "Edit related fields, submit once, inspect linked multi-field errors, fill a valid sample, and verify values are preserved."
  },
  "complete-complex-form": {
    title: "Complete a sectioned complex form",
    prompt: "Move between sections, validate required fields, fix cross-section errors, inspect section status, and save only after review is complete."
  },
  "multi-step-form": {
    title: "Complete a saved multi-step form",
    prompt: "Move through steps, validate prerequisites, go Back, review answers, change an earlier answer, and inspect stale downstream state."
  },
  wizard: {
    title: "Configure a guided setup wizard",
    prompt: "Choose a connector, unlock the next step, test credentials, review generated settings, cancel safely, and finish only after validation passes."
  },
  typeahead: {
    title: "Search as you type",
    prompt: "Type partial queries, inspect live result hits, trigger loading, select a result, and verify stale results do not replace newer input."
  },
  "no-results-recovery": {
    title: "Recover from no results",
    prompt: "Create an empty result set and inspect whether the recovery path is obvious."
  },
  pagination: {
    title: "Move through result pages",
    prompt: "Step between pages and inspect whether the current page and disabled edges are obvious."
  },
  "prompt-suggestions": {
    title: "Choose and revise an AI prompt",
    prompt: "Compare suggestions, edit one, and check whether the user remains in control."
  },
  "process-list": {
    title: "Expand an end-to-end process",
    prompt: "Open process steps, inspect task links, and check whether guidance, branches, costs, and offline actions stay separate from transaction progress."
  },
  "progress-bar": {
    title: "Track measurable system progress",
    prompt: "Move an upload through partial, complete, error, cancel, and background states; compare honest values with fake 100%, reset, unlabeled, wrong-scope, and stuck progress."
  },
  meter: {
    title: "Read a bounded scalar gauge",
    prompt: "Switch storage, risk, battery, over-limit, unavailable, and low-better gauges; compare them with progress misuse, draggable gauges, missing maximums, and color-only bands."
  },
  "step-progress": {
    title: "Track workflow stage status",
    prompt: "Move an onboarding flow through saved, current, waiting, blocked, failed, skipped, inserted, and compact states; compare proof-based completion with visited, color-only, percent-bar, and stale-step misuse."
  },
  "offline-state": {
    title: "Keep work understandable offline",
    prompt: "Switch a field report through online, offline, local save, queued uploads, reconnecting, synced, sync failed, read-only cache, and stale data; compare against blank pages, fake saves, discarded drafts, and disabled-everything misuse."
  },
  "sync-state": {
    title: "Reconcile local and server changes",
    prompt: "Move a field report sync queue through local saved, queued, syncing, synced, partial, failed, retrying, and conflict-needs-review states; compare with hidden queue, endless spinner, false synced, and cleared-failure misuse."
  },
  "conflict-state": {
    title: "Resolve competing versions",
    prompt: "Review a field report conflict across detected, compare, keep mine, keep server, merge, save copy, resolved, and manual-tool states; compare against silent overwrite, vague retry, hidden copy, reversed sides, bulk accept, and toast-only misuse."
  },
  "conflict-resolution": {
    title: "Commit reviewed conflict decisions",
    prompt: "Walk through field report conflicts, choose local and server values, merge one conflict, save a copy, skip an unsafe item, review the decision summary, commit only when resolved, and compare accept-all or open-commit misuse."
  },
  "merge-conflict-resolver": {
    title: "Resolve repository merge conflicts",
    prompt: "Move a merge request through target/source branch review, hunk choices, inline edit validation, unsupported file handoff, commit message review, accepted commit, and compare undefined ours/theirs or marker-leaking misuse."
  },
  "permission-denied-state": {
    title: "Recover from an access boundary",
    prompt: "Switch a workspace report between denied page, read-only, action denied, request access, pending request, denied request, approved access, and switch-account states; compare with blank page, retry loop, hidden owner, leaking title, disabled-only, and false success misuse."
  },
  "permission-recovery": {
    title: "Recover missing access",
    prompt: "Move a blocked report through role request, reason entry, owner routing, pending status, approval, decline, wrong-account switch, policy escalation, and retry-after-grant while comparing retry loops, false grants, duplicate requests, and leaked private details."
  },
  "service-unavailable-page": {
    title: "Handle a closed or unavailable service",
    prompt: "Switch a benefits service through planned maintenance, unexpected outage, saved draft, unsaved work, partial outage, permanent closure, status update, and urgent support states; compare with bare 503, retry loop, missing return time, lost-work claim, fake progress, and dead-end homepage misuse."
  },
  "page-not-found-page": {
    title: "Recover from a missing route",
    prompt: "Switch a service route through typed URL, moved page, expired deep link, private no-disclosure, search recovery, report link, popular links, and signed-in return states; compare with auto-redirect, bare 404, outage confusion, dead-end, searchless, and private-title leak misuse."
  },
  "radio-group": {
    title: "Choose one visible option",
    prompt: "Select a single option and check whether all choices remain visible."
  },
  "search-suggestions": {
    title: "Use query suggestions",
    prompt: "Type a partial query, choose a suggestion, and inspect whether the query remains editable."
  },
  "skip-link": {
    title: "Bypass repeated navigation",
    prompt: "Reveal the skip link with first focus, activate it, and confirm focus continues at the main content target."
  },
  "service-navigation": {
    title: "Move around one service",
    prompt: "Switch service sections, open the mobile menu, and check whether service identity, tools, and current content stay in sync."
  },
  "step-navigation": {
    title: "Track multistep progress",
    prompt: "Validate the current step, continue, revisit a completed step, and check whether future steps stay locked until ready."
  },
  "side-navigation": {
    title: "Move through local hierarchy",
    prompt: "Switch child pages, collapse the active parent, and check whether local current state stays visible."
  },
  "segmented-control": {
    title: "Switch a compact mode",
    prompt: "Change modes and inspect whether the selected option behaves like a local setting."
  },
  select: {
    title: "Choose from a compact list",
    prompt: "Open the select, choose one value, and check whether the selected value remains visible."
  },
  autocomplete: {
    title: "Complete a known value",
    prompt: "Type into the field, choose a suggestion, and inspect whether typed input remains valid."
  },
  combobox: {
    title: "Choose one value from an owned popup",
    prompt: "Open the popup, move the active option, accept or cancel it, and check whether the submitted ID stays synchronized."
  },
  tabs: {
    title: "Switch sibling sections",
    prompt: "Change tabs and check whether section content changes without navigating away."
  },
  "toast-only-critical-error": {
    title: "Compare transient vs persistent error handling",
    prompt: "Trigger both outcomes and inspect which one still supports recovery."
  },
  undo: {
    title: "Recover after a completed action",
    prompt: "Delete an item, inspect the undo window, and watch the final committed state."
  },
  redo: {
    title: "Reapply an undone edit",
    prompt: "Undo and redo a document change, then branch with a new edit and compare stale, hidden, wrong-target, and shortcut-only redo failures."
  },
  retry: {
    title: "Retry a failed operation safely",
    prompt: "Fail a report export, retry the same request with attempt count and duplicate guards, then compare cooldown, wrong-scope, non-retryable, infinite retry, and hidden-context failures."
  },
  "fallback-path": {
    title: "Switch to an alternate completion route",
    prompt: "Block an address lookup, move to manual entry or assisted support with the application reference retained, complete the fallback, return to lookup, and compare dead-end, retry-loop, hidden-manual, data-loss, and false-fallback failures."
  },
  "graceful-degradation": {
    title: "Preserve the task when enhancements fail",
    prompt: "Disable enhanced calendar, map, drag/drop, geolocation, animation, and third-party widgets; verify core fields and submission remain usable, then compare blank-widget, feature-only, blocked-submit, hidden-core, and fake-success failures."
  },
  "unsaved-changes-prompt": {
    title: "Protect a dirty editor",
    prompt: "Move a contact editor through dirty fields, close, record switch, review changes, save-before-close, failed save, discard, keep editing, and clean close while comparing vague prompts, pending closes, clean-state prompts, field loss, and wrong-scope warnings."
  },
  "exit-warning": {
    title: "Protect work when leaving",
    prompt: "Create unsaved work, attempt an internal route change, browser close, reload, external link, and sign out; choose Stay, Save and leave, or Discard and leave, then compare warn-always, no-warning, vague, trapped, stale-after-save, and toast-only failures."
  },
  "session-timeout-warning": {
    title: "Protect work before timeout",
    prompt: "Move a benefits form through early warning, imminent timeout, extension, save draft, reauthentication, expiry, and restored return states; compare no warning, vague timer, client-only extension, data loss, privacy leak, and alert-loop failures."
  },
  "autosave-recovery": {
    title: "Recover a failed autosave",
    prompt: "Fail an autosave, retry the same local value, save a local copy, restore last saved, compare local and server versions, reauthenticate, and contrast stale-saved, toast-only, data-loss, overwrite, duplicate-submit, and hidden-local-copy failures."
  },
  "restore-from-trash": {
    title: "Recover a deleted object",
    prompt: "Restore a deleted file to its original location, handle missing parents and retention expiry, review bulk restore, and compare permanent-delete misuse."
  }
};

export default function PatternPlayground({ pattern, variant = "detail" }: PatternPlaygroundProps) {
  const copy = playgroundPrompts[pattern.id] ?? {
    title: `Try ${pattern.name}`,
    prompt: "Interact with the pattern and compare the behavior against the guidance."
  };

  return (
    <section
      className={variant === "preview" ? "playground-panel playground-preview" : "detail-panel playground-panel"}
      aria-labelledby={`live-example-title-${pattern.id}-${variant}`}
    >
      <div className="playground-heading">
        <div>
          <h2 id={`live-example-title-${pattern.id}-${variant}`}>{copy.title}</h2>
          <p>{copy.prompt}</p>
        </div>
        <span>{pattern.name}</span>
      </div>
      <QualityPatternDemo pattern={pattern} />
      {variant === "detail" && (
        <div className="demo-contract" aria-label={`${pattern.name} demo contract`}>
          <section>
            <h3>State To Inspect</h3>
            <p>{pattern.requiredStates[0]}</p>
          </section>
          <section>
            <h3>Keyboard / Access</h3>
            <p>{pattern.keyboardBehavior[0] ?? pattern.accessibility[0] ?? "Verify focus, labels, and operable controls."}</p>
          </section>
          <section>
            <h3>Avoid Generating</h3>
            <p>{pattern.commonMisuses[0]}</p>
          </section>
        </div>
      )}
    </section>
  );
}
