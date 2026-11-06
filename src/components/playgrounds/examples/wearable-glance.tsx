import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type WearableGlanceMode =
  | "unconfigured"
  | "compact"
  | "ambient"
  | "fresh"
  | "stale"
  | "offline"
  | "privacy"
  | "lowBattery"
  | "dueNow"
  | "active"
  | "completed"
  | "missed"
  | "tapHandoff"
  | "safeAction"
  | "blockedAction"
  | "longText"
  | "loading"
  | "permissionLimited"
  | "focusMode"
  | "phoneDisconnected";

type WearableGlanceBadMode =
  | "miniDashboard"
  | "privateLeak"
  | "staleCurrent"
  | "destructiveTap"
  | "inboxMirror"
  | "ambientIllegible"
  | "tinyControls";

const wearableGlanceGoodLabels: Array<[WearableGlanceMode, string]> = [
  ["unconfigured", "Unconfigured"],
  ["compact", "Compact"],
  ["ambient", "Ambient"],
  ["fresh", "Fresh"],
  ["stale", "Stale"],
  ["offline", "Offline"],
  ["privacy", "Privacy"],
  ["lowBattery", "Low battery"],
  ["dueNow", "Due now"],
  ["active", "Active"],
  ["completed", "Completed"],
  ["missed", "Missed"],
  ["tapHandoff", "Tap handoff"],
  ["safeAction", "Safe action"],
  ["blockedAction", "Blocked action"],
  ["longText", "Long text"],
  ["loading", "Loading"],
  ["permissionLimited", "Permission limited"],
  ["focusMode", "Focus mode"],
  ["phoneDisconnected", "Phone disconnected"]
];

const wearableGlanceBadLabels: Array<[WearableGlanceBadMode, string]> = [
  ["miniDashboard", "Mini dashboard"],
  ["privateLeak", "Private leak"],
  ["staleCurrent", "Stale current"],
  ["destructiveTap", "Destructive tap"],
  ["inboxMirror", "Inbox mirror"],
  ["ambientIllegible", "Ambient illegible"],
  ["tinyControls", "Tiny controls"]
];

