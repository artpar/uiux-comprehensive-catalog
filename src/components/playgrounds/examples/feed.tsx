import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type FeedItem = {
  id: string;
  source: string;
  type: "Team" | "System" | "Recommended" | "Sponsored";
  time: string;
  title: string;
  body: string;
  meta: string;
  unread?: boolean;
  promoted?: boolean;
};

const feedItems: FeedItem[] = [
  {
    id: "feed-109",
    source: "Maya Chen",
    type: "Team",
    time: "2 min ago",
    title: "Shipment review moved to finance",
    body: "Maya attached the disputed carrier note and asked finance to confirm the surcharge before end of day.",
    meta: "Project Stream / Shipments",
    unread: true
  },
  {
    id: "feed-108",
    source: "Workflow bot",
    type: "System",
    time: "18 min ago",
    title: "Carrier export finished",
    body: "The nightly label export completed with 1 warning. Open the export route for the full job history.",
    meta: "Background job"
  },
  {
    id: "feed-107",
    source: "Noah Kim",
    type: "Team",
    time: "34 min ago",
    title: "Backorder note updated",
    body: "Noah added a customer-approved split-shipment note and linked the supplier ETA.",
    meta: "Order ORD-1844"
  }
];

const feedQueuedItem: FeedItem = {
  id: "feed-110",
  source: "Priya Shah",
  type: "Team",
  time: "Just now",
  title: "New carrier exception posted",
  body: "Priya added a photo and tagged the carrier owner. The item is waiting above the current reading position.",
  meta: "Live update",
  unread: true
};

const feedOlderItem: FeedItem = {
  id: "feed-094",
  source: "Maya Chen",
  type: "Team",
  time: "Yesterday",
  title: "Original shipment exception created",
  body: "Maya opened the case after the warehouse scan showed a damaged pallet during pickup.",
  meta: "Loaded older boundary"
};

function FeedArticle({
  item,
  index,
  total,
  read,
  prefix,
  onRead
}: {
  item: FeedItem;
  index: number;
  total: number;
  read?: boolean;
  prefix: string;
  onRead?: (id: string) => void;
}) {
  const titleId = `${prefix}-${item.id}-title`;
  const isUnread = item.unread && !read;

  return (
    <article
      className={`feed-item ${isUnread ? "is-unread" : ""} ${item.promoted || item.type === "Sponsored" ? "is-promoted" : ""}`}
      aria-labelledby={titleId}
      aria-posinset={index + 1}
      aria-setsize={total}
    >
      <div className="feed-avatar" aria-hidden="true">{item.source.slice(0, 1)}</div>
      <div className="feed-content">
        <div className="feed-item-head">
          <div>
            <span className="feed-source">{item.source}</span>
            <span className={`feed-type is-${item.type.toLowerCase()}`}>{item.type}</span>
          </div>
          <time>{item.time}</time>
        </div>
        <h4 id={titleId}>{item.title}</h4>
        <p>{item.body}</p>
        <div className="feed-meta">
          <span>{item.meta}</span>
          {isUnread ? <span>Unread</span> : <span>Read position preserved</span>}
        </div>
        <div className="feed-actions">
          <button type="button" className="demo-button small">Open update</button>
          <button type="button" className="demo-button small">Save</button>
          <button type="button" className="demo-button small" onClick={() => onRead?.(item.id)}>Mark read</button>
        </div>
      </div>
    </article>
  );
}

function FeedGoodUi() {
  return (
    <div className="quality-example feed-demo">
      <div className="feed-toolbar" id="feed-ui-label">
        <strong>Project stream</strong>
        <span>Latest first</span>
        <span>1 new item waiting</span>
      </div>
      <button type="button" className="feed-new-banner">1 new update queued - jump to latest when ready</button>
      <div className="feed-stack" role="feed" aria-labelledby="feed-ui-label" aria-busy="false">
        {feedItems.map((item, index) => (
          <FeedArticle key={item.id} item={item} index={index} total={feedItems.length} prefix="feed-ui" />
        ))}
      </div>
      <button type="button" className="demo-button small">Load older updates</button>
      <p className="demo-status">The stream labels source, time, item boundary, order, queued new content, and the older-loading boundary without moving the reader.</p>
    </div>
  );
}

function FeedBadUi() {
  return (
    <div className="bad-ui-sample feed-bad-demo is-mixedOrder">
      <div className="feed-broken" aria-label="Broken feed">
        <div><b>Important thing</b><span>No source, no timestamp, and no stable article boundary.</span></div>
        <div><b>You may like this</b><span>Looks identical to followed content but is a paid insertion.</span></div>
        <div><b>Yesterday? Today?</b><span>Items are ranked, chronological, and sponsored without labels.</span></div>
      </div>
      <p className="demo-status">The broken feed hides order, source, and inserted-item reasons, so users cannot trust why each item appears.</p>
    </div>
  );
}

