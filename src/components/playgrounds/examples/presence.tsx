import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PresenceMode = "available" | "busy" | "dnd" | "away" | "offline" | "unknown" | "stale" | "privacy" | "coViewers" | "notify" | "activity";

function PresenceFrame({
  mode = "available",
  idSuffix = "demo"
}: {
  mode?: PresenceMode;
  idSuffix?: string;
}) {
  const titleId = `presence-title-${idSuffix}`;
  const states: Record<PresenceMode, {
    name: string;
    status: string;
    detail: string;
    source: string;
    updated: string;
    badge: string;
    action: string;
    actionState: string;
  }> = {
    available: {
      name: "Priya Rao",
      status: "Available",
      detail: "Active in review workspace.",
      source: "App activity",
      updated: "Updated now",
      badge: "available",
      action: "Call Priya",
      actionState: "Call available"
    },
    busy: {
      name: "Dana Lee",
      status: "Busy in a meeting",
      detail: "Calendar says meeting ends at 14:30.",
      source: "Calendar",
      updated: "Updated 2 min ago",
      badge: "busy",
      action: "Message Dana",
      actionState: "Call waits"
    },
    dnd: {
      name: "Noah Kim",
      status: "Do not disturb",
      detail: "Banners are suppressed unless priority policy applies.",
      source: "Manual status",
      updated: "For 45 min",
      badge: "dnd",
      action: "Notify later",
      actionState: "No banner"
    },
    away: {
      name: "Maya Chen",
      status: "Away",
      detail: "No activity detected after inactivity threshold.",
      source: "Device activity",
      updated: "Last active 18 min ago",
      badge: "away",
      action: "Send message",
      actionState: "Async expected"
    },
    offline: {
      name: "Alex King",
      status: "Offline",
      detail: "No connected app session is available.",
      source: "Presence API",
      updated: "Last seen yesterday",
      badge: "offline",
      action: "Route to backup",
      actionState: "Call disabled"
    },
    unknown: {
      name: "External reviewer",
      status: "Presence unknown",
      detail: "External organization does not share availability.",
      source: "Privacy boundary",
      updated: "No live signal",
      badge: "unknown",
      action: "Request update",
      actionState: "Limited"
    },
    stale: {
      name: "Priya Rao",
      status: "Available, stale",
      detail: "Last update is older than the freshness threshold.",
      source: "Presence API",
      updated: "Updated 27 min ago",
      badge: "stale",
      action: "Refresh status",
      actionState: "Verify first"
    },
    privacy: {
      name: "Hidden viewer",
      status: "Activity hidden",
      detail: "View history is hidden by user or domain setting.",
      source: "Privacy control",
      updated: "Not disclosed",
      badge: "privacy",
      action: "Respect privacy",
      actionState: "No identity"
    },
    coViewers: {
      name: "3 viewers here",
      status: "Co-viewing",
      detail: "Priya and Dana are viewing; 1 anonymous viewer hidden.",
      source: "Document session",
      updated: "Updated now",
      badge: "available",
      action: "Open viewer list",
      actionState: "Names allowed"
    },
    notify: {
      name: "Noah Kim",
      status: "Do not disturb",
      detail: "Follow-up is scheduled for the next available change.",
      source: "Manual status",
      updated: "Reminder set",
      badge: "dnd",
      action: "Notify when available",
      actionState: "Scheduled"
    },
    activity: {
      name: "File activity",
      status: "Viewed by Priya",
      detail: "Useful for follow-up, not an audit or attendance record.",
      source: "Activity dashboard",
      updated: "Viewed 09:42",
      badge: "activity",
      action: "Follow up",
      actionState: "Not audit"
    }
  };
  const current = states[mode];
  const people = [
    { name: "Priya Rao", state: "Available", badge: "available", note: "App activity" },
    { name: "Dana Lee", state: "Busy", badge: "busy", note: "In meeting" },
    { name: "Noah Kim", state: "Do not disturb", badge: "dnd", note: "Manual" },
    { name: "Hidden viewer", state: "Activity hidden", badge: "privacy", note: "Privacy" }
  ];
  return (
    <div className={`presence-frame presence-surface is-${mode}`}>
      <section className="presence-panel" aria-labelledby={titleId}>
        <div className="presence-panel-head">
          <span>Reviewer routing</span>
          <strong>{current.status}</strong>
        </div>
        <h4 id={titleId}>Who can review the refund exception?</h4>
        <article className={`presence-card is-${current.badge}`}>
          <div className="presence-person">
            <span className={`presence-dot is-${current.badge}`} aria-hidden="true" />
            <div>
              <b>{current.name}</b>
              <span>{current.status}</span>
            </div>
          </div>
          <p>{current.detail}</p>
          <div className="presence-facts">
            <span>{current.source}</span>
            <span>{current.updated}</span>
            <span>{current.actionState}</span>
          </div>
          <div className="presence-actions">
            <button type="button" className={current.badge === "available" ? "demo-button small primary" : "demo-button small"}>{current.action}</button>
            <button type="button" className="demo-button small">Message</button>
            <button type="button" className="demo-button small">Details</button>
          </div>
        </article>
        <div className="presence-summary" aria-label="Presence summary">
          {people.map((person) => (
            <div key={person.name}>
              <span className={`presence-dot is-${person.badge}`} aria-hidden="true" />
              <b>{person.name}</b>
              <span>{person.state}</span>
              <small>{person.note}</small>
            </div>
          ))}
        </div>
      </section>
      <section className="presence-detail" aria-label="Presence detail">
        <div className="presence-detail-card">
          <span>{mode === "coViewers" ? "Co-viewers" : mode === "privacy" ? "Privacy" : mode === "activity" ? "Activity context" : "Action behavior"}</span>
          <strong>{current.actionState}</strong>
          <p>{mode === "coViewers" ? "Show names where allowed, count hidden viewers honestly, and keep the object context visible." : mode === "privacy" ? "When visibility is restricted, show a hidden or unknown state instead of inventing availability." : mode === "activity" ? "Viewer activity can support follow-up, but durable audit evidence belongs in an activity log." : "Presence changes the action affordance without replacing message, assignment, or notification history."}</p>
        </div>
        <div className="presence-timeline">
          <span>Freshness</span>
          <b>{current.updated}</b>
          <small>{current.source}</small>
        </div>
      </section>
    </div>
  );
}