function WearableGlancePanel({ mode = "compact", idSuffix = "static" }: { mode?: WearableGlanceMode; idSuffix?: string }) {
  const config: Record<WearableGlanceMode, {
    chip: string;
    title: string;
    value: string;
    label: string;
    freshness: string;
    privacy: string;
    handoff: string;
    action: string;
    status: string;
    tone?: "safe" | "warn" | "neutral";
    ambient?: boolean;
  }> = {
    unconfigured: {
      chip: "Unconfigured",
      title: "Choose what appears on the watch",
      value: "--",
      label: "No tile selected",
      freshness: "No source",
      privacy: "No data shown",
      handoff: "Open setup",
      action: "Configure",
      status: "The empty slot names what is missing and offers setup rather than showing a blank complication.",
      tone: "neutral"
    },
    compact: {
      chip: "Compact",
      title: "Next train in six minutes",
      value: "6 min",
      label: "Blue line",
      freshness: "Updated now",
      privacy: "Public transit status",
      handoff: "Open route",
      action: "View",
      status: "The glance answers one immediate question with a short label and source.",
      tone: "safe"
    },
    ambient: {
      chip: "Ambient",
      title: "Dim mode keeps only essentials",
      value: "6",
      label: "min",
      freshness: "Updated 1 min ago",
      privacy: "No private detail",
      handoff: "Tap to wake",
      action: "Wake",
      status: "Ambient mode reduces detail without changing the meaning of the glance.",
      tone: "neutral",
      ambient: true
    },
    fresh: {
      chip: "Fresh",
      title: "Current value is safe to trust",
      value: "B12",
      label: "Gate",
      freshness: "Updated 20 sec ago",
      privacy: "Boarding status only",
      handoff: "Open boarding pass",
      action: "Open",
      status: "Freshness is visible for time-sensitive travel information.",
      tone: "safe"
    },
    stale: {
      chip: "Stale",
      title: "Old data is labeled before use",
      value: "18m",
      label: "Stale ETA",
      freshness: "Last updated 18 min ago",
      privacy: "Route hidden",
      handoff: "Refresh on phone",
      action: "Refresh",
      status: "Stale data is not presented as current and has a larger-surface refresh path.",
      tone: "warn"
    },
    offline: {
      chip: "Offline",
      title: "Cached glance names the limitation",
      value: "Cached",
      label: "Route",
      freshness: "Phone offline",
      privacy: "No upload",
      handoff: "Open cached details",
      action: "Details",
      status: "Offline mode distinguishes cached wearable data from live status.",
      tone: "neutral"
    },
    privacy: {
      chip: "Privacy",
      title: "Sensitive content is redacted",
      value: "Due",
      label: "Medication",
      freshness: "Updated now",
      privacy: "Details hidden",
      handoff: "Authenticate on phone",
      action: "Reveal",
      status: "The wrist surface preserves the reminder while hiding private dose details.",
      tone: "safe"
    },
    lowBattery: {
      chip: "Low battery",
      title: "Updates slow down to protect battery",
      value: "42%",
      label: "Battery",
      freshness: "Refresh paused",
      privacy: "Device status",
      handoff: "Open power settings",
      action: "Save power",
      status: "Low-power state explains reduced update frequency instead of silently going stale.",
      tone: "neutral"
    },
    dueNow: {
      chip: "Due now",
      title: "A time-critical glance stays brief",
      value: "Now",
      label: "Dose due",
      freshness: "Current",
      privacy: "Dose hidden",
      handoff: "Open medication",
      action: "Taken",
      status: "The glance highlights urgency and keeps the action safe and reversible.",
      tone: "warn"
    },
    active: {
      chip: "Active",
      title: "Ongoing activity shows the live cue",
      value: "142",
      label: "bpm zone 3",
      freshness: "Live sensor",
      privacy: "Health visible",
      handoff: "Open workout",
      action: "Pause",
      status: "Active states keep one current metric and a safe action on the wrist.",
      tone: "safe"
    },
    completed: {
      chip: "Completed",
      title: "Completion is compact and final",
      value: "Done",
      label: "Boarded",
      freshness: "Confirmed 2 min ago",
      privacy: "Public status",
      handoff: "Open trip",
      action: "Close",
      status: "Completion confirms the state without keeping a noisy notification around.",
      tone: "safe"
    },
    missed: {
      chip: "Missed",
      title: "Missed event keeps recovery visible",
      value: "Missed",
      label: "Dose",
      freshness: "11 min late",
      privacy: "Details hidden",
      handoff: "Open recovery",
      action: "Snooze",
      status: "Missed state is visible but still hands off complex recovery.",
      tone: "warn"
    },
    tapHandoff: {
      chip: "Handoff",
      title: "Tap opens the right larger surface",
      value: "B12",
      label: "Boarding",
      freshness: "Updated now",
      privacy: "Pass hidden",
      handoff: "Phone boarding pass",
      action: "Open pass",
      status: "The primary tap moves to the surface that can handle details and authentication.",
      tone: "safe"
    },
    safeAction: {
      chip: "Safe action",
      title: "One reversible action fits the watch",
      value: "Start",
      label: "Timer",
      freshness: "Ready",
      privacy: "No private detail",
      handoff: "Open timer",
      action: "Start",
      status: "The on-wrist action is simple, safe, and mirrored in the app.",
      tone: "safe"
    },
    blockedAction: {
      chip: "Blocked",
      title: "Risky action requires phone review",
      value: "Review",
      label: "Payment",
      freshness: "Pending",
      privacy: "Amount hidden",
      handoff: "Review on phone",
      action: "Open phone",
      status: "Risky or complex actions are blocked on the glance and routed to review.",
      tone: "warn"
    },
    longText: {
      chip: "Long text",
      title: "Long names are shortened safely",
      value: "A7",
      label: "Main St...",
      freshness: "Updated now",
      privacy: "Address truncated",
      handoff: "Open full route",
      action: "Route",
      status: "The glance truncates nonessential text while preserving the primary answer.",
      tone: "neutral"
    },
    loading: {
      chip: "Loading",
      title: "Loading names the source",
      value: "...",
      label: "Refreshing ETA",
      freshness: "Checking phone",
      privacy: "No data change",
      handoff: "Open status",
      action: "Wait",
      status: "Loading is scoped and does not pretend the old value is current.",
      tone: "neutral"
    },
    permissionLimited: {
      chip: "Permission",
      title: "Permission-limited data has a next step",
      value: "Locked",
      label: "Health",
      freshness: "Permission needed",
      privacy: "Protected",
      handoff: "Open permissions",
      action: "Fix",
      status: "Permission limits are explicit and direct users to a larger settings surface.",
      tone: "warn"
    },
    focusMode: {
      chip: "Focus mode",
      title: "Focus mode suppresses noncritical detail",
      value: "1",
      label: "Priority",
      freshness: "Filtered",
      privacy: "Details hidden",
      handoff: "Open notifications",
      action: "Review",
      status: "Focus mode keeps only critical glance information and respects notification rules.",
      tone: "neutral"
    },
    phoneDisconnected: {
      chip: "Disconnected",
      title: "Phone dependency is visible",
      value: "--",
      label: "Phone offline",
      freshness: "Last sync 9 min ago",
      privacy: "No new data",
      handoff: "Reconnect phone",
      action: "Reconnect",
      status: "The glance names phone dependency instead of showing stale paired-app data as live.",
      tone: "warn"
    }
  };
  const item = config[mode];
  const titleId = `wearable-glance-title-${idSuffix}`;
  const descId = `wearable-glance-desc-${idSuffix}`;

  return (
    <section className={`wearable-glance-shell is-${item.tone ?? "neutral"} ${item.ambient ? "is-ambient" : ""}`} aria-labelledby={titleId} aria-describedby={descId}>
      <header className="wearable-glance-header">
        <div>
          <span>{item.chip}</span>
          <strong id={titleId}>{item.title}</strong>
        </div>
        <button type="button" className="wearable-glance-action">{item.action}</button>
      </header>
      <div className="wearable-glance-stage" id={descId}>
        <div className="wearable-watch" aria-label="Wearable glance preview">
          <span>{item.value}</span>
          <strong>{item.label}</strong>
          <small>{item.freshness}</small>
        </div>
        <div className="wearable-glance-grid">
          <div><span>Freshness</span><strong>{item.freshness}</strong></div>
          <div><span>Privacy</span><strong>{item.privacy}</strong></div>
          <div><span>Handoff</span><strong>{item.handoff}</strong></div>
          <div><span>Action</span><strong>{item.action}</strong></div>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{item.status}</p>
    </section>
  );
}

