import { track } from "./analytics";
import { readingMetrics } from "./reading-metrics";

function surface(path: string) {
  if (path === import.meta.env.BASE_URL) return "home";
  if (/\/patterns\/category\//.test(path)) return "pattern_family";
  for (const [section, detail, index] of [
    ["patterns", "pattern_detail", "pattern_directory"],
    ["sources", "source_detail", "sources"],
    ["compare", "comparison_detail", "comparisons"],
    ["resources", "resource_detail", "resources"],
    ["learn", "lesson", "learn"],
    ["principles", "ui_principle", "ui_principles"],
    ["practice", "practice_case", "practice"],
    ["work", "work_tool", "work"]
  ]) {
    if (new RegExp(`/${section}/[^/]+/?$`).test(path)) return detail;
    if (path.endsWith(`/${section}/`)) return index;
  }
  if (path.endsWith("/lab/")) return "lab";
  if (path.endsWith("/reference/")) return "reference";
  return "other";
}

export function setupReadingAnalytics() {
  if (import.meta.env.DEV || window.__analyticsDisabled) return;
  const session = readingMetrics((event, props) => track(event, props), surface(window.location.pathname));
  const tick = () => session.tick(performance.now(), !document.hidden && document.hasFocus());
  const depth = () => {
    const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    session.depth(Math.min(100, Math.round((window.scrollY + window.innerHeight) / height * 100)));
  };
  tick();
  depth();
  const timer = window.setInterval(tick, 1000);
  document.addEventListener("visibilitychange", tick);
  window.addEventListener("focus", tick);
  window.addEventListener("blur", tick);
  window.addEventListener("scroll", depth, { passive: true });
  window.addEventListener("resize", depth);
  window.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
}
