import { useState, type ReactNode } from "react";

export type PatternGroup =
  | "search"
  | "choice"
  | "input"
  | "navigation"
  | "state"
  | "validation"
  | "dialog"
  | "recovery"
  | "ai"
  | "anti";

export type PatternMeta = {
  name: string;
  group: PatternGroup;
  subject: string;
  field: string;
  options: string[];
};

export const patternMeta: Record<string, PatternMeta> = {
  autocomplete: {
    name: "Autocomplete",
    group: "search",
    subject: "Customer record",
    field: "Customer",
    options: ["Ada Lovelace", "Aditi Rao", "Adam Chen", "Grace Hopper"]
  },
  combobox: {
    name: "Combobox",
    group: "search",
    subject: "Assignee picker",
    field: "Assignee",
    options: ["Aditi Rao", "Ada Lovelace", "Adam Chen", "Grace Hopper", "Mina Patel"]
  },
  listbox: {
    name: "Listbox",
    group: "choice",
    subject: "Role assignment",
    field: "Role",
    options: ["Analyst", "Designer", "Developer", "Support", "Manager", "Auditor"]
  },
  "transfer-list": {
    name: "Transfer list",
    group: "choice",
    subject: "Access package",
    field: "Permissions",
    options: ["View reports", "Edit users", "Billing admin", "Audit logs", "Export data", "Manage team"]
  },
  "tree-selection": {
    name: "Tree selection",
    group: "choice",
    subject: "Workspace permissions",
    field: "Permission tree",
    options: ["Workspace", "Reports", "Billing", "Security", "Audit logs", "Exports"]
  },
  "object-picker": {
    name: "Object picker",
    group: "choice",
    subject: "Related record",
    field: "Related account",
    options: ["Acme Retail", "Acme Retail", "Acme rollout", "Ada Lovelace", "Archive import"]
  },
  "chip-selection": {
    name: "Chip selection",
    group: "choice",
    subject: "Onboarding interests",
    field: "Choose up to 3 interests",
    options: ["Design", "Data", "Research", "AI", "Accessibility", "Mobile"]
  },
  "button-group": {
    name: "Button group",
    group: "choice",
    subject: "Application draft",
    field: "Application actions",
    options: ["Save draft", "Continue", "Cancel", "Reset changes"]
  },
  "action-menu": {
    name: "Action menu",
    group: "choice",
    subject: "Customer record",
    field: "Customer actions",
    options: ["Edit customer", "Merge customer", "Request data export", "Delete customer"]
  },
  "action-sheet": {
    name: "Action sheet",
    group: "choice",
    subject: "Message draft 18",
    field: "Cancel draft",
    options: ["Save draft", "Discard draft", "Keep editing", "Share", "Report"]
  },
  alert: {
    name: "Alert",
    group: "state",
    subject: "Session workspace",
    field: "Task alert",
    options: ["Session", "Connection", "Payment", "Saved", "Resolve"]
  },
  banner: {
    name: "Banner",
    group: "state",
    subject: "Billing workspace",
    field: "Workspace banner",
    options: ["Maintenance", "Rollout", "Identity", "Dismiss", "Resolve"]
  },
  "notification-banner": {
    name: "Notification banner",
    group: "state",
    subject: "Evidence service",
    field: "Page-flow notice",
    options: ["Uploaded", "Deadline", "Service delay", "No banner"]
  },
  "site-alert": {
    name: "Site alert",
    group: "state",
    subject: "Public service site",
    field: "Sitewide alert",
    options: ["Emergency", "Outage", "Information", "Resolve"]
  },
  "consent-prompt": {
    name: "Consent prompt",
    group: "state",
    subject: "Research workspace",
    field: "Optional data-use consent",
    options: ["Purpose", "Accept", "Decline", "Withdraw", "Renew"]
  },
  "dark-pattern-consent": {
    name: "Dark-pattern consent",
    group: "state",
    subject: "Privacy consent surface",
    field: "Consent fairness audit",
    options: ["Accept parity", "Reject path", "Purposes", "Runtime", "Withdraw"]
  },
  "permission-request": {
    name: "Permission request",
    group: "state",
    subject: "Field service app",
    field: "Device resource permission",
    options: ["Context", "Allow", "Deny", "Fallback", "Settings"]
  },
  "permission-prompt-with-no-context": {
    name: "Permission prompt with no context",
    group: "state",
    subject: "First-run mobile app",
    field: "Premature device permission",
    options: ["Cold start", "Feature trigger", "Fallback", "Settings", "No nag"]
  },
  "sensitive-data-reveal": {
    name: "Sensitive-data reveal",
    group: "state",
    subject: "Security console",
    field: "Masked sensitive value",
    options: ["Masked", "Reveal", "Hide", "Copy", "Audit"]
  },
  "security-warning": {
    name: "Security warning",
    group: "state",
    subject: "Browser safety interstitial",
    field: "Unsafe destination warning",
    options: ["Safe path", "Details", "Report", "Override", "Policy"]
  },
  "dangerous-action-review": {
    name: "Dangerous-action review",
    group: "state",
    subject: "Operations console",
    field: "High-impact action",
    options: ["Risk inventory", "Evidence", "Dry run", "Edit", "Run"]
  },
  "touch-gesture": {
    name: "Touch gesture",
    group: "input",
    subject: "Mobile media workspace",
    field: "Gesture contract",
    options: ["Tap target", "Threshold", "Cancel", "Pinch alt", "Scroll conflict"]
  },
  "pull-to-refresh": {
    name: "Pull to refresh",
    group: "input",
    subject: "Mobile inbox feed",
    field: "Top-of-scroll refresh",
    options: ["At top", "Threshold", "Release", "Refreshing", "Manual refresh"]
  },
  "swipe-action": {
    name: "Swipe action",
    group: "input",
    subject: "Mobile message list",
    field: "Row action gesture",
    options: ["Gesture hint", "Partial reveal", "Threshold", "Undo", "Action menu"]
  },
  "long-press": {
    name: "Long press",
    group: "input",
    subject: "Mobile file tile",
    field: "Sustained-contact gesture",
    options: ["Hold progress", "Threshold", "Context menu", "Selection mode", "Equivalent path"]
  },
  "drag-and-drop": {
    name: "Drag and drop",
    group: "input",
    subject: "Workflow board",
    field: "Object movement",
    options: ["Pickup", "Valid target", "Invalid target", "Drop", "Move menu"]
  },
  "keyboard-shortcut": {
    name: "Keyboard shortcut",
    group: "input",
    subject: "Document editor",
    field: "Key command accelerator",
    options: ["Command+S", "Control+S", "Shortcut help", "Remap", "Conflict check"]
  },
  "focus-traversal": {
    name: "Focus traversal",
    group: "input",
    subject: "Checkout workflow",
    field: "Sequential focus path",
    options: ["Initial focus", "Tab order", "Shift+Tab", "Error focus", "Focus return"]
  },
  "voice-command": {
    name: "Voice command",
    group: "input",
    subject: "Incident console",
    field: "Spoken command lifecycle",
    options: ["Push to talk", "Transcript", "Confidence", "Confirm target", "Fallback path"]
  },
  "camera-capture": {
    name: "Camera capture",
    group: "input",
    subject: "Receipt scanner",
    field: "Live camera media capture",
    options: ["Permission", "Live preview", "Capture", "Review", "Retake"]
  },
  "qr-scan": {
    name: "QR scan",
    group: "input",
    subject: "Device pairing",
    field: "QR payload detection",
    options: ["Aim guide", "Torch", "Decoded preview", "Manual code", "Unsafe URL"]
  },
  "haptic-feedback": {
    name: "Haptic feedback",
    group: "input",
    subject: "Mobile task board",
    field: "Tactile event feedback",
    options: ["Light press", "Drag threshold", "Detent", "Warning", "Disabled"]
  },
  "wearable-glance": {
    name: "Wearable glance",
    group: "state",
    subject: "Transit watch tile",
    field: "One-glance wearable status",
    options: ["Compact", "Ambient", "Stale", "Privacy", "Handoff"]
  },
  "responsive-navigation-adaptation": {
    name: "Responsive navigation adaptation",
    group: "navigation",
    subject: "Operations app shell",
    field: "Adaptive destination model",
    options: ["Compact", "Rail", "Expanded", "Overflow", "Focus"]
  },
  "offline-mobile-retry": {
    name: "Offline mobile retry",
    group: "state",
    subject: "Field report outbox",
    field: "Queued mobile retry lifecycle",
    options: ["Queued", "Retry now", "Background", "Wi-Fi only", "Auth"]
  },
  "location-permission-flow": {
    name: "Location permission flow",
    group: "input",
    subject: "Route check-in",
    field: "Current location access",
    options: ["Pre-prompt", "Allow once", "Approximate", "Manual fallback", "Stop sharing"]
  },
  "session-timeout": {
    name: "Session timeout",
    group: "state",
    subject: "Benefits claim",
    field: "Expired authenticated session",
    options: ["Reference SES-2048", "Saved draft 10:42", "Sign in again", "Return to claim review", "Start again"]
  },
  "audit-log": {
    name: "Audit log",
    group: "state",
    subject: "Enterprise security console",
    field: "Governed audit evidence",
    options: ["Audit ID", "Retention policy", "Legal hold", "Export evidence", "SIEM stream", "Tamper check"]
  },
  "data-export": {
    name: "Data export",
    group: "state",
    subject: "Privacy dashboard",
    field: "Export package workflow",
    options: ["Profile data", "Activity history", "JSON archive", "EXP-2048", "Download expires"]
  },
  "delete-account": {
    name: "Delete account",
    group: "state",
    subject: "Account settings",
    field: "Account closure workflow",
    options: ["maya.chen@example.com", "Export first", "14-day recovery", "Retained invoices", "Delete request"]
  },
  "hidden-destructive-account-deletion": {
    name: "Hidden destructive account deletion",
    group: "state",
    subject: "Account control surface",
    field: "Account deletion obstruction",
    options: ["Find path", "True deletion", "Export", "Status", "Web route"]
  },
  "privacy-settings": {
    name: "Privacy settings",
    group: "state",
    subject: "Privacy dashboard",
    field: "Privacy control surface",
    options: ["Saved activity", "Profile visibility", "App access", "Ad personalization", "Managed policy"]
  },
  "report-abuse": {
    name: "Report abuse",
    group: "state",
    subject: "Community safety",
    field: "Safety report flow",
    options: ["Report reason", "Affected person", "Evidence", "Receipt", "Safety actions"]
  },
  "block-mute": {
    name: "Block / mute",
    group: "state",
    subject: "Personal safety",
    field: "Personal boundary control",
    options: ["Block account", "Mute account", "Hide person", "Temporary mute", "Manage list"]
  },
  "age-gate": {
    name: "Age gate",
    group: "state",
    subject: "Age-sensitive access",
    field: "Eligibility boundary",
    options: ["Date of birth", "Age band", "Parent consent", "Age assurance", "Underage route"]
  },
  "legal-acceptance": {
    name: "Legal acceptance",
    group: "state",
    subject: "Checkout agreement",
    field: "Terms acceptance gate",
    options: ["Terms checkbox", "Version", "Decline route", "Audit record", "Updated terms"]
  },
  "exit-this-page-quickly": {
    name: "Exit this page quickly",
    group: "state",
    subject: "Sensitive support service",
    field: "Quick safety exit",
    options: ["Persistent exit", "Neutral destination", "Safety limits", "Fallback", "Mobile exit"]
  },
  "official-site-banner": {
    name: "Official-site banner",
    group: "state",
    subject: "Government benefits service",
    field: "Official identity proof",
    options: [".gov domain", "HTTPS", "Every page", "Agency identity", "Eligibility guard"]
  },
  "cookie-banner": {
    name: "Cookie banner",
    group: "state",
    subject: "Benefits service",
    field: "Cookie consent",
    options: ["Accept", "Reject", "Manage", "Withdraw"]
  },
  "cookie-consent": {
    name: "Cookie consent",
    group: "state",
    subject: "Benefits service",
    field: "Cookie runtime consent",
    options: ["Purpose choices", "Runtime block", "Consent record", "Withdrawal", "Signal"]
  },
  "phase-beta-banner": {
    name: "Phase / beta banner",
    group: "state",
    subject: "Benefits service",
    field: "Service phase",
    options: ["Alpha", "Private beta", "Public beta", "Live"]
  },
  "notification-center": {
    name: "Notification center",
    group: "state",
    subject: "Work updates",
    field: "Notification drawer",
    options: ["Open center", "Unread", "Mark read", "Suppress toast", "Preferences"]
  },
  "warning-text": {
    name: "Warning text",
    group: "state",
    subject: "Application declaration",
    field: "Consequence warning",
    options: ["Fine", "Delete", "Eligibility", "Declaration", "Resolve"]
  },
  "success-confirmation": {
    name: "Success confirmation",
    group: "state",
    subject: "Evidence upload",
    field: "Completion proof",
    options: ["Save draft", "Upload evidence", "Copy reference", "View receipt", "New task"]
  },
  "confirmation-page": {
    name: "Confirmation page",
    group: "state",
    subject: "Grant application",
    field: "Final receipt",
    options: ["Submit", "Copy reference", "Email receipt", "Track", "Bookmark"]
  },
  "toast-notification": {
    name: "Toast notification",
    group: "state",
    subject: "Export job",
    field: "Notification region",
    options: ["Queue export", "Show saved", "Archive with undo", "Show sync delay", "Expire stack"]
  },
  "toast-only-success-for-completed-transaction": {
    name: "Toast-only success for completed transaction",
    group: "state",
    subject: "Benefit application",
    field: "Durable transaction proof",
    options: ["Receipt", "Toast expired", "Copy reference", "Track", "Duplicate guard"]
  },
  "inline-message": {
    name: "Inline message",
    group: "state",
    subject: "Invoice row",
    field: "Invoice feedback",
    options: ["Billing contact", "Export warning", "Sent reference", "Resolve message"]
  },
  "back-link": {
    name: "Back link",
    group: "navigation",
    subject: "Claim application",
    field: "Transaction steps",
    options: ["Eligibility", "Contact details", "Review answers", "Submit"]
  },
  "basic-search": {
    name: "Basic search",
    group: "search",
    subject: "Reports",
    field: "Search reports",
    options: ["Analytics report", "Billing settings", "Security audit", "Team invitations"]
  },
  "browse-by-category": {
    name: "Browse by category",
    group: "search",
    subject: "Service directory",
    field: "Category",
    options: ["Benefits", "Housing and local services", "Money and tax", "Driving and transport"]
  },
  "advanced-search": {
    name: "Advanced search",
    group: "search",
    subject: "Case records",
    field: "Query clauses",
    options: ["Status equals Open", "Title contains appeal", "Created after 2026-01-01", "Owner is me"]
  },
  "query-correction": {
    name: "Query correction",
    group: "search",
    subject: "Benefits knowledge search",
    field: "Search query",
    options: ["benefit appeal", "benefit appeal deadline", "upload benefit evidence", "appeal decision notice"]
  },
  recommendations: {
    name: "Recommendations",
    group: "search",
    subject: "Recommended services",
    field: "Recommendation controls",
    options: ["Appeal a benefit decision", "Upload evidence", "Debt advice appointment", "Housing support"]
  },
  "search-result-highlighting": {
    name: "Search result highlighting",
    group: "search",
    subject: "Knowledge results",
    field: "Matched fields",
    options: ["Benefits appeal policy", "Appeal deadline guide", "Housing benefit notice", "Case review checklist"]
  },
  "search-scope-selector": {
    name: "Search scope selector",
    group: "search",
    subject: "Knowledge search",
    field: "Search scope",
    options: ["All knowledge", "Current workspace", "Cases", "People"]
  },
  "bottom-navigation": {
    name: "Bottom navigation",
    group: "navigation",
    subject: "Mobile workspace",
    field: "Destination",
    options: ["Home", "Search", "Saved", "Alerts", "Settings"]
  },
  breadcrumbs: {
    name: "Breadcrumbs",
    group: "navigation",
    subject: "Runbook",
    field: "Location",
    options: ["Home", "Projects", "Migration", "Runbook"]
  },
  carousel: {
    name: "Carousel",
    group: "navigation",
    subject: "Product tour slides",
    field: "Current slide",
    options: ["Overview", "Backup", "Security", "Reporting", "Pause"]
  },
  "carousel-auto-advance-without-pause": {
    name: "Carousel auto-advance without pause",
    group: "navigation",
    subject: "Campaign carousel",
    field: "Rotation control",
    options: ["Pause first", "Start rotation", "Focus stop", "Hover stop", "Reduced motion"]
  },
  toolbar: {
    name: "Toolbar",
    group: "navigation",
    subject: "Document editor",
    field: "Formatting commands",
    options: ["Undo", "Redo", "Bold", "Align", "More"]
  },
  "window-splitter": {
    name: "Window splitter",
    group: "navigation",
    subject: "Case workspace",
    field: "Pane ratio",
    options: ["List pane", "Splitter", "Detail pane", "Collapse", "Restore"]
  },
  "full-screen-takeover": {
    name: "Full-screen takeover",
    group: "dialog",
    subject: "Expense receipt",
    field: "Capture mode",
    options: ["Open", "Capture", "Review", "Close", "Save"]
  },
  table: {
    name: "Table",
    group: "navigation",
    subject: "Payment review",
    field: "Rows and columns",
    options: ["Vendor", "Status", "Due date", "Amount", "Action"]
  },
  "data-grid": {
    name: "Data grid",
    group: "navigation",
    subject: "Invoice workspace",
    field: "Focused cell",
    options: ["Invoice", "Vendor", "Amount", "Due", "Owner", "Status"]
  },
  "tree-grid": {
    name: "Tree grid",
    group: "navigation",
    subject: "Project breakdown",
    field: "Hierarchy row",
    options: ["Phase", "Owner", "Due", "Status", "Cost"]
  },
  "list-view": {
    name: "List view",
    group: "navigation",
    subject: "Ticket queue",
    field: "Object rows",
    options: ["Title", "Summary", "Status", "Owner", "Updated"]
  },
  collection: {
    name: "Collection",
    group: "navigation",
    subject: "Launch assets kit",
    field: "Collection membership",
    options: ["Title", "Description", "Owner", "Count", "Visibility", "Items"]
  },
  "card-list": {
    name: "Card list",
    group: "navigation",
    subject: "Grant opportunities",
    field: "Rich object cards",
    options: ["Preview", "Title", "Summary", "Deadline", "Status", "Save"]
  },
  "card-grid": {
    name: "Card grid",
    group: "navigation",
    subject: "Course marketplace",
    field: "Responsive object tiles",
    options: ["Thumbnail", "Title", "Provider", "Level", "Duration", "Save"]
  },
  "master-detail": {
    name: "Master-detail",
    group: "navigation",
    subject: "Order workspace",
    field: "Selected order detail",
    options: ["Order list", "Detail", "Back to list", "Draft", "Filter", "Resize"]
  },
  feed: {
    name: "Feed",
    group: "navigation",
    subject: "Project stream",
    field: "Dynamic feed items",
    options: ["Source", "Time", "Item boundary", "New queue", "Load older", "Actions"]
  },
  "infinite-scroll-with-no-footer-access": {
    name: "Infinite scroll with no footer access",
    group: "navigation",
    subject: "Product result stream",
    field: "Footer reachability",
    options: ["Bounded auto-load", "Load more", "Jump to footer", "End state", "Failed load"]
  },
  "activity-feed": {
    name: "Activity feed",
    group: "state",
    subject: "Team activity",
    field: "Work event catch-up",
    options: ["Actor", "Type", "Unread", "Filter", "Clear", "Open"]
  },
  reactions: {
    name: "Reactions",
    group: "state",
    subject: "Message feedback",
    field: "Emoji reaction controls",
    options: ["Emoji", "Count", "Mine", "Picker", "People", "Remove"]
  },
  "follow-subscribe": {
    name: "Follow / subscribe",
    group: "state",
    subject: "Incident thread",
    field: "Future update subscription",
    options: ["Scope", "Reason", "Delivery", "Digest", "Unfollow", "Access"]
  },
  "notification-preferences": {
    name: "Notification preferences",
    group: "state",
    subject: "Alert delivery",
    field: "Notification rules",
    options: ["Type", "Channel", "Frequency", "Quiet", "Override", "Preview"]
  },
  "preference-center": {
    name: "Preference center",
    group: "input",
    subject: "Customer account preferences",
    field: "Communication and consent choices",
    options: ["Status", "Channels", "Topics", "Consent", "Language", "Source"]
  },
  "version-history": {
    name: "Version history",
    group: "state",
    subject: "Design spec file",
    field: "Saved version browser",
    options: ["Current", "Version", "Compare", "Restore", "Author", "Retention"]
  },
  "change-review": {
    name: "Change review",
    group: "state",
    subject: "Pull request diff",
    field: "Proposed change review",
    options: ["Original", "Proposed", "Comment", "Accept", "Reject", "Stale"]
  },
  "handoff-summary": {
    name: "Handoff summary",
    group: "state",
    subject: "Support escalation",
    field: "Transfer context packet",
    options: ["Sender", "Receiver", "Status", "Actions", "Sources", "Risks"]
  },
  comments: {
    name: "Comments",
    group: "state",
    subject: "Shipment exception note",
    field: "Anchored discussion",
    options: ["Anchor", "Reply", "Resolve", "Assign", "Moderate", "Link"]
  },
  "threaded-discussion": {
    name: "Threaded discussion",
    group: "state",
    subject: "Release readiness topic",
    field: "Branched replies",
    options: ["Parent", "Branch", "Unread", "Answer", "Follow", "Link"]
  },
  mentions: {
    name: "Mentions",
    group: "state",
    subject: "Incident note",
    field: "Inline recipient routing",
    options: ["Trigger", "Suggest", "Token", "Access", "Warn", "Notify"]
  },
  presence: {
    name: "Presence",
    group: "state",
    subject: "Reviewer availability",
    field: "Status and co-viewing",
    options: ["Available", "Busy", "DND", "Away", "Offline", "Privacy"]
  },
  "live-cursors": {
    name: "Live cursors",
    group: "state",
    subject: "Shared design canvas",
    field: "Realtime pointer awareness",
    options: ["Pointer", "Caret", "Select", "Follow", "Hide", "Stale"]
  },
  "share-dialog": {
    name: "Share dialog",
    group: "state",
    subject: "Quarterly report",
    field: "Object sharing controls",
    options: ["People", "Link", "Role", "Notify", "Copy", "Revoke"]
  },
  "permission-sharing": {
    name: "Permission sharing",
    group: "state",
    subject: "Repository access",
    field: "Effective permission model",
    options: ["Direct", "Groups", "Inherited", "Role", "Revoke", "Audit"]
  },
  timeline: {
    name: "Timeline",
    group: "navigation",
    subject: "Benefit claim history",
    field: "Chronological events",
    options: ["Submitted", "Evidence requested", "Evidence received", "Decision pending", "Review scheduled"]
  },
  "activity-log": {
    name: "Activity log",
    group: "navigation",
    subject: "Organization audit log",
    field: "Recorded events",
    options: ["Actor", "Action", "Object", "Time", "Source", "Export"]
  },
  "calendar-view": {
    name: "Calendar view",
    group: "navigation",
    subject: "Clinic schedule",
    field: "Scheduled events",
    options: ["Month", "Week", "Agenda", "Overflow", "Conflict", "Timezone"]
  },
  "kanban-board": {
    name: "Kanban board",
    group: "navigation",
    subject: "Product delivery board",
    field: "Workflow cards",
    options: ["Backlog", "Ready", "In progress", "Review", "Done", "WIP"]
  },
  "map-view": {
    name: "Map view",
    group: "navigation",
    subject: "Clinic finder map",
    field: "Spatial results",
    options: ["Viewport", "Markers", "Clusters", "Layers", "Geolocation", "Fallback list"]
  },
  "data-visualization": {
    name: "Data visualization",
    group: "navigation",
    subject: "Revenue trend chart",
    field: "Visual encodings",
    options: ["Metric", "Axis", "Legend", "Tooltip", "Annotation", "Data table"]
  },
  "chart-drilldown": {
    name: "Chart drilldown",
    group: "navigation",
    subject: "Revenue hierarchy chart",
    field: "Aggregate drill path",
    options: ["Region", "Country", "Store", "Breadcrumbs", "Drill up", "Leaf"]
  },
  "compare-view": {
    name: "Compare view",
    group: "navigation",
    subject: "Laptop shortlist",
    field: "Comparable attributes",
    options: ["Shortlist", "Differences", "Pinned header", "Groups", "Remove", "Mobile pair"]
  },
  "expandable-row": {
    name: "Expandable row",
    group: "navigation",
    subject: "Invoice review table",
    field: "Row-owned detail",
    options: ["Expand", "Sort", "Filter", "Refresh", "No detail", "Mobile"]
  },
  "saved-view": {
    name: "Saved view",
    group: "navigation",
    subject: "Support queue views",
    field: "Saved presentation state",
    options: ["Views", "Columns", "Layout", "Grouping", "Visibility", "Default"]
  },
  "dashboard-layout": {
    name: "Dashboard layout",
    group: "navigation",
    subject: "Operations dashboard",
    field: "Coordinated monitoring widgets",
    options: ["Filters", "KPIs", "Exceptions", "Freshness", "Drill", "Responsive"]
  },
  "custom-dashboard": {
    name: "Custom dashboard",
    group: "navigation",
    subject: "Personal support dashboard",
    field: "Persisted widget composition",
    options: ["Add widget", "Move", "Resize", "Save scope", "Mobile preview", "Reset"]
  },
  "pinned-items": {
    name: "Pinned items",
    group: "navigation",
    subject: "Workspace quick access",
    field: "Stable prominent items",
    options: ["Pin", "Unpin", "Move", "Limit", "Scope", "Stale target"]
  },
  favorites: {
    name: "Favorites",
    group: "navigation",
    subject: "Saved preferred items",
    field: "Personal favorite state",
    options: ["Favorite", "Unfavorite", "List", "Scope", "Unavailable", "Public count"]
  },
  "recently-used": {
    name: "Recently used",
    group: "navigation",
    subject: "Recent use shortcuts",
    field: "Meaningful use event",
    options: ["Run", "Resume", "Move top", "Remove", "Scope", "Stale target"]
  },
  "recommended-next-action": {
    name: "Recommended next action",
    group: "navigation",
    subject: "Case action guidance",
    field: "Context-sensitive action",
    options: ["Why now", "Review", "Accept", "Defer", "Dismiss", "Blocked"]
  },
  "adaptive-defaults": {
    name: "Adaptive defaults",
    group: "input",
    subject: "Context-aware field defaults",
    field: "Adapted starting value",
    options: ["Source", "Scope", "Change", "Remember", "Reset", "Review"]
  },
  "user-controlled-density": {
    name: "User-controlled density",
    group: "state",
    subject: "Queue display density",
    field: "Row spacing preference",
    options: ["Comfortable", "Standard", "Compact", "Spacious", "Reset", "Scope"]
  },
  "user-controlled-layout": {
    name: "User-controlled layout",
    group: "navigation",
    subject: "Case review workspace",
    field: "Pane arrangement preference",
    options: ["Split", "Focus", "Stacked", "Inspector", "Save", "Reset"]
  },
  "language-selector": {
    name: "Language selector",
    group: "navigation",
    subject: "Benefits application page",
    field: "Current content language",
    options: ["English", "Español", "Français", "Partial", "Unavailable", "Reset"]
  },
  "prompt-box": {
    name: "Prompt box",
    group: "ai",
    subject: "Contract review assistant",
    field: "AI request draft",
    options: ["Draft", "Context", "Attach", "Send", "Retry", "Edit"]
  },
  "chat-interface": {
    name: "Chat interface",
    group: "ai",
    subject: "Research assistant conversation",
    field: "Active transcript",
    options: ["Turns", "History", "Stream", "Sources", "Retry", "Export"]
  },
  "streaming-response": {
    name: "Streaming response",
    group: "ai",
    subject: "Policy answer generation",
    field: "Generated output stream",
    options: ["First", "Delta", "Stop", "Continue", "Retry", "Complete"]
  },
  "citation-display": {
    name: "Citation display",
    group: "ai",
    subject: "Policy answer evidence",
    field: "Claim citations",
    options: ["Verified", "Source", "Pending", "Stale", "Missing", "Copy"]
  },
  "source-grounding-display": {
    name: "Source grounding display",
    group: "ai",
    subject: "Policy answer grounding",
    field: "Answer evidence coverage",
    options: ["Scope", "Retrieved", "Used", "Unsupported", "Pending", "Review"]
  },
  "ai-answer-without-sources": {
    name: "AI answer without sources",
    group: "ai",
    subject: "Customer policy answer",
    field: "Source status",
    options: ["Search sources", "Retry retrieval", "Upload source", "Ask human", "Copy draft", "Continue without sources"]
  },
  "ai-confidence-shown-as-fake-precision": {
    name: "AI confidence shown as fake precision",
    group: "ai",
    subject: "Claim classification assistant",
    field: "Confidence validity",
    options: ["Hide raw score", "Calibrate", "Review", "Recompute", "Explain caveat", "Block apply"]
  },
  "ai-agent-acts-without-approval": {
    name: "AI agent acts without approval",
    group: "ai",
    subject: "Account automation agent",
    field: "Side-effect authorization",
    options: ["Read-only", "Gate side effect", "Preview payload", "Approve", "Reject", "Rollback"]
  },
  "confidence-uncertainty-display": {
    name: "Confidence / uncertainty display",
    group: "ai",
    subject: "Claim classification assistant",
    field: "Prediction reliability",
    options: ["High", "Medium", "Low", "Insufficient", "Review", "Explain"]
  },
  "human-approval-gate": {
    name: "Human approval gate",
    group: "ai",
    subject: "Refund automation run",
    field: "Paused approval checkpoint",
    options: ["Paused", "Approve", "Edit", "Reject", "Timeout", "Bypass"]
  },
  "agent-plan-preview": {
    name: "Agent plan preview",
    group: "ai",
    subject: "Account research agent",
    field: "Pre-run execution plan",
    options: ["Objective", "Tools", "Edit", "Gate", "Run", "Cancel"]
  },
  "agent-progress-trace": {
    name: "Agent progress trace",
    group: "ai",
    subject: "Account research agent",
    field: "Live execution trace",
    options: ["Run", "Step", "Tool", "Gate", "Retry", "Audit"]
  },
  "tool-use-visibility": {
    name: "Tool-use visibility",
    group: "ai",
    subject: "Account research agent",
    field: "Tool call details",
    options: ["Tool", "Input", "Output", "Permission", "Redact", "Audit"]
  },
  "editable-ai-output": {
    name: "Editable AI output",
    group: "ai",
    subject: "Policy answer draft",
    field: "Generated output draft",
    options: ["Draft", "Edit", "Sources", "Review", "Apply", "Undo"]
  },
  "regenerate-retry": {
    name: "Regenerate / retry",
    group: "ai",
    subject: "Policy answer assistant",
    field: "Response version attempt",
    options: ["Same prompt", "Version", "Sources", "Tools", "Compare", "Restore"]
  },
  "correction-feedback": {
    name: "Correction feedback",
    group: "ai",
    subject: "Policy answer assistant",
    field: "AI correction feedback",
    options: ["Claim", "Reason", "Source", "Scope", "Send", "History"]
  },
  "scope-clarification": {
    name: "Scope clarification",
    group: "ai",
    subject: "Records cleanup agent",
    field: "Clarification before action",
    options: ["Request", "Boundary", "Choices", "Default", "Blocked", "Resume"]
  },
  "escalate-to-human": {
    name: "Escalate to human",
    group: "ai",
    subject: "Support assistant",
    field: "Human escalation route",
    options: ["Route", "Wait", "Context", "Consent", "Queue", "Fallback"]
  },
  "automation-rule-builder": {
    name: "Automation rule builder",
    group: "ai",
    subject: "Support operations",
    field: "Rule authoring",
    options: ["Trigger", "Condition", "Action", "Test", "Enable", "Monitor"]
  },
  "model-update-notice": {
    name: "Model update notice",
    group: "ai",
    subject: "AI platform admin",
    field: "Model lifecycle notice",
    options: ["Model", "Deadline", "Impact", "Test", "Migrate", "Status"]
  },
  "ai-limitation-onboarding": {
    name: "AI limitation onboarding",
    group: "ai",
    subject: "Research assistant",
    field: "Capability boundary intro",
    options: ["Benefit", "Limits", "Data", "Review", "Try", "Fallback"]
  },
  "ai-output-audit-trail": {
    name: "AI output audit trail",
    group: "ai",
    subject: "Compliance reviewer",
    field: "Generated output lineage",
    options: ["Prompt", "Response", "Sources", "Tools", "Actions", "Export"]
  },
  "summary-box": {
    name: "Summary box",
    group: "navigation",
    subject: "Benefits application guide",
    field: "Key page facts",
    options: ["Heading", "Facts", "Next steps", "Body sync", "Links", "Review"]
  },
  tag: {
    name: "Tag / status tag",
    group: "navigation",
    subject: "Claim review queue",
    field: "Object labels",
    options: ["Category", "Status", "Update", "Stale", "Limit", "Overflow"]
  },
  onboarding: {
    name: "Onboarding",
    group: "navigation",
    subject: "Team workspace",
    field: "First-run activation",
    options: ["Welcome", "Goal", "Setup", "Sample", "Skip", "Resume"]
  },
  "start-page": {
    name: "Start page",
    group: "navigation",
    subject: "Building permit service",
    field: "Service entry point",
    options: ["Fit", "Need", "Start", "Resume", "Alternative", "Unavailable"]
  },
  "account-creation": {
    name: "Account creation",
    group: "input",
    subject: "Permit draft account",
    field: "Persistent access setup",
    options: ["Need", "Email", "Password", "Verify", "Existing", "Return"]
  },
  "create-user-profile": {
    name: "Create user profile",
    group: "input",
    subject: "Team directory profile",
    field: "Visible profile identity",
    options: ["Display", "Avatar", "Visibility", "Managed", "Preview", "Saved"]
  },
  "profile-setup": {
    name: "Profile setup",
    group: "input",
    subject: "Team profile readiness",
    field: "Existing profile completion",
    options: ["Current", "Required", "Recommended", "Visibility", "Managed", "Return"]
  },
  "settings-management": {
    name: "Settings management",
    group: "input",
    subject: "Workspace preferences",
    field: "Persistent configuration",
    options: ["Overview", "Immediate", "Save", "Search", "Managed", "Reset"]
  },
  "settings-page": {
    name: "Settings page",
    group: "navigation",
    subject: "Workspace settings",
    field: "Settings page structure",
    options: ["Sections", "Current", "Deep link", "Search", "Mobile", "Return"]
  },
  "invite-user": {
    name: "Invite user",
    group: "input",
    subject: "Workspace invitation",
    field: "Recipient access grant",
    options: ["Recipient", "Role", "Scope", "Review", "Pending", "Manage"]
  },
  assignment: {
    name: "Assignment",
    group: "input",
    subject: "Support ticket owner",
    field: "Responsible assignee",
    options: ["Owner", "Eligible", "Notify", "Handoff", "Bulk", "Sync"]
  },
  "approval-workflow": {
    name: "Approval workflow",
    group: "input",
    subject: "Production deployment",
    field: "Routed approval decision",
    options: ["Submit", "Route", "Decide", "Revise", "Escalate", "Audit"]
  },
  "review-queue": {
    name: "Review queue",
    group: "input",
    subject: "Shared triage queue",
    field: "Many-item review workload",
    options: ["Scope", "Reason", "Claim", "SLA", "Bulk", "Stale"]
  },
  "publish-workflow": {
    name: "Publish workflow",
    group: "input",
    subject: "Campaign page release",
    field: "Draft to live transition",
    options: ["Draft", "Preview", "Validate", "Target", "Schedule", "Live"]
  },
  scheduling: {
    name: "Scheduling",
    group: "input",
    subject: "Product review meeting",
    field: "Coordinated calendar time",
    options: ["People", "Availability", "Time", "Timezone", "Recurrence", "Send"]
  },
  booking: {
    name: "Booking",
    group: "input",
    subject: "Haircut appointment",
    field: "Customer slot reservation",
    options: ["Service", "Staff", "Slot", "Capacity", "Policy", "Confirm"]
  },
  "complete-multiple-tasks": {
    name: "Complete multiple tasks",
    group: "input",
    subject: "Childcare licence application",
    field: "Saved section completion",
    options: ["Started", "Progress", "Blocked", "Review", "Submit", "Return"]
  },
  "task-list": {
    name: "Task list",
    group: "input",
    subject: "Application task rows",
    field: "Linked task status rows",
    options: ["Names", "Hints", "Status", "Blocked", "Groups", "Return"]
  },
  "sign-in": {
    name: "Sign in",
    group: "input",
    subject: "Private document access",
    field: "Returning account authentication",
    options: ["Destination", "Identifier", "Password", "Passkey", "SSO", "Return"]
  },
  login: {
    name: "Login",
    group: "input",
    subject: "Account verification attempt",
    field: "Login attempt lifecycle",
    options: ["Ready", "Verify", "Failure", "Throttle", "Lock", "Success"]
  },
  "password-reset": {
    name: "Password reset",
    group: "input",
    subject: "Account recovery",
    field: "Reset token lifecycle",
    options: ["Request", "Sent", "Resend", "Expired", "New password", "Sessions"]
  },
  "two-factor-authentication": {
    name: "Two-factor authentication",
    group: "input",
    subject: "Payroll settings access",
    field: "Additional factor challenge",
    options: ["Code", "Push", "Wrong", "Expired", "Recovery", "Trusted"]
  },
  "confirm-email": {
    name: "Confirm email",
    group: "input",
    subject: "Account activation",
    field: "Mailbox access proof",
    options: ["Sent", "Blocking", "Code", "Resend", "Expired", "Verified"]
  },
  "confirm-phone": {
    name: "Confirm phone",
    group: "input",
    subject: "Account recovery phone",
    field: "Phone access proof",
    options: ["Sent", "SMS", "Voice", "Wrong", "Expired", "Verified"]
  },
  "global-navigation": {
    name: "Global navigation",
    group: "navigation",
    subject: "Workspace shell",
    field: "Primary sections",
    options: ["Dashboard", "Projects", "Reports", "Billing", "Admin"]
  },
  header: {
    name: "Header / top app bar",
    group: "navigation",
    subject: "Project view",
    field: "Current view",
    options: ["Details", "Files", "Activity"]
  },
  "checkbox-group": {
    name: "Checkbox group",
    group: "choice",
    subject: "Alert channels",
    field: "Send alerts by",
    options: ["Email", "SMS", "Push"]
  },
  "toggle-switch": {
    name: "Toggle switch",
    group: "choice",
    subject: "Notification settings",
    field: "Email notifications",
    options: ["Notifications", "Weekly digest", "Marketing emails"]
  },
  slider: {
    name: "Slider",
    group: "choice",
    subject: "Display settings",
    field: "Brightness",
    options: ["Low", "Comfort", "Bright", "Maximum"]
  },
  "range-slider": {
    name: "Range slider",
    group: "choice",
    subject: "Hotel results",
    field: "Nightly price range",
    options: ["$80", "$180", "$260", "$400"]
  },
  spinbutton: {
    name: "Spinbutton / numeric stepper",
    group: "choice",
    subject: "Room booking",
    field: "Guests",
    options: ["0", "1", "2", "3"]
  },
  "command-palette": {
    name: "Command palette",
    group: "search",
    subject: "Global commands",
    field: "Command",
    options: [
      "Open billing",
      "Create report",
      "Invite teammate",
      "Run security audit",
      "Go to settings",
      "Switch theme to dark",
      "Open audit logs",
      "Delete workspace..."
    ]
  },
  "menu-button": {
    name: "Menu button",
    group: "dialog",
    subject: "Q2 risk report",
    field: "Report actions",
    options: ["Open report", "Rename report", "Duplicate report", "Archive report"]
  },
  "menu-menubar": {
    name: "Menu / menubar",
    group: "navigation",
    subject: "Document editor",
    field: "Editor commands",
    options: ["File", "Edit", "View", "Insert", "Format"]
  },
  "confirmation-dialog": {
    name: "Confirmation dialog",
    group: "dialog",
    subject: "Research archive",
    field: "Confirmation",
    options: ["Keep archive", "Delete archive", "Type DELETE"]
  },
  "confirmation-fatigue": {
    name: "Confirmation fatigue",
    group: "dialog",
    subject: "Message cleanup",
    field: "Prompt policy",
    options: ["Archive", "Undo archive", "Delete workspace", "Suppress routine prompts"]
  },
  "ambiguous-destructive-action-copy": {
    name: "Ambiguous destructive action copy",
    group: "anti",
    subject: "Payments project",
    field: "Destructive copy",
    options: ["Delete Payments project", "Keep project", "Cancel Pro subscription", "Revoke Maya's access", "Permanently delete 12 files"]
  },
  "destructive-action-confirmation": {
    name: "Destructive action confirmation",
    group: "dialog",
    subject: "Payments project",
    field: "Destructive review",
    options: ["Keep project", "Acknowledge loss", "Delete project", "Stop jobs"]
  },
  "typed-confirmation": {
    name: "Typed confirmation",
    group: "dialog",
    subject: "acme/payments-api",
    field: "Repository path",
    options: ["acme/payments-api", "acme/billing-api", "DELETE", "wrong/path"]
  },
  "dead-end-empty-state": {
    name: "Dead-end empty state",
    group: "anti",
    subject: "Projects",
    field: "Empty projects",
    options: ["Create project", "Import", "Blank table"]
  },
  "disabled-button-no-explanation": {
    name: "Disabled button",
    group: "anti",
    subject: "Workspace",
    field: "Workspace name",
    options: ["Explain requirement", "Validate on click", "Disabled"]
  },
  "disabled-controls-without-recovery": {
    name: "Disabled controls without recovery",
    group: "anti",
    subject: "Workspace invite",
    field: "Invite teammate",
    options: ["Invite teammate", "Add billing contact", "Request access", "Save draft", "Contact admin"]
  },
  "empty-state": {
    name: "Empty state",
    group: "state",
    subject: "Projects",
    field: "Projects",
    options: ["Create project", "Import", "View sample"]
  },
  "error-state": {
    name: "Error state",
    group: "state",
    subject: "Reports",
    field: "Reports",
    options: ["Retry", "Use cached data", "Contact support"]
  },
  "error-summary": {
    name: "Error summary",
    group: "validation",
    subject: "Account form",
    field: "Email",
    options: ["Email", "Plan", "Team size"]
  },
  "faceted-search": {
    name: "Faceted search",
    group: "search",
    subject: "Pattern results",
    field: "Filters",
    options: ["web", "mobile", "standard", "emerging"]
  },
  "filter-panel": {
    name: "Filter panel",
    group: "search",
    subject: "Case results",
    field: "Filter results",
    options: ["Open", "Appeal", "Urgent", "Last 30 days", "Benefits", "Housing"]
  },
  "filter-reset-that-clears-unrelated-search": {
    name: "Filter reset that clears unrelated search",
    group: "search",
    subject: "Case search results",
    field: "Scoped reset",
    options: ["Clear one filter", "Clear all filters", "Clear search", "Reset draft", "Saved filter"]
  },
  "filter-chips": {
    name: "Filter chips",
    group: "search",
    subject: "Case results",
    field: "Quick filters",
    options: ["Open", "Urgent", "Appeal", "Benefits", "Housing", "Last 30 days"]
  },
  "sort-controls": {
    name: "Sort controls",
    group: "search",
    subject: "Case results",
    field: "Sort by",
    options: ["Relevance", "Due date", "Amount", "Case name"]
  },
  "saved-filter": {
    name: "Saved filter",
    group: "search",
    subject: "Case list",
    field: "Filter presets",
    options: ["High priority", "My open cases", "Needs review", "Save current filters"]
  },
  "saved-search": {
    name: "Saved search",
    group: "search",
    subject: "Work item search",
    field: "Saved searches",
    options: ["Renewal risk", "My blocked reviews", "Open escalations", "Save current criteria"]
  },
  "icon-only-ambiguous-action": {
    name: "Icon-only action",
    group: "anti",
    subject: "Report row",
    field: "Archive",
    options: ["Archive report", "Download", "Share"]
  },
  "inaccessible-custom-select": {
    name: "Custom select",
    group: "anti",
    subject: "Plan",
    field: "Plan",
    options: ["Starter", "Team", "Enterprise"]
  },
  "infinite-spinner": {
    name: "Infinite spinner",
    group: "anti",
    subject: "Billing data",
    field: "Loading",
    options: ["Retry", "Use cached values", "Keep waiting"]
  },
  "loading-spinner": {
    name: "Loading spinner",
    group: "state",
    subject: "Payment request",
    field: "Processing state",
    options: ["Button", "Region", "Overlay", "Resolve", "Timeout"]
  },
  "inline-validation": {
    name: "Inline validation",
    group: "validation",
    subject: "Signup form",
    field: "Email",
    options: ["Email", "Password", "Workspace"]
  },
  "in-page-anchor-navigation": {
    name: "In-page anchor navigation",
    group: "navigation",
    subject: "Application guidance",
    field: "Page sections",
    options: ["Eligibility", "Documents", "Fees", "After you apply"]
  },
  "loading-skeleton": {
    name: "Loading skeleton",
    group: "state",
    subject: "Report list",
    field: "Loading",
    options: ["Loading", "Loaded", "Timeout"]
  },
  "progress-bar": {
    name: "Progress bar",
    group: "state",
    subject: "Evidence upload",
    field: "Upload progress",
    options: ["12%", "64%", "Complete", "Error", "Background"]
  },
  meter: {
    name: "Meter",
    group: "state",
    subject: "Account storage",
    field: "Storage used",
    options: ["Healthy", "Warning", "Critical", "Risk", "Unavailable"]
  },
  "step-progress": {
    name: "Step progress",
    group: "state",
    subject: "Vendor onboarding",
    field: "Workflow stages",
    options: ["Profile", "Documents", "Compliance", "Review", "Finish"]
  },
  "offline-state": {
    name: "Offline state",
    group: "state",
    subject: "Field report",
    field: "Connectivity",
    options: ["Online", "Offline", "Queued", "Reconnecting", "Sync failed"]
  },
  "sync-state": {
    name: "Sync state",
    group: "state",
    subject: "Field report",
    field: "Sync queue",
    options: ["Local saved", "Queued", "Syncing", "Synced", "Failed"]
  },
  "conflict-state": {
    name: "Conflict state",
    group: "state",
    subject: "Field report",
    field: "Conflicting values",
    options: ["Detected", "Compare", "Keep mine", "Keep server", "Merge"]
  },
  "conflict-resolution": {
    name: "Conflict resolution",
    group: "recovery",
    subject: "Field report",
    field: "Resolution workflow",
    options: ["Supervisor comment", "Emergency contact", "Safety note", "Photo attachment", "Resolution CR-2048"]
  },
  "merge-conflict-resolver": {
    name: "Merge conflict resolver",
    group: "recovery",
    subject: "Merge request !428",
    field: "Repository conflicts",
    options: ["src/billing/rules.ts", "Use target main", "Use source feature/billing", "Edit resolved hunk", "Resolution commit"]
  },
  "permission-denied-state": {
    name: "Permission denied state",
    group: "state",
    subject: "Quarterly revenue report",
    field: "Access",
    options: ["Read-only", "Request access", "Switch account", "Contact owner"]
  },
  "permission-recovery": {
    name: "Permission recovery",
    group: "recovery",
    subject: "Quarterly revenue report",
    field: "Access request",
    options: ["Finance viewer", "Request ACC-2048", "Priya Raman", "alex@northwind.example", "Open report"]
  },
  "service-unavailable-page": {
    name: "Service unavailable page",
    group: "state",
    subject: "Benefits application service",
    field: "Service availability",
    options: ["Planned maintenance", "Check status", "Contact support", "Return later"]
  },
  "page-not-found-page": {
    name: "Page not found page",
    group: "state",
    subject: "Benefits service page",
    field: "Missing route",
    options: ["Search service", "Go to start", "Report link", "Check URL"]
  },
  "mega-menu": {
    name: "Mega menu",
    group: "navigation",
    subject: "Product catalog",
    field: "Navigation groups",
    options: ["Products", "Solutions", "Resources", "Partners", "Pricing"]
  },
  "utility-navigation": {
    name: "Utility navigation",
    group: "navigation",
    subject: "Workspace shell",
    field: "Utilities",
    options: ["Search", "Help", "Notifications", "Account", "Sign out"]
  },
  "alert-dialog": {
    name: "Alert dialog",
    group: "dialog",
    subject: "Session lock",
    field: "Security response",
    options: ["Review warning", "Stay signed in", "Sign out", "Escape"]
  },
  drawer: {
    name: "Drawer",
    group: "dialog",
    subject: "Claims review queue",
    field: "Case detail drawer",
    options: ["Claim C-1042", "Claim C-1043", "Pin drawer", "Close drawer"]
  },
  sheet: {
    name: "Sheet",
    group: "dialog",
    subject: "Claim C-1042",
    field: "Follow-up task sheet",
    options: ["Open sheet", "Edit note", "Expand sheet", "Save follow-up"]
  },
  "bottom-sheet": {
    name: "Bottom sheet",
    group: "dialog",
    subject: "Harbor station map",
    field: "Station bottom sheet",
    options: ["Open sheet", "Peek", "Half", "Full", "Close"]
  },
  popover: {
    name: "Popover",
    group: "dialog",
    subject: "Task planning row",
    field: "Due date",
    options: ["Open popover", "Today", "Tomorrow", "Friday", "Custom date"]
  },
  tooltip: {
    name: "Tooltip",
    group: "dialog",
    subject: "Document toolbar",
    field: "Archive button",
    options: ["Archive", "Share", "Copy link", "Escape", "Pointer hover"]
  },
  "tooltip-only-required-information": {
    name: "Tooltip-only required information",
    group: "dialog",
    subject: "Tax credit application",
    field: "Tax ID",
    options: ["Visible help", "Tooltip dismissed", "Validation", "Touch", "Disabled reason"]
  },
  "hover-card": {
    name: "Hover card",
    group: "dialog",
    subject: "Mention and file references",
    field: "@Maya Chen",
    options: ["@Maya Chen", "Forecast.xlsx", "View profile", "Open file", "Escape"]
  },
  "details-panel": {
    name: "Details panel",
    group: "dialog",
    subject: "Support ticket queue",
    field: "TCK-2048",
    options: ["TCK-2048", "TCK-2049", "Collapse", "Open full ticket", "Filter queue"]
  },
  "preview-panel": {
    name: "Preview panel",
    group: "dialog",
    subject: "Project files",
    field: "Forecast.pdf",
    options: ["Forecast.pdf", "Receipt.png", "Next page", "Zoom", "Open full preview"]
  },
  "context-menu": {
    name: "Context menu",
    group: "dialog",
    subject: "Project files",
    field: "Forecast.xlsx",
    options: ["Right click", "Shift F10", "Rename", "Export", "Delete"]
  },
  "modal-dialog": {
    name: "Modal dialog",
    group: "dialog",
    subject: "Account settings",
    field: "Display name",
    options: ["Save", "Cancel", "Escape"]
  },
  "modal-for-nonblocking-content": {
    name: "Modal for nonblocking content",
    group: "dialog",
    subject: "Case review workspace",
    field: "Nonblocking case update",
    options: ["Inline note", "Popover help", "Drawer detail", "Banner status", "Side preview"]
  },
  "drawer-with-no-close-or-return-path": {
    name: "Drawer with no close or return path",
    group: "dialog",
    subject: "Claims review queue",
    field: "Claim details drawer",
    options: ["Close button", "Escape close", "Browser back", "Focus return", "Mobile back"]
  },
  "multi-select": {
    name: "Multi-select",
    group: "choice",
    subject: "Assignees",
    field: "Assignees",
    options: ["Mina Patel", "Oscar Reed", "Priya Shah", "Chen Wei", "Aditi Rao", "Grace Hopper", "Ada Lovelace", "Sam Rivera"]
  },
  "navigation-drawer": {
    name: "Navigation drawer",
    group: "navigation",
    subject: "Mail app",
    field: "Drawer destination",
    options: ["Inbox", "Starred", "Sent", "Drafts", "Settings"]
  },
  "no-results-recovery": {
    name: "No-results recovery",
    group: "search",
    subject: "Search results",
    field: "Search patterns",
    options: ["Modal dialog", "Undo", "Faceted search", "Bottom navigation"]
  },
  pagination: {
    name: "Pagination",
    group: "navigation",
    subject: "Result pages",
    field: "Page",
    options: ["1", "2", "3", "4"]
  },
  "pagination-without-current-page": {
    name: "Pagination without current page",
    group: "navigation",
    subject: "Audit log results",
    field: "Current page state",
    options: ["Current marker", "Result range", "Edge states", "Loading commit", "Out-of-range"]
  },
  "prompt-suggestions": {
    name: "Prompt suggestions",
    group: "ai",
    subject: "AI writing task",
    field: "Prompt",
    options: ["Summarize", "Compare", "Draft reply"]
  },
  "process-list": {
    name: "Process list",
    group: "navigation",
    subject: "Permit application journey",
    field: "Journey steps",
    options: ["Check eligibility", "Prepare documents", "Submit application", "Pay the fee", "Track the decision"]
  },
  "related-links": {
    name: "Related links",
    group: "navigation",
    subject: "Support claim guidance",
    field: "Related destinations",
    options: ["Check eligibility", "Upload evidence", "Appeal a decision", "Benefits calculator"]
  },
  "recently-viewed": {
    name: "Recently viewed",
    group: "navigation",
    subject: "Supplier records",
    field: "Recent records",
    options: ["Atlas Packaging", "Nile Components", "Orion Health", "Tara Logistics"]
  },
  "recently-searched": {
    name: "Recently searched",
    group: "search",
    subject: "Knowledge search",
    field: "Search query",
    options: ["benefit appeal deadline", "housing evidence upload", "debt advice appointment", "claim renewal notice"]
  },
  "search-history": {
    name: "Search history",
    group: "search",
    subject: "Account search activity",
    field: "History controls",
    options: ["Drive: benefit appeal", "Gmail: housing evidence", "Web: debt advice", "YouTube: appeal hearing"]
  },
  "text-input": {
    name: "Text input",
    group: "input",
    subject: "Case reference",
    field: "Reference name",
    options: ["Appeal draft", "Housing file", "Renewal note"]
  },
  "inline-edit": {
    name: "Inline edit",
    group: "input",
    subject: "Resource owner",
    field: "Owner",
    options: ["Maya Chen", "Ops lead", "Unassigned"]
  },
  "autosave-form": {
    name: "Autosave form",
    group: "input",
    subject: "Grant application",
    field: "Application draft",
    options: ["Project title", "Funding category", "Impact statement"]
  },
  "draft-state": {
    name: "Draft state",
    group: "input",
    subject: "Knowledge article",
    field: "Article version",
    options: ["Published article", "Unpublished draft", "Shared changes"]
  },
  "dependent-fields": {
    name: "Dependent fields",
    group: "input",
    subject: "Incident intake",
    field: "Category and subcategory",
    options: ["Category", "Subcategory", "Assignment group"]
  },
  "conditional-reveal-fields": {
    name: "Conditional reveal fields",
    group: "input",
    subject: "Contact preference",
    field: "Contact method",
    options: ["Email", "Phone", "No contact"]
  },
  "required-field-hidden-by-conditional-logic": {
    name: "Required field hidden by conditional logic",
    group: "input",
    subject: "Benefits eligibility form",
    field: "Accommodation request",
    options: ["No accommodation", "Needs accommodation", "Evidence reference"]
  },
  "validation-that-clears-user-input": {
    name: "Validation that clears user input",
    group: "input",
    subject: "Grant application form",
    field: "Project contact",
    options: ["Email", "Phone", "Impact statement"]
  },
  "input-mask": {
    name: "Input mask",
    group: "input",
    subject: "Container release",
    field: "Container reference",
    options: ["ABCD 123456 7", "ABCD1234567", "+44 20 7946 0958"]
  },
  "input-prefix-suffix": {
    name: "Input prefix/suffix",
    group: "input",
    subject: "Payment adjustment",
    field: "Adjustment amount",
    options: ["$1,250", "1250", "12%"]
  },
  "character-count": {
    name: "Character count",
    group: "input",
    subject: "Grant abstract",
    field: "Public summary",
    options: [
      "We need short-term funding to replace unsafe entrance lighting before winter.",
      "Clear issue impact action timeline reviewer owner",
      "This hidden backend limit fails only after submit."
    ]
  },
  "date-input": {
    name: "Date input",
    group: "input",
    subject: "Passport issued date",
    field: "When was your passport issued?",
    options: ["7", "Jan", "1984"]
  },
  "date-picker": {
    name: "Date picker",
    group: "input",
    subject: "Appointment booking",
    field: "Appointment date",
    options: ["2026-07-14", "2026-08-11", "2026-07-18"]
  },
  "date-range-picker": {
    name: "Date range picker",
    group: "input",
    subject: "Analytics report",
    field: "Report date range",
    options: ["2026-08-03", "2026-08-14", "last-7-days"]
  },
  "time-picker": {
    name: "Time picker",
    group: "input",
    subject: "Clinic appointment",
    field: "Appointment time",
    options: ["9:30 AM", "09:30:00", "America/New_York"]
  },
  "file-upload": {
    name: "File upload",
    group: "input",
    subject: "Evidence attachment",
    field: "Upload bank statement",
    options: ["bank-statement.pdf", "PDF, PNG, JPG", "10 MB"]
  },
  "drag-and-drop-upload": {
    name: "Drag-and-drop upload",
    group: "input",
    subject: "Evidence attachment",
    field: "Drop evidence files",
    options: ["lease.pdf", "income-proof.png", "not-a-file-link"]
  },
  "bulk-import": {
    name: "Bulk import",
    group: "input",
    subject: "Team member records",
    field: "Import team members",
    options: ["team-members.csv", "Email, Name, Role, Department", "external_id"]
  },
  "review-before-submit": {
    name: "Review before submit",
    group: "input",
    subject: "Housing benefit claim",
    field: "Check your answers",
    options: ["Applicant", "Contact details", "Evidence", "Declaration"]
  },
  "address-entry": {
    name: "Address entry",
    group: "input",
    subject: "Housing benefit claim",
    field: "Home address",
    options: ["Flat 2, 12 Market Road", "SW1A 1AA", "United Kingdom"]
  },
  "bank-details": {
    name: "Bank details",
    group: "input",
    subject: "Refund payment",
    field: "Bank or building society account details",
    options: ["Alex Chen", "12-34-56", "12345678", "AB 12/345"]
  },
  "payment-card-entry": {
    name: "Payment card entry",
    group: "input",
    subject: "Checkout payment",
    field: "Payment card",
    options: ["4242 4242 4242 4242", "12/30", "123", "10001"]
  },
  checkout: {
    name: "Checkout",
    group: "input",
    subject: "Order ORD-2048",
    field: "Purchase commitment",
    options: ["Cart", "Guest", "Delivery", "Payment", "Review", "Placed"]
  },
  "payment-collection": {
    name: "Payment collection",
    group: "input",
    subject: "Permit fee APP-2048",
    field: "Payment status",
    options: ["Request", "Method", "Action", "Processing", "Failed", "Paid"]
  },
  "password-input": {
    name: "Password input",
    group: "input",
    subject: "Account sign in",
    field: "Password",
    options: ["ada@example.com", "correct horse battery staple", "manager-generated-password-64"]
  },
  "password-creation": {
    name: "Password creation",
    group: "input",
    subject: "Account setup",
    field: "New password",
    options: ["correct horse battery staple", "Password123", "river lantern map orbit"]
  },
  "email-address-entry": {
    name: "Email address entry",
    group: "input",
    subject: "Receipt contact",
    field: "Email address",
    options: ["alex+receipts@example.co.uk", "ada@gmial.com", "name@example.com"]
  },
  "phone-number-entry": {
    name: "Phone number entry",
    group: "input",
    subject: "Appointment contact",
    field: "Phone number",
    options: ["07700 900 982", "+44 808 157 0192", "020 7946 0018 ext 204"]
  },
  "name-entry": {
    name: "Name entry",
    group: "input",
    subject: "Profile details",
    field: "Full name",
    options: ["María-José Carreño Quiñones", "小林康宏", "Dr Samira van der Waals"]
  },
  textarea: {
    name: "Textarea",
    group: "input",
    subject: "Case explanation",
    field: "More detail",
    options: ["I called the office on Monday.\nThey asked me to upload evidence.", "Please review the housing evidence.", "This is a short draft."]
  },
  "single-question-page": {
    name: "Single-question page",
    group: "input",
    subject: "Evidence upload",
    field: "Do you have evidence to upload?",
    options: ["Yes", "No", "Not sure yet"]
  },
  "single-page-form": {
    name: "Single-page form",
    group: "input",
    subject: "Contact details",
    field: "Contact details",
    options: ["Full name", "Email address", "Phone number", "Contact preference"]
  },
  "complete-complex-form": {
    name: "Complete complex form",
    group: "input",
    subject: "Enterprise policy configuration",
    field: "Policy sections",
    options: ["Basics", "Rules", "Approvals", "Notifications", "Review"]
  },
  "multi-step-form": {
    name: "Multi-step form",
    group: "input",
    subject: "Benefit application",
    field: "Application steps",
    options: ["Eligibility", "Contact details", "Documents", "Review", "Submit"]
  },
  wizard: {
    name: "Wizard",
    group: "input",
    subject: "Connector setup",
    field: "Setup steps",
    options: ["Choose connector", "Configure access", "Test connection", "Review", "Finish"]
  },
  typeahead: {
    name: "Typeahead",
    group: "search",
    subject: "Live case lookup",
    field: "Search cases",
    options: ["Case 104 - Benefit appeal", "Case 221 - Housing evidence", "Calendar hearing guide", "Claim renewal notice"]
  },
  "radio-group": {
    name: "Radio group",
    group: "choice",
    subject: "Plan",
    field: "Plan",
    options: ["Starter", "Team", "Enterprise"]
  },
  "search-suggestions": {
    name: "Search suggestions",
    group: "search",
    subject: "Pattern search",
    field: "Search",
    options: ["modal dialog", "modal vs popover", "modal focus trap", "modeless panel"]
  },
  "service-navigation": {
    name: "Service navigation",
    group: "navigation",
    subject: "Apply for support",
    field: "Service sections",
    options: ["Overview", "Applications", "Messages", "Contact"]
  },
  "skip-link": {
    name: "Skip link",
    group: "navigation",
    subject: "Service page",
    field: "Bypass target",
    options: ["Skip to main content", "Header", "Service navigation", "Main content"]
  },
  "step-navigation": {
    name: "Step navigation",
    group: "navigation",
    subject: "Application flow",
    field: "Task steps",
    options: ["Eligibility", "Contact details", "Documents", "Review", "Submit"]
  },
  "side-navigation": {
    name: "Side navigation",
    group: "navigation",
    subject: "Workspace settings",
    field: "Section pages",
    options: ["Account", "Billing", "Security", "Audit log", "Access keys"]
  },
  "segmented-control": {
    name: "Segmented control",
    group: "choice",
    subject: "View mode",
    field: "View",
    options: ["List", "Board", "Calendar"]
  },
  select: {
    name: "Select",
    group: "choice",
    subject: "Service region",
    field: "Region",
    options: ["London", "North East", "North West", "South East", "South West", "West Midlands", "Yorkshire and the Humber", "Scotland", "Wales"]
  },
  tabs: {
    name: "Tabs",
    group: "navigation",
    subject: "Project sections",
    field: "Section",
    options: ["Overview", "Activity", "Settings"]
  },
  accordion: {
    name: "Accordion",
    group: "navigation",
    subject: "Return policy",
    field: "Policy sections",
    options: ["Eligibility", "Proof needed", "Refund timing", "Exceptions"]
  },
  "disclosure-details": {
    name: "Disclosure / details",
    group: "input",
    subject: "Household income",
    field: "Income answer",
    options: ["How we calculate household income", "Eligibility rule", "Guidance page", "Extra help"]
  },
  "progressive-disclosure": {
    name: "Progressive disclosure",
    group: "input",
    subject: "Backup setup",
    field: "Advanced retention",
    options: ["Recommended backup", "Advanced settings", "Encryption", "Diagnostics", "Reset defaults"]
  },
  "toast-only-critical-error": {
    name: "Toast-only error",
    group: "state",
    subject: "Payment",
    field: "Payment status",
    options: ["Retry", "Update card", "Dismiss"]
  },
  undo: {
    name: "Undo",
    group: "recovery",
    subject: "Tasks",
    field: "Deleted item",
    options: ["Inbox cleanup", "Quarterly report", "Vendor renewal"]
  },
  "fake-undo": {
    name: "Fake undo",
    group: "recovery",
    subject: "Shared task list",
    field: "Recovery state",
    options: ["Quarterly report", "Vendor renewal", "Board invite", "Bulk archive"]
  },
  redo: {
    name: "Redo",
    group: "recovery",
    subject: "Document outline",
    field: "Edit history",
    options: ["Overview", "Risk", "Summary", "Appendix"]
  },
  retry: {
    name: "Retry",
    group: "recovery",
    subject: "Report export",
    field: "Retry request",
    options: ["Q2 risk export", "Attempt 1 failed", "Attempt 2 retrying", "Reference EXP-2048"]
  },
  "fallback-path": {
    name: "Fallback path",
    group: "recovery",
    subject: "Address lookup",
    field: "Application route",
    options: ["Postcode SW1A 1AA", "Manual address entry", "Assisted support", "Reference APP-2048"]
  },
  "graceful-degradation": {
    name: "Graceful degradation",
    group: "recovery",
    subject: "Appointment booking",
    field: "Capability layer",
    options: ["Enhanced calendar", "Date text fields", "Location list", "Reference BK-2048"]
  },
  "unsaved-changes-prompt": {
    name: "Unsaved changes prompt",
    group: "recovery",
    subject: "Billing contact",
    field: "Dirty editor",
    options: ["Phone number", "Department", "Samira Lee", "Customer profile"]
  },
  "exit-warning": {
    name: "Exit warning",
    group: "recovery",
    subject: "Grant application",
    field: "Departure guard",
    options: ["Project summary", "Evidence upload", "Review page", "Reference GR-2048"]
  },
  "session-timeout-warning": {
    name: "Session timeout warning",
    group: "recovery",
    subject: "Benefits form",
    field: "Session boundary",
    options: ["Household income answer", "Evidence upload", "Review benefits claim", "Reference SES-2048"]
  },
  "autosave-recovery": {
    name: "Autosave recovery",
    group: "recovery",
    subject: "Benefits form",
    field: "Autosave recovery",
    options: ["Household income answer", "Evidence upload", "Review benefits claim", "Reference ASR-2048"]
  },
  "restore-from-trash": {
    name: "Restore from trash",
    group: "recovery",
    subject: "Deleted files",
    field: "Recovery list",
    options: ["Quarterly budget.xlsx", "Customer exports", "Roadmap draft", "Archive.zip"]
  }
};

