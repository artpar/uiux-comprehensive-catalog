import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const collectionItems = [
  { id: "brief", title: "Campaign launch brief", type: "Doc", section: "Read first", status: "Ready", owner: "Maya", updated: "Updated today", visibility: "Team", summary: "Audience, launch windows, review owners, and approval checklist." },
  { id: "assets", title: "Approved hero assets", type: "Folder", section: "Assets", status: "Ready", owner: "Nora", updated: "Updated 1 hr ago", visibility: "Team", summary: "Final image exports, source files, alt text, and crop notes." },
  { id: "metrics", title: "Launch dashboard spec", type: "Sheet", section: "Measure", status: "Review", owner: "Ravi", updated: "Updated yesterday", visibility: "Private", summary: "Success metrics, owner notes, alert thresholds, and reporting cadence." },
  { id: "faq", title: "Support FAQ draft", type: "Article", section: "Read first", status: "Draft", owner: "Lee", updated: "Updated 2 days ago", visibility: "Team", summary: "Common customer questions, escalation path, and links to service policy." }
];

function CollectionItemCard({
  item,
  compact,
  onRemove
}: {
  item: typeof collectionItems[number];
  compact?: boolean;
  onRemove?: () => void;
}) {
  return (
    <li className={`collection-item ${compact ? "is-compact" : ""}`}>
      <span className="collection-type" aria-hidden="true">{item.type.slice(0, 1)}</span>
      <span className="collection-item-copy">
        <strong>{item.title}</strong>
        <span>{item.summary}</span>
        <small>{item.section} · {item.type} · {item.owner} · {item.updated}</small>
      </span>
      <span className={`collection-status is-${item.status.toLowerCase()}`}>{item.status}</span>
      <button type="button" className="demo-button small" onClick={onRemove} aria-label={`Remove ${item.title} from Launch assets kit`}>Remove</button>
    </li>
  );
}

function CollectionHeader({
  visibleCount,
  totalCount,
  hiddenCount,
  shared
}: {
  visibleCount: number;
  totalCount: number;
  hiddenCount?: number;
  shared?: boolean;
}) {
  return (
    <div className="collection-header">
      <div>
        <strong>Launch assets kit</strong>
        <p>Curated launch references for campaign, support, and measurement teams.</p>
      </div>
      <div className="collection-meta" aria-label="Collection metadata">
        <span>{totalCount} total</span>
        <span>{visibleCount} visible</span>
        {hiddenCount ? <span>{hiddenCount} hidden</span> : null}
        <span>Owner: Maya</span>
        <span>{shared ? "Shared with team" : "Private draft"}</span>
      </div>
    </div>
  );
}

