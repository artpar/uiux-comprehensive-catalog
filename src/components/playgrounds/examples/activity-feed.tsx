import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ActivityFeedMode = "all" | "unread" | "mentions" | "replies" | "reactions" | "appEvent" | "repoEvent" | "grouped" | "customView" | "cleared";

type ActivityFeedItem = {
  id: string;
  actor: string;
  verb: string;
  object: string;
  source: string;
  timestamp: string;
  type: "Mention" | "Reply" | "Reaction" | "App" | "Repository" | "Meeting";
  tone: "human" | "bot" | "repo" | "meeting";
  preview: string;
  scope: string;
  unread?: boolean;
  cleared?: boolean;
  grouped?: boolean;
  custom?: boolean;
  retention: string;
  action: string;
};

const activityFeedItems: ActivityFeedItem[] = [
  {
    id: "act-118",
    actor: "Priya Shah",
    verb: "mentioned you in",
    object: "#refunds",
    source: "Teams",
    timestamp: "2 min ago",
    type: "Mention",
    tone: "human",
    preview: "Can you confirm the April refund exception before the noon review?",
    scope: "Support workspace",
    unread: true,
    custom: true,
    retention: "Visible for 30 days",
    action: "Reply"
  },
  {
    id: "act-117",
    actor: "Build bot",
    verb: "marked",
    object: "release-128 failed",
    source: "Deployments",
    timestamp: "7 min ago",
    type: "App",
    tone: "bot",
    preview: "Smoke test checkout-payment timed out in us-east-1.",
    scope: "Release channel",
    unread: true,
    custom: true,
    retention: "Audit details in deployment log",
    action: "Open run"
  },
  {
    id: "act-116",
    actor: "Maya Chen",
    verb: "replied to",
    object: "handoff summary",
    source: "Slack",
    timestamp: "18 min ago",
    type: "Reply",
    tone: "human",
    preview: "Added the rollback note and tagged Rahul for the schema question.",
    scope: "Incident review",
    unread: true,
    retention: "Thread keeps the durable conversation",
    action: "Open thread"
  },
  {
    id: "act-115",
    actor: "5 teammates",
    verb: "reacted to",
    object: "your launch note",
    source: "Slack",
    timestamp: "26 min ago",
    type: "Reaction",
    tone: "human",
    preview: "Grouped reactions collapsed into one low-priority activity item.",
    scope: "Launch room",
    grouped: true,
    retention: "Grouped for 24 hours",
    action: "Expand group"
  },
  {
    id: "act-114",
    actor: "Rahul Patel",
    verb: "merged",
    object: "PR #742",
    source: "GitHub",
    timestamp: "41 min ago",
    type: "Repository",
    tone: "repo",
    preview: "payments: add retry window for card network failures.",
    scope: "revenue-api",
    custom: true,
    retention: "Repository history remains separate",
    action: "Open PR"
  },
  {
    id: "act-113",
    actor: "Calendar",
    verb: "updated",
    object: "incident review",
    source: "Calendar",
    timestamp: "1 hr ago",
    type: "Meeting",
    tone: "meeting",
    preview: "Room moved to Delta and remote link was regenerated.",
    scope: "Operations",
    retention: "Event details remain in Calendar",
    action: "Open event"
  },
  {
    id: "act-112",
    actor: "Nora Lee",
    verb: "cleared",
    object: "triage reminder",
    source: "Activity",
    timestamp: "Yesterday",
    type: "App",
    tone: "human",
    preview: "Cleared activity remains recoverable in the cleared filter.",
    scope: "Personal activity",
    cleared: true,
    retention: "Cleared view keeps 14 days",
    action: "Restore"
  }
];

