import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ActivityLogEvent = {
  id: string;
  timeUtc: string;
  actor: string;
  actorType: "User" | "System" | "Service account";
  action: string;
  object: string;
  result: "Success" | "Failed" | "Redacted";
  source: string;
  ip: string;
  details: string;
  beforeAfter: string;
};

const activityLogEvents: ActivityLogEvent[] = [
  {
    id: "evt-84921",
    timeUtc: "2026-06-11 04:18 UTC",
    actor: "maya.chen@example.com",
    actorType: "User",
    action: "Changed repository visibility",
    object: "payments-api",
    result: "Success",
    source: "GitHub Enterprise",
    ip: "203.0.113.42",
    details: "Visibility changed from private to internal. Request ID req-91e2.",
    beforeAfter: "before: private / after: internal"
  },
  {
    id: "evt-84908",
    timeUtc: "2026-06-11 03:56 UTC",
    actor: "sso-sync-bot",
    actorType: "Service account",
    action: "Removed group membership",
    object: "Finance approvers",
    result: "Success",
    source: "Identity sync",
    ip: "10.12.8.4",
    details: "Service account removed 1 user after directory sync.",
    beforeAfter: "before: member / after: removed"
  },
  {
    id: "evt-84877",
    timeUtc: "2026-06-10 22:41 UTC",
    actor: "noah.kim@example.com",
    actorType: "User",
    action: "Failed admin sign-in",
    object: "Admin console",
    result: "Failed",
    source: "Atlassian Guard",
    ip: "198.51.100.18",
    details: "MFA challenge failed twice. Location available to security admins only.",
    beforeAfter: "reason: invalid second factor"
  },
  {
    id: "evt-84852",
    timeUtc: "2026-06-10 19:02 UTC",
    actor: "redacted by scope",
    actorType: "System",
    action: "Exported audit search",
    object: "Audit query job",
    result: "Redacted",
    source: "Microsoft Purview",
    ip: "hidden",
    details: "Actor and IP hidden by assigned administrative unit scope.",
    beforeAfter: "scope: restricted admin"
  }
];