function FeedGoodUx() {
  const [paused, setPaused] = useState(true);
  const [queuedCount, setQueuedCount] = useState(1);
  const [showQueued, setShowQueued] = useState(false);
  const [olderLoaded, setOlderLoaded] = useState(false);
  const [teamOnly, setTeamOnly] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [message, setMessage] = useState("Live updates are paused, so new posts queue without moving the current reading position.");

  const currentItems = [
    ...(showQueued ? [feedQueuedItem] : []),
    ...feedItems,
    ...(olderLoaded ? [feedOlderItem] : [])
  ].filter((item) => !teamOnly || item.type === "Team");

  const markRead = (id: string) => {
    setReadIds((ids) => ids.includes(id) ? ids : [...ids, id]);
    setMessage(`${id} marked read. The item stays in the stream and focus remains near the action.`);
  };

  const addIncoming = () => {
    if (paused) {
      setQueuedCount((count) => count + 1);
      setMessage("A new post arrived and was added to the waiting banner instead of shifting the feed.");
      return;
    }
    setShowQueued(true);
    setMessage("Live mode inserted the new post at the top after the user chose to keep live updates running.");
  };

  return (
    <div className="quality-example feed-demo">
      <div className="feed-toolbar" id="feed-ux-label">
        <strong>Project stream</strong>
        <span>{teamOnly ? "Team updates" : "All updates"}</span>
        <span>{paused ? "Live paused" : "Live running"}</span>
        <span>{queuedCount > 0 && !showQueued ? `${queuedCount} waiting` : `${currentItems.length} visible`}</span>
      </div>
      {queuedCount > 0 && !showQueued ? (
        <button type="button" className="feed-new-banner" onClick={() => {
          setShowQueued(true);
          setQueuedCount(0);
          setMessage("Jumped to the latest queued update by explicit command; the new item is now at the top.");
        }}>{queuedCount} new {queuedCount === 1 ? "update" : "updates"} waiting - jump to latest</button>
      ) : null}
      <div className="feed-stack" role="feed" aria-labelledby="feed-ux-label" aria-busy="false">
        {currentItems.map((item, index) => (
          <FeedArticle
            key={item.id}
            item={item}
            index={index}
            total={currentItems.length}
            prefix="feed-ux"
            read={readIds.includes(item.id)}
            onRead={markRead}
          />
        ))}
      </div>
      <div className="demo-row feed-controls" aria-label="Feed exercise controls">
        <button type="button" className="demo-button small" onClick={addIncoming}>New post arrives</button>
        <button type="button" className={paused ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPaused((value) => !value);
          setMessage(!paused ? "Live updates paused. New posts will queue until the reader jumps." : "Live updates enabled. Incoming posts can appear at the top.");
        }}>{paused ? "Resume live" : "Pause live"}</button>
        <button type="button" className="demo-button small" onClick={() => {
          setShowQueued(true);
          setQueuedCount(0);
          setMessage("Latest update opened from the banner, with the older reading position still recoverable.");
        }}>Jump latest</button>
        <button type="button" className={teamOnly ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTeamOnly((value) => !value);
          setMessage(!teamOnly ? "Filtered to team updates. System items are hidden without changing read state." : "All update types restored.");
        }}>Filter team</button>
        <button type="button" className={olderLoaded ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOlderLoaded(true);
          setMessage("Older updates loaded below the current boundary, and the Load older control remains the orientation point.");
        }}>Load older</button>
        <button type="button" className="demo-button small" onClick={() => {
          setReadIds((ids) => ids.includes("feed-109") ? ids : [...ids, "feed-109"]);
          setMessage("The unread marker changed to read without removing the item or clearing the new-items banner.");
        }}>Mark read</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function FeedBadUx() {
  type Mode = "autoJump" | "mixedOrder" | "hiddenSponsored" | "staleUnread" | "noContext" | "endlessTrap";
  const [mode, setMode] = useState<Mode>("autoJump");
  const copy: Record<Mode, string> = {
    autoJump: "A new post prepends itself and moves the viewport while the user is reading.",
    mixedOrder: "Ranked, latest, and following content appear together with no order label.",
    hiddenSponsored: "A paid story looks identical to followed team updates and has no disclosure.",
    staleUnread: "Unread markers remain after the user opens related work elsewhere.",
    noContext: "Items show action text without author, source, timestamp, or related object.",
    endlessTrap: "Infinite loading hides the footer and offers no load boundary, save point, or end state."
  };

  return (
    <div className={`quality-example feed-bad-demo is-${mode}`}>
      <div className="feed-broken" aria-label="Broken feed behavior">
        <div><b>{mode === "hiddenSponsored" ? "Recommended carrier deal" : "New update"}</b><span>{copy[mode]}</span></div>
        <div><b>{mode === "noContext" ? "Approved" : "Shipment note"}</b><span>{mode === "mixedOrder" ? "Yesterday item appears between two current posts." : "No stable loading or reading-position behavior."}</span></div>
        <div><b>{mode === "endlessTrap" ? "Loading..." : "Older item"}</b><span>{mode === "staleUnread" ? "Still says unread after the order was opened." : "Footer and route return are not recoverable."}</span></div>
      </div>
      <div className="demo-row feed-controls">
        <button type="button" className={mode === "autoJump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("autoJump")}>Auto jump</button>
        <button type="button" className={mode === "mixedOrder" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedOrder")}>Mixed order</button>
        <button type="button" className={mode === "hiddenSponsored" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenSponsored")}>Hidden sponsored</button>
        <button type="button" className={mode === "staleUnread" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleUnread")}>Stale unread</button>
        <button type="button" className={mode === "noContext" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noContext")}>No context</button>
        <button type="button" className={mode === "endlessTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("endlessTrap")}>Endless trap</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FeedGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FeedBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FeedGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FeedBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