function activityVisibleItems(mode: ActivityFeedMode, clearedIds: string[] = []) {
  return activityFeedItems.filter((item) => {
    const isCleared = item.cleared || clearedIds.includes(item.id);
    if (mode === "cleared") return isCleared;
    if (isCleared) return false;
    if (mode === "unread") return item.unread;
    if (mode === "mentions") return item.type === "Mention";
    if (mode === "replies") return item.type === "Reply";
    if (mode === "reactions") return item.type === "Reaction";
    if (mode === "appEvent") return item.type === "App";
    if (mode === "repoEvent") return item.type === "Repository";
    if (mode === "grouped") return item.grouped;
    if (mode === "customView") return item.custom;
    return true;
  });
}

function ActivityFeedEventRow({
  item,
  index,
  total,
  detailed = true,
  idSuffix = "demo",
  onClear,
  onOpen,
  onReply
}: {
  item: ActivityFeedItem;
  index: number;
  total: number;
  detailed?: boolean;
  idSuffix?: string;
  onClear?: (id: string) => void;
  onOpen?: (id: string) => void;
  onReply?: (id: string) => void;
}) {
  const titleId = `activity-feed-${idSuffix}-${item.id}-title`;
  return (
    <article
      className={`activity-feed-event is-${item.tone} ${item.unread ? "is-unread" : ""} ${item.grouped ? "is-grouped" : ""} ${item.cleared ? "is-cleared" : ""}`}
      aria-labelledby={titleId}
      aria-posinset={index + 1}
      aria-setsize={total}
    >
      <div className="activity-feed-icon" aria-hidden="true">{item.actor.slice(0, 1)}</div>
      <div className="activity-feed-event-body">
        <div className="activity-feed-event-head">
          <span className={`activity-feed-type is-${item.type.toLowerCase()}`}>{item.type}</span>
          <time>{item.timestamp}</time>
        </div>
        <h4 id={titleId}><strong>{item.actor}</strong> {item.verb} <span>{item.object}</span></h4>
        {detailed ? <p>{item.preview}</p> : null}
        <div className="activity-feed-meta">
          <span>{item.source}</span>
          <span>{item.scope}</span>
          <span>{item.unread ? "Unread" : item.cleared ? "Cleared" : "Read"}</span>
          <span>{item.retention}</span>
        </div>
        <div className="activity-feed-actions">
          <button type="button" className="demo-button small" onClick={() => onOpen?.(item.id)}>{item.action}</button>
          {item.type === "Mention" || item.type === "Reply" ? (
            <button type="button" className="demo-button small" onClick={() => onReply?.(item.id)}>Quick reply</button>
          ) : null}
          <button type="button" className="demo-button small" onClick={() => onClear?.(item.id)}>{item.cleared ? "Restore" : "Clear"}</button>
        </div>
      </div>
    </article>
  );
}

