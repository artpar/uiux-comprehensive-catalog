import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PullToRefreshMode =
  | "idle"
  | "atTop"
  | "pulling"
  | "threshold"
  | "release"
  | "refreshing"
  | "success"
  | "empty"
  | "noNew"
  | "failed"
  | "offline"
  | "nestedScroll"
  | "rateLimited"
  | "manual"
  | "mobile";

type PullToRefreshBadMode =
  | "anywherePull"
  | "noIndicator"
  | "doubleRefresh"
  | "eatsScroll"
  | "offlineSpin"
  | "destructiveRefresh"
  | "hiddenManual";

const pullToRefreshGoodLabels: Array<[PullToRefreshMode, string]> = [
  ["idle", "Idle"],
  ["atTop", "At top"],
  ["pulling", "Pulling"],
  ["threshold", "Threshold"],
  ["release", "Release to refresh"],
  ["refreshing", "Refreshing"],
  ["success", "Success"],
  ["empty", "Empty result"],
  ["noNew", "No new data"],
  ["failed", "Failed"],
  ["offline", "Offline"],
  ["nestedScroll", "Nested scroll"],
  ["rateLimited", "Rate limited"],
  ["manual", "Manual refresh"],
  ["mobile", "Mobile compact"]
];

const pullToRefreshBadLabels: Array<[PullToRefreshBadMode, string]> = [
  ["anywherePull", "Anywhere pull"],
  ["noIndicator", "No indicator"],
  ["doubleRefresh", "Double refresh"],
  ["eatsScroll", "Eats scroll"],
  ["offlineSpin", "Offline spin"],
  ["destructiveRefresh", "Destructive refresh"],
  ["hiddenManual", "Hidden manual"]
];