export function QualityPanel({
  tone,
  label,
  children
}: {
  tone: "good" | "bad";
  label: string;
  children: ReactNode;
}) {
  return (
    <section className={`quality-panel ${tone}`}>
      <h3>{label}</h3>
      {children}
    </section>
  );
}

export function StateUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (!good) {
    if (patternId === "empty-state") {
      return (
        <div className="bad-state-sample empty-state-bad-ui" aria-label="Unexplained empty table">
          <div className="blank-table-line"></div>
          <div className="blank-table-line"></div>
          <div className="blank-table-line"></div>
        </div>
      );
    }

    if (patternId === "error-state") {
      return (
        <div className="bad-state-sample">
          <div className="demo-toast error-toast-preview">Something went wrong</div>
        </div>
      );
    }

    if (patternId === "toast-only-critical-error") {
      return (
        <div className="toast-only-preview bad-state-sample">
          <button type="button" className="demo-button small">Pay invoice</button>
          <div className="demo-toast error-toast-preview">Payment failed</div>
        </div>
      );
    }

    if (patternId === "alert") {
      return (
        <div className="alert-bad-ui">
          <div className="alert-toast-misuse">Warning</div>
          <div className="alert-work-card">
            <strong>Quarterly filing draft</strong>
            <span>Unsaved answers are still editable.</span>
            <button type="button" className="demo-button small primary">Continue editing</button>
          </div>
          <p className="demo-status">The warning is vague, detached, and behaves like a short-lived toast.</p>
        </div>
      );
    }

    if (patternId === "banner") {
      return (
        <div className="banner-bad-ui">
          <div className="product-shell-preview">
            <div className="product-shell-top">Acme Ops</div>
            <div className="bad-banner-stack">
              <div>Important</div>
              <div>New features</div>
              <div>Payment failed</div>
            </div>
            <div className="product-shell-content">
              <strong>Billing overview</strong>
              <span>Task content is pushed down by stacked broad messages.</span>
            </div>
          </div>
          <p className="demo-status">Unprioritized banners compete for attention and hide the workspace context.</p>
        </div>
      );
    }

    if (patternId === "notification-banner") {
      return (
        <div className="notification-banner-bad-ui">
          <div className="service-page-preview">
            <h3>Manage evidence</h3>
            <div className="bad-notification-banner validation">Fix errors before continuing.</div>
            <div className="service-page-card">
              <strong>Evidence upload</strong>
              <span>No field links or page-flow priority are provided.</span>
            </div>
          </div>
          <p className="demo-status">The validation message appears after the heading and does not link users to fields.</p>
        </div>
      );
    }

    if (patternId === "site-alert") {
      return (
        <div className="site-alert-bad-ui">
          <div className="site-alert-page-preview">
            <div className="site-alert-header">Benefits service</div>
            <div className="bad-site-alert-stack">
              <div>Emergency closure</div>
              <div>Newsletter sign-up</div>
              <div>Fix form errors</div>
            </div>
            <main className="site-alert-page-body">
              <strong>Apply for support</strong>
              <span>Users must sort through unrelated top-of-site messages before the task.</span>
            </main>
          </div>
          <p className="demo-status">The alert area is stacked with unrelated marketing and validation content.</p>
        </div>
      );
    }

    if (patternId === "consent-prompt") {
      return (
        <div className="consent-prompt-bad-ui">
          <div className="consent-service-preview">
            <div className="consent-service-top">Research workspace</div>
            <section className="consent-prompt-card bad" aria-label="Broken consent prompt">
              <div>
                <strong>Help us improve your experience</strong>
                <span>By continuing, you agree to research, personalized offers, partner sharing, and AI training.</span>
              </div>
              <div className="consent-prompt-actions">
                <button type="button" className="demo-button small primary">Continue</button>
                <a href="#privacy">Privacy policy</a>
              </div>
            </section>
            <div className="consent-record-grid bad">
              <div>
                <span>Runtime</span>
                <strong>Optional processing already started</strong>
              </div>
              <div>
                <span>Record</span>
                <strong>accepted=true, no purpose version</strong>
              </div>
            </div>
          </div>
          <p className="demo-status">The UI bundles purposes, treats continuing as consent, hides decline, and cannot prove a specific affirmative opt-in.</p>
        </div>
      );
    }

    if (patternId === "cookie-banner") {
      return (
        <div className="cookie-banner-bad-ui">
          <div className="cookie-service-preview">
            <div className="cookie-service-top">Benefits service</div>
            <section className="cookie-banner-card bad" aria-label="Broken cookie banner">
              <div>
                <strong>We value your privacy</strong>
                <span>Click accept to get the best experience.</span>
              </div>
              <div className="cookie-banner-actions">
                <button type="button" className="demo-button small primary">Accept all</button>
                <a href="#settings">Settings</a>
              </div>
            </section>
            <div className="cookie-runtime-panel bad">
              <strong>Runtime</strong>
              <span>Analytics and advertising scripts already loaded before a choice.</span>
            </div>
          </div>
          <p className="demo-status">The UI asks for consent after optional tracking has already started and does not offer an equal reject action.</p>
        </div>
      );
    }

    if (patternId === "cookie-consent") {
      return (
        <div className="cookie-consent-bad-ui">
          <div className="cookie-consent-runtime">
            <div className="cookie-consent-top">Benefits service consent runtime</div>
            <section className="cookie-consent-card bad" aria-label="Broken cookie consent">
              <div>
                <strong>Improve your experience</strong>
                <span>Analytics, personalization, and advertising are already running while the page asks for consent.</span>
              </div>
              <div className="cookie-consent-evidence-grid">
                <span><b>Runtime</b>Tags fired before choice</span>
                <span><b>Record</b>accepted=true only</span>
                <span><b>Signal</b>Ignored</span>
                <span><b>Choices</b>Preselected optional purposes</span>
              </div>
              <div className="cookie-consent-actions">
                <button type="button" className="demo-button small primary">Accept all</button>
                <a href="#privacy">Privacy policy</a>
              </div>
            </section>
          </div>
          <p className="demo-status">The broken UI asks for consent after optional tracking has already started and records no purpose-level evidence.</p>
        </div>
      );
    }

    if (patternId === "phase-beta-banner") {
      return (
        <div className="phase-banner-bad-ui">
          <div className="phase-service-preview">
            <div className="phase-service-top">Benefits service</div>
            <div className="phase-service-nav">Overview | Apply | Messages</div>
            <section className="phase-banner-card bad" aria-label="Broken phase banner">
              <strong>Beta</strong>
              <span>New features are here. Try them now.</span>
              <button type="button" className="demo-button small">Dismiss</button>
            </section>
            <div className="phase-service-body">
              <strong>Apply for support</strong>
              <span>No service maturity, phase owner, or route-aware feedback is shown.</span>
            </div>
          </div>
          <p className="demo-status">The UI treats Beta as a dismissible promotional badge instead of a service-wide maturity and feedback marker.</p>
        </div>
      );
    }

    if (patternId === "notification-center") {
      return (
        <div className="notification-center-bad-ui">
          <div className="notification-center-shell">
            <div className="notification-center-topbar">
              <strong>Ops workspace</strong>
              <button type="button" aria-label="Notifications, 42 unread">Bell 42</button>
            </div>
            <div className="bad-notification-center-list">
              <div>Done</div>
              <div>Done</div>
              <div>Done</div>
              <div>Payment failed</div>
            </div>
          </div>
          <p className="demo-status">The count, repeated items, and vague messages give no triage path or durable context.</p>
        </div>
      );
    }

    if (patternId === "warning-text") {
      return (
        <div className="warning-text-bad-ui">
          <div className="warning-text-form">
            <h4>Submit application</h4>
            <label className="warning-text-check">
              <input type="checkbox" />
              I confirm the details are correct.
            </label>
            <button type="button" className="demo-button small primary">Submit</button>
            <p className="bad-warning-after-action">Important: penalties may apply.</p>
          </div>
          <p className="demo-status">The consequence appears after the action and is too vague to change behavior.</p>
        </div>
      );
    }

    if (patternId === "success-confirmation") {
      return (
        <div className="success-confirmation-bad-ui">
          <div className="success-confirmation-workspace">
            <h4>Evidence upload</h4>
            <div className="bad-success-strip">Done</div>
            <button type="button" className="demo-button small primary">Continue</button>
          </div>
          <p className="demo-status">The success message does not name the file, receipt, timestamp, or next step.</p>
        </div>
      );
    }

    if (patternId === "confirmation-page") {
      return (
        <div className="confirmation-page-bad-ui">
          <div className="confirmation-page-frame bad">
            <div className="bad-confirmation-strip">Done</div>
            <div className="confirmation-page-section compact">
              <strong>Application details</strong>
              <span>No reference, next step, contact path, or saved record is visible.</span>
              <button type="button" className="demo-button small">Continue</button>
            </div>
          </div>
          <p className="demo-status">The endpoint does not prove the transaction or explain what happens next.</p>
        </div>
      );
    }

    if (patternId === "toast-notification") {
      return (
        <div className="toast-demo-shell toast-bad-ui">
          <button type="button" className="demo-button small">Save profile</button>
          <div className="toast-stack" aria-label="Broken toast stack">
            <div className="toast-card bad critical">Payment failed. Contact support with ERR-82731 before closing this screen.</div>
            <div className="toast-card bad">Done</div>
            <div className="toast-card bad">Updated</div>
            <div className="toast-card bad">Synced</div>
          </div>
          <p className="demo-status">Long, vague, and critical messages cover the task and will disappear.</p>
        </div>
      );
    }

    if (patternId === "toast-only-success-for-completed-transaction") return <ToastOnlySuccessTransactionBadUi />;

    if (patternId === "inline-message") {
      return (
        <div className="inline-message-bad-ui">
          <div className="inline-message-detached">Important: check something before continuing.</div>
          <div className="invoice-row-preview">
            <strong>Invoice INV-2048</strong>
            <span>Acme Retail</span>
            <button type="button" className="demo-button small">Send</button>
          </div>
          <p className="demo-status">The message is detached from the invoice and does not name the affected condition.</p>
        </div>
      );
    }

    if (patternId === "progress-bar") {
      return (
        <div className="progress-bar-bad-ui" aria-label="Misleading progress">
          <div className="progress-bar-job-card bad">
            <div className="progress-bar-track fake" aria-hidden="true">
              <span style={{ width: "100%" }}></span>
            </div>
            <strong>100%</strong>
            <span>Still scanning evidence.zip</span>
            <button type="button" className="demo-button small primary">Leave page</button>
          </div>
          <p className="demo-status">The bar says complete before server acceptance and does not name the operation in the progress element.</p>
        </div>
      );
    }

    if (patternId === "meter") {
      return (
        <div className="meter-bad-ui" aria-label="Broken storage meter">
          <div className="meter-card bad">
            <div className="meter-label-row">
              <strong>Usage</strong>
              <span>89%</span>
            </div>
            <div className="meter-track bad" aria-hidden="true">
              <span style={{ width: "89%" }}></span>
              <i className="meter-thumb" aria-hidden="true"></i>
            </div>
            <button type="button" className="demo-button small primary">Drag to fix</button>
          </div>
          <p className="demo-status">The gauge lacks max, unit, threshold meaning, and looks editable even though storage used is read-only.</p>
        </div>
      );
    }

    if (patternId === "step-progress") {
      return (
        <div className="step-progress-bad-ui" aria-label="Broken onboarding step progress">
          <div className="step-progress-card bad">
            <ol className="step-progress-list bad" aria-label="Visited onboarding pages">
              {["Profile", "Documents", "Compliance", "Review", "Finish"].map((step) => (
                <li className="is-complete" key={step}>
                  <span aria-hidden="true"></span>
                  <strong>{step}</strong>
                  <em>Done</em>
                </li>
              ))}
            </ol>
            <button type="button" className="demo-button small primary">Finish onboarding</button>
          </div>
          <p className="demo-status">Every visited stage looks complete even though documents failed and review cannot start.</p>
        </div>
      );
    }

    if (patternId === "offline-state") {
      return (
        <div className="offline-state-bad-ui" aria-label="Broken offline field report">
          <div className="offline-card bad">
            <div className="offline-topline">
              <strong>Saved</strong>
              <span className="offline-chip bad">Online</span>
            </div>
            <p>Report submitted.</p>
            <div className="offline-actions">
              <button type="button" className="demo-button small primary">Close report</button>
              <button type="button" className="demo-button small">Upload photos</button>
            </div>
          </div>
          <p className="demo-status">The UI claims server success while the device is offline and gives no queue, cache, or reconnect state.</p>
        </div>
      );
    }

    if (patternId === "sync-state") {
      return (
        <div className="sync-state-bad-ui" aria-label="Broken sync field report">
          <div className="sync-card bad">
            <div className="sync-topline">
              <div>
                <strong>Field report synced</strong>
                <span>All changes saved to server.</span>
              </div>
              <span className="sync-chip bad">Synced</span>
            </div>
            <div className="sync-queue">
              <div className="sync-row">
                <span>Inspection note</span>
                <strong>Done</strong>
              </div>
              <div className="sync-row muted">
                <span>Photos and signature</span>
                <strong>Hidden queue</strong>
              </div>
            </div>
            <div className="sync-actions">
              <button type="button" className="demo-button small primary">Close report</button>
              <button type="button" className="demo-button small">Open server copy</button>
            </div>
          </div>
          <p className="demo-status">The UI claims remote acceptance while some local changes are still pending and gives no item-level retry or review path.</p>
        </div>
      );
    }

    if (patternId === "conflict-state") {
      return (
        <div className="conflict-state-bad-ui" aria-label="Broken conflict resolution">
          <div className="conflict-card bad">
            <div className="conflict-topline">
              <div>
                <strong>Report saved</strong>
                <span>Latest version was kept automatically.</span>
              </div>
              <span className="conflict-chip bad">Resolved</span>
            </div>
            <div className="conflict-version-stack">
              <div className="conflict-value muted">
                <span>Supervisor comment</span>
                <strong>Server value kept</strong>
                <small>Your offline edit is no longer shown.</small>
              </div>
            </div>
            <div className="conflict-actions">
              <button type="button" className="demo-button small primary">Continue</button>
              <button type="button" className="demo-button small">Retry save</button>
            </div>
          </div>
          <p className="demo-status">The UI silently chooses a winner and hides the competing local value, so the user cannot review or recover it.</p>
        </div>
      );
    }

    if (patternId === "permission-denied-state") {
      return (
        <div className="permission-state-bad-ui" aria-label="Broken permission denied state">
          <div className="permission-card bad">
            <div className="permission-topline">
              <div>
                <strong>Could not open report</strong>
                <span>Something went wrong. Try again.</span>
              </div>
              <span className="permission-chip bad">Error</span>
            </div>
            <div className="permission-row muted">
              <span>Access</span>
              <strong>Unknown</strong>
              <small>No current account, owner, role, or request path is shown.</small>
            </div>
            <div className="permission-actions">
              <button type="button" className="demo-button small primary">Retry</button>
              <button type="button" className="demo-button small">Back</button>
            </div>
          </div>
          <p className="demo-status">The UI treats a known access boundary as a retryable failure and gives no recovery path.</p>
        </div>
      );
    }

    if (patternId === "permission-recovery") {
      return (
        <div className="permission-recovery-bad-ui" aria-label="Broken permission recovery">
          <div className="permission-card bad">
            <div className="permission-topline">
              <div>
                <strong>Request sent</strong>
                <span>You should have access now.</span>
              </div>
              <span className="permission-chip bad">Unverified</span>
            </div>
            <div className="permission-row muted">
              <span>Request status</span>
              <strong>No owner decision</strong>
              <small>No requested role, reason, owner, request ID, pending state, or return path is shown.</small>
            </div>
            <div className="permission-actions">
              <button type="button" className="demo-button small primary">Retry report</button>
              <button type="button" className="demo-button small">Send again</button>
            </div>
          </div>
          <p className="demo-status">The broken recovery flow treats request submission as approval and sends users into retry or duplicate-request loops.</p>
        </div>
      );
    }

    if (patternId === "service-unavailable-page") {
      return (
        <div className="service-unavailable-page-bad-ui" aria-label="Broken service unavailable page">
          <div className="service-unavailable-card bad">
            <div className="service-unavailable-topline">
              <div>
                <strong>503</strong>
                <span>Something went wrong.</span>
              </div>
              <span className="service-unavailable-chip bad">Error</span>
            </div>
            <div className="service-unavailable-row muted">
              <span>What happens next</span>
              <strong>Try again</strong>
              <small>No return time, saved-work status, affected task, support route, or incident reference is shown.</small>
            </div>
            <div className="service-unavailable-actions">
              <button type="button" className="demo-button small primary">Refresh now</button>
              <button type="button" className="demo-button small">Go home</button>
            </div>
          </div>
          <p className="demo-status">The page hides service scope and recovery timing, so users can only retry blindly.</p>
        </div>
      );
    }

    if (patternId === "page-not-found-page") {
      return (
        <div className="page-not-found-page-bad-ui" aria-label="Broken page not found page">
          <div className="not-found-card bad">
            <div className="not-found-topline">
              <div>
                <strong>404</strong>
                <span>Nothing here.</span>
              </div>
              <span className="not-found-chip bad">Error</span>
            </div>
            <div className="not-found-row muted">
              <span>Next step</span>
              <strong>Home</strong>
              <small>No service identity, likely cause, search, current-task route, contact path, or broken-link reporting is provided.</small>
            </div>
            <div className="not-found-actions">
              <button type="button" className="demo-button small primary">Home</button>
              <button type="button" className="demo-button small" disabled>Search</button>
            </div>
          </div>
          <p className="demo-status">The page leaves users with a code and an escape hatch, but no way to recover the missing route.</p>
        </div>
      );
    }

    if (patternId === "loading-spinner") {
      return (
        <div className="loading-spinner-bad-ui" aria-label="Unscoped payment wait">
          <div className="loading-spinner-payment-card">
            <strong>Payment request</strong>
            <span>Invoice PAY-2048</span>
            <div className="loading-spinner-blank" aria-hidden="true">
              <span className="spinner-only"></span>
            </div>
            <button type="button" className="demo-button small primary">Pay again</button>
          </div>
          <p className="demo-status">The spinner has no label, the payment scope is unclear, and duplicate submit remains available.</p>
        </div>
      );
    }

    if (patternId === "loading-skeleton") {
      return (
        <div className="bad-state-sample skeleton-bad-ui">
          <button type="button" className="fake-skeleton-control">Open report</button>
          <button type="button" className="fake-skeleton-control">Export CSV</button>
          <p className="demo-status">Focusable fake controls; no timeout.</p>
        </div>
      );
    }

    return (
      <div className="bad-state-sample">
        {patternId.includes("spinner") || patternId === "loading-skeleton" ? <span className="spinner-only"></span> : <strong>{patternId === "error-state" ? "Error" : ""}</strong>}
      </div>
    );
  }

  if (patternId === "alert") {
    return (
      <div className="alert-demo-shell">
        <div className="alert-work-card">
          <strong>Quarterly filing draft</strong>
          <span>12 answers saved locally. Session expires soon.</span>
          <button type="button" className="demo-button small primary">Continue editing</button>
        </div>
        <div className="task-alert-card warning">
          <div className="task-alert-message" role="alert">
            <strong>Session expires in 2 minutes</strong>
            <span>Save the draft now or renew the session before continuing.</span>
          </div>
          <button type="button">Save draft</button>
        </div>
        <p className="demo-status">The alert stays in the task area, names the consequence, and offers one next step.</p>
      </div>
    );
  }

  if (patternId === "banner") {
    return (
      <div className="banner-demo-shell">
        <div className="product-shell-preview">
          <div className="product-shell-top">Acme Ops</div>
          <div className="product-banner-card warning" role="region" aria-label="Billing workspace notice">
            <div>
              <strong>Scheduled maintenance Saturday</strong>
              <span>Billing exports and payment runs pause from 01:00 to 03:00 UTC.</span>
            </div>
            <button type="button">View schedule</button>
          </div>
          <div className="product-shell-content">
            <strong>Billing overview</strong>
            <span>The banner applies across Billing, Invoices, and Payments.</span>
          </div>
        </div>
        <p className="demo-status">The banner sits below product chrome, above affected content, and names its broad scope.</p>
      </div>
    );
  }

  if (patternId === "notification-banner") {
    return (
      <div className="notification-banner-demo-shell">
        <div className="service-page-preview">
          <div className="service-crumb">Application evidence</div>
          <section className="notification-banner-card success" role="alert" aria-label="Success notification">
            <div className="notification-banner-title">Success</div>
            <div className="notification-banner-content">
              <strong>Evidence uploaded</strong>
              <span>Receipt EV-2048 is ready. Continue checking the application evidence.</span>
              <button type="button">View evidence</button>
            </div>
          </section>
          <h3>Manage evidence</h3>
          <div className="service-page-card">
            <strong>Current evidence</strong>
            <span>The notification sits before the heading and confirms the previous page outcome.</span>
          </div>
        </div>
        <p className="demo-status">The success notification appears before the H1 because it confirms a previous-page action while the service journey continues.</p>
      </div>
    );
  }

  if (patternId === "site-alert") {
    return (
      <div className="site-alert-demo-shell">
        <div className="site-alert-page-preview">
          <section className="site-alert-card emergency" role="region" aria-label="Site alert: Emergency office closures">
            <div className="site-alert-icon" aria-hidden="true">!</div>
            <div className="site-alert-copy">
              <strong>Emergency office closures</strong>
              <span>All offices are closed today because of severe weather. Use phone service or reschedule appointments.</span>
              <a href="#status">View affected offices</a>
            </div>
          </section>
          <div className="site-alert-header">Benefits service</div>
          <main className="site-alert-page-body">
            <strong>Application status</strong>
            <span>The sitewide alert appears before every page route, not just the home page.</span>
          </main>
        </div>
        <p className="demo-status">The site alert is full-width, near the top, and visible before users start any site page.</p>
      </div>
    );
  }

  if (patternId === "consent-prompt") {
    return (
      <div className="consent-prompt-demo-shell">
        <div className="consent-service-preview">
          <div className="consent-service-top">
            <strong>Research workspace</strong>
            <span>Optional data use</span>
          </div>
          <section className="consent-prompt-card" role="region" aria-label="Consent for follow-up research">
            <div>
              <strong>Join follow-up research</strong>
              <span>Do you consent to Product Research using your email address and survey answers to invite you to one interview about this beta?</span>
            </div>
            <div className="consent-purpose-grid">
              <span><b>Requester</b>Product Research</span>
              <span><b>Data</b>Email and survey answers</span>
              <span><b>Purpose</b>One beta interview invitation</span>
              <span><b>Withdrawal</b>Privacy settings anytime</span>
            </div>
            <div className="consent-prompt-actions">
              <button type="button" className="demo-button small primary">Yes, I consent</button>
              <button type="button" className="demo-button small">No thanks</button>
              <a href="#consent-details">Read details</a>
            </div>
          </section>
          <div className="consent-record-grid">
            <div>
              <span>Runtime</span>
              <strong>Follow-up contact is off until opt-in</strong>
            </div>
            <div>
              <span>Consent record</span>
              <strong>purpose=research-follow-up, version=2026-06</strong>
            </div>
          </div>
        </div>
        <p className="demo-status">The consent prompt names requester, data, purpose, optionality, decline path, withdrawal route, and consent record before the user chooses.</p>
      </div>
    );
  }

  if (patternId === "cookie-banner") {
    return (
      <div className="cookie-banner-demo-shell">
        <div className="cookie-service-preview">
          <div className="cookie-service-top">Benefits service</div>
          <section className="cookie-banner-card" role="region" aria-label="Cookies on Benefits service">
            <div>
              <strong>Cookies on Benefits service</strong>
              <span>We use essential cookies to make this service work. We would also like to use analytics cookies to improve it.</span>
            </div>
            <div className="cookie-banner-actions">
              <button type="button" className="demo-button small primary">Accept analytics cookies</button>
              <button type="button" className="demo-button small">Reject analytics cookies</button>
              <a href="#cookies">View cookies</a>
            </div>
          </section>
          <div className="cookie-runtime-grid">
            <div>
              <span>Essential</span>
              <strong>On for security and session</strong>
            </div>
            <div>
              <span>Analytics</span>
              <strong>Waiting for choice</strong>
            </div>
          </div>
        </div>
        <p className="demo-status">The banner explains essential and analytics cookies, gives accept and reject actions at the same level, and holds optional storage until consent.</p>
      </div>
    );
  }

  if (patternId === "cookie-consent") {
    type CookieConsentMode =
      | "pre"
      | "necessary"
      | "acceptAll"
      | "rejectAll"
      | "granular"
      | "vendors"
      | "record"
      | "returning"
      | "withdrawal"
      | "renewal"
      | "expired"
      | "signal"
      | "nojs"
      | "runtimeMismatch"
      | "mobile";
    const [mode, setMode] = useState<CookieConsentMode>("pre");
    const [analytics, setAnalytics] = useState(false);
    const [personalization, setPersonalization] = useState(false);
    const [ads, setAds] = useState(false);
    const config: Record<CookieConsentMode, {
      title: string;
      body: string;
      chip: string;
      runtime: string;
      record: string;
      signal: string;
      primary: string;
      secondary: string;
      status: string;
      tone?: "ready" | "warning" | "danger";
      showChoices?: boolean;
      compact?: boolean;
    }> = {
      pre: {
        title: "Pre-consent blocked",
        body: "Analytics, advertising, personalization, pixels, local storage, and SDK tags are blocked until a matching purpose is accepted.",
        chip: "Pre-consent",
        runtime: "Optional tags blocked",
        record: "No consent record",
        signal: "No browser signal",
        primary: "Manage purposes",
        secondary: "Reject all",
        status: "Pre-consent state proves optional storage is off before the user chooses.",
        tone: "warning"
      },
      necessary: {
        title: "Strictly necessary separated",
        body: "Security, load balancing, and session cookies are listed separately and are not presented as optional consent toggles.",
        chip: "Necessary",
        runtime: "Essential only",
        record: "Essential classification logged",
        signal: "Signal not needed",
        primary: "View optional purposes",
        secondary: "Reject optional",
        status: "Strictly necessary storage is explained without pretending users can disable required service cookies."
      },
      acceptAll: {
        title: "Accept all optional purposes",
        body: "Accept all enables analytics, personalization, and advertising only after the explicit action.",
        chip: "Accepted all",
        runtime: "All optional tags allowed",
        record: "analytics=yes, personalization=yes, ads=yes, version=2026-06",
        signal: "No conflict",
        primary: "Save all",
        secondary: "Change choices",
        status: "Accept-all state updates purpose-level runtime and record together.",
        tone: "ready"
      },
      rejectAll: {
        title: "Reject all optional purposes",
        body: "Reject all keeps the service usable with essential storage only and records purpose-level refusal.",
        chip: "Rejected all",
        runtime: "Optional tags blocked",
        record: "analytics=no, personalization=no, ads=no, version=2026-06",
        signal: "No conflict",
        primary: "Review choices",
        secondary: "Keep rejected",
        status: "Reject-all state has comparable effort and does not block service access.",
        tone: "ready"
      },
      granular: {
        title: "Granular purpose choices",
        body: "Optional categories start off and can be saved separately by purpose.",
        chip: "Granular",
        runtime: "Matches selected purposes",
        record: "Purpose choices pending",
        signal: "No conflict",
        primary: "Save choices",
        secondary: "Reject all",
        status: "Granular state separates analytics, personalization, and advertising choices.",
        showChoices: true
      },
      vendors: {
        title: "Vendor and tag details",
        body: "Users can inspect which analytics, advertising, SDK, and pixel tags belong to each optional purpose before saving.",
        chip: "Vendor details",
        runtime: "Tags mapped to purposes",
        record: "Vendor list version 14",
        signal: "No conflict",
        primary: "Open vendor list",
        secondary: "Back to purposes",
        status: "Vendor details make the runtime owner and tag category inspectable."
      },
      record: {
        title: "Saved consent record",
        body: "The record stores purpose, version, timestamp, region, source surface, browser signal, and withdrawal route.",
        chip: "Record",
        runtime: "Consent enforced",
        record: "EU, v2026-06, banner, 00:43 IST",
        signal: "Stored with record",
        primary: "View record",
        secondary: "Change choices",
        status: "Saved record state proves the UI does not store only accepted=true.",
        tone: "ready"
      },
      returning: {
        title: "Return visit applies stored preferences",
        body: "The service loads stored consent before optional scripts and keeps the banner hidden until renewal is needed.",
        chip: "Return visit",
        runtime: "Stored preferences applied",
        record: "Loaded before tag manager",
        signal: "Checked on load",
        primary: "Open cookie settings",
        secondary: "Renew consent",
        status: "Return-visit state proves consent enforcement happens before optional tags load."
      },
      withdrawal: {
        title: "Withdrawal stops optional storage",
        body: "Saving withdrawal updates the record and blocks future optional tags instead of only changing visible copy.",
        chip: "Withdrawal",
        runtime: "Optional tags stopped",
        record: "Withdrawn at 00:43 IST",
        signal: "No conflict",
        primary: "Save withdrawal",
        secondary: "Keep current",
        status: "Withdrawal state keeps changing consent as easy as giving it.",
        tone: "warning"
      },
      renewal: {
        title: "Renewal for new purpose",
        body: "A new advertising partner or purpose makes old consent stale before the new tag can run.",
        chip: "Renewal",
        runtime: "New purpose blocked",
        record: "v2026-06 stale for ads-v2",
        signal: "No conflict",
        primary: "Review new purpose",
        secondary: "Reject new purpose",
        status: "Renewal state prevents new purposes from inheriting old consent.",
        tone: "warning"
      },
      expired: {
        title: "Expired consent",
        body: "Consent older than the review period is treated as expired and optional tags remain blocked until refreshed.",
        chip: "Expired",
        runtime: "Optional tags paused",
        record: "Expired after review window",
        signal: "No conflict",
        primary: "Refresh choices",
        secondary: "Reject all",
        status: "Expired state handles time-based review without silently extending consent.",
        tone: "warning"
      },
      signal: {
        title: "Browser privacy signal",
        body: "A Global Privacy Control or similar signal conflicts with advertising, so ad tags stay blocked even when other purposes are allowed.",
        chip: "Signal",
        runtime: "Advertising blocked",
        record: "GPC=true recorded",
        signal: "Do not sell/share",
        primary: "Honor signal",
        secondary: "View details",
        status: "Signal state treats browser privacy preference as an enforcement input, not decoration.",
        tone: "danger"
      },
      nojs: {
        title: "No-JavaScript form",
        body: "A server-side form accepts or rejects optional purposes before any client tag manager runs.",
        chip: "No JS",
        runtime: "Server waits for form",
        record: "Saved after POST",
        signal: "Checked server-side",
        primary: "Submit choices",
        secondary: "Submit reject all",
        status: "No-JavaScript state keeps cookie consent functional without client scripts."
      },
      runtimeMismatch: {
        title: "Runtime mismatch blocked",
        body: "The inspector detects an ad pixel trying to run while advertising consent is off and blocks it.",
        chip: "Mismatch",
        runtime: "Ad pixel blocked",
        record: "ads=no",
        signal: "Conflict logged",
        primary: "Block tag",
        secondary: "Open audit",
        status: "Runtime mismatch state verifies actual storage and tag behavior against the consent record.",
        tone: "danger"
      },
      mobile: {
        title: "Mobile compact consent",
        body: "Purpose choices, reject all, save, withdrawal, and record status stay reachable in a compact stack.",
        chip: "Mobile",
        runtime: "Compact controls",
        record: "Same version",
        signal: "Visible",
        primary: "Save choices",
        secondary: "Reject all",
        status: "Mobile compact state keeps the consent model usable without horizontal scrolling.",
        compact: true,
        showChoices: true
      }
    };
    const item = config[mode];
    const chooseMode = (next: CookieConsentMode) => {
      if (next === "acceptAll") {
        setAnalytics(true);
        setPersonalization(true);
        setAds(true);
      }
      if (next === "rejectAll" || next === "withdrawal" || next === "signal" || next === "runtimeMismatch") {
        setAnalytics(false);
        setPersonalization(false);
        setAds(false);
      }
      setMode(next);
    };
    return (
      <div className={`quality-example cookie-consent-demo-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`}>
        <div className="cookie-consent-runtime">
          <div className="cookie-consent-top">
            <strong>Cookie consent runtime</strong>
            <span>{item.chip}</span>
          </div>
          <section className="cookie-consent-card" aria-label={item.title}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </div>
            {item.showChoices ? (
              <div className="cookie-consent-purpose-list">
                <label><input type="checkbox" checked readOnly /> Strictly necessary <span>Required for security and session</span></label>
                <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.currentTarget.checked)} /> Analytics <span>Service measurement only</span></label>
                <label><input type="checkbox" checked={personalization} onChange={(event) => setPersonalization(event.currentTarget.checked)} /> Personalization <span>Remember display choices</span></label>
                <label><input type="checkbox" checked={ads} onChange={(event) => setAds(event.currentTarget.checked)} /> Advertising <span>Off unless explicitly selected</span></label>
              </div>
            ) : null}
            <div className="cookie-consent-evidence-grid" aria-label="Cookie consent evidence">
              <span><b>Runtime</b>{item.runtime}</span>
              <span><b>Record</b>{item.record}</span>
              <span><b>Signal</b>{item.signal}</span>
              <span><b>Current choices</b>{`analytics=${analytics ? "yes" : "no"}, personalization=${personalization ? "yes" : "no"}, ads=${ads ? "yes" : "no"}`}</span>
            </div>
            <div className="cookie-consent-actions">
              <button type="button" className="demo-button small primary" onClick={() => chooseMode(mode === "granular" || mode === "mobile" ? "record" : mode === "pre" ? "granular" : "acceptAll")}>{item.primary}</button>
              <button type="button" className="demo-button small" onClick={() => chooseMode(mode === "acceptAll" ? "granular" : "rejectAll")}>{item.secondary}</button>
              <button type="button" className="demo-button small" onClick={() => chooseMode("withdrawal")}>Withdraw</button>
              <button type="button" className="demo-button small" onClick={() => chooseMode("runtimeMismatch")}>Audit tags</button>
            </div>
          </section>
        </div>
        <div className="demo-row cookie-consent-controls" aria-label="Cookie consent exercise controls">
          {([
            ["pre", "Pre-consent blocked"],
            ["necessary", "Strictly necessary"],
            ["acceptAll", "Accept all"],
            ["rejectAll", "Reject all"],
            ["granular", "Granular purposes"],
            ["vendors", "Vendor details"],
            ["record", "Saved consent record"],
            ["returning", "Return visit"],
            ["withdrawal", "Withdrawal"],
            ["renewal", "Renewal"],
            ["expired", "Expired consent"],
            ["signal", "Browser privacy signal"],
            ["nojs", "No-JavaScript form"],
            ["runtimeMismatch", "Runtime mismatch"],
            ["mobile", "Mobile compact consent"]
          ] as Array<[CookieConsentMode, string]>).map(([key, label]) => (
            <button type="button" key={key} className={mode === key ? "demo-button small primary" : "demo-button small"} onClick={() => chooseMode(key)}>{label}</button>
          ))}
        </div>
        <p className="demo-status" aria-live="polite">{item.status}</p>
      </div>
    );
  }

  if (patternId === "cookie-consent") {
    return (
      <div className="cookie-consent-demo-shell">
        <div className="cookie-consent-runtime">
          <div className="cookie-consent-top">
            <strong>Benefits service consent runtime</strong>
            <span>Purpose-level consent</span>
          </div>
          <section className="cookie-consent-card" role="region" aria-label="Cookie consent purpose choices">
            <div>
              <strong>Choose optional cookie purposes</strong>
              <span>Strictly necessary storage is always on. Analytics, personalization, and advertising stay off until selected.</span>
            </div>
            <div className="cookie-consent-purpose-list">
              <label><input type="checkbox" checked readOnly /> Strictly necessary <span>Required for sign-in and security</span></label>
              <label><input type="checkbox" /> Analytics <span>Measure service use</span></label>
              <label><input type="checkbox" /> Personalization <span>Remember display choices</span></label>
              <label><input type="checkbox" /> Advertising <span>Off unless explicitly selected</span></label>
            </div>
            <div className="cookie-consent-actions">
              <button type="button" className="demo-button small primary">Save choices</button>
              <button type="button" className="demo-button small">Reject all</button>
              <button type="button" className="demo-button small">Vendor details</button>
            </div>
          </section>
          <div className="cookie-consent-evidence-grid">
            <span><b>Runtime</b>Optional tags blocked before consent</span>
            <span><b>Record</b>Purpose, version, region, timestamp</span>
            <span><b>Signal</b>Checked before advertising</span>
            <span><b>Withdrawal</b>Cookie settings link remains available</span>
          </div>
        </div>
        <p className="demo-status">Cookie consent UI exposes purpose-level choices and runtime enforcement, not just a first-layer banner.</p>
      </div>
    );
  }

  if (patternId === "cookie-consent") {
    type Mode = "trackingFirst" | "preselected" | "hiddenReject" | "flagOnly" | "consentWall" | "signalIgnored" | "stalePurpose";
    const [mode, setMode] = useState<Mode>("trackingFirst");
    const copy: Record<Mode, string> = {
      trackingFirst: "Tracking-before-choice starts optional storage before the consent state can permit it.",
      preselected: "Preselected purposes turn the settings layer into default acceptance.",
      hiddenReject: "Hidden reject-all makes refusal harder than acceptance.",
      flagOnly: "Accepted-flag-only records cannot prove purpose, version, region, timestamp, or withdrawal state.",
      consentWall: "Consent wall blocks service access even though refusal should still allow the requested service.",
      signalIgnored: "Signal ignored lets advertising tags run despite a browser privacy signal.",
      stalePurpose: "Stale purpose lets a new advertising purpose inherit old consent without renewal."
    };
    const rows: Record<Mode, [string, string, string, string]> = {
      trackingFirst: ["Analytics fired", "Ad pixel fired", "No choice yet", "Runtime invalid"],
      preselected: ["Analytics on", "Ads on", "Personalization on", "Default bias"],
      hiddenReject: ["Accept prominent", "Reject buried", "Privacy link only", "Unequal effort"],
      flagOnly: ["accepted=true", "No purpose", "No version", "No withdrawal"],
      consentWall: ["Page blocked", "Reject unavailable", "Access tied", "Coerced choice"],
      signalIgnored: ["GPC=true", "Ads loaded", "Conflict ignored", "Audit failed"],
      stalePurpose: ["New vendor", "Old version", "No refresh", "Ads running"]
    };
    const [runtime, record, signal, result] = rows[mode];
    return (
      <div className={`quality-example cookie-consent-bad-ux is-${mode}`}>
        <div className="cookie-consent-runtime">
          <div className="cookie-consent-top">
            <strong>Cookie consent failure</strong>
            <span>{mode}</span>
          </div>
          <section className="cookie-consent-card bad" aria-label={`Broken cookie consent: ${mode}`}>
            <div>
              <strong>{mode === "trackingFirst" ? "Consent requested after tags run" : mode === "preselected" ? "Optional purposes preselected" : mode === "hiddenReject" ? "Reject all hidden" : mode === "flagOnly" ? "Boolean-only record" : mode === "consentWall" ? "Consent wall" : mode === "signalIgnored" ? "Browser signal ignored" : "Stale purpose reused"}</strong>
              <span>{copy[mode]}</span>
            </div>
            <div className="cookie-consent-evidence-grid">
              <span><b>Runtime</b>{runtime}</span>
              <span><b>Record</b>{record}</span>
              <span><b>Signal</b>{signal}</span>
              <span><b>Result</b>{result}</span>
            </div>
            <div className="cookie-consent-actions">
              <button type="button" className="demo-button small primary">{mode === "flagOnly" ? "Store true" : "Accept all"}</button>
              {mode === "hiddenReject" ? <a href="#privacy">Other options</a> : <button type="button" className="demo-button small">Save</button>}
            </div>
          </section>
        </div>
        <div className="demo-row cookie-consent-controls" aria-label="Cookie consent misuse controls">
          <button type="button" className={mode === "trackingFirst" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("trackingFirst")}>Tracking-before-choice</button>
          <button type="button" className={mode === "preselected" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("preselected")}>Preselected purposes</button>
          <button type="button" className={mode === "hiddenReject" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenReject")}>Hidden reject all</button>
          <button type="button" className={mode === "flagOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("flagOnly")}>Accepted-flag-only</button>
          <button type="button" className={mode === "consentWall" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("consentWall")}>Consent wall</button>
          <button type="button" className={mode === "signalIgnored" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("signalIgnored")}>Signal ignored</button>
          <button type="button" className={mode === "stalePurpose" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stalePurpose")}>Stale purpose</button>
        </div>
        <p className="demo-status" aria-live="polite">{copy[mode]}</p>
      </div>
    );
  }

  if (patternId === "phase-beta-banner") {
    return (
      <div className="phase-banner-demo-shell">
        <div className="phase-service-preview">
          <div className="phase-service-top">Benefits service</div>
          <div className="phase-service-nav">Overview | Apply | Messages</div>
          <section className="phase-banner-card" aria-label="Service phase">
            <strong>Beta</strong>
            <span>This is a new service. Help us improve it and <a href="#feedback">give feedback about this page</a>.</span>
          </section>
          <div className="phase-service-body">
            <strong>Apply for support</strong>
            <span>The phase banner sits after service navigation and appears across service pages.</span>
          </div>
        </div>
        <p className="demo-status">The banner labels service maturity, keeps a feedback route visible, and does not replace ordinary operational messages.</p>
      </div>
    );
  }

  if (patternId === "notification-center") {
    return (
      <div className="notification-center-demo-shell">
        <div className="notification-center-shell">
          <div className="notification-center-topbar">
            <strong>Ops workspace</strong>
            <button type="button" aria-label="Notifications, 3 new">
              Bell <span>3</span>
            </button>
          </div>
          <aside className="notification-center-panel" aria-label="Notification center">
            <div className="notification-center-panel-head">
              <strong>Notifications</strong>
              <span>3 unread</span>
            </div>
            <div className="notification-center-tabs" role="group" aria-label="Notification filters">
              <button type="button" className="demo-button small primary">Unread</button>
              <button type="button" className="demo-button small">All</button>
            </div>
            <div className="notification-center-item unread">
              <strong>Mina mentioned you</strong>
              <span>PR-482 review request - 4 min ago</span>
              <button type="button">Open PR</button>
            </div>
            <div className="notification-center-item unread">
              <strong>Export is ready</strong>
              <span>June invoices CSV - 12 min ago</span>
              <button type="button">Download</button>
            </div>
          </aside>
        </div>
        <p className="demo-status">The center keeps notifications available after arrival and lets users filter and act later.</p>
      </div>
    );
  }

  if (patternId === "warning-text") {
    return (
      <div className="warning-text-demo-shell">
        <div className="warning-text-form">
          <h4>Submit declaration</h4>
          <div className="warning-text-card" role="note" aria-label="Warning: financial penalty">
            <span className="warning-text-icon" aria-hidden="true">!</span>
            <strong><span className="visually-hidden">Warning: </span>You may be fined if you give false information.</strong>
          </div>
          <label className="warning-text-check">
            <input type="checkbox" />
            I confirm the information is complete and correct.
          </label>
          <button type="button" className="demo-button small primary">Submit declaration</button>
        </div>
        <p className="demo-status">The warning sits before the declaration and states the consequence before the action.</p>
      </div>
    );
  }

  if (patternId === "success-confirmation") {
    return (
      <div className="success-confirmation-demo-shell">
        <div className="success-confirmation-workspace">
          <h4>Evidence upload</h4>
          <div className="success-confirmation-card" role="status" aria-live="polite">
            <span className="success-confirmation-icon" aria-hidden="true">✓</span>
            <div>
              <strong>Evidence uploaded</strong>
              <span>bank-statement.pdf was accepted at 14:32. Receipt EV-2048 is ready.</span>
            </div>
            <button type="button">View receipt</button>
          </div>
          <div className="success-confirmation-task">
            <strong>Evidence checklist</strong>
            <span>1 of 3 required files received.</span>
            <button type="button" className="demo-button small primary">Continue review</button>
          </div>
        </div>
        <p className="demo-status">The confirmation names the uploaded file, gives proof, and leaves one next step.</p>
      </div>
    );
  }

  if (patternId === "confirmation-page") {
    return (
      <div className="confirmation-page-demo-shell">
        <div className="confirmation-page-frame">
          <section className="confirmation-page-panel" aria-label="Application complete">
            <span aria-hidden="true">✓</span>
            <div>
              <h4>Application complete</h4>
              <p>Your reference number is <strong>APP-48291</strong>.</p>
            </div>
          </section>
          <div className="confirmation-page-grid">
            <div className="confirmation-page-section">
              <strong>What happens next</strong>
              <span>The grants team will email a decision within 5 working days.</span>
            </div>
            <div className="confirmation-page-section">
              <strong>Keep a record</strong>
              <span>Save this page or copy the reference if you contact support.</span>
              <button type="button" className="demo-button small">Save record</button>
            </div>
          </div>
        </div>
        <p className="demo-status">The endpoint names the completed transaction, shows proof, and explains the next step.</p>
      </div>
    );
  }

  if (patternId === "progress-bar") {
    return (
      <div className="progress-bar-demo-shell">
        <div className="progress-bar-job-card" aria-busy="true" aria-describedby="progress-bar-good-helper">
          <div className="progress-bar-card-head">
            <div>
              <strong>Uploading evidence.zip</strong>
              <span>32 of 50 MB transferred</span>
            </div>
            <span className="progress-bar-value">64%</span>
          </div>
          <div
            className="progress-bar-track"
            role="progressbar"
            aria-label="Uploading evidence.zip"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={64}
            aria-valuetext="64 percent, 32 of 50 MB transferred"
          >
            <span style={{ width: "64%" }}></span>
          </div>
          <div className="progress-bar-helper" id="progress-bar-good-helper">
            <span>Uploading</span>
            <span>About 14 seconds left</span>
          </div>
          <button type="button" className="demo-button small">Cancel upload</button>
        </div>
        <p className="demo-status">The bar is labeled, scoped to the file, exposes a determinate value, and keeps the cancellation path available.</p>
      </div>
    );
  }

  if (patternId === "meter") {
    return (
      <div className="meter-demo-shell">
        <div className="meter-card" aria-describedby="meter-good-helper">
          <div className="meter-label-row">
            <div>
              <strong id="meter-good-label">Account storage</strong>
              <span>86 GB of 100 GB used</span>
            </div>
            <em className="meter-chip critical">Critical</em>
          </div>
          <div
            className="meter-track"
            role="meter"
            aria-labelledby="meter-good-label"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={86}
            aria-valuetext="86 GB of 100 GB used, critical storage range"
          >
            <span style={{ width: "86%" }}></span>
          </div>
          <div className="meter-scale" id="meter-good-helper">
            <span>0 GB</span>
            <span>70 GB warning</span>
            <span>90 GB critical</span>
            <span>100 GB</span>
          </div>
          <button type="button" className="demo-button small primary">Manage storage</button>
        </div>
        <p className="demo-status">The meter is read-only, names the bounded resource, exposes value text, and labels warning and critical thresholds.</p>
      </div>
    );
  }

  if (patternId === "step-progress") {
    const steps = [
      { label: "Profile", status: "Complete", tone: "complete", detail: "Saved at 14:20" },
      { label: "Documents", status: "Current", tone: "current", detail: "Upload certificate" },
      { label: "Compliance", status: "Waiting", tone: "waiting", detail: "Starts after document scan" },
      { label: "Review", status: "Blocked", tone: "blocked", detail: "Needs accepted documents" },
      { label: "Finish", status: "Pending", tone: "pending", detail: "Not available yet" }
    ];

    return (
      <div className="step-progress-demo-shell">
        <div className="step-progress-card" aria-describedby="step-progress-good-helper">
          <ol className="step-progress-list" aria-label="Vendor onboarding progress">
            {steps.map((step, index) => (
              <li className={`is-${step.tone}`} aria-current={step.tone === "current" ? "step" : undefined} key={step.label}>
                <span aria-hidden="true">{step.tone === "complete" ? "✓" : index + 1}</span>
                <strong>{step.label}</strong>
                <em>{step.status}</em>
              </li>
            ))}
          </ol>
          <div className="step-progress-summary" id="step-progress-good-helper">
            <strong>Step 2 of 5: Documents</strong>
            <span>Profile is saved. Review is blocked until the certificate upload is accepted.</span>
          </div>
          <button type="button" className="demo-button small primary">Upload certificate</button>
        </div>
        <p className="demo-status">The status strip separates saved, current, waiting, blocked, and pending stages without acting as the flow itself.</p>
      </div>
    );
  }

  if (patternId === "offline-state") {
    return (
      <div className="offline-state-demo-shell">
        <div className="offline-card">
          <div className="offline-topline">
            <div>
              <strong>Offline: field report is saved on this device</strong>
              <span>Last server sync 10:42. 3 edits and 2 photos are queued.</span>
            </div>
            <span className="offline-chip">No internet</span>
          </div>
          <div className="offline-grid">
            <div>
              <strong>Available</strong>
              <span>Edit notes, review cached asset history, export local copy.</span>
            </div>
            <div>
              <strong>Waiting</strong>
              <span>Submit report, upload photos, refresh customer data.</span>
            </div>
          </div>
          <div className="offline-actions">
            <button type="button" className="demo-button small primary">Retry connection</button>
            <button type="button" className="demo-button small">Export local copy</button>
            <button type="button" className="demo-button small" disabled>Submit when online</button>
          </div>
        </div>
        <p className="demo-status">The card names offline scope, local save location, queued work, cached timestamp, and unavailable online-only actions.</p>
      </div>
    );
  }

  if (patternId === "sync-state") {
    const rows = [
      { item: "Inspection note", status: "Synced", tone: "synced", detail: "Server accepted at 11:08" },
      { item: "Photo set", status: "Syncing", tone: "syncing", detail: "2 of 5 photos uploaded" },
      { item: "Meter reading", status: "Queued", tone: "queued", detail: "Saved locally at 11:06" },
      { item: "Customer signature", status: "Failed", tone: "failed", detail: "Retry upload keeps local file" },
      { item: "Supervisor comment", status: "Review", tone: "conflict", detail: "Server copy changed at 11:07" }
    ];

    return (
      <div className="sync-state-demo-shell">
        <div className="sync-card" aria-describedby="sync-state-good-helper">
          <div className="sync-topline">
            <div>
              <strong>Field report sync queue</strong>
              <span>Local copy preserved. Last accepted server update 11:08.</span>
            </div>
            <span className="sync-chip syncing">2 of 5 syncing</span>
          </div>
          <div className="sync-progress-strip" aria-hidden="true">
            <span style={{ width: "46%" }}></span>
          </div>
          <div className="sync-queue" aria-label="Field report sync queue">
            {rows.map((row) => (
              <div className={`sync-row is-${row.tone}`} key={row.item}>
                <span>{row.item}</span>
                <strong>{row.status}</strong>
                <small>{row.detail}</small>
              </div>
            ))}
          </div>
          <div className="sync-actions">
            <button type="button" className="demo-button small primary">Retry failed item</button>
            <button type="button" className="demo-button small">Review conflict</button>
            <button type="button" className="demo-button small">Export local copy</button>
          </div>
        </div>
        <p className="demo-status" id="sync-state-good-helper">The queue separates local saved, queued, syncing, synced, failed, and review-needed work instead of hiding reconciliation behind one status.</p>
      </div>
    );
  }

  if (patternId === "conflict-state") {
    return (
      <div className="conflict-state-demo-shell">
        <div className="conflict-card" aria-describedby="conflict-state-good-helper">
          <div className="conflict-topline">
            <div>
              <strong>Conflict: supervisor comment</strong>
              <span>Your offline edit and Mina's server edit changed the same field.</span>
            </div>
            <span className="conflict-chip review">Review needed</span>
          </div>
          <div className="conflict-version-grid" aria-label="Conflicting supervisor comment values">
            <div className="conflict-value mine">
              <span>Your edit - device saved 11:06</span>
              <strong>Valve pressure rose after restart. Schedule inspection before close.</strong>
              <small>From offline field report on this device.</small>
            </div>
            <div className="conflict-value theirs">
              <span>Mina's server edit - saved 11:07</span>
              <strong>Valve pressure stable after restart. Inspection can happen tomorrow.</strong>
              <small>Current server version from live report.</small>
            </div>
          </div>
          <div className="conflict-preview">
            <strong>Resolved preview</strong>
            <span>Merge both comments or choose one side before saving the server copy.</span>
          </div>
          <div className="conflict-actions">
            <button type="button" className="demo-button small primary">Merge manually</button>
            <button type="button" className="demo-button small">Keep mine</button>
            <button type="button" className="demo-button small">Keep server</button>
            <button type="button" className="demo-button small">Save local copy</button>
          </div>
        </div>
        <p className="demo-status" id="conflict-state-good-helper">The conflict surface preserves both values, names each source, explains the overlap, and makes every resolution action explicit.</p>
      </div>
    );
  }

  if (patternId === "permission-denied-state") {
    return (
      <div className="permission-state-demo-shell">
        <div className="permission-card" aria-describedby="permission-state-good-helper">
          <div className="permission-topline">
            <div>
              <strong>Access needed for Quarterly revenue report</strong>
              <span>Signed in as alex@northwind.example with Analyst access.</span>
            </div>
            <span className="permission-chip denied">Viewer required</span>
          </div>
          <div className="permission-grid">
            <div className="permission-row">
              <span>Current access</span>
              <strong>Analyst workspace member</strong>
              <small>Can view dashboards, not finance reports.</small>
            </div>
            <div className="permission-row">
              <span>Required access</span>
              <strong>Finance viewer</strong>
              <small>Owner: Priya Raman, Finance Ops.</small>
            </div>
          </div>
          <div className="permission-request-box">
            <strong>Request message</strong>
            <span>Need the report to reconcile Q2 renewal forecast before Friday review.</span>
          </div>
          <div className="permission-actions">
            <button type="button" className="demo-button small primary">Request access</button>
            <button type="button" className="demo-button small">Switch account</button>
            <button type="button" className="demo-button small">Open dashboards</button>
          </div>
        </div>
        <p className="demo-status" id="permission-state-good-helper">The state names the safe object, current account, required role, owner path, request reason, and an allowed fallback.</p>
      </div>
    );
  }

  if (patternId === "permission-recovery") {
    return (
      <div className="permission-recovery-demo-shell">
        <div className="permission-card" aria-describedby="permission-recovery-good-helper">
          <div className="permission-topline">
            <div>
              <strong>Request {meta.options[0]} access</strong>
              <span>{meta.subject} is blocked for {meta.options[3]}. Recovery keeps the report return path attached.</span>
            </div>
            <span className="permission-chip pending">Request path</span>
          </div>
          <div className="permission-grid">
            <div className="permission-row">
              <span>Requested role</span>
              <strong>{meta.options[0]}</strong>
              <small>Needed to view forecast worksheets.</small>
            </div>
            <div className="permission-row">
              <span>Owner route</span>
              <strong>{meta.options[2]}</strong>
              <small>Receives request reason and target report.</small>
            </div>
          </div>
          <div className="permission-recovery-timeline" aria-label="Permission recovery timeline">
            <span className="is-done">Denied</span>
            <span className="is-current">Reason</span>
            <span>Owner review</span>
            <span>Resume</span>
          </div>
          <div className="permission-request-box">
            <strong>Reason to owner</strong>
            <span>Need Q2 renewal forecast before Friday review. Request ID will be {meta.options[1]}.</span>
          </div>
          <div className="permission-actions">
            <button type="button" className="demo-button small primary">Send request</button>
            <button type="button" className="demo-button small">Switch account</button>
            <button type="button" className="demo-button small">Open allowed dashboard</button>
          </div>
        </div>
        <p className="demo-status" id="permission-recovery-good-helper">The recovery workflow captures role, reason, owner route, pending status, and the original report return path before access is retried.</p>
      </div>
    );
  }

  if (patternId === "service-unavailable-page") {
    return (
      <div className="service-unavailable-page-demo-shell">
        <div className="service-unavailable-card" aria-describedby="service-unavailable-good-helper">
          <div className="service-unavailable-topline">
            <div>
              <strong>Benefits application service unavailable</strong>
              <span>Planned maintenance from 22:00 to 01:00 today.</span>
            </div>
            <span className="service-unavailable-chip planned">Maintenance</span>
          </div>
          <div className="service-unavailable-grid">
            <div className="service-unavailable-row">
              <span>Return time</span>
              <strong>Use this service after 01:00</strong>
              <small>Last updated 21:45. Next update if the window changes.</small>
            </div>
            <div className="service-unavailable-row">
              <span>Your work</span>
              <strong>Draft answers are saved for 30 days</strong>
              <small>Reference BEN-2048 remains attached to your account.</small>
            </div>
          </div>
          <div className="service-unavailable-support">
            <strong>Need to report an urgent change?</strong>
            <span>Call the Benefits helpline or use the emergency change form while the online service is closed.</span>
          </div>
          <div className="service-unavailable-actions">
            <button type="button" className="demo-button small primary">Check service status</button>
            <button type="button" className="demo-button small">Contact support</button>
            <button type="button" className="demo-button small">Return to GOV tasks</button>
          </div>
        </div>
        <p className="demo-status" id="service-unavailable-good-helper">The page names the service scope, planned window, saved-work impact, status route, and urgent support fallback.</p>
      </div>
    );
  }

  if (patternId === "page-not-found-page") {
    return (
      <div className="page-not-found-page-demo-shell">
        <div className="not-found-card" aria-describedby="page-not-found-good-helper">
          <div className="not-found-topline">
            <div>
              <strong>Page not found</strong>
              <span>Benefits service could not find /benefits/change-bank-details.</span>
            </div>
            <span className="not-found-chip route">404 route</span>
          </div>
          <div className="not-found-grid">
            <div className="not-found-row">
              <span>Possible cause</span>
              <strong>The address may be mistyped or the page moved</strong>
              <small>Check the full web address if you typed or pasted it.</small>
            </div>
            <div className="not-found-row">
              <span>Recover</span>
              <strong>Search benefits or return to your account</strong>
              <small>Signed-in users can continue from current applications.</small>
            </div>
          </div>
          <div className="not-found-search" role="search">
            <label htmlFor="not-found-static-search">Search this service</label>
            <div>
              <input id="not-found-static-search" value="change bank details" readOnly />
              <button type="button" className="demo-button small primary">Search</button>
            </div>
          </div>
          <div className="not-found-link-list" aria-label="Page not found recovery links">
            <a href="#start">Start benefits application</a>
            <a href="#account">Go to account dashboard</a>
            <a href="#report">Report this broken link</a>
          </div>
        </div>
        <p className="demo-status" id="page-not-found-good-helper">The page keeps service identity, explains address and moved-page causes, offers search and task recovery, and avoids revealing private-resource details.</p>
      </div>
    );
  }

  if (patternId === "loading-spinner") {
    return (
      <div className="loading-spinner-demo-shell">
        <div className="loading-spinner-payment-card is-busy" aria-busy="true" aria-label="Payment PAY-2048 processing">
          <div className="loading-spinner-card-head">
            <div>
              <strong>Payment request</strong>
              <span>Reference PAY-2048</span>
            </div>
            <span className="loading-spinner-chip">Short wait</span>
          </div>
          <div className="loading-spinner-status" role="status" aria-live="polite">
            <span className="spinner-only small" aria-hidden="true"></span>
            <span>Processing payment PAY-2048</span>
          </div>
          <div className="loading-spinner-actions">
            <button type="button" className="demo-button small primary" disabled>Pay $240.00</button>
            <button type="button" className="demo-button small">Cancel</button>
          </div>
        </div>
        <p className="demo-status">The spinner is labeled, scoped to the payment region, and prevents a second submit while the action is busy.</p>
      </div>
    );
  }

  if (patternId === "loading-skeleton") {
    return (
      <div className="skeleton-region-preview" aria-busy="true" aria-label="Reports loading preview">
        {[0, 1, 2].map((item) => (
          <div className="skeleton-report-card" key={item} aria-hidden="true">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-stack">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        ))}
        <p className="demo-status">Loading report cards...</p>
      </div>
    );
  }

  if (patternId === "empty-state") {
    return (
      <div className="demo-empty compact-empty empty-state-panel">
        <span className="empty-state-icon" aria-hidden="true"></span>
        <h3>No projects yet</h3>
        <p>Start by creating a project or importing existing work.</p>
        <div className="demo-row">
          <button type="button" className="demo-button small primary">Create project</button>
          <button type="button" className="demo-button small">Import CSV</button>
        </div>
      </div>
    );
  }

  if (patternId === "error-state") {
    return (
      <div className="demo-error compact error-state-panel" role="alert">
        <strong>Reports could not load</strong>
        <p>Keep filter: Q2 risk. Try again or open cached results.</p>
        <div className="demo-row">
          <button type="button" className="demo-button small primary">Retry</button>
          <button type="button" className="demo-button small">Use cached data</button>
        </div>
      </div>
    );
  }

  if (patternId === "toast-only-critical-error") {
    return (
      <div className="demo-error compact critical-error-panel" role="alert">
        <strong>Invoice payment failed</strong>
        <p>Card ending 4242 was declined. The invoice is still unpaid.</p>
        <div className="demo-row">
          <button type="button" className="demo-button small primary">Retry payment</button>
          <button type="button" className="demo-button small">Update card</button>
        </div>
      </div>
    );
  }

  if (patternId === "toast-only-success-for-completed-transaction") return <ToastOnlySuccessTransactionGoodUi />;

  if (patternId === "toast-notification") {
    return (
      <div className="toast-demo-shell">
        <div className="toast-task-card">
          <strong>April invoices export</strong>
          <span>Working area stays usable while status appears.</span>
          <button type="button" className="demo-button small primary">Keep editing</button>
        </div>
        <div className="toast-stack" role="status" aria-live="polite" aria-label="Recent status messages">
          <div className="toast-card success">
            <strong>Export started</strong>
            <span>April invoices are queued.</span>
            <button type="button">View jobs</button>
          </div>
          <div className="toast-card info">
            <strong>Profile saved</strong>
            <span>Changes are now current.</span>
            <button type="button" aria-label="Dismiss Profile saved toast">x</button>
          </div>
        </div>
        <p className="toast-history-note">Export status will remain in job history after the toast closes.</p>
      </div>
    );
  }

  if (patternId === "inline-message") {
    return (
      <div className="inline-message-demo">
        <div className="invoice-row-preview">
          <strong>Invoice INV-2048</strong>
          <span>Acme Retail - $4,820 due Friday</span>
          <button type="button" className="demo-button small primary">Send invoice</button>
        </div>
        <div className="inline-message-card warning" role="status" aria-live="polite">
          <strong>Billing contact missing</strong>
          <span>Add a billing contact before sending this invoice to Acme Retail.</span>
          <button type="button">Add contact</button>
        </div>
        <p className="demo-status">The message stays in the invoice row context and exposes one local action.</p>
      </div>
    );
  }

  return (
    <div className={patternId === "error-state" || patternId === "toast-only-critical-error" ? "demo-error" : "demo-empty"}>
      <h3>{patternId === "error-state" ? `${meta.subject} could not load` : patternId === "toast-only-critical-error" ? "Payment failed" : `No ${meta.subject.toLowerCase()} yet`}</h3>
      <p>{patternId === "empty-state" ? "Start with a clear next action." : "Keep the state visible."}</p>
      <button type="button" className="demo-button small">{meta.options[0]}</button>
    </div>
  );
}

export function BrokenCustomSelect({ meta }: { meta: PatternMeta }) {
  const [open, setOpen] = useState(false);
  const [visualValue, setVisualValue] = useState(meta.options[1]);
  const [formValue, setFormValue] = useState("");
  const [status, setStatus] = useState("Visual value is Team; submitted value is empty.");
  return (
    <div className="quality-example broken-select-panel">
      <div className="fake-select" onClick={() => { setOpen(!open); setStatus(open ? "Closed by click; focus and submitted value are still unmanaged." : "Opened by pointer only; keyboard contract is missing."); }}>
        <span>{visualValue}</span>
        <span>v</span>
      </div>
      {open && (
        <div className="fake-options">
          {meta.options.map((item) => (
            <div
              key={item}
              onClick={() => {
                setVisualValue(item);
                setStatus(`${item} appears selected, but the hidden form value is still "${formValue || "empty"}".`);
                setOpen(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
      <input type="hidden" value={formValue} onChange={(event) => setFormValue(event.target.value)} />
      <div className="demo-row">
        <button type="button" className="demo-button small" onClick={() => setStatus("Arrow keys do nothing because options are not real focusable choices.")}>Try keyboard</button>
        <button type="button" className="demo-button small" onClick={() => setStatus(`Submitting sends "${formValue || "empty"}", not the visible value "${visualValue}".`)}>Submit form</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

export type ToastOnlySuccessTransactionMode =
  | "receipt"
  | "supplementalToast"
  | "toastExpired"
  | "copyReference"
  | "saveReceipt"
  | "emailReceipt"
  | "trackStatus"
  | "bookmarkReturn"
  | "startAnother"
  | "duplicateGuard"
  | "pendingNotSuccess"
  | "failedNotSuccess"
  | "printReceipt"
  | "amendCancel"
  | "mobileReceipt";

export type ToastOnlySuccessTransactionBadMode =
  | "disappearedProof"
  | "noReference"
  | "dashboardRedirect"
  | "falseCommit"
  | "screenReaderTimeout"
  | "duplicateSubmit"
  | "genericDone"
  | "lostBookingDetails";

export function ToastOnlySuccessTransactionPanel({ mode, idSuffix = "main" }: { mode: ToastOnlySuccessTransactionMode; idSuffix?: string }) {
  const reference = mode === "mobileReceipt" ? "MBL-48291" : "APP-48291";
  const showToast = mode === "supplementalToast";
  const isPending = mode === "pendingNotSuccess";
  const isFailed = mode === "failedNotSuccess";
  const heading = isPending ? "Application still pending" : isFailed ? "Application not submitted" : "Benefit application complete";
  const status = {
    receipt: `Completed transaction proof is durable: reference ${reference}, receipt, and what happens next remain visible.`,
    supplementalToast: "A short toast confirms the page update, but the receipt is the authoritative success signal.",
    toastExpired: "Toast expired; the completed transaction still has a reference, receipt, and next steps.",
    copyReference: `Copy reference is available without depending on a disappearing message: ${reference}.`,
    saveReceipt: "Save receipt keeps the completed transaction proof after the page is closed.",
    emailReceipt: "Email receipt sends the reference and what happens next to the applicant.",
    trackStatus: "Track status opens from the receipt and keeps the completed transaction context.",
    bookmarkReturn: "Bookmark return restores the same receipt instead of a blank dashboard.",
    startAnother: "Starting another transaction does not replace the completed receipt.",
    duplicateGuard: "Duplicate-submit guard disables resubmission after the authoritative success signal.",
    pendingNotSuccess: "Pending-not-success: queued or processing state does not claim completed transaction success.",
    failedNotSuccess: "Failed-not-success: payment or permission failure moves to recovery instead of success.",
    printReceipt: "Print receipt includes reference, applicant, timestamp, and what happens next.",
    amendCancel: "Amend or cancel path explains what can still change after completion.",
    mobileReceipt: "Mobile receipt stacks reference, receipt actions, and next steps without relying on a toast."
  }[mode];
  const proofLabel = isPending ? "Processing" : isFailed ? "Submission blocked" : "Receipt";
  const nextStep = isPending
    ? "We will not show success until the server commits the transaction."
    : isFailed
      ? "Fix payment or permission before trying again."
      : "Decision email due within 5 working days.";
  const toneClass = isPending ? "is-neutral" : isFailed ? "is-warn" : "is-safe";

  return (
    <div className={`toast-only-success-shell ${toneClass}`}>
      {showToast && (
        <div className="toast-only-success-toast" role="status" aria-live="polite">
          Application submitted. Receipt is on this page.
        </div>
      )}
      <section className="toast-only-success-panel" aria-labelledby={`toast-success-heading-${idSuffix}`}>
        <div className="toast-only-success-header">
          <span aria-hidden="true">{isFailed ? "!" : isPending ? "..." : "OK"}</span>
          <div>
            <h4 id={`toast-success-heading-${idSuffix}`}>{heading}</h4>
            <p>{status}</p>
          </div>
        </div>
        <div className="toast-only-success-grid">
          <div>
            <strong>{proofLabel}</strong>
            <span>{isPending || isFailed ? "No receipt number is issued yet." : `Reference ${reference}`}</span>
          </div>
          <div>
            <strong>What happens next</strong>
            <span>{nextStep}</span>
          </div>
          <div>
            <strong>Record</strong>
            <span>{isPending || isFailed ? "Draft details are preserved for recovery." : "Copy, save, print, or email receipt."}</span>
          </div>
          <div>
            <strong>Recovery</strong>
            <span>{isFailed ? "Retry or contact support with the failed attempt ID." : "Track, amend, cancel, or start another request."}</span>
          </div>
        </div>
        <div className="toast-only-success-actions">
          <button type="button" disabled={isPending || isFailed}>Copy reference</button>
          <button type="button" disabled={isPending || isFailed}>Save receipt</button>
          <button type="button" disabled={isPending || isFailed}>Track status</button>
          <button type="button" disabled={mode === "duplicateGuard" || isPending || isFailed}>
            {mode === "duplicateGuard" ? "Submit locked" : "Submit again"}
          </button>
        </div>
      </section>
    </div>
  );
}

export function ToastOnlySuccessTransactionBadPanel({ mode }: { mode: ToastOnlySuccessTransactionBadMode }) {
  const message = {
    disappearedProof: "The only success proof disappeared with the toast; no receipt remains.",
    noReference: "The page says success but no reference, receipt, or what happens next is visible.",
    dashboardRedirect: "The completed transaction redirects to a dashboard that cannot prove what was submitted.",
    falseCommit: "Success appears before the server commits, so a later failure contradicts it.",
    screenReaderTimeout: "Screen reader users get a short live-region announcement with no persistent equivalent.",
    duplicateSubmit: "The form still looks submittable, so a second click can create a duplicate transaction.",
    genericDone: "Done does not name the transaction, applicant, amount, reference, or result.",
    lostBookingDetails: "Booking date, place, and confirmation number were only in the vanished toast."
  }[mode];
  const toastText = mode === "genericDone" ? "Done" : mode === "screenReaderTimeout" ? "Application sent" : "Success";

  return (
    <div className={`toast-only-success-shell bad is-${mode}`}>
      <div className="toast-only-success-bad-workspace">
        <strong>{mode === "dashboardRedirect" ? "Account dashboard" : "Benefit application"}</strong>
        <span>{message}</span>
        <button type="button" className="demo-button small primary">
          {mode === "duplicateSubmit" ? "Submit again still visible" : "Continue"}
        </button>
      </div>
      <div className="toast-only-success-toast bad" role="status" aria-live="polite">
        {toastText}
      </div>
      <div className="toast-only-success-missing">
        <span>No durable completed transaction receipt</span>
        <span>No reference to copy</span>
        <span>No saved what happens next</span>
      </div>
    </div>
  );
}

export function ToastOnlySuccessTransactionGoodUi() {
  return (
    <div className="toast-only-success-demo">
      <ToastOnlySuccessTransactionPanel mode="receipt" idSuffix="good-ui" />
      <p className="demo-status">The completed transaction does not rely on toast-only success; durable proof remains in the page.</p>
    </div>
  );
}

export function ToastOnlySuccessTransactionBadUi() {
  return (
    <div className="toast-only-success-bad-ui">
      <ToastOnlySuccessTransactionBadPanel mode="disappearedProof" />
      <p className="demo-status">The only success confirmation is a toast, so users lose proof of the completed transaction.</p>
    </div>
  );
}

export function short(value: string) {
  return value.length > 10 ? `${value.slice(0, 8)}...` : value;
}