function PresenceGoodUi() {
  return (
    <div className="quality-example presence-demo">
      <PresenceFrame mode="busy" />
      <p className="demo-status">The presence indicator labels the status, source, freshness, and action effect instead of relying on a color dot.</p>
    </div>
  );
}

function PresenceBadUi() {
  return (
    <div className="bad-ui-sample presence-bad-demo is-colorOnly">
      <strong>Reviewers</strong>
      <div className="presence-bad-grid">
        <span><i className="presence-dot is-available" /> Priya</span>
        <span><i className="presence-dot is-available" /> Dana</span>
        <span><i className="presence-dot is-available" /> Noah</span>
      </div>
      <p className="demo-status">The broken UI shows identical green dots with no label, source, recency, privacy state, or action guidance.</p>
    </div>
  );
}

function PresenceGoodUx() {
  const [mode, setMode] = useState<PresenceMode>("available");
  const [message, setMessage] = useState("Available status names the source and keeps interruptive actions appropriate.");
  function choose(nextMode: PresenceMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example presence-demo">
      <PresenceFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row presence-controls" aria-label="Presence exercise controls">
        <button type="button" className={mode === "available" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("available", "Available status names the source and keeps call available.")}>Available</button>
        <button type="button" className={mode === "busy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("busy", "Busy status comes from calendar and changes call into a message-first action.")}>Busy</button>
        <button type="button" className={mode === "dnd" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("dnd", "Do not disturb suppresses banners and offers notify later.")}>Do not disturb</button>
        <button type="button" className={mode === "away" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("away", "Away state shows last activity and sets expectation for asynchronous response.")}>Away</button>
        <button type="button" className={mode === "offline" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("offline", "Offline state disables calling and offers backup routing.")}>Offline</button>
        <button type="button" className={mode === "unknown" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unknown", "Unknown state explains that external availability is not shared.")}>Unknown</button>
        <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale presence shows last update and asks users to refresh before relying on it.")}>Stale</button>
        <button type="button" className={mode === "privacy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("privacy", "Privacy-hidden state avoids exposing viewer identity or last-seen time.")}>Privacy</button>
        <button type="button" className={mode === "coViewers" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("coViewers", "Co-viewer state names allowed viewers and counts hidden viewers honestly.")}>Co-viewers</button>
        <button type="button" className={mode === "notify" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("notify", "Notify later respects do-not-disturb while preserving a follow-up path.")}>Notify later</button>
        <button type="button" className={mode === "activity" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("activity", "File activity supports follow-up but is not treated as audit proof.")}>Activity note</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PresenceBadUx() {
  type Mode = "colorOnly" | "staleActive" | "interruptBusy" | "privacyLeak" | "auditMisuse" | "anonymousCount";
  const [mode, setMode] = useState<Mode>("colorOnly");
  const copy: Record<Mode, string> = {
    colorOnly: "Dots have no accessible label, timestamp, source, or meaning.",
    staleActive: "Priya still looks active even though the last update was 42 minutes ago.",
    interruptBusy: "The primary action calls someone who is busy and in do-not-disturb.",
    privacyLeak: "Hidden file activity exposes a viewer name across a privacy boundary.",
    auditMisuse: "Last seen is treated as an attendance or compliance record.",
    anonymousCount: "The document says people are here but gives no names, roles, hidden count, or privacy reason."
  };
  const cells: Record<Mode, string[]> = {
    colorOnly: ["Green dot", "Green dot", "Green dot"],
    staleActive: ["Active", "42 min old", "No stale label"],
    interruptBusy: ["Busy", "Call now", "Banner sent"],
    privacyLeak: ["External viewer", "Name shown", "No consent"],
    auditMisuse: ["Last seen", "Attendance", "No event"],
    anonymousCount: ["3 here", "Who?", "No reason"]
  };
  return (
    <div className={`quality-example presence-bad-demo is-${mode}`}>
      <strong>{mode === "privacyLeak" ? "Viewer activity" : mode === "auditMisuse" ? "Presence report" : "Presence list"}</strong>
      <div className="presence-bad-grid">
        {cells[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row presence-controls">
        <button type="button" className={mode === "colorOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("colorOnly")}>Color only</button>
        <button type="button" className={mode === "staleActive" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleActive")}>Stale active</button>
        <button type="button" className={mode === "interruptBusy" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("interruptBusy")}>Interrupt busy</button>
        <button type="button" className={mode === "privacyLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privacyLeak")}>Privacy leak</button>
        <button type="button" className={mode === "auditMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auditMisuse")}>Audit misuse</button>
        <button type="button" className={mode === "anonymousCount" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("anonymousCount")}>Anonymous count</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PresenceGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PresenceBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PresenceGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PresenceBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