function CollectionGoodUi() {
  return (
    <div className="quality-example collection-demo">
      <CollectionHeader visibleCount={4} totalCount={4} shared />
      <div className="collection-actions" aria-label="Collection actions">
        <button type="button" className="demo-button small primary">Share collection</button>
        <button type="button" className="demo-button small">Copy</button>
        <button type="button" className="demo-button small">Subscribe</button>
      </div>
      <div className="collection-section">
        <span>Read first</span>
        <ul className="collection-list">
          {collectionItems.filter((item) => item.section === "Read first").map((item) => (
            <CollectionItemCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
      <div className="collection-section">
        <span>Assets and measurement</span>
        <ul className="collection-list">
          {collectionItems.filter((item) => item.section !== "Read first").slice(0, 2).map((item) => (
            <CollectionItemCard key={item.id} item={item} compact />
          ))}
        </ul>
      </div>
      <p className="demo-status">The collection identity, purpose, owner, count, visibility, sections, item identities, and item-scoped remove actions are all explicit.</p>
    </div>
  );
}

function CollectionBadUi() {
  return (
    <div className="bad-ui-sample collection-bad-demo is-unnamedSet">
      <div className="collection-card-grid" aria-label="Unclear card set">
        <button type="button">Resources</button>
        <button type="button">More</button>
        <button type="button">Useful</button>
        <button type="button">Links</button>
      </div>
      <p className="demo-status">The broken surface is only a card grid. It lacks a collection title, purpose, count, owner, membership rule, item type, and action scope.</p>
    </div>
  );
}

function CollectionGoodUx() {
  const [items, setItems] = useState(collectionItems);
  const [assetsOnly, setAssetsOnly] = useState(false);
  const [hidePrivate, setHidePrivate] = useState(false);
  const [shared, setShared] = useState(true);
  const [message, setMessage] = useState("Collection membership is stable. Filters change the view, not the saved set.");

  const visibleItems = items.filter((item) => {
    if (assetsOnly && item.section !== "Assets") return false;
    if (hidePrivate && item.visibility === "Private") return false;
    return true;
  });
  const hiddenCount = items.length - visibleItems.length;

  const addChecklist = () => {
    if (items.some((item) => item.id === "checklist")) {
      setMessage("Launch checklist is already in the collection.");
      return;
    }
    setItems((current) => [
      ...current,
      { id: "checklist", title: "Launch readiness checklist", type: "Task", section: "Read first", status: "Ready", owner: "Maya", updated: "Added now", visibility: "Team", summary: "Final review tasks, approval owners, and rollback contact list." }
    ]);
    setMessage("Launch readiness checklist added to Launch assets kit. Total count increased.");
  };

  const moveFirstDown = () => {
    setItems((current) => {
      if (current.length < 2) return current;
      const next = [...current];
      const first = next.shift();
      if (first) next.splice(1, 0, first);
      return next;
    });
    setMessage("First item moved to position 2. Item order changed without losing membership.");
  };

  const removeItem = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    setItems((current) => current.filter((entry) => entry.id !== id));
    setMessage(`${item?.title ?? "Item"} removed from the collection. The action affected membership, not the current filter.`);
  };

  return (
    <div className="quality-example collection-demo">
      <CollectionHeader visibleCount={visibleItems.length} totalCount={items.length} hiddenCount={hiddenCount} shared={shared} />
      <ul className={`collection-list ${assetsOnly ? "is-filtered" : ""}`} aria-label="Launch assets kit items">
        {visibleItems.map((item) => (
          <CollectionItemCard key={item.id} item={item} onRemove={() => removeItem(item.id)} />
        ))}
      </ul>
      {visibleItems.length === 0 ? (
        <div className="collection-empty">No visible items match this view. The collection still contains {items.length} saved items.</div>
      ) : null}
      <div className="demo-row collection-controls" aria-label="Collection exercise controls">
        <button type="button" className="demo-button small" onClick={addChecklist}>Add checklist</button>
        <button type="button" className="demo-button small" onClick={moveFirstDown}>Move first down</button>
        <button type="button" className={assetsOnly ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setAssetsOnly((value) => !value);
          setMessage(!assetsOnly ? "Filtered to Assets. Total collection count remains visible." : "Filter cleared. Collection membership is unchanged.");
        }}>Assets filter</button>
        <button type="button" className={hidePrivate ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setHidePrivate((value) => !value);
          setMessage(!hidePrivate ? "Private items hidden for shared viewers and counted explicitly." : "Private items shown for the owner.");
        }}>Hide private</button>
        <button type="button" className={shared ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setShared((value) => !value);
          setMessage(shared ? "Collection changed to private draft. Existing shared viewers lose access." : "Collection shared with the team. Viewer access is visible in the header.");
        }}>{shared ? "Shared" : "Private"}</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CollectionBadUx() {
  type Mode = "unnamedSet" | "mixedSet" | "filterMutation" | "hiddenPrivate" | "destructiveScope" | "dragOnly" | "staleCopy";
  const [mode, setMode] = useState<Mode>("unnamedSet");
  const copy: Record<Mode, string> = {
    unnamedSet: "Cards render, but users cannot tell why the set exists, who owns it, how many items it contains, or whether it can be shared.",
    mixedSet: "Search results, related links, recent history, and recommendations appear under one collection label with no membership rule.",
    filterMutation: "The Videos filter deletes every non-video item from the collection instead of changing only the current view.",
    hiddenPrivate: "A shared link says 12 items but shows 8, with no explanation that private items are hidden.",
    destructiveScope: "Delete, Remove, and Clear all use the same visual treatment, so the affected scope is unknowable.",
    dragOnly: "Manual ordering depends on pointer drag with no keyboard move controls or position feedback.",
    staleCopy: "A copied collection keeps the original owner, description, and sharing state, so editors update the wrong audience."
  };

  return (
    <div className={`quality-example collection-bad-demo is-${mode}`}>
      <div className="collection-broken-header">
        <strong>{mode === "unnamedSet" ? "Items" : mode === "staleCopy" ? "Maya's kit copy" : "Collection"}</strong>
        <span>{mode === "hiddenPrivate" ? "12 items" : "Some resources"}</span>
      </div>
      <div className="collection-card-grid" aria-label="Broken collection">
        <button type="button">{mode === "mixedSet" ? "Because you viewed" : "Campaign launch brief"}</button>
        <button type="button">{mode === "filterMutation" ? "Videos only saved" : "Approved assets"}</button>
        <button type="button">{mode === "destructiveScope" ? "Delete" : "Support FAQ"}</button>
        <button type="button">{mode === "dragOnly" ? "Drag to move" : "Dashboard spec"}</button>
      </div>
      <div className="demo-row collection-controls">
        <button type="button" className={mode === "unnamedSet" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unnamedSet")}>Unnamed set</button>
        <button type="button" className={mode === "mixedSet" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedSet")}>Mixed set</button>
        <button type="button" className={mode === "filterMutation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("filterMutation")}>Filter mutation</button>
        <button type="button" className={mode === "hiddenPrivate" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenPrivate")}>Hidden private</button>
        <button type="button" className={mode === "destructiveScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("destructiveScope")}>Destructive scope</button>
        <button type="button" className={mode === "dragOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dragOnly")}>Drag only</button>
        <button type="button" className={mode === "staleCopy" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleCopy")}>Stale copy</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CollectionGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CollectionBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CollectionGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CollectionBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
