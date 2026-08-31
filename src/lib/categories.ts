export const categoryDescriptions: Record<string, string> = {
  "AI And Automation UX": "AI capability boundaries, agent control, source grounding, uncertainty, approval, and safe fallback.",
  "Collaboration And Social Interaction": "Comments, mentions, presence, feeds, handoffs, shared attention, and team workflow.",
  "Cross-Device And Physical Interaction": "Touch, haptics, sensors, camera, permissions, offline states, and device adaptation.",
  "Data Display And Exploration": "Tables, dashboards, charts, maps, compare views, timelines, and drill-down behavior.",
  "Disclosure And Attention Management": "Progressive disclosure, overlays, warnings, focus, and interruption management.",
  "Error Prevention And Recovery": "Validation, undo, retry, fallback, destructive action review, and recovery paths.",
  "Feedback, Status, And System State": "Loading, progress, alerts, banners, sync, confidence, and system visibility.",
  "Input And Data Entry": "Forms, field behavior, uploads, dates, addresses, payment entry, and account data.",
  "Navigation And Wayfinding": "Headers, breadcrumbs, tabs, side navigation, steps, local anchors, and return paths.",
  "Personalization And Preference": "Settings, preference centers, saved views, defaults, recommendations, and user control.",
  "Search, Browse, And Discovery": "Search, filters, facets, category browsing, query correction, and no-results recovery.",
  "Selection And Choice": "Choice controls, object pickers, ranges, menu actions, bulk selection, and commands.",
  "Task And Workflow Patterns": "Multi-step work, approvals, scheduling, review queues, checkout, and task completion.",
  "Trust, Safety, And Privacy": "Consent, privacy, security, sensitive data, reporting, permissions, and safety exits."
};

export function categorySlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const categoryNames = Object.keys(categoryDescriptions).sort();

export function categoryNameFromSlug(slug: string) {
  return categoryNames.find((category) => categorySlug(category) === slug);
}
