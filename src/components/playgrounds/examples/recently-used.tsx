import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type RecentUseScope = "Device" | "Account" | "Workspace";

type RecentlyUsedTarget = {
  id: string;
  title: string;
  type: string;
  location: string;
  lastUsed: string;
  scope: RecentUseScope;
  status: "ready" | "stale" | "restricted";
};

const recentlyUsedTargets: RecentlyUsedTarget[] = [
  { id: "export-invoices", title: "Export invoices", type: "Tool", location: "Finance workspace", lastUsed: "12 min ago", scope: "Workspace", status: "ready" },
  { id: "pricing-sheet", title: "Pricing sheet link", type: "File command", location: "Sales docs", lastUsed: "Yesterday", scope: "Account", status: "ready" },
  { id: "android-task", title: "Returns app task", type: "App task", location: "Mobile switcher", lastUsed: "2 days ago", scope: "Device", status: "ready" },
  { id: "legacy-export", title: "Legacy export job", type: "Command", location: "Archived reports", lastUsed: "5 days ago", scope: "Workspace", status: "stale" },
  { id: "private-workspace", title: "Acquisition room", type: "Workspace", location: "Restricted tenant", lastUsed: "Last week", scope: "Account", status: "restricted" }
];

function RecentlyUsedBoard({
  items,
  showControls = true
}: {
  items: RecentlyUsedTarget[];
  showControls?: boolean;
}) {
  if (items.length === 0) {
    return (
      <section className="recently-used-board is-empty" aria-label="Recently used shortcuts">
        <strong>No recent use recorded</strong>
        <span>Run a tool or use a file command; favorites, pins, recents, and recommendations stay separate.</span>
      </section>
    );
  }

  return (
    <section className="recently-used-board" aria-label="Recently used shortcuts">
      <div className="recently-used-header">
        <div>
          <strong>Recently used</strong>
          <span>{items.length} shortcuts · ordered by meaningful use · clear does not delete targets</span>
        </div>
        <span className="recently-used-scope">Account, device, and workspace scope shown</span>
      </div>
      <div className="recently-used-list">
        {items.map((item, index) => (
          <article key={item.id} className={`recently-used-card is-${item.status}`}>
            <div>
              <strong>{item.title}</strong>
              <span>Position {index + 1} · {item.type} · {item.location}</span>
            </div>
            <small>{item.scope} scope · used {item.lastUsed} · {item.status === "stale" ? "Needs repair" : item.status === "restricted" ? "Access limited" : "Ready"}</small>
            {showControls ? (
              <div className="recently-used-actions" aria-label={`${item.title} recent-use actions`}>
                <button type="button" className="demo-button small">{item.status === "stale" ? "Repair" : "Resume"}</button>
                <button type="button" className="demo-button small">Remove history</button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function RecentlyUsedGoodUi() {
  return (
    <div className="quality-example recently-used-demo">
      <RecentlyUsedBoard items={recentlyUsedTargets.slice(0, 3)} />
      <p className="demo-status">The list is scoped to meaningful use events, shows target type, location, last-used time, availability, resume, and remove-history controls without mixing viewed, favorite, pinned, or recommended items.</p>
    </div>
  );
}

function RecentlyUsedBadUi() {
  return (
    <div className="bad-ui-sample recently-used-bad-demo is-counted-views">
      <div className="recently-used-broken-grid">
        {["Hovered", "Suggested", "Favorite", "Viewed"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken UI calls everything recently used even though none of the entries proves a tool, file, app, workspace, or command was actually operated.</p>
    </div>
  );
}

function RecentlyUsedGoodUx() {
  const [items, setItems] = useState<RecentlyUsedTarget[]>(recentlyUsedTargets.slice(0, 4));
  const [scope, setScope] = useState<RecentUseScope>("Account");
  const [message, setMessage] = useState("Recent-use shortcuts are written by launch, run, insert, edit, or resume events only.");

  const useTarget = (target: RecentlyUsedTarget) => {
    setItems((current) => [{ ...target, scope, lastUsed: "Just now", status: target.status === "stale" ? "ready" : target.status }, ...current.filter((item) => item.id !== target.id)].slice(0, 4));
    setMessage(`${target.title} was used and moved to the top; duplicate recent-use entries were avoided.`);
  };

  const removeFirst = () => {
    if (items.length === 0) {
      setMessage("No recently used shortcuts remain; no files, commands, apps, or workspaces were deleted.");
      return;
    }
    const [first, ...rest] = items;
    setItems(rest);
    setMessage(`${first.title} removed from recent-use history only; the ${first.type.toLowerCase()} still exists.`);
  };

  const clearAll = () => {
    setItems([]);
    setMessage("Recently used history cleared for the selected scope; favorites, pins, and viewed-item history remain unchanged.");
  };

  const repairStale = () => {
    setItems((current) => current.map((item) => item.id === "legacy-export" ? { ...item, title: "Export archive job", location: "Finance archive", status: "ready", lastUsed: "Just repaired" } : item));
    setMessage("Stale recent-use shortcut repaired with a current target instead of opening a dead command.");
  };

  return (
    <div className="quality-example recently-used-demo">
      <div className="recently-used-toolbar" aria-label="Recent-use management controls">
        <label>
          <span>Recent-use scope</span>
          <select value={scope} onChange={(event) => {
            const next = event.target.value as RecentUseScope;
            setScope(next);
            setMessage(`${next} scope selected; users can see where recent-use history will appear.`);
          }}>
            <option>Account</option>
            <option>Device</option>
            <option>Workspace</option>
          </select>
        </label>
        <button type="button" className="demo-button small primary" onClick={() => useTarget(recentlyUsedTargets[1])}>Use file command</button>
        <button type="button" className="demo-button small" onClick={() => useTarget(recentlyUsedTargets[3])}>Run stale job</button>
        <button type="button" className="demo-button small" onClick={() => useTarget(recentlyUsedTargets[4])}>Resume workspace</button>
        <button type="button" className="demo-button small" onClick={removeFirst}>Remove first</button>
        <button type="button" className="demo-button small" onClick={clearAll}>Clear recent use</button>
        <button type="button" className="demo-button small" onClick={repairStale}>Repair stale</button>
        <button type="button" className="demo-button small" onClick={() => {
          setItems(recentlyUsedTargets.slice(0, 4));
          setScope("Account");
          setMessage("Default recent-use list restored with automatic use history separate from favorites, pins, and views.");
        }}>Restore recents</button>
      </div>
      <RecentlyUsedBoard items={items} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function RecentlyUsedBadUx() {
  type Mode = "counted-views" | "mixed-saved" | "delete-confusion" | "no-scope" | "unlimited-history" | "recommendation-pollution" | "dead-shortcut";
  const [mode, setMode] = useState<Mode>("counted-views");
  const copy: Record<Mode, string> = {
    "counted-views": "The list counts hover, preview, and impressions as use, so it no longer represents tools or targets the user operated.",
    "mixed-saved": "Recently used, recently viewed, favorites, pinned items, and saved views are merged into one list with no removal contract.",
    "delete-confusion": "Remove from recent use deletes the source file instead of clearing only the shortcut.",
    "no-scope": "Recent-use entries sync to a shared device without account, workspace, or device scope labels.",
    "unlimited-history": "The list never caps or expires, becoming a long activity log instead of a quick return path.",
    "recommendation-pollution": "Recommended actions appear in Recently used before the user runs them.",
    "dead-shortcut": "A moved command remains as a dead shortcut with no remove, repair, or browse-again path."
  };
  const labels: Record<Mode, string[]> = {
    "counted-views": ["Hover", "Preview", "Seen", "Ad"],
    "mixed-saved": ["Recent", "Pinned", "Favorite", "Saved"],
    "delete-confusion": ["Removed", "File gone", "No undo", "Audit?"],
    "no-scope": ["Device?", "Account?", "Shared", "Private"],
    "unlimited-history": ["Item 83", "Item 84", "Item 85", "Item 86"],
    "recommendation-pollution": ["Try AI", "Suggested", "Popular", "Not used"],
    "dead-shortcut": ["404", "Moved", "No access", "Still recent"]
  };

  return (
    <div className={`quality-example recently-used-bad-demo is-${mode}`}>
      <div className="recently-used-broken-grid">
        {labels[mode].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <strong>{mode === "delete-confusion" ? "Target deleted" : mode === "recommendation-pollution" ? "Not actually used" : "Broken recent use"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row recently-used-controls">
        <button type="button" className={mode === "counted-views" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("counted-views")}>Counted views</button>
        <button type="button" className={mode === "mixed-saved" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixed-saved")}>Mixed saved</button>
        <button type="button" className={mode === "delete-confusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("delete-confusion")}>Delete confusion</button>
        <button type="button" className={mode === "no-scope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-scope")}>No scope</button>
        <button type="button" className={mode === "unlimited-history" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unlimited-history")}>Unlimited history</button>
        <button type="button" className={mode === "recommendation-pollution" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("recommendation-pollution")}>Recommendation pollution</button>
        <button type="button" className={mode === "dead-shortcut" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dead-shortcut")}>Dead shortcut</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecentlyUsedGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecentlyUsedBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecentlyUsedGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecentlyUsedBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