function ActivityLogTable({
  events,
  expandedId,
  onToggle
}: {
  events: ActivityLogEvent[];
  expandedId?: string;
  onToggle?: (id: string) => void;
}) {
  return (
    <div className="activity-log-table-wrap">
      <table className="activity-log-table">
        <caption>Audit events matching the current query</caption>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Actor</th>
            <th scope="col">Action</th>
            <th scope="col">Object</th>
            <th scope="col">Result</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className={`activity-log-row is-${event.result.toLowerCase().replaceAll(" ", "-")}`}>
              <td><time>{event.timeUtc}</time></td>
              <td><span>{event.actor}</span><small>{event.actorType}</small></td>
              <td>{event.action}</td>
              <td>{event.object}</td>
              <td><span className={`activity-log-result is-${event.result.toLowerCase()}`}>{event.result}</span></td>
              <td>
                <button type="button" className="demo-button small" aria-expanded={expandedId === event.id} onClick={() => onToggle?.(event.id)}>
                  {expandedId === event.id ? "Hide details" : "Show details"}
                </button>
                {expandedId === event.id ? (
                  <div className="activity-log-detail">
                    <strong>{event.id}</strong>
                    <span>{event.source} - {event.ip}</span>
                    <p>{event.details}</p>
                    <code>{event.beforeAfter}</code>
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityLogGoodUi() {
  return (
    <div className="quality-example activity-log-demo">
      <div className="activity-log-toolbar" id="activity-log-ui-label">
        <strong>Organization audit log</strong>
        <span>Last 24 hours</span>
        <span>UTC</span>
        <span>4 records</span>
        <span>180-day retention</span>
      </div>
      <ActivityLogTable events={activityLogEvents.slice(0, 3)} expandedId="evt-84921" />
      <p className="demo-status">The log exposes actor, action, object, timestamp, result, event ID, source, IP, and retention context before export.</p>
    </div>
  );
}

function ActivityLogBadUi() {
  return (
    <div className="bad-ui-sample activity-log-bad-demo is-vagueEvents">
      <div className="activity-log-broken" aria-label="Broken activity log">
        <div><b>Changed settings</b><span>No actor, object, timestamp, source, IP, result, or event ID.</span></div>
        <div><b>User did thing</b><span>Export uses local time while the screen implies UTC.</span></div>
        <div><b>Read notification</b><span>The entry disappears when the inbox is cleared.</span></div>
      </div>
      <p className="demo-status">The broken log cannot prove who did what, when, where, or whether the record is complete.</p>
    </div>
  );
}

function ActivityLogGoodUx() {
  type Filter = "all" | "failed" | "system";
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState("evt-84921");
  const [timezone, setTimezone] = useState<"UTC" | "Local">("UTC");
  const [exportState, setExportState] = useState<"idle" | "queued" | "ready" | "failed">("idle");
  const [showRetention, setShowRetention] = useState(false);
  const [message, setMessage] = useState("Query shows last 24 hours in UTC with organization-admin scope.");

  const visibleEvents = activityLogEvents.filter((event) => {
    if (filter === "failed") return event.result === "Failed";
    if (filter === "system") return event.actorType !== "User";
    return true;
  });

  const toggleDetails = (id: string) => {
    setExpandedId((current) => current === id ? "" : id);
    setMessage(`${id} details ${expandedId === id ? "collapsed" : "expanded"} without changing the filtered event set.`);
  };

  const startExport = () => {
    setExportState("queued");
    setMessage(`Export queued for ${visibleEvents.length} visible records using the same query, scope, and ${timezone} timezone.`);
  };

  return (
    <div className="quality-example activity-log-demo">
      <div className="activity-log-toolbar" id="activity-log-ux-label">
        <strong>Organization audit log</strong>
        <span>{filter === "all" ? "All event types" : filter === "failed" ? "Failed only" : "System and service accounts"}</span>
        <span>{timezone}</span>
        <span>{visibleEvents.length} visible</span>
        <span>{showRetention ? "180-day retention shown" : "Recent range"}</span>
        {exportState !== "idle" ? <span>Export {exportState}</span> : null}
      </div>
      <ActivityLogTable events={visibleEvents} expandedId={expandedId} onToggle={toggleDetails} />
      <div className="demo-row activity-log-controls" aria-label="Activity log exercise controls">
        <button type="button" className={filter === "all" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setFilter("all");
          setMessage("All event types restored. The result count and query scope are visible.");
        }}>All events</button>
        <button type="button" className={filter === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setFilter("failed");
          setMessage("Filtered to failed events. The visible count changed without deleting records.");
        }}>Failed events</button>
        <button type="button" className={filter === "system" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setFilter("system");
          setMessage("Filtered to system and service-account events with human actors excluded.");
        }}>System actors</button>
        <button type="button" className="demo-button small" onClick={() => {
          setExpandedId("evt-84921");
          setMessage("evt-84921 opened with before/after fields, source, IP address, and request context.");
        }}>Open visibility change</button>
        <button type="button" className="demo-button small" onClick={() => {
          setMessage(`${expandedId || visibleEvents[0]?.id || "event ID"} copied for incident notes.`);
        }}>Copy event ID</button>
        <button type="button" className={timezone === "UTC" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTimezone((value) => value === "UTC" ? "Local" : "UTC");
          setMessage(timezone === "UTC" ? "Timezone switched to Local; export state names the timezone." : "Timezone switched back to UTC for investigation consistency.");
        }}>Toggle timezone</button>
        <button type="button" className="demo-button small" onClick={startExport}>Export query</button>
        <button type="button" className={showRetention ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setShowRetention((value) => !value);
          setMessage(!showRetention ? "Retention limit revealed: default UI covers 180 days; archive needed beyond that." : "Retention detail collapsed while recent range remains visible.");
        }}>Retention limits</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ActivityLogBadUx() {
  type Mode = "vagueEvents" | "hiddenScope" | "exportMismatch" | "readClears" | "localTimeDrift" | "duplicateStream";
  const [mode, setMode] = useState<Mode>("vagueEvents");
  const copy: Record<Mode, string> = {
    vagueEvents: "Entries say updated or changed without actor, action, object, timestamp, or event ID.",
    hiddenScope: "The log hides that restricted admin scope excludes three workspaces and redacts actors.",
    exportMismatch: "Export downloads all records for seven days while the screen shows failed events for 24 hours.",
    readClears: "Reading a notification clears the only activity record users expected to investigate.",
    localTimeDrift: "Screen uses local time, export uses UTC, and neither label says which timezone is authoritative.",
    duplicateStream: "At-least-once streamed duplicates inflate the incident count with no duplicate marker."
  };

  return (
    <div className={`quality-example activity-log-bad-demo is-${mode}`}>
      <div className="activity-log-broken" aria-label="Broken activity log behavior">
        <div><b>{mode === "exportMismatch" ? "Export ready" : "Changed settings"}</b><span>{copy[mode]}</span></div>
        <div><b>{mode === "duplicateStream" ? "evt-84921 repeated" : "Admin action"}</b><span>{mode === "hiddenScope" ? "Filtered records are missing with no hidden-count or redaction reason." : "No reliable event schema or scope state."}</span></div>
        <div><b>{mode === "readClears" ? "Notification read" : "08:41"}</b><span>{mode === "localTimeDrift" ? "Same event appears as two different times." : "Investigation context is not preserved."}</span></div>
      </div>
      <div className="demo-row activity-log-controls">
        <button type="button" className={mode === "vagueEvents" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueEvents")}>Vague events</button>
        <button type="button" className={mode === "hiddenScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenScope")}>Hidden scope</button>
        <button type="button" className={mode === "exportMismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("exportMismatch")}>Export mismatch</button>
        <button type="button" className={mode === "readClears" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("readClears")}>Read clears</button>
        <button type="button" className={mode === "localTimeDrift" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("localTimeDrift")}>Time drift</button>
        <button type="button" className={mode === "duplicateStream" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicateStream")}>Duplicate stream</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityLogGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityLogBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityLogGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityLogBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
