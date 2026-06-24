import { lazy, Suspense, useState } from "react";
import type { PatternEntry } from "@/schemas/catalog";

const QualityPatternDemo = lazy(() => import("./playgrounds/QualityPatternDemo"));

export type PlaygroundPattern = Pick<
  PatternEntry,
  "id" | "name" | "requiredStates" | "keyboardBehavior" | "accessibility" | "commonMisuses"
>;

type PatternPlaygroundProps = {
  pattern: PlaygroundPattern;
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
  carousel: {
    title: "Browse a controlled slide set",
    prompt: "Pause rotation, move next and previous, jump to named slides, test first/last wrap behavior, hover or focus to stop motion, follow a slide action, and compare auto-advance, unlabeled-dots, hidden-required, swipe-only, focus-loss, and content-dump failures."
  },
  "carousel-auto-advance-without-pause": {
    title: "Stop carousel motion on demand",
    prompt: "Inspect pause first, user-start rotation, focus stop, hover stop, reduced motion, resume safely, slide action stable, reading lock, form entry lock, and background return states; compare no pause, hidden pause, focus ignored, hover ignored, reduced motion ignored, reading interrupted, form entry advanced, constant announcements, and feedback rail rotated failures."
  },
  toolbar: {
    title: "Apply view-scoped commands from a toolbar",
    prompt: "Move toolbar focus with arrow-style controls, toggle formatting state, open overflow, switch to selected-row scope, run and block selection commands, and compare mixed-scope, tab-trap, icon-only, stale-state, hidden-primary, and overflow-dump failures."
  },
  "window-splitter": {
    title: "Resize adjacent panes with a splitter",
    prompt: "Move the splitter left and right, jump to min and max, collapse and restore a pane, check preserved selection and scroll state, and compare pointer-only, no-value, over-collapse, state-loss, unlabeled, and mobile-sliver failures."
  },
  "full-screen-takeover": {
    title: "Enter and exit a full-screen task mode",
    prompt: "Open the takeover, capture a receipt, move to review, use internal Back versus Close, trigger dirty-exit review with Escape or browser back, save, and compare no-exit, ambiguous-back, silent-discard, route-trap, focus-leak, and stacked-overlay failures."
  },
  table: {
    title: "Inspect a semantic record table",
    prompt: "Sort by Amount, filter to pending rows, select a row, move pages, inspect row actions, switch responsive labels, and compare div-table, headerless-mobile, wrong-row-action, sort-mismatch, data-grid-misuse, and cramped-column failures."
  },
  "data-grid": {
    title: "Navigate an editable data grid",
    prompt: "Move the focused cell with arrow controls, enter edit mode, type and save a value, select rows, page virtual rows, validate bad paste, leave the grid, and compare static-role, tab-every-cell, arrow-conflict, wrong-index, lost-focus, and mobile-trap failures."
  },
  "tree-grid": {
    title: "Expand hierarchical rows in a grid",
    prompt: "Move focus through parent and child rows, expand and collapse phases, preserve dirty child state, filter overdue descendants, select child rows, restore focus, and compare flat-grid, fake-leaf, hidden-dirty, sort-break, stale-index, and mobile-crush failures."
  },
  "list-view": {
    title: "Scan and act on object rows",
    prompt: "Filter rows, sort by update time, select tickets, open a row menu, preview the active row, load more rows, inspect hidden selections, and compare fake-table, action-maze, row-conflict, lost-selection, virtual-jump, and mobile-overlap failures."
  },
  collection: {
    title: "Manage a named item collection",
    prompt: "Add an item, reorder the first item, filter the view, toggle sharing and hidden private items, remove an item, and compare unnamed-set, mixed-set, filter-mutation, hidden-private, destructive-scope, drag-only, and stale-copy failures."
  },
  "card-list": {
    title: "Browse rich object cards in a single column",
    prompt: "Save, expand, filter, select, load more, inspect missing-preview fallback, and compare dense-row-wrapper, action-collision, inconsistent-anatomy, hidden-selection, compare-cards, missing-preview, and too-many-actions failures."
  },
  "card-grid": {
    title: "Browse peer objects in a responsive card grid",
    prompt: "Change density, filter available items, select and save cards, load more, inspect missing-thumbnail fallback, and compare masonry-order, comparison-trap, index-selection, hover-only, collapsed-thumbnail, and mixed-card-role failures."
  },
  "master-detail": {
    title: "Move between a master list and adaptive detail",
    prompt: "Select orders, switch between side-by-side and stacked modes, open detail, go back to the list, protect a draft, filter the selected item away, restore it, and compare stale-detail, no-back, lost-state, random-default, index-keyed, and inspector-misuse failures."
  },
  feed: {
    title: "Read a dynamic stream without losing place",
    prompt: "Pause live updates, queue new posts, jump to latest, load older items, mark an item read, filter to team updates, and compare auto-jump, mixed-order, hidden-sponsored, stale-unread, no-context, and endless-trap failures."
  },
  "infinite-scroll-with-no-footer-access": {
    title: "Keep the footer reachable",
    prompt: "Inspect bounded auto-load, load more, jump to footer, footer visible, end state, failed load, return position, keyboard bypass, mobile footer, and legal links states; compare auto-load pushes footer, footer-only legal links, keyboard endless trap, spinner loop, lost return position, mobile footer miss, virtual focus loss, and no load-more escape failures."
  },
  "activity-feed": {
    title: "Catch up on work activity without audit confusion",
    prompt: "Filter actor-verb-object activity by unread, mentions, replies, reactions, app events, repository events, grouped noise, custom view, cleared state, and retention; open, reply, clear, and compare vague, no-filter, audit-confusion, noise-flood, badge-mismatch, and wrong-link failures."
  },
  reactions: {
    title: "React lightly without turning emoji into hidden workflow",
    prompt: "Add and remove your own reaction, open the picker, inspect who reacted, compare counts, custom emoji, skin tone, overflow, not-reactable, workflow-trigger warning, activity grouping, and compare approval-confusion, hover-only, hidden-actors, surprise-workflow, inaccessible-emoji, and reaction-storm failures."
  },
  "follow-subscribe": {
    title: "Subscribe to future updates without hiding scope",
    prompt: "Follow, unfollow, switch item/thread/parent scope, inspect auto-follow reason, delivery destination, digest, muted, permission-limited, closed-target, bulk cleanup, and compare vague-scope, hidden-unfollow, surprise-email, duplicate-delivery, stale-access, and fake-bookmark failures."
  },
  "notification-preferences": {
    title: "Tune notification delivery without hiding critical exceptions",
    prompt: "Configure event types, email, push, in-app, banner, digest, quiet hours, critical exceptions, mobile override, OS permission block, admin policy, preview privacy, keyword alerts, restore defaults, and compare master-off, vague-important, split-channels, quiet-critical, os-mismatch, and duplicate-delivery failures."
  },
  "preference-center": {
    title: "Manage preference categories without hiding consent scope",
    prompt: "Inspect category status, communication channels, topics, notification summary, privacy, cookies, language, required messages, policy-managed values, unsaved changes, saved and failed saves, withdraw consent, restore defaults, source conflict, mobile layout, and compare everything-switch, hidden-required, consent-drift, no-save-state, policy-mystery, and category-dump failures."
  },
  "version-history": {
    title: "Restore an earlier version without losing current context",
    prompt: "Inspect the current version, named version, autosaved version, compare preview, restore confirmation, retention limit, permission state, draft conflict, deleted author, mobile collapse, and compare audit-log-confusion, no-compare, restore-without-preview, hidden-current, permission-leak, and undo-confusion failures."
  },
  "change-review": {
    title: "Review proposed changes without losing scope",
    prompt: "Inspect original versus proposed content, diff hunk, pending review comment, submitted review, accept, reject, apply suggestion, batch scope, stale change, mark viewed, permission limit, mobile navigation, and compare broad-scope, draft-confusion, stale-apply, no-base, comment-only, and hidden-permission failures."
  },
  "handoff-summary": {
    title: "Transfer context without forcing the receiver to reconstruct history",
    prompt: "Inspect sender, receiver, reason, current status, situation, background, assessment, recommendation, source links, generated time, accepted ownership, clarification, stale source, redaction, declined, reassigned, handed back, mobile card, and compare assignment-only, transcript-dump, stale-summary, privacy-leak, no-next-action, and unverifiable-AI failures."
  },
  comments: {
    title: "Discuss one object without losing the anchor",
    prompt: "Add an anchored comment, preserve a draft, reply, resolve, reopen, assign, edit, hide, delete with warning, follow a direct link, inspect permissions, and compare loose-notes, lost-anchor, hover-only-actions, silent-delete, no-deep-link, and draft-loss failures."
  },
  "threaded-discussion": {
    title: "Follow a branched topic discussion",
    prompt: "Open a parent topic, reply to a branch, follow and mute the thread, mark unread branches read, mark a nested reply as answer, deep-link to a reply, load older replies, collapse a branch, and compare flat-replies, lost-parent, hidden-answer, unread-whole-thread, deep-indent, and wrong-thread-action failures."
  },
  mentions: {
    title: "Route attention with inline mentions",
    prompt: "Type @ to open scoped suggestions, choose a person, resolve duplicate names, handle missing access, confirm a broad audience mention, inspect suppressed notification state, follow a deep link, create an action item, remove a token, and compare plain-text, wrong-person, no-access-warning, blast-all, generic-link, and fake-assignment failures."
  },
  presence: {
    title: "Read availability without guessing",
    prompt: "Inspect available, busy, do-not-disturb, away, offline, unknown, stale, privacy-hidden, co-viewer, notify-later, and activity-not-audit states, then compare color-only, stale-active, interrupt-busy, privacy-leak, audit-misuse, and anonymous-count failures."
  },
  "live-cursors": {
    title: "Follow collaborators on a shared canvas",
    prompt: "Show remote pointer, text caret, object selection, cursor chat, follow collaborator, hide my pointer, reduce cursor noise, inspect stale, disconnected, privacy-hidden, and transformed-canvas states, then compare frozen cursor, unlabeled color, overlay-blocking, privacy leak, history noise, and offset cursor failures."
  },
  "share-dialog": {
    title: "Share one object without widening access by accident",
    prompt: "Add recipients, switch role and link scope, toggle notification, copy the current link, review external sharing, set expiration, block download, try native share, stop sharing, and compare public-default, hidden-role, no-warning, copy-mismatch, no-revoke, and native-only failures."
  },
  "permission-sharing": {
    title: "Manage effective access without missing hidden grants",
    prompt: "Inspect direct, group, inherited, anonymous, service, and deploy-key access, change roles, review pending changes, test revoke warnings, save with an audit note, and compare direct-only, hidden-group, unclear-role, no-review, partial-save, and no-audit failures."
  },
  timeline: {
    title: "Inspect a chronological event record",
    prompt: "Switch timeline order, expand an event, filter system events, load older events, restore the full range, mark the current milestone, and compare no-dates, future-as-done, audit-loss, feed-misuse, hidden-range, and stepper-confusion failures."
  },
  "activity-log": {
    title: "Investigate recorded system activity",
    prompt: "Filter by event type, expand a record, copy the event ID, export the current query, switch timezone, reveal retention limits, and compare vague-events, hidden-scope, export-mismatch, read-clears, local-time-drift, and duplicate-stream failures."
  },
  "data-export": {
    title: "Prepare and download scoped data packages",
    prompt: "Inspect data export, category selection, date range, format, destination, identity check, permission check, export requested, queued, estimating size, packaging archive, large background job, partial export, ready package, secure download, transfer destination, expired link, regenerate link, failed export, canceled export, rate limited, unsupported format, storage full, post-download, mobile compact export, and compare export-all-mystery, delete-confusion, visible-rows-only, permanent-link, silent-partial, wrong-account-download, and raw-secret-manifest failures."
  },
  "delete-account": {
    title: "Close an account with data and recovery clarity",
    prompt: "Inspect delete account, account identity, affected services, associated data, retained data, linked apps, subscription warning, export first, reauthentication, typed confirmation, scheduled deletion, pending request, completed deletion, cancel deletion, recovery window, legal retention, backup retention, web deletion link, support-required flow, wrong-account block, enterprise-managed account, child account, mobile compact deletion, and compare hidden-delete, deactivate-only, export-confusion, wrong-account, retention-mystery, subscription-surprise, and support-only failures."
  },
  "hidden-destructive-account-deletion": {
    title: "Find and repair hidden account deletion",
    prompt: "Inspect hidden settings, deactivation-only, support-only, export confusion, uninstall trap, wrong account, one-click delete, retention hidden, subscription surprise, discoverable entry, account-scope review, and web deletion resource states; compare delete account, destructive action confirmation, typed confirmation, data export, privacy settings, and settings management boundaries."
  },
  "privacy-settings": {
    title: "Control privacy posture across data and access",
    prompt: "Inspect privacy settings, privacy overview, activity controls, profile visibility, ad personalization, location history, app access, device permission mismatch, connected apps, data sharing, consent handoff, cookie handoff, data export handoff, delete account handoff, unavailable data, managed policy, child privacy default, region restriction, pending sync, saved state, failed save, reset privacy group, mobile compact privacy, and compare policy-only, master-switch, hidden-app-access, consent-mismatch, stale-current-values, overbroad-reset, and low-privacy-default failures."
  },
  "report-abuse": {
    title: "Submit a scoped abuse report",
    prompt: "Inspect report abuse, report entry point, reported object snapshot, reason selection, affected person, additional context, multiple content selection, route selection, pending submit, submitted receipt, failed submit, duplicate report, rate limited report, offline draft, post-report safety actions, content hidden after report, follow-up needed, action taken, no violation found, reporter privacy, signed-out reporting, blocked-account reporting, mobile compact report, and compare instant-takedown, no-target, public-report, forced-reexposure, generic-reason, no-safety-actions, and lost-failed-report failures."
  },
  "block-mute": {
    title: "Set a personal visibility and interaction boundary",
    prompt: "Inspect block / mute, block entry point, mute entry point, block confirmation, mute without target notification, blocked state, muted state, hidden person, restrict interaction, temporary mute, exceptions, undo and management, report abuse handoff, emergency route, failed action, offline pending, permission-limited state, admin-managed state, mobile compact boundary, and compare blended-action, no-confirmation, hidden-unmute, unexplained-exceptions, target-notified, wrong-scope, and private-note-leak failures."
  },
  "age-gate": {
    title: "Check age before age-sensitive access",
    prompt: "Inspect age gate, age prompt, neutral age entry, age band selection, adult allowed, underage adapted, parent consent required, age assurance handoff, data minimization, region threshold, retry correction, known account age, appeal route, expired session, verification unavailable, mobile compact age gate, and compare adult-default, content leak, overcollection, no-parent-route, unlimited-retry, bundled-consent, and provider-confusion failures."
  },
  "legal-acceptance": {
    title: "Accept terms with document and record clarity",
    prompt: "Inspect legal acceptance, terms checkbox, embedded terms, terms link, required validation, accepted record, decline route, updated terms, change summary, grace period, access blocked, download copy, language variant, audit record, failed record write, mobile compact legal gate, and compare implied-acceptance, prechecked-terms, bundled-consent, hidden-terms, disabled-only, tiny-scrollbox, and no-version-record failures."
  },
  "exit-this-page-quickly": {
    title: "Leave a sensitive page without exposing content",
    prompt: "Inspect exit this page quickly, persistent exit button, assistive exit link, immediate content cover, neutral destination, interruption page, safety content, browser history limitation, monitored device warning, slow network fallback, no-JavaScript exit, mobile fixed exit, referrer protection, failed destination, and compare hidden-exit, delayed-exit, back-link-exit, overpromised-safety, related-destination, keyboard-unreachable, and late-warning failures."
  },
  "official-site-banner": {
    title: "Verify official ownership and secure connection",
    prompt: "Inspect official-site banner, collapsed official identity, expanded domain details, expanded HTTPS details, every-page top placement, agency identity, mobile compact banner, bilingual identity, non-eligible domain, insecure connection blocked, staging warning, coexists with site alert, coexists with service navigation, and compare copied-to-private-site, footer-only-identity, dismissible-proof, maintenance-message, http-secure-claim, and navigation-mix failures."
  },
  "calendar-view": {
    title: "Manage scheduled events in calendar context",
    prompt: "Switch month, week, and agenda views, open a crowded day, inspect selected-day detail, preview a conflict, toggle timezone, reveal hidden calendars, and compare dots-only, clipped-overflow, timezone-shift, conflict-drag, mobile-crush, and date-picker-misuse failures."
  },
  "kanban-board": {
    title: "Move work through workflow columns",
    prompt: "Move a card to Review, inspect WIP limits, show hidden filtered cards, open a blocked card, use the keyboard move path, undo a move, and compare decorative-columns, drag-only, hidden-wip, stale-cards, wrong-status, and sorted-priority failures."
  },
  "map-view": {
    title: "Inspect places in spatial context",
    prompt: "Pan the viewport, zoom to expand a cluster, select a marker, toggle layers, deny and recover from location permission, fit results, open route preview, switch list fallback, and compare decorative-pins, no-cluster, no-legend, permission-dead-end, stale-bounds, hover-only, and wrong-distance failures."
  },
  "data-visualization": {
    title: "Read an honest chart",
    prompt: "Switch metrics, select a month, highlight a series, normalize values, reveal the data table, toggle an annotation, export with context, and compare wrong-chart, missing-axes, truncated-scale, color-only, tooltip-only, stale-data, and decorative-chart failures."
  },
  "chart-drilldown": {
    title: "Drill from aggregate to child chart",
    prompt: "Drill from region to country to store, use breadcrumbs and drill-up, inspect terminal leaves and child tables, reset the path, export context, and compare no-breadcrumb, metric-change, fake-child, hover-only, no-announcement, deep-trap, and broken-leaf failures."
  },
  "compare-view": {
    title: "Compare a selected shortlist",
    prompt: "Add and remove laptop candidates, hide identical rows, highlight differences, pin item identity, switch mobile pair mode, group specs, export the shortlist, and compare too-many-items, hidden-compare, no-sticky, identical-clutter, inconsistent-specs, mobile-crush, and lost-shortlist failures."
  },
  "expandable-row": {
    title: "Inspect row-local detail in context",
    prompt: "Expand invoice rows, preserve row detail across sort and filter, refresh detail, handle no-detail and failed-detail rows, copy row evidence, switch mobile stacking, and compare index-keyed, chevron-only, no-summary, dead-chevron, detached-detail, overstuffed, and mobile-unlabeled failures."
  },
  "saved-view": {
    title: "Return to a named workspace view",
    prompt: "Apply private and team queue views, inspect saved layout, columns, filters, grouping, sort, visibility, and default state, make temporary display changes, save a copy, update shared state, repair invalid fields, and compare snapshot, hidden-settings, overwrite, mixed-saved, silent-invalid, private-leak, and mobile-hidden failures."
  },
  "dashboard-layout": {
    title: "Monitor a coordinated dashboard",
    prompt: "Change global filters, inspect KPI hierarchy, freshness, affected tiles, exception placement, drill paths, section collapse, partial refresh, permission-limited widgets, mobile priority, and compare equal-weight, hidden-filter, stale-tile, snapshot-live, cross-filter, permission-gap, and mobile-bury failures."
  },
  "custom-dashboard": {
    title: "Customize a persisted dashboard",
    prompt: "Enter customization mode, add a widget, move and resize cards, preview mobile order, save personal versus shared layout, handle permission-limited widgets, reset defaults, and compare drag-only, shared-overwrite, hidden-required, mobile-order, blank-permission, filter-confusion, and unsaved-loss failures."
  },
  "pinned-items": {
    title: "Keep selected items prominent",
    prompt: "Pin and unpin items, reorder the pinned section, hit the pin limit, switch personal and shared scope, repair stale pins, and compare mixed-recents, delete-confusion, shared-surprise, unlimited-pins, drag-only, stale-dead-link, and privacy-leak failures."
  },
  favorites: {
    title: "Save preferred items for return access",
    prompt: "Favorite and unfavorite items, filter to Favorites, switch personal and public effect cues, repair unavailable favorites, restore the list, and compare unlabeled-star, delete-confusion, mixed-pins, auto-favorite, no-list, public-surprise, and dead-favorite failures."
  },
  "recently-used": {
    title: "Resume recently used tools and targets",
    prompt: "Run tools, move reused targets to the top, remove and clear recent-use shortcuts, switch account/device scope, repair stale targets, and compare counted-views, mixed-saved, delete-confusion, no-scope, unlimited-history, recommendation-pollution, and dead-shortcut failures."
  },
  "recommended-next-action": {
    title: "Review a context-sensitive next action",
    prompt: "Inspect why the action is suggested, review before applying, accept, defer, dismiss, mark already done, handle stale and permission-blocked states, and compare context-free-button, hidden-reason, required-mix, instant-apply, stale-action, no-feedback, and low-confidence failures."
  },
  "adaptive-defaults": {
    title: "Inspect context-aware starting values",
    prompt: "Review adapted field values, inspect source, change one time, remember correction, reset to neutral, stop adapting, handle stale, policy, low-confidence, and review-required states, and compare hidden-source, saved-accident, sensitive-history, stale-context, conversion-push, no-reset, and correction-ignored failures."
  },
  "user-controlled-density": {
    title: "Switch display density without losing state",
    prompt: "Change comfortable, standard, compact, and spacious density, preview before saving, save personal scope, reset to system default, handle managed and unsafe compact states, preserve focus, selection, edits, and filters, and compare hidden-labels, state-loss, shared-overwrite, saved-view-mix, target-shrink, mobile-scroll, and no-reset failures."
  },
  "user-controlled-layout": {
    title: "Rearrange workspace panes without losing task state",
    prompt: "Switch split, focus, stacked, and inspector layouts, preview before saving, save personal scope, reset to default, handle managed and unsafe mobile arrangements, preserve selected record, filters, draft, validation, scroll, and focus, and compare unlabeled, state-loss, shared-overwrite, saved-view-mix, splitter-confusion, mobile-offscreen, and no-reset failures."
  },
  "language-selector": {
    title: "Switch page language without losing context",
    prompt: "Switch between two-language and multi-language selector states, choose native labels, handle partial, unavailable, browser-hint, sticky explicit choice, preserved draft, and reset states, and compare flag-only, context-loss, auto-override, missing-translation, preference-confusion, no-lang, and hidden-control failures."
  },
  "prompt-box": {
    title: "Compose an AI request with visible context",
    prompt: "Write a prompt, attach selected text and a file, inspect source, tool, format, and safety chips, test over-limit, unavailable source, blocked send, explicit send, pending, failed send, retry, edit-and-resend, clear draft, and compare hint-submit, enter-send, hidden-context, unreadable-file, auto-suggest, draft-loss, and command-disguise failures."
  },
  "chat-interface": {
    title: "Manage a multi-turn assistant conversation",
    prompt: "Inspect user and assistant turns, active conversation title, history state, work mode, carried context, streaming, stop, retry, regenerate, copy, citations, new chat, older history, disabled history, deleted chat, preserved scroll and draft, and compare latest-only, role-blur, hidden-memory, overwrite-regen, scroll-jump, lost-draft, and human-chat-mix failures."
  },
  "streaming-response": {
    title: "Inspect a generated answer while it streams",
    prompt: "Watch first output, active deltas, pending citations, tool progress, moderation hold, stalled stream, stopped partial, continue, failed stream, retry, complete, copy final, malformed code, auto-scroll, noisy live region, early citation, erased partial, and spinner-only failures."
  },
  "citation-display": {
    title: "Inspect evidence behind generated claims",
    prompt: "Inspect inline citation markers, selected source preview, claim-to-source mapping, verified source, open source, multi-source, pending citation, stale citation, missing source, permission-limited source, source mismatch, copy citation, mobile source panel, and compare link-dump, vague-source, dead-cite, citation-drift, tooltip-only, hidden-permission, over-cited, and decorative-number failures."
  },
  "source-grounding-display": {
    title: "Audit whole-answer source grounding",
    prompt: "Inspect source scope, searched sources, retrieved sources, used sources, supported claims, partially supported claims, unsupported claims, pending grounding, not searched, permission-limited source, stale source, conflicting source, retrieval failed, source quality warning, mobile grounding panel, and compare global-badge, mixed-sources, hidden-unsupported, confidence-only, omitted-scope, vanished-permission, and related-links-as-evidence failures."
  },
  "ai-answer-without-sources": {
    title: "Expose unsourced AI answers before use",
    prompt: "Inspect sourced answer, not searched, no supporting source found, retrieval failed, permission-limited, pending source search, draft from model knowledge, source needed, human verification, and copy/apply gated states; compare confident no-source, related links as evidence, hidden retrieval failure, permission omitted, citation promised missing, stale source claim, and copy strips warning failures."
  },
  "ai-confidence-shown-as-fake-precision": {
    title: "Remove fake AI confidence precision",
    prompt: "Inspect raw score hidden, calibration unavailable, calibrated range, insufficient evidence, out-of-distribution, stale score, threshold changed, ranking score not probability, and copy caveat states; compare exact percent, decimal certainty, color-only precision, gauge precision, hidden caveat, confidence as source proof, stale precision, and copied score failures."
  },
  "ai-agent-acts-without-approval": {
    title: "Stop agent side effects before approval",
    prompt: "Inspect read-only step allowed, approval required before side effect, payload preview, eligible approver, self-review blocked, approve and resume, edit before approve, reject, cancel, stale approval refused, emergency bypass, rollback available, and audit recovery states; compare silent execution, broad consent, hidden tool call, post-action approval, stale approval, self-approval, no rollback, and audit-only failures."
  },
  "confidence-uncertainty-display": {
    title: "Communicate model uncertainty before users act",
    prompt: "Inspect high confidence, medium confidence, low confidence, insufficient evidence, conflicting signals, out-of-distribution input, stale model, calibration unavailable, threshold changed, review required, explain confidence, apply gated, mobile compact panel, and compare fake-percent, color-only confidence, no-threshold, hidden uncertainty, confidence-as-proof, stale-confidence, uncalibrated-score, and buried-review failures."
  },
  "human-approval-gate": {
    title: "Pause automation until a human authorizes the next step",
    prompt: "Inspect paused gate, proposed action, payload snapshot, triggering rule, eligible approver, self-review block, approve and resume, edit before approve, reject, cancel, timeout, stale gate, bypass override, failed resume, mobile compact gate, and compare blind approve, post-action audit, stale notification, any-viewer approval, confidence-only gate, stuck rejection, and hidden resume failures."
  },
  "agent-plan-preview": {
    title: "Review an AI agent plan before execution starts",
    prompt: "Inspect draft plan, objective, ordered steps, planned tools, data access, expected output, editable step, fixed step, optional step, conditional step, blocked permission, missing input, risk warning, approval gate marker, stale plan, regenerated plan, run-ready plan, run-started handoff, mobile compact plan, and compare summary-only, hidden-tools, executed-as-preview, edit-ignored, mandatory recommendation, stale-runnable, and side-effect-hidden failures."
  },
  "agent-progress-trace": {
    title: "Monitor an AI agent run after execution starts",
    prompt: "Inspect run started, run ID, plan version, current step, active tool, tool-use visibility handoff, queued step, completed step, blocked permission, missing input, approval wait, retry attempt, skipped step, failed step, cancelled run, final outcome, audit handoff, mobile compact trace, and compare spinner-only, raw-tool-log, fake-percent, hidden-gate, duplicate-events, vanished-cancel, and complete-too-early failures."
  },
  "tool-use-visibility": {
    title: "Inspect an AI tool call safely",
    prompt: "Inspect pending tool call, running tool call, succeeded tool call, failed tool call, denied permission, redacted input, redacted output, raw payload gated, side-effect preview, side-effect executed, retry attempt, stale result, duplicate tool event, mobile tool card, and compare vague-tools, raw-secret-dump, false-success, hidden-side-effect, unsafe-retry, missing-redaction, and audit-disconnect failures."
  },
  "editable-ai-output": {
    title: "Edit generated output without losing provenance",
    prompt: "Inspect editable AI output, generated draft, user edited, source mapping, citation preservation, unsupported edit, tracked change, accept edit, reject edit, apply output, save draft, undo to generated, regenerate from edit, stale source, unsafe edit, review required, partial edit, conflict edit, mobile editor, copy edited, and compare editable-looking-final, lost-citations, silent-rewrite, apply-without-review, raw-prompt-edit, no-undo, and source-drift failures."
  },
  "regenerate-retry": {
    title: "Regenerate or retry an AI answer without losing context",
    prompt: "Inspect regenerate retry, retry same prompt, prompt snapshot, response version, previous answer, new answer, regenerate answer, retry failed response, continue partial output, retry from start, retry failed sources, retry failed tool, no-tool rerun, changed context, changed model, compare versions, restore previous, cooldown, rate limited, safety blocked, manual edits present, mobile regenerate, and compare vague-try-again, silent-overwrite, hidden-context-change, duplicate-tool-side-effect, automatic-retry-loop, lost-partial, and prompt-edit-disguise failures."
  },
  "correction-feedback": {
    title: "Correct an AI result without losing scope",
    prompt: "Inspect correction feedback, wrong answer, missing source, wrong source, harmful suggestion, outdated answer, user correction, feedback reason, selected claim, source correction, expected answer, private note, send feedback, feedback received, apply to this answer, apply to future answers, reviewer routed, training opt-out, appeal decision, feedback history, mobile feedback, and compare thumbs-only, no-scope, silent-learning, prompt-confusion, lost-correction, public-leak, and no-follow-up failures."
  },
  "scope-clarification": {
    title: "Clarify AI task scope before acting",
    prompt: "Inspect scope clarification, ambiguous request, original request, missing boundary, clarifying question, bounded choices, object set, audience, timeframe, source set, action target, selected scope, visible default, skip clarification, blocked until clarified, permission-limited scope, conflicting scope, stale clarification, resume answer, change scope, mobile clarification, and compare broad-assumption, endless-questions, hidden-default, prompt-rewrite, asks-after-acting, option-dump, and forgets-scope failures."
  },
  "escalate-to-human": {
    title: "Move from AI help to a human route honestly",
    prompt: "Inspect escalate to human, user requested human, system suggested escalation, route choice, live agent, create ticket, request callback, specialist queue, supervisor review, business hours, expected wait, queue position, shared context, consent to share, verification required, transfer pending, human joined, ticket created, callback scheduled, no agent available, failed transfer, cancel escalation, handback to AI, mobile escalation, and compare bot-loop, fake-transfer, hidden-wait, context-drop, privacy-surprise, unavailable-live, and no-cancel failures."
  },
  "automation-rule-builder": {
    title: "Author automation rules with inspectable trigger logic",
    prompt: "Inspect automation rule builder, rule name, trigger selected, event scope, condition builder, AND OR logic, operator, action configured, action target, side effects, permissions, plain-language summary, save draft, enable rule, pause rule, test run, preview matches, sample event, branch taken, skipped action, conflict warning, priority order, loop risk, duplicate action, stale field, natural-language generated rule, active rule, version history, run history, failed run, mobile builder, and compare prompt-only, auto-enable, hidden-scope, no-test, conflict-blind, summary-mismatch, and no-pause failures."
  },
  "model-update-notice": {
    title: "Communicate model lifecycle changes before behavior breaks",
    prompt: "Inspect model update notice, current model, new model, replacement model, model version, lifecycle stage, effective date, retirement date, shutdown date, affected usage, affected prompts, affected workflows, affected deployments, action required, no action required, auto-upgrade scheduled, manual migration required, preview short-notice, behavior change, compatibility check, test replacement, regression results, rollout plan, rollback plan, migration owner, snooze notice, dismiss notice, completed migration, failed migration, stale notice, post-retirement blocked, mobile notice, and compare marketing-update, hidden-deadline, no-impact-scope, dismiss-required, no-test-path, stale-picker, and confidence-confusion failures."
  },
  "ai-limitation-onboarding": {
    title: "Set honest AI expectations before first use",
    prompt: "Inspect AI limitation onboarding, first-run welcome, can do, cannot do, data scope, data not available, uncertainty, low confidence, human review, safe trial, feedback, correction, manual fallback, skip for now, remembered limit, re-onboarding, capability change, data-use change, autonomy increase, policy limit, source limit, privacy boundary, high-impact use, mobile compact, and compare human-like promise, ask-anything, disclaimer wall, no fallback, hidden data scope, no re-onboarding, and confidence substitute failures."
  },
  "ai-output-audit-trail": {
    title: "Trace generated AI output from prompt to downstream use",
    prompt: "Inspect AI output audit trail, output generated, prompt snapshot, response snapshot, response ID, model version, system instruction reference, source snapshot, retrieved context, tool call record, safety event, confidence at time, user viewed, copied output, edited output, applied output, approved output, rejected output, regenerated output, version chain, redacted content, retention window, export evidence, investigation filter, permission-limited view, tamper evidence, deletion request, mobile compact trail, and compare answer-only, missing-prompt, source-drift, editable-no-history, audit-after-action-only, raw-secret-log, and retention-mystery failures."
  },
  "audit-log": {
    title: "Review governed audit evidence",
    prompt: "Inspect audit log, privileged action record, restricted admin scope, retention policy, legal hold, export evidence, API query, SIEM stream, tamper check, duplicate ingestion, corrected record, redacted record, license-limited event, out-of-retention event, permission-limited view, system actor, service account actor, mobile compact audit, and compare activity-feed masquerade, missing audit ID, editable evidence, hidden scope, export mismatch, raw secret audit, and healthy-while-delayed failures."
  },
  "summary-box": {
    title: "Extract key facts from a longer page",
    prompt: "Inspect a purpose-specific summary heading, key facts, next-step link, synchronized body sections, outdated-summary review, too-long, alert-misuse, warning-misuse, link-dump, hidden-required, vague-heading, and mobile-wall failures."
  },
  tag: {
    title: "Scan object status and category labels",
    prompt: "Inspect static category tags, semantic status tags, stale-status review, active-status update, tag-count limits, and button-like, color-only, filter-chip, title-tag, message-replacement, and tag-cloud failures."
  },
  onboarding: {
    title: "Reach first value from a first-run flow",
    prompt: "Choose a role goal, skip optional teaching, resume setup, create sample content, finish into the real workspace, and compare forced-tour, marketing-only, no-resume, blank-landing, permission-first, and disconnected-tutorial failures."
  },
  "start-page": {
    title: "Start the right service with the right preparation",
    prompt: "Check fit, reveal required documents, start the service, resume a draft, follow alternative access, pause the service, and compare buried requirements, equal actions, no resume, eligibility maze, and dead-end entry failures."
  },
  "account-creation": {
    title: "Create an account only when persistence is needed",
    prompt: "Create an account from a saved draft, reuse entered contact details, verify safely, route existing users, defer profile setup, and compare forced account, sign-in confusion, account enumeration, repeated entry, CAPTCHA block, and lost-draft failures."
  },
  "create-user-profile": {
    title: "Create a visible profile with safe sharing",
    prompt: "Set display identity, use an initials avatar fallback, choose profile visibility, inspect managed fields, preview the profile card, save to the team directory, and compare forced photo, public-by-default, legal-name leak, managed overwrite, no-preview, and required-optional failures."
  },
  "profile-setup": {
    title: "Complete an existing profile without forcing disclosure",
    prompt: "Review current profile readiness, fill required and recommended fields, skip optional details, inspect visibility and managed fields, save partial progress, return to the source task, and compare completion-meter, public-default, synced-field, no-skip, mixed-settings, and repeated-nag failures."
  },
  "settings-management": {
    title: "Manage persistent settings with clear scope and save state",
    prompt: "Inspect current settings, switch immediate preferences, edit saved settings, search for a rare setting, review inherited and permission-blocked values, reset one group, recover a failed save, and compare dumping-ground, mixed-save, wrong-scope, hidden-current, broad-reset, and lost-unsaved failures."
  },
  "settings-page": {
    title: "Find the right settings section without losing context",
    prompt: "Inspect settings overview, selected section, deep link context, search results, no-results recovery, mobile section picker, unavailable section, separated high-risk area, return path, long labels, and compare link-dump, hidden-section, tab-overflow, global-confusion, orphan-deep-link, and risky-mix failures."
  },
  "invite-user": {
    title: "Invite a user with explicit access scope",
    prompt: "Resolve a recipient, choose role and scope, review guest and billing impact, send an invitation, inspect pending status, resend, edit, cancel, handle approval-needed, expired, accepted, and duplicate states, and compare instant-member, broad-access, hidden-pending, duplicate-send, no-cancel, and leak failures."
  },
  assignment: {
    title: "Assign work without confusing responsibility with attention",
    prompt: "Inspect current owner, unassigned, self-assign, eligible picker, multiple assignees, team, bot, automatic owner, reassign with handoff, bulk preview, permission warnings, assigned-to-me sync, and compare mention-only, no-access, mixed-roles, stale-auto, hidden-bulk, and lost-handoff failures."
  },
  "approval-workflow": {
    title: "Route a submitted request through required approvals",
    prompt: "Submit a production deployment approval, inspect the approver route, block self-review, approve sequential and parallel gates, request changes, reject with reason, delegate, timeout, bypass with audit reason, and compare blind-approve, first-approval-done, no-reason, self-approve, lost-revision, and stale-email failures."
  },
  "review-queue": {
    title: "Triage many items that need review",
    prompt: "Inspect a shared review queue, switch queue scope, preview row reasons, claim and assign work, sort by SLA risk, handle stale and already-reviewed rows, bulk-review visible items with exceptions, skip, escalate, recover from empty filters, and compare title-only, hidden-bulk, double-work, stale-action, no-next, and unsafe-preview failures."
  },
  "publish-workflow": {
    title: "Move edited work to the right live target",
    prompt: "Compare draft, preview, validation, target selection, production publish, scheduled publish, reschedule, cancel schedule, live verification, unpublish, rollback, permission denial, and version conflict states while contrasting save-is-live, wrong-target, no-validation, silent-schedule-fail, no-rollback, and stale-publish failures."
  },
  scheduling: {
    title: "Coordinate time across people and calendars",
    prompt: "Build a meeting schedule with attendees, free/busy availability, suggested times, room conflict, timezone, recurrence, reminders, save-versus-send, pending responses, reschedule, cancel, stale availability, and compare date-only, hidden-conflict, timezone-shift, series-mistake, no-send-state, and stale-slot failures."
  },
  booking: {
    title: "Reserve an offered slot or service",
    prompt: "Book an appointment with service type, staff/resource, available slots, capacity, venue timezone, intake questions, policy acceptance, email verification, deposit payment, temporary hold, confirmation, cancel, reschedule, waitlist, stale slot recovery, and compare date-only, hidden-capacity, wrong-timezone, pay-first, no-policy, and lost-cancel failures."
  },
  "complete-multiple-tasks": {
    title: "Complete a saved transaction through several task sections",
    prompt: "Use a transaction hub with grouped tasks, saved progress, completed count, resume cue, not-started, in-progress, blocked, needs-attention, optional, all-complete, review-ready, and submit states; compare linear-step, summary-misuse, hidden-blocker, clickable-status, too-many-statuses, and locked-edit failures."
  },
  "task-list": {
    title: "Present task rows with clear names, hints, and statuses",
    prompt: "Build a component-level task list with short row names, whole-row links, concise hints, status text, grouped rows, unavailable reasons, completed low emphasis, returned work, mobile wrapping, and compare long-hint, clickable-status, color-only, record-list, hidden-blocked, and summary-row failures."
  },
  "sign-in": {
    title: "Sign in and return to the protected task",
    prompt: "Preserve the requested destination, use saved credentials or passkey, route to SSO, show generic failure, handle step-up verification, continue to the document, and compare account reveal, lost return, password-manager block, equal routes, CAPTCHA-only, and stale-session failures."
  },
  login: {
    title: "Handle login attempts and outcomes safely",
    prompt: "Submit credentials, show verifying progress, recover from generic failure, expose safe attempt and wait-time feedback, handle lockout and unlock, complete the session, show a security notice, and compare account reveal, silent disable, client-only counter, CAPTCHA-only, no unlock, and stale warning failures."
  },
  "password-reset": {
    title: "Recover an account through a safe reset flow",
    prompt: "Request a reset with neutral confirmation, inspect resend timing, expired and used-link recovery, enter a reset code, hand off to new-password setup, choose session cleanup, and compare account reveal, reusable token, no expiry, auto sign-in, emailed password, and dead-link failures."
  },
  "two-factor-authentication": {
    title: "Verify an additional factor without creating bypasses",
    prompt: "Enter a one-time code, wait for push or hardware-key approval, handle wrong and expired codes, use an alternate factor, use a recovery code, choose trusted-device scope, manage factors safely, and compare bypass, no recovery, reusable backup code, unsafe trust, SMS-only, and weak factor-change failures."
  },
  "confirm-email": {
    title: "Prove mailbox access without trapping the user",
    prompt: "Send a confirmation link or code, show the pending address, switch between blocking and non-blocking loops, handle resend wait, change address, expired and used links, verify the mailbox, and compare hidden address, no resend, dead expired link, false verified, unnecessary block, stale link, and account reveal failures."
  },
  "confirm-phone": {
    title: "Prove phone reachability without forcing SMS",
    prompt: "Send a phone security code, show the target number and channel when safe, switch between blocking and non-blocking loops, handle SMS, voice, resend wait, change number, wrong, expired, rate-limited, verified, and no-access states, and compare hidden number, SMS-only, false verified, stale code, logged-code, and account reveal failures."
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
  "alert-dialog": {
    title: "Respond to a blocking urgent message",
    prompt: "Open an urgent session-lock alert dialog, inspect title and consequence text, test contained focus, choose Stay signed in, Sign out, Escape cancel, background inertness, and compare non-modal alert, ordinary modal, vague OK, focus leak, auto-open, and no-response failures."
  },
  drawer: {
    title: "Inspect related detail without losing page context",
    prompt: "Open a case details drawer from a table row, switch selected rows while it stays open, pin the drawer for side-by-side comparison, close with Escape, verify focus and selection return, and compare no-close, stale-detail, navigation-mix, modal-blocking, state-loss, and overstuffed failures."
  },
  sheet: {
    title: "Complete a temporary child task in a sheet",
    prompt: "Open the follow-up sheet from a claim row, edit the note, expand and compact the sheet, try Escape or close with unsaved edits, resolve the discard review, save the task, verify focus return, and compare no-title, silent-discard, background-edit, wrong-surface, hidden-actions, and stacked-sheet failures."
  },
  "bottom-sheet": {
    title: "Reveal mobile context from the bottom edge",
    prompt: "Open a station bottom sheet from the map, move through peek, half, and full detents, select a departure, collapse back to the map, close with Escape, verify selected-pin focus return, and compare no-peek-content, scroll-conflict, covers-context, nav-mix, safe-area-block, and gesture-only failures."
  },
  popover: {
    title: "Open local context without interrupting the page",
    prompt: "Open the due-date popover from the task row, choose Tomorrow, move the anchor near the viewport edge, close with Escape or outside click, verify focus return, and compare hover-only, detached, focus-loss, overstuffed, modal-mask, and menu-role failures."
  },
  tooltip: {
    title: "Reveal a short description on focus or hover",
    prompt: "Focus the Archive toolbar button, inspect the tooltip while focus stays on the trigger, switch between toolbar buttons, dismiss with Escape, test pointer hover and pointer out, and compare hover-only, label-replacement, interactive-content, required-info, disabled-target, and clipping failures."
  },
  "tooltip-only-required-information": {
    title: "Move required instructions out of temporary tooltips",
    prompt: "Inspect visible format help, supplemental tooltip, tooltip dismissed, validation recovery, disabled reason, touch route, screen reader text, details example, popover example, deadline consequence, legal consequence, high-zoom wrapping, and mobile task states; compare hover-only format, title-only help, disabled-tooltip, lost-on-blur, legal-tooltip, password-rules, clipped-tooltip, and mobile-no-hover failures."
  },
  "hover-card": {
    title: "Preview an object before navigating",
    prompt: "Hover or focus @Maya Chen, move into the hover card without closing it, switch to the file preview, dismiss with Escape, verify focus return and full-object route, then compare hover-only, pointer-gap, stale-object, required-info, interactive-trap, and focus-loss failures."
  },
  "details-panel": {
    title: "Inspect selected object details beside the source list",
    prompt: "Select ticket TCK-2048, move through nearby tickets without focus jumping into the panel, filter selected-away state, collapse and restore the panel, open the full ticket route, and compare stale-detail, generic-title, focus-steal, mixed-purpose, hidden-selection, and no-empty-state failures."
  },
  "preview-panel": {
    title: "Preview selected content without opening it",
    prompt: "Select Forecast.pdf, page through the preview, zoom and fit width, test blocked-file fallback, open the full preview, and compare stale-preview, metadata-only, no-fallback, unsafe-render, tiny-pane, and focus-trap failures."
  },
  "progressive-disclosure": {
    title: "Stage advanced controls behind clear intent",
    prompt: "Complete the default backup path, reveal advanced retention and encryption settings, collapse them with a visible changed summary, reset to recommended defaults, trigger hidden validation, reveal diagnostics, and compare hidden-required, vague-trigger, buried-change, nested-levels, no-reset, and focus-jump failures."
  },
  "context-menu": {
    title: "Invoke object commands from pointer or keyboard context",
    prompt: "Right-click or use Shift+F10 on a file row, verify the menu opens at the invoked file, move through commands, try a disabled export reason, dismiss with Escape, route Delete to review, and compare stale-target, keyboard-corner, hidden-primary, mixed-content, pointer-keyboard-mismatch, and focus-loss failures."
  },
  "destructive-action-confirmation": {
    title: "Review loss before destructive commit",
    prompt: "Open a destructive delete review, inspect object scope and loss inventory, resolve dependency blocking, acknowledge permanent loss, cancel safely, commit once, and compare vague, default-danger, reversible-action, hidden-scope, post-commit, and double-submit misuse."
  },
  "ambiguous-destructive-action-copy": {
    title: "Make destructive copy name the outcome",
    prompt: "Inspect clear destructive title, final action, safe action, cancel ambiguity, reversible cleanup, bulk scope, access removal, external effect, and mobile compact labels; compare OK delete, Yes/No, Continue executes, Remove ambiguity, Cancel ambiguity, same copy, color-only danger, and post-commit clarification failures."
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
  "disabled-controls-without-recovery": {
    title: "Give disabled controls a recovery path",
    prompt: "Inspect prerequisite map, missing fields, permission request, dependency unlock, saving retry, offline fallback, role limited, admin managed, expired session, and alternative route states; compare dead disabled, hidden reason, tooltip only, infinite disabled, permission dead end, stale disabled, invalid hidden, and mobile trap failures."
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
  "filter-reset-that-clears-unrelated-search": {
    title: "Keep filter reset scoped",
    prompt: "Inspect clear one filter, clear all filters, clear search, reset draft, no-results recovery, saved filter boundary, saved search bundle, sort preserved, pagination policy, mobile reset, undo reset, and URL state states; compare query wiped, one chip clears all, mobile reset wipes search, broad start over, saved filter wipes query, sort reset, history deleted, and draft reset clears applied failures."
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
  "modal-for-nonblocking-content": {
    title: "Keep nonblocking information out of modal traps",
    prompt: "Inspect inline note, popover help, drawer detail, banner status, side preview, background usable, dismiss note, keyboard flow, mobile inline, high-zoom wrapping, optional disclosure, and safe toast states; compare info modal, help modal, status modal, preview modal, OK trap, repeated modal, newsletter modal, and mobile block failures."
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
  "action-sheet": {
    title: "Resolve an initiated action with a short choice sheet",
    prompt: "Tap Cancel draft to open the action sheet, choose Save draft, Discard draft, Keep editing, Share choices, and Report review, verify result feedback and focus return, then compare unsolicited, too-many-options, no-cancel, hidden-danger, rich-content, and focus-loss failures."
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
  "consent-prompt": {
    title: "Ask for a specific optional data-use consent",
    prompt: "Move a consent prompt through pre-consent, specific purpose, accept consent, decline consent, granular consent, explicit consent, confirmation, withdrawal, renewal, expired consent, permission-limited, and mobile compact states; compare with continue-to-agree, preselected, bundled-purpose, hidden-decline, processed-before-consent, no-withdrawal, and record-only failures."
  },
  "dark-pattern-consent": {
    title: "Audit manipulative consent flows",
    prompt: "Inspect accept-dominant, hidden reject, preselected purpose, bundled purposes, consent wall, processing before choice, repeated nag, hard withdrawal, equal-choice correction, granular correction, withdrawal correction, and mobile compact states; compare consent prompt, cookie consent, cookie banner, legal acceptance, preference center, and privacy settings boundaries."
  },
  "permission-request": {
    title: "Ask for device or browser permission in context",
    prompt: "Move a permission request through contextual request, feature-triggered ask, system prompt ready, grant permission, deny permission, denied fallback, ask again later, previously denied, permanently denied, settings required, limited access, while-in-use, one-time, permission revoked, permission status check, manual fallback, and mobile compact states; compare with cold-start prompt, vague reason, blocked on deny, repeat nag, fake required, no settings path, and permission mismatch failures."
  },
  "permission-prompt-with-no-context": {
    title: "Remove permission prompts before context exists",
    prompt: "Inspect cold-start prompt, vague rationale, resource mismatch, bundled permissions, feature-triggered correction, least-access alternative, deny without punishment, settings recovery, mobile compact, repeat nag, blocked on deny, no fallback, and deceptive setup states; compare permission request, location permission flow, consent prompt, permission denied state, notification preferences, and privacy settings boundaries."
  },
  "sensitive-data-reveal": {
    title: "Reveal sensitive values only under user control",
    prompt: "Move a sensitive-data reveal surface through masked state, reveal action, hide action, hold-to-reveal, timed reveal, reauthentication, partial reveal, full reveal, copy while hidden, clipboard warning, audit event, redaction boundary, shoulder-surfing warning, expired reveal, screen reader announcement, and mobile compact states; compare with auto-revealed secret, permanent visible, copied silently, wrong field revealed, no hide action, reveals after blur, and logs raw secret failures."
  },
  "security-warning": {
    title: "Stop unsafe security-risk paths before exposure",
    prompt: "Move a security warning through safe path, phishing warning, deceptive-site warning, malware warning, dangerous download warning, invalid certificate, insecure connection, mixed-content form, suspicious redirect, lookalike domain, file preview blocked, unknown publisher, details expanded, override requested, policy blocked, false-positive report, safe return, and mobile compact states; compare with vague security issue, continue primary, after exposure, no destination, fake urgency, report requires visit, and logs secrets failures."
  },
  "dangerous-action-review": {
    title: "Review high-impact action before execution",
    prompt: "Inspect armed action, risk inventory, evidence and confidence, freshness revalidation, edit before run, dry run, cancel, defer, escalate, run action, blocked state, executed audit receipt, mobile compact review, and compare generic continue, hidden payload, confidence-only, stale notification, bundled actions, routine overuse, and missing audit failures."
  },
  "touch-gesture": {
    title: "Make touch gestures predictable and optional",
    prompt: "Inspect touch gesture, tap target, gesture hint, touch down, movement preview, threshold not met, committed gesture, pinch zoom alternative, scroll conflict, target spacing, system gesture boundary, assistive touch path, mobile landscape, and compare gesture-only zoom, hidden swipe, tiny targets, scroll hijack, no cancellation, system conflict, and hover hint failures."
  },
  "pull-to-refresh": {
    title: "Refresh a top-of-scroll data set",
    prompt: "Inspect idle, at top, pulling, threshold, release to refresh, refreshing, success, no new data, failed, offline, nested scroll, rate limited, manual refresh, and mobile compact states; compare anywhere pull, no indicator, double refresh, eats scroll, offline spin, destructive refresh, and hidden manual failures."
  },
  "swipe-action": {
    title: "Reveal row-scoped actions by horizontal swipe",
    prompt: "Inspect idle row, gesture hint, partial reveal, threshold, snap back, revealed actions, committed action, destructive action, undo, bidirectional actions, disabled action, scroll conflict, keyboard path, screen reader action, bulk selection, and mobile compact states; compare hidden-only, accidental delete, no undo, vertical conflict, icon mystery, destructive no confirm, and no equivalent failures."
  },
  "long-press": {
    title: "Use sustained contact for secondary actions",
    prompt: "Inspect idle target, gesture hint, press down, hold progress, threshold reached, release cancel, movement cancel, context menu, selection mode, preview, drag pickup, disabled action, destructive handoff, keyboard path, screen reader action, and mobile compact states; compare hidden-only, slow tap misfire, no cancel, scroll conflict, required tooltip, destructive commit, and no equivalent failures."
  },
  "drag-and-drop": {
    title: "Move objects between valid destinations",
    prompt: "Inspect idle object, pickup handle, dragging preview, valid target, invalid target, insertion indicator, auto-scroll, drop preview, successful drop, canceled drag, failed drop, keyboard move, screen reader move, multi-select drag, mobile compact, and risky move states; compare pointer-only, no target feedback, invalid silent, scroll hijack, no cancel, server mismatch, and no equivalent failures."
  },
  "keyboard-shortcut": {
    title: "Accelerate known commands with scoped key chords",
    prompt: "Inspect shortcut hint, platform variant, command registry, active scope, text-field suppression, disabled shortcut, conflict detected, executed command, risky confirmation, remap shortcut, character-key off, aria-keyshortcuts exposure, shortcut help, and mobile fallback states; compare hidden only, global character key, platform mismatch, stale hint, disabled fires, conflict override, and risky instant failures."
  },
  "focus-traversal": {
    title: "Keep keyboard focus moving in task order",
    prompt: "Inspect initial focus, skip entry, forward Tab, reverse Shift+Tab, visible focus, hidden content removed, programmatic focus, overlay open, overlay return, validation error, dynamic removal, responsive order, composite boundary, and trap escape states; compare positive tabindex, hidden focus, no focus ring, scroll only, lost return, trap loop, and virtualized loss failures."
  },
  "voice-command": {
    title: "Execute bounded spoken commands safely",
    prompt: "Inspect unavailable, permission, wake, listening, partial transcript, recognized phrase, low confidence, alternatives, disambiguation, matched command, risky confirmation, executed, undo, dictation boundary, offline fallback, and equivalent path states; compare invisible listening, partial execution, hidden phrase, dictation confusion, no fallback, no confirmation, and transcript leak failures."
  },
  "camera-capture": {
    title: "Create and review new media from a live camera",
    prompt: "Inspect unsupported, permission, live preview, switch camera, framing guide, low light, blur warning, capture, review, retake, crop, upload fallback, denied permission, upload pending, upload failed, saved, cancel cleanup, and sensitive capture states; compare auto start, no indicator, instant upload, no fallback, stream leak, wrong camera, no review, and stored after cancel failures."
  },
  "qr-scan": {
    title: "Decode and confirm a QR payload safely",
    prompt: "Inspect unsupported detector, pre-scan rationale, delegated scanner, permission, camera ready, aim guide, torch, focus, low light, no code, multiple codes, decoding, decoded preview, unsafe URL, expired payload, duplicate scan, scan from photo, manual code, success, cleanup, and offline validation states; compare auto-open URL, camera-only dead end, wrong code selected, spinner no guidance, no payload preview, secret retained, and repeated action failures."
  },
  "haptic-feedback": {
    title: "Reinforce touch events with tactile feedback",
    prompt: "Inspect unsupported hardware, haptics disabled, reduced feedback, light press, selection changed, drag threshold, snap detent, boundary reached, success, warning, error reinforcement, destructive commit, repeated-effect suppression, cancel vibration, web vibration pattern, preference preview, and quiet context states; compare haptic-only error, same strong pulse, vibration progress, ignored settings, decorative buzz, delayed buzz, and alarm-like loop failures."
  },
  "wearable-glance": {
    title: "Show one safe answer on a wearable surface",
    prompt: "Inspect unconfigured slot, compact glance, ambient mode, fresh data, stale data, offline, privacy redacted, low battery, due now, active, completed, missed, tap handoff, safe action, blocked action, long text, loading, permission limited, focus mode, and phone disconnected states; compare mini dashboard, private leak, stale current, destructive tap, inbox mirror, ambient illegible, and tiny controls failures."
  },
  "responsive-navigation-adaptation": {
    title: "Keep navigation coherent across layout changes",
    prompt: "Inspect compact bottom bar, medium navigation rail, expanded side navigation, dense destination overflow, More drawer, selected route preservation, filter and draft preservation, badge preservation, keyboard inset, safe area, split screen, landscape, drawer open during resize, focus recovery, long labels, and utility separation states; compare missing destination, renamed labels, duplicate nav surfaces, reset on resize, hidden focus, icon-only mystery, and action in nav failures."
  },
  "offline-mobile-retry": {
    title: "Preserve and safely retry mobile work after connection loss",
    prompt: "Inspect offline submit, queued local save, retry ready, retrying, background eligible, background unavailable, app return, metered pause, Wi-Fi only, low battery, captive portal, auth expired, attachment retry, partial upload, duplicate guard, success, failed again, exhausted, cancelled, conflict review, and expired queue states; compare false sent, hidden queue, duplicate submit, retry loop, metered drain, lost background work, and payment duplicate failures."
  },
  "location-permission-flow": {
    title: "Request current location in context",
    prompt: "Inspect unsupported, pre-prompt, prompt ready, allow once, while using, approximate, precise, granted fix, denied, settings recovery, timeout, stale location, manual fallback, saved place, active tracking, stop sharing, retention, and offline states; compare cold-start ask, forced precise, no fallback, stale coordinate, background surprise, settings dead end, and retained location failures."
  },
  "session-timeout": {
    title: "Recover from an already expired session",
    prompt: "Move a session timeout state through expired, hidden private content, saved draft, reauthenticate, validate return, restored task, no recovery, start again, multiple-tab timeout, identity-provider timeout, and mobile compact states; compare with private leak, stale controls, access-denied copy, lost return, false saved, token log, and retry loop failures."
  },
  "cookie-banner": {
    title: "Collect cookie consent honestly",
    prompt: "Move a service cookie banner through first visit, accept, reject, manage settings, saved confirmation, returning visit, withdrawal, and no-JavaScript states; compare with accept-only, preselected, tracking-before-consent, deceptive contrast, sticky block, and no-withdrawal misuse."
  },
  "cookie-consent": {
    title: "Enforce purpose-level cookie consent",
    prompt: "Inspect cookie consent, pre-consent blocked, strictly necessary, accept all, reject all, granular purposes, vendor details, saved consent record, return visit, withdrawal, renewal, expired consent, browser privacy signal, no-JavaScript form, runtime mismatch, mobile compact consent, and compare tracking-before-choice, preselected purposes, hidden reject all, accepted-flag-only, consent wall, signal ignored, and stale purpose failures."
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
  "toast-only-success-for-completed-transaction": {
    title: "Replace disappearing transaction success with durable proof",
    prompt: "Inspect completed receipt, supplemental toast, toast expired proof remains, copy reference, save receipt, email receipt, track status, bookmark return, start another transaction, duplicate-submit guard, pending-not-success, failed-not-success, print receipt, amend or cancel path, and mobile receipt states; compare disappeared proof, no reference, dashboard redirect, false commit, screen reader timeout, duplicate submit, generic done, and lost booking details failures."
  },
  "inline-message": {
    title: "Resolve contextual in-flow feedback",
    prompt: "Select invoice rows, reveal local detail, switch between warning and success messages, add a billing contact, and check that the message stays attached to the affected row."
  },
  "drawer-with-no-close-or-return-path": {
    title: "Recover from temporary drawer exits",
    prompt: "Inspect close button, Escape close, browser back, scrim close, focus return, selected-object switching, dirty review, mobile back, sticky header, state preserved, gesture equivalent, and commit lock states; compare no close, dead Escape, bad back, lost focus, reset state, mobile no back, gesture-only close, and dirty trap failures."
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
  "required-field-hidden-by-conditional-logic": {
    title: "Expose every active required branch",
    prompt: "Inspect requirement map, trigger selected, trigger cleared, submit recovery, server restored, draft synced, review branch, nested escalated, assistive notice, and mobile collapsed states; compare hidden blocker, stale trigger, disabled required, dead link, server-only, after-submit reveal, nested surprise, mobile trap, and silent reveal failures."
  },
  "validation-that-clears-user-input": {
    title: "Preserve input through validation",
    prompt: "Inspect preserved invalid value, sibling fields kept, server rehydrated, retry same value, raw value preserved, textarea draft, upload names kept, session return, sensitive exception, and reset separate states; compare full reset, field wipe, sibling loss, server blank, formatter loss, textarea loss, upload loss, session loss, and overbroad secret clear failures."
  },
  "confirmation-fatigue": {
    title: "Keep confirmations rare and meaningful",
    prompt: "Inspect prompt inventory, undo alternative, meaningful confirmation, suppression rule, escalation, specific copy, telemetry, and keyboard burden states; compare spam prompts, generic copy, double protection, false safety, post-commit prompt, severe prompt lost, prompt chain, and fast dismiss failures."
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
  checkout: {
    title: "Finalize an order without losing purchase context",
    prompt: "Review the cart summary, continue as guest, change delivery, apply and reject discounts, switch payment state, handle payment decline, acknowledge inventory or price changes, guard duplicate place-order, recover an expired checkout, and hand off to confirmation."
  },
  "payment-collection": {
    title: "Collect money with clear status and duplicate safety",
    prompt: "Show amount and reference, choose method, hand off to a secure provider, handle authentication, processing, decline, cancel, expired session, retry, refund, reconciliation, and receipt states, and compare hidden amount, duplicate charge, lost reference, vague failure, premature receipt, raw details, and no reconciliation failures."
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
  "disclosure-details": {
    title: "Reveal one optional explanation",
    prompt: "Open and close one details disclosure, trigger a validation link that opens hidden help, preserve a nearby answer while toggling, and compare vague summary, hidden requirement, navigation-link, fake-control, state-loss, and overstuffed-content failures."
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
  "pagination-without-current-page": {
    title: "Expose the current result page",
    prompt: "Inspect current page marker, result range, first edge, last edge, loading commit, filter reset, out-of-range recovery, cursor range, mobile compact, duplicate pagination, and browser back states; compare no current page, color-only current, stale loading, range mismatch, multiple current pages, active edge controls, mobile arrows only, and empty stale page failures."
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
  "fake-undo": {
    title: "Expose undo that cannot really restore",
    prompt: "Inspect captured prior state, exact restore, external side-effect blocked, expired labelled, multiple undo targets, and partial recovery labelled states; compare no state captured, partial restore, external effect, overwritten target, expired still active, wrong item, toast vanished, and bulk partial failures."
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
  const [demoRequested, setDemoRequested] = useState(false);
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
      {demoRequested ? (
        <Suspense
          fallback={
            <div className="demo-surface quality-lab demo-loading" role="status">
              Loading interactive demo...
            </div>
          }
        >
          <QualityPatternDemo pattern={pattern} />
        </Suspense>
      ) : (
        <div className="demo-surface demo-on-demand" aria-label={`${pattern.name} interactive demo launcher`}>
          <div>
            <strong>Interactive demo is ready</strong>
            <p>Launch the live UI/UX lab when you want to inspect states, keyboard behavior, and common failure modes.</p>
          </div>
          <button className="demo-button primary" type="button" onClick={() => setDemoRequested(true)}>
            Launch demo
          </button>
        </div>
      )}
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