function WearableGlanceGoodUi() {
  return (
    <div className="quality-example wearable-glance-demo">
      <WearableGlancePanel mode="compact" idSuffix="good-ui" />
    </div>
  );
}

function WearableGlanceBadUi() {
  return (
    <div className="bad-ui-sample wearable-glance-bad-ui">
      <section className="wearable-glance-shell bad" aria-label="Broken wearable glance interface">
        <header className="wearable-glance-header">
          <div>
            <span>Mini dashboard</span>
            <strong>Four charts and private messages</strong>
          </div>
          <button type="button" className="wearable-glance-action danger">Delete</button>
        </header>
        <p>The watch tile copies a dashboard, exposes private message text, hides stale timestamps, and puts destructive controls inside tiny tap targets.</p>
        <div className="wearable-glance-grid compact">
          <div><span>Density</span><strong>Unreadable</strong></div>
          <div><span>Privacy</span><strong>Leaking</strong></div>
          <div><span>Freshness</span><strong>Hidden</strong></div>
          <div><span>Action</span><strong>Risky tap</strong></div>
        </div>
      </section>
      <p className="demo-status">The broken UI treats a wearable glance as a tiny phone page instead of a one-question wrist surface.</p>
    </div>
  );
}

function WearableGlanceGoodUx() {
  const [mode, setMode] = useState<WearableGlanceMode>("compact");

  return (
    <div className="quality-example wearable-glance-demo">
      <div className="demo-row wearable-glance-controls" aria-label="Wearable glance exercise controls">
        {wearableGlanceGoodLabels.map(([key, label]) => (
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
      <WearableGlancePanel mode={mode} idSuffix="good-ux" />
      <p className="demo-status" aria-live="polite">Wearable glance state: {wearableGlanceGoodLabels.find(([key]) => key === mode)?.[1]}.</p>
    </div>
  );
}

function WearableGlanceBadUx() {
  const [mode, setMode] = useState<WearableGlanceBadMode>("miniDashboard");
  const copy: Record<WearableGlanceBadMode, { title: string; body: string; consequence: string; metric: string }> = {
    miniDashboard: {
      title: "Mini dashboard",
      body: "Four metrics, two charts, filters, and drill links are squeezed into a tiny watch tile.",
      consequence: "The glance cannot answer one question quickly.",
      metric: "Too dense"
    },
    privateLeak: {
      title: "Private leak",
      body: "A locked watch face shows message sender, body, account balance, and exact location.",
      consequence: "Bystanders can read sensitive content from the wrist.",
      metric: "Privacy off"
    },
    staleCurrent: {
      title: "Stale current",
      body: "Yesterday's health reading appears as a current value with no timestamp or unavailable state.",
      consequence: "Users can make decisions from old data.",
      metric: "Freshness hidden"
    },
    destructiveTap: {
      title: "Destructive tap",
      body: "Tapping a complication immediately cancels a booking without review or phone handoff.",
      consequence: "A tiny accidental wrist tap changes account state.",
      metric: "No review"
    },
    inboxMirror: {
      title: "Inbox mirror",
      body: "Every notification becomes a glance card, including marketing, comments, reminders, and background sync events.",
      consequence: "The wearable surface becomes an unreadable notification center.",
      metric: "No priority"
    },
    ambientIllegible: {
      title: "Ambient illegible",
      body: "Ambient mode removes labels and dims the only meaningful number until it is unreadable.",
      consequence: "Always-on display changes the meaning instead of reducing detail.",
      metric: "Dim failure"
    },
    tinyControls: {
      title: "Tiny controls",
      body: "A watch widget includes six small buttons for filters, edit, delete, share, refresh, and details.",
      consequence: "The action area is too small and complex for wrist use.",
      metric: "Too many actions"
    }
  };
  const item = copy[mode];

  return (
    <div className={`quality-example wearable-glance-bad-ux is-${mode}`}>
      <div className="demo-row wearable-glance-controls" aria-label="Wearable glance misuse controls">
        {wearableGlanceBadLabels.map(([key, label]) => (
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
      <section className="wearable-glance-shell bad" aria-label={`Wearable glance failure: ${item.title}`}>
        <header className="wearable-glance-header">
          <div>
            <span>{item.title}</span>
            <strong>{item.metric}</strong>
          </div>
          <button type="button" className="wearable-glance-action danger">Act now</button>
        </header>
        <p>{item.body}</p>
        <div className="wearable-glance-grid compact">
          <div><span>Question</span><strong>{mode === "miniDashboard" || mode === "inboxMirror" ? "Unclear" : "Hidden"}</strong></div>
          <div><span>Privacy</span><strong>{mode === "privateLeak" ? "Leaking" : "Weak"}</strong></div>
          <div><span>Freshness</span><strong>{mode === "staleCurrent" ? "Missing" : "Not enough"}</strong></div>
          <div><span>Action</span><strong>{mode === "destructiveTap" || mode === "tinyControls" ? "Unsafe" : "No handoff"}</strong></div>
        </div>
      </section>
      <p className="demo-status" aria-live="polite">{item.consequence}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WearableGlanceGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WearableGlanceBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WearableGlanceGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WearableGlanceBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