function ActivityFeedFrame({
  mode = "all",
  clearedIds = [],
  detailed = true,
  savedView = false,
  idSuffix = "demo",
  onClear,
  onOpen,
  onReply
}: {
  mode?: ActivityFeedMode;
  clearedIds?: string[];
  detailed?: boolean;
  savedView?: boolean;
  idSuffix?: string;
  onClear?: (id: string) => void;
  onOpen?: (id: string) => void;
  onReply?: (id: string) => void;
}) {
  const items = activityVisibleItems(mode, clearedIds);
  const labelId = `activity-feed-label-${idSuffix}`;
  return (
    <section className={`activity-feed-frame is-${mode} ${detailed ? "is-detailed" : "is-dense"}`} aria-labelledby={labelId}>
      <div className="activity-feed-topbar">
        <div>
          <span>Activity</span>
          <h4 id={labelId}>{savedView ? "VIP and release activity" : "Team activity"}</h4>
        </div>
        <div className="activity-feed-counts" aria-label="Activity summary">
          <span>{items.length} visible</span>
          <span>{activityFeedItems.filter((item) => item.unread && !clearedIds.includes(item.id)).length} unread</span>
          <span>{savedView ? "Saved view" : "All sources"}</span>
        </div>
      </div>
      <div className="activity-feed-filterbar" aria-label="Activity type filters">
        <span className={mode === "all" ? "is-active" : ""}>All</span>
        <span className={mode === "unread" ? "is-active" : ""}>Unread</span>
        <span className={mode === "mentions" ? "is-active" : ""}>Mentions</span>
        <span className={mode === "replies" ? "is-active" : ""}>Replies</span>
        <span className={mode === "appEvent" ? "is-active" : ""}>Apps</span>
        <span className={mode === "repoEvent" ? "is-active" : ""}>Repos</span>
        <span className={mode === "cleared" ? "is-active" : ""}>Cleared</span>
      </div>
      <div className="activity-feed-list" role="feed" aria-labelledby={labelId} aria-busy="false">
        {items.length > 0 ? items.map((item, index) => (
          <ActivityFeedEventRow
            key={item.id}
            item={{ ...item, cleared: item.cleared || clearedIds.includes(item.id) }}
            index={index}
            total={items.length}
            detailed={detailed}
            idSuffix={idSuffix}
            onClear={onClear}
            onOpen={onOpen}
            onReply={onReply}
          />
        )) : (
          <div className="activity-feed-empty">
            <strong>No matching activity</strong>
            <span>Filters do not delete events; switch filters or open cleared activity.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function ActivityFeedGoodUi() {
  return (
    <div className="quality-example activity-feed-demo">
      <ActivityFeedFrame />
      <p className="demo-status">The feed names actor, verb, object, source, timestamp, event type, unread state, retention, and a destination for each recent work event.</p>
    </div>
  );
}

function ActivityFeedBadUi() {
  return (
    <div className="bad-ui-sample activity-feed-bad-demo is-vague">
      <strong>Recent things</strong>
      <div className="activity-feed-broken" aria-label="Broken activity feed">
        <span>Updated</span>
        <span>Someone did stuff</span>
        <span>New item</span>
        <span>Message</span>
      </div>
      <p className="demo-status">The broken surface hides actor, object, event type, source, timestamp, unread meaning, and destination.</p>
    </div>
  );
}

function ActivityFeedGoodUx() {
  const [mode, setMode] = useState<ActivityFeedMode>("all");
  const [clearedIds, setClearedIds] = useState<string[]>([]);
  const [detailed, setDetailed] = useState(true);
  const [savedView, setSavedView] = useState(false);
  const [message, setMessage] = useState("All recent work activity is visible with actor, verb, object, source, and destination.");

  function choose(nextMode: ActivityFeedMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }

  function clearItem(id: string) {
    setClearedIds((ids) => ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]);
    setMessage(clearedIds.includes(id) ? "Activity restored from the cleared filter." : "Activity cleared here and recoverable from the cleared filter.");
  }

  function openItem(id: string) {
    const item = activityFeedItems.find((candidate) => candidate.id === id);
    setMessage(item ? `Opened ${item.object} in ${item.source}; activity state stays synchronized with its source.` : "Opened the source item.");
  }

  function replyToItem(id: string) {
    const item = activityFeedItems.find((candidate) => candidate.id === id);
    setMessage(item ? `Reply editor opened for ${item.object}, with focus returning to this activity row after send.` : "Reply editor opened.");
  }

  return (
    <div className="quality-example activity-feed-demo">
      <ActivityFeedFrame
        mode={mode}
        clearedIds={clearedIds}
        detailed={detailed}
        savedView={savedView}
        idSuffix="good-ux"
        onClear={clearItem}
        onOpen={openItem}
        onReply={replyToItem}
      />
      <div className="demo-row activity-feed-controls" aria-label="Activity feed exercise controls">
        <button type="button" className={mode === "all" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("all", "All recent activity restored across people, apps, repositories, and meetings.")}>All</button>
        <button type="button" className={mode === "unread" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unread", "Unread filter shows only activity that still needs attention.")}>Unread</button>
        <button type="button" className={mode === "mentions" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mentions", "Mention activity stays separate from broad feed content and notification cleanup.")}>Mentions</button>
        <button type="button" className={mode === "replies" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("replies", "Replies route back to the underlying thread rather than becoming a separate conversation.")}>Replies</button>
        <button type="button" className={mode === "reactions" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reactions", "Repeated reactions are grouped into one low-priority row.")}>Reactions</button>
        <button type="button" className={mode === "appEvent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("appEvent", "App events carry source, preview, and destination instead of anonymous system text.")}>App event</button>
        <button type="button" className={mode === "repoEvent" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("repoEvent", "Repository activity links to GitHub without turning the feed into an audit log.")}>Repo event</button>
        <button type="button" className={mode === "grouped" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("grouped", "Grouped noise remains visible but collapsed until the user expands it.")}>Grouped</button>
        <button type="button" className={savedView ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSavedView((value) => !value);
          setMode("customView");
          setMessage(!savedView ? "Custom view keeps VIP and release activity without changing notification preferences." : "Saved view turned off; filter remains explicit.");
        }}>Custom view</button>
        <button type="button" className={detailed ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setDetailed((value) => !value);
          setMessage(detailed ? "Dense layout still preserves actor, action, object, type, and destination." : "Detailed layout restores previews and retention notes.");
        }}>{detailed ? "Detailed" : "Dense"}</button>
        <button type="button" className={mode === "cleared" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("cleared", "Cleared activity is recoverable and does not contradict notification state.")}>Cleared</button>
        <button type="button" className="demo-button small" onClick={() => clearItem("act-115")}>Clear reactions</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ActivityFeedBadUx() {
  type Mode = "vague" | "noFilters" | "auditConfusion" | "noiseFlood" | "badgeMismatch" | "wrongLink" | "privateLeak";
  const [mode, setMode] = useState<Mode>("vague");
  const copy: Record<Mode, string> = {
    vague: "Activity text omits who acted, what changed, where it happened, and how to continue.",
    noFilters: "Mentions, replies, reactions, app events, and repository events all compete in one unfilterable list.",
    auditConfusion: "The feed is exported as evidence even though it lacks immutable event IDs, IPs, retention, and complete actor data.",
    noiseFlood: "Reaction bursts and bot sync updates push a failed deployment and direct mention below the fold.",
    badgeMismatch: "The user clears Activity, but the notification center badge still counts the same event as unread.",
    wrongLink: "Opening a repository event lands on the project home instead of the pull request that changed.",
    privateLeak: "A private-channel event exposes the channel name and file title to someone without access."
  };
  const cells: Record<Mode, string[]> = {
    vague: ["Updated", "Someone", "Thing"],
    noFilters: ["Mention", "Like", "Bot", "PR", "Reply", "Meeting"],
    auditConfusion: ["Export CSV", "No event ID", "No retention"],
    noiseFlood: ["19 likes", "18 likes", "Bot sync", "Bot sync", "Mention hidden"],
    badgeMismatch: ["Activity clear", "Badge 7", "Unread again"],
    wrongLink: ["PR merged", "Open", "Project home"],
    privateLeak: ["#exec-planning", "layoff-file.pdf", "No access"]
  };
  return (
    <div className={`quality-example activity-feed-bad-demo is-${mode}`}>
      <strong>{mode === "auditConfusion" ? "Activity treated as audit evidence" : "Broken activity feed"}</strong>
      <div className="activity-feed-broken" aria-label="Broken activity state">
        {cells[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row activity-feed-controls">
        <button type="button" className={mode === "vague" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague")}>Vague</button>
        <button type="button" className={mode === "noFilters" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noFilters")}>No filters</button>
        <button type="button" className={mode === "auditConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auditConfusion")}>Audit confusion</button>
        <button type="button" className={mode === "noiseFlood" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noiseFlood")}>Noise flood</button>
        <button type="button" className={mode === "badgeMismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("badgeMismatch")}>Badge mismatch</button>
        <button type="button" className={mode === "wrongLink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongLink")}>Wrong link</button>
        <button type="button" className={mode === "privateLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privateLeak")}>Private leak</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityFeedGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityFeedBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityFeedGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ActivityFeedBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
