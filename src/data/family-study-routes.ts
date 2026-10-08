export type FamilyStudyRoute = {
  foundations: string[];
  applications: string[];
  qualityChecks: string[];
};

export const familyLearningOrder = [
  "Navigation And Wayfinding", "Search, Browse, And Discovery", "Input And Data Entry",
  "Selection And Choice", "Feedback, Status, And System State", "Error Prevention And Recovery",
  "Disclosure And Attention Management", "Data Display And Exploration", "Task And Workflow Patterns",
  "Collaboration And Social Interaction", "Personalization And Preference", "Trust, Safety, And Privacy",
  "AI And Automation UX", "Cross-Device And Physical Interaction"
];

// Every entry appears once. The order moves from core task behavior to specialized
// applications, then to failure cases that sharpen the learner's judgment.
export const familyStudyRoutes: Record<string, FamilyStudyRoute> = {
  "Navigation And Wayfinding": {
    foundations: ["global-navigation", "header", "breadcrumbs", "back-link", "skip-link", "related-links"],
    applications: ["service-navigation", "side-navigation", "tabs", "in-page-anchor-navigation", "step-navigation", "process-list", "pagination", "bottom-navigation", "navigation-drawer", "mega-menu", "utility-navigation", "command-palette", "recently-viewed", "carousel"],
    qualityChecks: ["pagination-without-current-page"]
  },
  "Search, Browse, And Discovery": {
    foundations: ["browse-by-category", "basic-search", "search-suggestions", "filter-panel", "no-results-recovery", "sort-controls"],
    applications: ["filter-chips", "faceted-search", "search-scope-selector", "query-correction", "search-result-highlighting", "typeahead", "advanced-search", "saved-search", "saved-filter", "search-history", "recently-searched", "recommendations"],
    qualityChecks: ["infinite-scroll-with-no-footer-access", "filter-reset-that-clears-unrelated-search"]
  },
  "Input And Data Entry": {
    foundations: ["single-question-page", "text-input", "textarea", "single-page-form", "inline-validation", "review-before-submit", "bank-details"],
    applications: ["name-entry", "email-address-entry", "phone-number-entry", "address-entry", "date-input", "date-picker", "time-picker", "date-range-picker", "input-prefix-suffix", "input-mask", "character-count", "password-input", "password-creation", "payment-card-entry", "file-upload", "drag-and-drop-upload", "autocomplete", "dependent-fields", "conditional-reveal-fields", "multi-step-form", "wizard", "complete-complex-form", "draft-state", "autosave-form", "inline-edit", "bulk-import"],
    qualityChecks: ["required-field-hidden-by-conditional-logic"]
  },
  "Selection And Choice": {
    foundations: ["radio-group", "checkbox-group", "select", "toggle-switch", "button-group"],
    applications: ["segmented-control", "multi-select", "combobox", "listbox", "object-picker", "chip-selection", "slider", "range-slider", "spinbutton", "tree-selection", "transfer-list", "action-menu", "action-sheet", "menu-menubar"],
    qualityChecks: ["inaccessible-custom-select"]
  },
  "Feedback, Status, And System State": {
    foundations: ["inline-message", "error-state", "success-confirmation", "confirmation-page", "empty-state", "loading-spinner"],
    applications: ["loading-skeleton", "progress-bar", "step-progress", "meter", "toast-notification", "banner", "notification-banner", "site-alert", "alert", "warning-text", "notification-center", "sync-state", "offline-state", "permission-denied-state", "conflict-state", "service-unavailable-page", "page-not-found-page", "phase-beta-banner", "cookie-banner"],
    qualityChecks: ["infinite-spinner", "disabled-button-no-explanation", "dead-end-empty-state", "toast-only-success-for-completed-transaction", "toast-only-critical-error"]
  },
  "Error Prevention And Recovery": {
    foundations: ["error-summary", "retry", "undo", "redo", "fallback-path", "confirmation-dialog"],
    applications: ["destructive-action-confirmation", "typed-confirmation", "unsaved-changes-prompt", "exit-warning", "autosave-recovery", "version-history", "restore-from-trash", "conflict-resolution", "merge-conflict-resolver", "session-timeout-warning", "permission-recovery", "graceful-degradation"],
    qualityChecks: ["confirmation-fatigue", "ambiguous-destructive-action-copy", "disabled-controls-without-recovery", "fake-undo", "validation-that-clears-user-input"]
  },
  "Disclosure And Attention Management": {
    foundations: ["disclosure-details", "accordion", "progressive-disclosure", "details-panel", "tooltip", "modal-dialog"],
    applications: ["popover", "hover-card", "preview-panel", "menu-button", "context-menu", "alert-dialog", "sheet", "bottom-sheet", "drawer", "full-screen-takeover"],
    qualityChecks: ["icon-only-ambiguous-action", "modal-for-nonblocking-content", "carousel-auto-advance-without-pause", "tooltip-only-required-information", "drawer-with-no-close-or-return-path"]
  },
  "Data Display And Exploration": {
    foundations: ["summary-box", "list-view", "table", "card-list", "card-grid", "data-visualization", "dashboard-layout"],
    applications: ["data-grid", "chart-drilldown", "compare-view", "saved-view", "master-detail", "expandable-row", "tree-grid", "timeline", "activity-log", "calendar-view", "kanban-board", "map-view", "feed", "collection", "tag", "window-splitter"],
    qualityChecks: []
  },
  "Task And Workflow Patterns": {
    foundations: ["start-page", "task-list", "onboarding", "booking", "review-queue"],
    applications: ["account-creation", "create-user-profile", "profile-setup", "sign-in", "login", "password-reset", "two-factor-authentication", "confirm-email", "confirm-phone", "checkout", "payment-collection", "scheduling", "complete-multiple-tasks", "assignment", "approval-workflow", "publish-workflow", "settings-management", "toolbar"],
    qualityChecks: []
  },
  "Collaboration And Social Interaction": {
    foundations: ["share-dialog", "invite-user", "comments", "mentions", "activity-feed", "handoff-summary"],
    applications: ["threaded-discussion", "reactions", "follow-subscribe", "presence", "live-cursors", "change-review"],
    qualityChecks: []
  },
  "Personalization And Preference": {
    foundations: ["settings-page", "preference-center", "notification-preferences", "language-selector", "custom-dashboard", "adaptive-defaults"],
    applications: ["favorites", "pinned-items", "recently-used", "user-controlled-layout", "user-controlled-density", "recommended-next-action"],
    qualityChecks: []
  },
  "AI And Automation UX": {
    foundations: ["ai-limitation-onboarding", "prompt-box", "prompt-suggestions", "scope-clarification", "source-grounding-display", "confidence-uncertainty-display", "human-approval-gate", "correction-feedback"],
    applications: ["chat-interface", "streaming-response", "citation-display", "editable-ai-output", "regenerate-retry", "tool-use-visibility", "agent-plan-preview", "agent-progress-trace", "automation-rule-builder", "ai-output-audit-trail", "model-update-notice", "escalate-to-human"],
    qualityChecks: ["ai-confidence-shown-as-fake-precision", "ai-answer-without-sources", "ai-agent-acts-without-approval"]
  },
  "Trust, Safety, And Privacy": {
    foundations: ["consent-prompt", "privacy-settings", "permission-request", "permission-sharing", "sensitive-data-reveal", "security-warning"],
    applications: ["cookie-consent", "official-site-banner", "audit-log", "data-export", "session-timeout", "legal-acceptance", "dangerous-action-review", "delete-account", "report-abuse", "block-mute", "age-gate", "exit-this-page-quickly"],
    qualityChecks: ["permission-prompt-with-no-context", "dark-pattern-consent", "hidden-destructive-account-deletion"]
  },
  "Cross-Device And Physical Interaction": {
    foundations: ["responsive-navigation-adaptation", "focus-traversal", "touch-gesture", "keyboard-shortcut", "offline-mobile-retry", "qr-scan"],
    applications: ["swipe-action", "long-press", "drag-and-drop", "pull-to-refresh", "camera-capture", "location-permission-flow", "voice-command", "haptic-feedback", "wearable-glance"],
    qualityChecks: []
  }
};

export function studySequence(category: string) {
  const route = familyStudyRoutes[category];
  return route ? [...route.foundations, ...route.applications, ...route.qualityChecks] : [];
}
