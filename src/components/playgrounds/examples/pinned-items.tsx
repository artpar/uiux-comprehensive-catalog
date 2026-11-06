import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PinnedScope = "Personal" | "Team" | "Public";

type PinnedItem = {
  id: string;
  title: string;
  type: string;
  location: string;
  scope: PinnedScope;
  status: "current" | "stale" | "locked";
};

const pinnedItemPool: PinnedItem[] = [
  { id: "benefits-checklist", title: "Benefits checklist", type: "Folder", location: "Shared library", scope: "Team", status: "current" },
  { id: "quarterly-review", title: "Quarterly review", type: "File", location: "Planning", scope: "Personal", status: "current" },
  { id: "profile-api", title: "Profile API", type: "Repository", location: "Public profile", scope: "Public", status: "current" },
  { id: "legacy-report", title: "Legacy margin report", type: "Report", location: "Finance", scope: "Team", status: "stale" },
  { id: "security-notice", title: "Security notice", type: "Policy", location: "Admin managed", scope: "Team", status: "locked" }
];

function PinnedItemsBoard({
  items,
  limit = 3,
  showManage = true
}: {
  items: PinnedItem[];
  limit?: number;
  showManage?: boolean;
}) {
  return (
    <div className="pinned-items-board">
      <div className="pinned-items-header">
        <div>
          <strong>Pinned workspace items</strong>
          <span>{items.length} of {limit} pins used · stable order · unpin keeps the item</span>
        </div>
        <span className="pinned-items-scope">Personal and team scopes shown</span>
      </div>
      <section className="pinned-items-list" aria-label="Pinned items">
        {items.map((item, index) => (
          <article key={item.id} className={`pinned-item-card is-${item.status}`}>
            <div>
              <strong>{item.title}</strong>
              <span>Position {index + 1} · {item.type} · {item.location}</span>
            </div>
            <small>{item.scope} pin · {item.status === "stale" ? "Needs repair" : item.status === "locked" ? "Policy locked" : "Current"}</small>
            {showManage ? (
              <div className="pinned-item-actions" aria-label={`${item.title} pin actions`}>
                <button type="button" className="demo-button small">Move earlier</button>
                <button type="button" className="demo-button small">Move later</button>
                <button type="button" className="demo-button small" disabled={item.status === "locked"}>{item.status === "stale" ? "Replace" : "Unpin"}</button>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}

function PinnedItemsGoodUi() {
  return (
    <div className="quality-example pinned-items-demo">
      <PinnedItemsBoard items={pinnedItemPool.slice(0, 3)} />
      <p className="demo-status">The pinned section names its scope, limit, stable order, item type, location, pin state, reorder controls, and unpin path without implying deletion.</p>
    </div>
  );
}

function PinnedItemsBadUi() {
  return (
    <div className="bad-ui-sample pinned-items-bad-demo is-mixedRecents">
      <div className="pinned-items-broken-list">
        {["Important", "Yesterday", "Starred?", "Auto"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken list mixes pinned, recent, favorite, and automatic items without scope, order, state, limit, or a safe unpin action.</p>
    </div>
  );
}

function PinnedItemsGoodUx() {
  const [pins, setPins] = useState<PinnedItem[]>(pinnedItemPool.slice(0, 3));
  const [scope, setScope] = useState<PinnedScope>("Personal");
  const [message, setMessage] = useState("Pinned items stay in a stable top section; unpin removes only the pin relationship.");

  const addPin = (item: PinnedItem) => {
    if (pins.some((pin) => pin.id === item.id)) {
      setMessage(`${item.title} is already pinned; duplicates are blocked.`);
      return;
    }
    if (pins.length >= 3) {
      setMessage("Pin limit reached: choose a pinned item to replace or reorder before adding another.");
      return;
    }
    setPins((current) => [{ ...item, scope }, ...current]);
    setMessage(`${item.title} pinned as ${scope.toLowerCase()} quick access at position 1.`);
  };

  const unpinFirst = () => {
    if (pins.length === 0) {
      setMessage("No pinned items remain; the underlying files and repositories were not deleted.");
      return;
    }
    const [first, ...rest] = pins;
    setPins(rest);
    setMessage(`${first.title} was unpinned only; the ${first.type.toLowerCase()} still exists in ${first.location}.`);
  };

  const moveLastFirst = () => {
    if (pins.length < 2) return;
    setPins((current) => [current[current.length - 1], ...current.slice(0, current.length - 1)]);
    setMessage("Last pinned item moved to position 1; visible order, keyboard order, and mobile order stay aligned.");
  };

  const replaceStale = () => {
    setPins((current) => current.map((pin) => pin.status === "stale" ? { ...pinnedItemPool[1], scope: pin.scope } : pin));
    setMessage("Stale pinned target replaced with Quarterly review instead of opening a dead link.");
  };

  return (
    <div className="quality-example pinned-items-demo">
      <div className="pinned-items-toolbar" aria-label="Pin management controls">
        <label>
          <span>New pin scope</span>
          <select value={scope} onChange={(event) => {
            const next = event.target.value as PinnedScope;
            setScope(next);
            setMessage(`${next} scope selected for the next pin; audience remains visible before saving.`);
          }}>
            <option>Personal</option>
            <option>Team</option>
            <option>Public</option>
          </select>
        </label>
        <button type="button" className="demo-button small primary" onClick={() => addPin(pinnedItemPool[3])}>Pin stale report</button>
        <button type="button" className="demo-button small" onClick={() => addPin(pinnedItemPool[4])}>Pin locked policy</button>
        <button type="button" className="demo-button small" onClick={moveLastFirst}>Move last first</button>
        <button type="button" className="demo-button small" onClick={unpinFirst}>Unpin first</button>
        <button type="button" className="demo-button small" onClick={replaceStale}>Replace stale</button>
        <button type="button" className="demo-button small" onClick={() => {
          setPins(pinnedItemPool.slice(0, 3));
          setScope("Personal");
          setMessage("Default pinned order restored with no change to favorites, recents, or subscriptions.");
        }}>Restore pins</button>
      </div>
      <PinnedItemsBoard items={pins} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PinnedItemsBadUx() {
  type Mode = "mixedRecents" | "deleteConfusion" | "sharedSurprise" | "unlimitedPins" | "dragOnly" | "staleDeadLink" | "privacyLeak";
  const [mode, setMode] = useState<Mode>("mixedRecents");
  const copy: Record<Mode, string> = {
    mixedRecents: "Pinned files, recent files, favorites, and recommendations share one list, so users cannot predict what stays fixed.",
    deleteConfusion: "Unpin removes the underlying file because the action was labelled only Remove.",
    sharedSurprise: "A team pin is reordered for everyone with no owner, audience, or rollback warning.",
    unlimitedPins: "The section allows dozens of pins, so nothing remains prominent.",
    dragOnly: "Pins can be reordered only by dragging, leaving keyboard and touch users without equivalent controls.",
    staleDeadLink: "A stale pinned report opens a dead link instead of offering replace, remove, or request-access recovery.",
    privacyLeak: "A restricted private item name appears in a public pinned section."
  };

  return (
    <div className={`quality-example pinned-items-bad-demo is-${mode}`}>
      <div className="pinned-items-broken-list">
        {["Pinned?", mode === "privacyLeak" ? "CEO plan" : "Recent", mode === "unlimitedPins" ? "Item 37" : "Star", mode === "staleDeadLink" ? "404" : "Link"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <strong>{mode === "sharedSurprise" ? "Changed for team" : mode === "deleteConfusion" ? "Removed" : "Important"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row pinned-items-controls">
        <button type="button" className={mode === "mixedRecents" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedRecents")}>Mixed recents</button>
        <button type="button" className={mode === "deleteConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deleteConfusion")}>Delete confusion</button>
        <button type="button" className={mode === "sharedSurprise" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("sharedSurprise")}>Shared surprise</button>
        <button type="button" className={mode === "unlimitedPins" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unlimitedPins")}>Unlimited pins</button>
        <button type="button" className={mode === "dragOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dragOnly")}>Drag only</button>
        <button type="button" className={mode === "staleDeadLink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleDeadLink")}>Stale dead link</button>
        <button type="button" className={mode === "privacyLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privacyLeak")}>Privacy leak</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PinnedItemsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PinnedItemsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PinnedItemsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PinnedItemsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