function PullToRefreshPanel({ mode, idSuffix }: { mode: PullToRefreshMode; idSuffix: string }) {
  const config: Record<PullToRefreshMode, {
    chip: string;
    title: string;
    indicator: string;
    status: string;
    list: string;
    guard: string;
    manual: string;
    result: string;
    tone?: string;
    compact?: boolean;
  }> = {
    idle: {
      chip: "Idle",
      title: "Inbox feed is current",
      indicator: "Pull distance 0 px",
      status: "Last updated 10:42. Manual refresh is available in the toolbar.",
      list: "Current messages stay visible; the scroll position and focus anchor are stable.",
      guard: "No request is running.",
      manual: "Refresh button and overflow menu call the same refresh method.",
      result: "Pull to refresh is optional, not required."
    },
    atTop: {
      chip: "At top",
      title: "Top of scroll is detected",
      indicator: "Top of scroll reached",
      status: "The list is at the beginning, so a downward drag can arm refresh.",
      list: "Older content is below; no network request starts until threshold and release.",
      guard: "Middle-of-list pulls are ignored.",
      manual: "Manual refresh remains reachable.",
      result: "Only the intended scroll container owns the gesture."
    },
    pulling: {
      chip: "Pulling",
      title: "Progress before threshold",
      indicator: "Pull distance 36 px of 72 px",
      status: "Pulling under threshold. Release now cancels.",
      list: "Content follows slightly and snaps back if released.",
      guard: "No refresh request has started.",
      manual: "Refresh button is still available.",
      result: "Users can see progress without committing."
    },
    threshold: {
      chip: "Threshold",
      title: "Threshold reached",
      indicator: "Pull distance 72 px of 72 px",
      status: "Threshold reached. Release to refresh.",
      list: "The indicator changes from progress to ready state.",
      guard: "The request waits for release.",
      manual: "Manual refresh uses the same in-flight guard.",
      result: "The commit boundary is explicit."
    },
    release: {
      chip: "Release to refresh",
      title: "Refresh starts on release",
      indicator: "Release to refresh",
      status: "Release triggered the current inbox refresh.",
      list: "Messages remain visible while new data loads.",
      guard: "Duplicate pulls are disabled.",
      manual: "Toolbar refresh is disabled while the request is in flight.",
      result: "The gesture starts one scoped refresh."
    },
    refreshing: {
      chip: "Refreshing",
      title: "One in-flight request",
      indicator: "Refreshing current feed",
      status: "Refreshing. Last successful update was 10:42.",
      list: "Existing content stays on screen with a top status message.",
      guard: "Pulls and manual refresh are disabled until the request resolves.",
      manual: "Manual refresh shows Refreshing instead of firing again.",
      result: "Status message announces progress without moving focus."
    },
    success: {
      chip: "Success",
      title: "New content inserted without jumping",
      indicator: "Refreshed",
      status: "Refreshed 2 new messages. Last updated 10:45.",
      list: "A new-items marker appears above the old anchor; focus is preserved.",
      guard: "The in-flight guard is cleared.",
      manual: "Manual refresh is available again.",
      result: "Users can continue from the same reading context.",
      tone: "safe"
    },
    empty: {
      chip: "Empty result",
      title: "Refresh completed with an empty current filter",
      indicator: "Refreshed filter",
      status: "No open alerts match this filter after refresh.",
      list: "The empty state names the active filter and keeps Reset filter nearby.",
      guard: "The empty result is not treated as a failed request.",
      manual: "Manual refresh can run again after filters change.",
      result: "The result distinguishes empty data from loading."
    },
    noNew: {
      chip: "No new data",
      title: "Refresh found no updates",
      indicator: "No new data",
      status: "No new updates. Last checked 10:45.",
      list: "Existing messages and unread counts remain unchanged.",
      guard: "Duplicate request guard resets after completion.",
      manual: "Users can refresh later from the same control.",
      result: "A completed refresh is visible even when content does not change."
    },
    failed: {
      chip: "Failed",
      title: "Refresh failed without clearing content",
      indicator: "Refresh failed",
      status: "Could not refresh current feed. Showing last updated 10:42.",
      list: "Cached content remains visible with Retry refresh beside the status.",
      guard: "The failed request can be retried once the cause changes.",
      manual: "Manual refresh becomes Retry refresh for the same request scope.",
      result: "Failure preserves usable data."
    },
    offline: {
      chip: "Offline",
      title: "Offline cached data is honest",
      indicator: "Offline",
      status: "Offline. Showing cached messages from 10:42.",
      list: "Refresh is unavailable until connection returns; cached content remains readable.",
      guard: "No endless spinner or network loop runs offline.",
      manual: "Manual refresh explains Offline instead of pretending to update.",
      result: "Offline state and pull to refresh stay separate."
    },
    nestedScroll: {
      chip: "Nested scroll",
      title: "Inner scroller wins first",
      indicator: "Comments panel scrolling",
      status: "The comment thread scrolls to its top before the inbox refresh can arm.",
      list: "Nested scroll ownership is defined for feed, comments, map, and row actions.",
      guard: "Outer refresh does not steal short inner scrolls.",
      manual: "Toolbar refresh remains the predictable fallback.",
      result: "Nested scroll conflicts are resolved before release."
    },
    rateLimited: {
      chip: "Rate limited",
      title: "Cooldown is visible",
      indicator: "Refresh paused",
      status: "Rate limited. Try again in 45 seconds.",
      list: "Current content stays visible and no extra requests are queued.",
      guard: "Pull and manual refresh share the same cooldown.",
      manual: "Refresh button shows the wait reason.",
      result: "The UI avoids rate-limit loops."
    },
    manual: {
      chip: "Manual refresh",
      title: "Equivalent command path",
      indicator: "Manual refresh ready",
      status: "Refresh button, overflow item, keyboard focus, and external device path all update the same feed.",
      list: "The gesture is useful on touch but not the only path.",
      guard: "Manual and pull requests dedupe against one in-flight refresh.",
      manual: "Refresh now is a visible command.",
      result: "Path-based gesture has a non-gesture equivalent.",
      tone: "safe"
    },
    mobile: {
      chip: "Mobile compact",
      title: "Compact layout keeps status readable",
      indicator: "Pull 72 px, release to refresh",
      status: "Indicator, last updated, manual refresh, and offline text wrap without overlap.",
      list: "Rows, controls, and status fit in a narrow viewport.",
      guard: "Large text and landscape still preserve the threshold copy.",
      manual: "Manual refresh stays reachable below the title.",
      result: "The pattern remains usable on small screens.",
      compact: true
    }
  };
  const item = config[mode];
  const titleId = `pull-to-refresh-title-${idSuffix}`;
  const descId = `pull-to-refresh-desc-${idSuffix}`;

  return (
    <section className={`pull-to-refresh-shell is-${mode} ${item.tone ? `is-${item.tone}` : ""} ${item.compact ? "is-compact" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="pull-to-refresh-header">
        <span>{item.chip}</span>
        <strong id={titleId}>{item.title}</strong>
      </header>
      <div className="pull-to-refresh-phone" id={descId}>
        <div className="pull-to-refresh-topbar">
          <strong>Inbox</strong>
          <button type="button" className="demo-button small">Manual refresh</button>
        </div>
        <div className="pull-to-refresh-indicator" aria-live="polite">
          <span aria-hidden="true" />
          <strong>{item.indicator}</strong>
          <p>{item.status}</p>
        </div>
        <div className="pull-to-refresh-list" aria-label="Refreshable message list">
          <div><strong>Release notes</strong><span>Unread update from Design systems</span></div>
          <div><strong>Incident channel</strong><span>Cached summary, last updated 10:42</span></div>
          <div><strong>Support queue</strong><span>{item.list}</span></div>
        </div>
      </div>
      <div className="pull-to-refresh-grid" aria-label="Pull to refresh evidence">
        <div><span>Top of scroll</span><strong>{mode === "atTop" || mode === "pulling" || mode === "threshold" || mode === "release" ? "Armed at top" : "Checked"}</strong></div>
        <div><span>Threshold</span><strong>{item.indicator}</strong></div>
        <div><span>Status message</span><strong>{item.status}</strong></div>
        <div><span>Duplicate guard</span><strong>{item.guard}</strong></div>
        <div><span>Manual refresh</span><strong>{item.manual}</strong></div>
        <div><span>Result</span><strong>{item.result}</strong></div>
      </div>
      <p className="demo-status">{item.result}</p>
    </section>
  );
}

function PullToRefreshGoodUi() {
  return (
    <div className="quality-example pull-to-refresh-demo">
      <PullToRefreshPanel mode="threshold" idSuffix="good-ui" />
    </div>
  );
}

function PullToRefreshBadUi() {
  return (
    <div className="bad-ui-sample pull-to-refresh-bad-ui">
      <section className="pull-to-refresh-shell bad" aria-label="Broken pull to refresh">
        <header className="pull-to-refresh-header">
          <span>No indicator</span>
          <strong>Hidden refresh gesture</strong>
        </header>
        <p>The feed refreshes from anywhere, has no pull distance, threshold, release to refresh, status message, last updated copy, manual refresh, offline state, or duplicate guard.</p>
        <div className="pull-to-refresh-phone bad">
          <div className="pull-to-refresh-topbar">
            <strong>Feed</strong>
            <span>Gesture only</span>
          </div>
          <div className="pull-to-refresh-list">
            <div><strong>Older post</strong><span>Scroll up and the list silently refreshes.</span></div>
            <div><strong>Offline</strong><span>Spinner continues forever.</span></div>
          </div>
        </div>
      </section>
      <p className="demo-status">The broken UI hides the refresh contract and excludes non-gesture users.</p>
    </div>
  );
}

function PullToRefreshGoodUx() {
  const [mode, setMode] = useState<PullToRefreshMode>("idle");
  return (
    <div className="quality-example pull-to-refresh-demo">
      <div className="demo-row pull-to-refresh-controls" aria-label="Pull to refresh exercise controls">
        {pullToRefreshGoodLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <PullToRefreshPanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Pull to refresh state: {pullToRefreshGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function PullToRefreshBadUx() {
  const [mode, setMode] = useState<PullToRefreshBadMode>("anywherePull");
  const copy: Record<PullToRefreshBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    anywherePull: {
      title: "Anywhere pull",
      body: "The feed starts refresh from the middle of the list instead of requiring top of scroll.",
      consequence: "Users trigger network calls while reading older items.",
      metric: "Top check missing"
    },
    noIndicator: {
      title: "No indicator",
      body: "There is no pull distance, threshold, release to refresh, refreshing, last updated, or status message.",
      consequence: "Users cannot tell whether refresh started, canceled, or completed.",
      metric: "No feedback"
    },
    doubleRefresh: {
      title: "Double refresh",
      body: "Pull gesture, toolbar refresh, and auto-refresh can all send requests at the same time.",
      consequence: "Duplicate requests race, reorder rows, and burn rate limits.",
      metric: "3 requests"
    },
    eatsScroll: {
      title: "Eats scroll",
      body: "A nested comments panel, map pan, and row swipe all arm the outer refresh gesture.",
      consequence: "Users lose control of normal scrolling and row actions.",
      metric: "Conflict"
    },
    offlineSpin: {
      title: "Offline spin",
      body: "Offline pull shows a spinner forever instead of cached data, offline text, retry, or last updated time.",
      consequence: "The product pretends a network update is still happening.",
      metric: "Stuck"
    },
    destructiveRefresh: {
      title: "Destructive refresh",
      body: "A hidden pull clears filters, deletes cached rows, and resets read state under the name refresh.",
      consequence: "Routine freshness checks destroy user context.",
      metric: "Data changed"
    },
    hiddenManual: {
      title: "Hidden manual",
      body: "There is no manual refresh, keyboard path, switch path, D-pad path, or assistive pointer equivalent.",
      consequence: "The path-based gesture becomes the only way to refresh.",
      metric: "Gesture only"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example pull-to-refresh-bad-ux is-${mode}`}>
      <div className="demo-row pull-to-refresh-controls" aria-label="Pull to refresh misuse controls">
        {pullToRefreshBadLabels.map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={mode === key ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <section className="pull-to-refresh-shell bad" aria-label={`Pull to refresh failure: ${item.title}`}>
        <header className="pull-to-refresh-header">
          <span>{item.title}</span>
          <strong>{item.metric}</strong>
        </header>
        <p>{item.body}</p>
        <div className="pull-to-refresh-grid">
          <div><span>Top of scroll</span><strong>{mode === "anywherePull" ? "Ignored" : "Unknown"}</strong></div>
          <div><span>Threshold</span><strong>{mode === "noIndicator" ? "Invisible" : "Unclear"}</strong></div>
          <div><span>Status message</span><strong>{mode === "offlineSpin" ? "Spinner only" : "Missing"}</strong></div>
          <div><span>Manual refresh</span><strong>{mode === "hiddenManual" ? "Missing" : "Not equivalent"}</strong></div>
          <div><span>Nested scroll</span><strong>{mode === "eatsScroll" ? "Stolen" : "Untested"}</strong></div>
          <div><span>Result</span><strong>{item.consequence}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PullToRefreshGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PullToRefreshBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PullToRefreshGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PullToRefreshBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
