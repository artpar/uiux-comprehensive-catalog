import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type FavoriteScope = "Personal" | "Synced" | "Public";

type FavoriteItem = {
  id: string;
  title: string;
  type: string;
  location: string;
  owner: string;
  scope: FavoriteScope;
  status: "current" | "unavailable" | "restricted";
};

const favoriteItemPool: FavoriteItem[] = [
  { id: "roadmap-repo", title: "Roadmap repository", type: "Repository", location: "Engineering", owner: "Platform team", scope: "Public", status: "current" },
  { id: "payroll-folder", title: "Payroll policy folder", type: "Folder", location: "People ops", owner: "HR", scope: "Personal", status: "current" },
  { id: "health-report", title: "Customer health report", type: "Report", location: "Revenue workspace", owner: "CS Ops", scope: "Synced", status: "current" },
  { id: "legacy-sheet", title: "Legacy pricing sheet", type: "Spreadsheet", location: "Archived finance", owner: "Finance", scope: "Personal", status: "unavailable" },
  { id: "incident-topic", title: "Incident response topic", type: "Topic", location: "Knowledge base", owner: "Reliability", scope: "Public", status: "restricted" }
];

function FavoritesBoard({
  items,
  favoriteIds,
  showControls = true
}: {
  items: FavoriteItem[];
  favoriteIds: string[];
  showControls?: boolean;
}) {
  if (items.length === 0) {
    return (
      <section className="favorites-board is-empty" aria-label="Favorites list">
        <strong>No favorites in this view</strong>
        <span>Favorite an eligible item or clear the filter; no recents, pins, or recommendations were inserted.</span>
      </section>
    );
  }

  return (
    <section className="favorites-board" aria-label="Favorites list">
      <div className="favorites-header">
        <div>
          <strong>Favorites</strong>
          <span>{favoriteIds.length} saved preferences · unfavorite keeps the source item</span>
        </div>
        <span className="favorites-scope">Personal list with scope cues</span>
      </div>
      <div className="favorites-list">
        {items.map((item) => {
          const isFavorite = favoriteIds.includes(item.id);
          return (
            <article key={item.id} className={`favorite-card is-${item.status} ${isFavorite ? "is-favorited" : ""}`}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.type} · {item.location} · {item.owner}</span>
              </div>
              <small>{item.scope} favorite · {item.status === "unavailable" ? "Needs repair" : item.status === "restricted" ? "Access limited" : "Current"}</small>
              {showControls ? (
                <div className="favorite-actions" aria-label={`${item.title} favorite actions`}>
                  <button type="button" className="demo-button small" aria-pressed={isFavorite}>{isFavorite ? "Favorited" : "Add favorite"}</button>
                  <button type="button" className="demo-button small">{item.status === "unavailable" ? "Repair" : isFavorite ? "Unfavorite" : "Preview"}</button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function FavoritesGoodUi() {
  return (
    <div className="quality-example favorites-demo">
      <FavoritesBoard items={favoriteItemPool.slice(0, 3)} favoriteIds={["roadmap-repo", "payroll-folder", "health-report"]} />
      <p className="demo-status">The favorite list names item type, location, owner, selected state, scope, and a safe unfavorite path while keeping pins, recents, and subscriptions separate.</p>
    </div>
  );
}

function FavoritesBadUi() {
  return (
    <div className="bad-ui-sample favorites-bad-demo is-unlabeled-star">
      <div className="favorites-broken-grid">
        {["Star", "Top?", "Seen", "Watch"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken UI uses ambiguous star-like labels for favorite, pin, recent, and subscription behavior without state, scope, or a list to return to.</p>
    </div>
  );
}

function FavoritesGoodUx() {
  const [items, setItems] = useState<FavoriteItem[]>(favoriteItemPool);
  const [favoriteIds, setFavoriteIds] = useState(["roadmap-repo", "payroll-folder", "health-report"]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [scope, setScope] = useState<FavoriteScope>("Personal");
  const [message, setMessage] = useState("Favorites capture personal preference; they do not pin, subscribe, or delete the item.");

  const visibleItems = favoritesOnly ? items.filter((item) => favoriteIds.includes(item.id)) : items;

  const favoriteItem = (item: FavoriteItem) => {
    if (favoriteIds.includes(item.id)) {
      setMessage(`${item.title} is already in Favorites; duplicate favorite records are blocked.`);
      return;
    }
    setFavoriteIds((current) => [item.id, ...current]);
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, scope } : entry));
    setMessage(`${item.title} added as a ${scope.toLowerCase()} favorite; the item location and pin order did not change.`);
  };

  const unfavoriteFirst = () => {
    if (favoriteIds.length === 0) {
      setMessage("Favorites are empty; no files, repositories, or reports were deleted.");
      return;
    }
    const firstId = favoriteIds[0];
    const first = items.find((item) => item.id === firstId);
    setFavoriteIds((current) => current.slice(1));
    setMessage(`${first?.title ?? "Item"} removed from Favorites only; recents, pins, and subscriptions remain unchanged.`);
  };

  const repairUnavailable = () => {
    setItems((current) => current.map((item) => item.id === "legacy-sheet" ? { ...item, title: "Pricing archive replacement", location: "Finance archive", status: "current" } : item));
    setFavoriteIds((current) => current.includes("legacy-sheet") ? current : ["legacy-sheet", ...current]);
    setMessage("Unavailable favorite repaired with a replacement target instead of opening a dead link.");
  };

  const restore = () => {
    setItems(favoriteItemPool);
    setFavoriteIds(["roadmap-repo", "payroll-folder", "health-report"]);
    setFavoritesOnly(false);
    setScope("Personal");
    setMessage("Favorites restored with personal scope, visible retrieval list, and no change to pins or recent history.");
  };

  return (
    <div className="quality-example favorites-demo">
      <div className="favorites-toolbar" aria-label="Favorite management controls">
        <label>
          <span>New favorite effect</span>
          <select value={scope} onChange={(event) => {
            const next = event.target.value as FavoriteScope;
            setScope(next);
            setMessage(`${next} effect selected; the UI discloses whether favorite state is personal, synced, or public before saving.`);
          }}>
            <option>Personal</option>
            <option>Synced</option>
            <option>Public</option>
          </select>
        </label>
        <button type="button" className="demo-button small primary" onClick={() => favoriteItem(items[3])}>Favorite sheet</button>
        <button type="button" className="demo-button small" onClick={() => favoriteItem(items[4])}>Favorite topic</button>
        <button type="button" className="demo-button small" onClick={unfavoriteFirst}>Unfavorite first</button>
        <button type="button" className="demo-button small" onClick={() => {
          setFavoritesOnly((current) => !current);
          setMessage(favoritesOnly ? "All eligible items shown; favorited state stays attached to each item." : "Favorites filter applied; only saved preferences remain visible.");
        }}>{favoritesOnly ? "Show all" : "Filter favorites"}</button>
        <button type="button" className="demo-button small" onClick={repairUnavailable}>Repair unavailable</button>
        <button type="button" className="demo-button small" onClick={restore}>Restore favorites</button>
      </div>
      <FavoritesBoard items={visibleItems} favoriteIds={favoriteIds} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function FavoritesBadUx() {
  type Mode = "unlabeled-star" | "delete-confusion" | "mixed-pins" | "auto-favorite" | "no-list" | "public-surprise" | "dead-favorite";
  const [mode, setMode] = useState<Mode>("unlabeled-star");
  const copy: Record<Mode, string> = {
    "unlabeled-star": "A bare star gives no accessible state and could mean like, rating, pin, vote, watch, or recommendation feedback.",
    "delete-confusion": "Removing a favorite deletes the underlying report instead of clearing only the favorite relationship.",
    "mixed-pins": "Favorites, pinned items, and recently viewed records are blended into one Important list with no rule for order or scope.",
    "auto-favorite": "The system favorites every opened item, corrupting a deliberate saved-preference list with automatic history.",
    "no-list": "Users can press Favorite but there is no Favorites list, filter, or search facet to find saved items later.",
    "public-surprise": "A public favorite count changes without disclosure, exposing preference as a public signal.",
    "dead-favorite": "A moved or permission-lost favorite remains a dead link with no remove, replace, or request-access path."
  };
  const labels: Record<Mode, string[]> = {
    "unlabeled-star": ["*", "?", "Top", "Watch"],
    "delete-confusion": ["Removed", "File gone", "No undo", "Audit?"],
    "mixed-pins": ["Pinned", "Recent", "Favorite", "Suggested"],
    "auto-favorite": ["Opened", "Opened", "Opened", "Opened"],
    "no-list": ["Favorite", "Now where?", "Search again", "Lost"],
    "public-surprise": ["Liked", "Public +1", "Profile", "No cue"],
    "dead-favorite": ["404", "Moved", "No access", "Still starred"]
  };

  return (
    <div className={`quality-example favorites-bad-demo is-${mode}`}>
      <div className="favorites-broken-grid">
        {labels[mode].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <strong>{mode === "public-surprise" ? "Public signal changed" : mode === "delete-confusion" ? "Item deleted" : "Ambiguous favorites"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row favorites-controls">
        <button type="button" className={mode === "unlabeled-star" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unlabeled-star")}>Unlabeled star</button>
        <button type="button" className={mode === "delete-confusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("delete-confusion")}>Delete confusion</button>
        <button type="button" className={mode === "mixed-pins" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixed-pins")}>Mixed pins</button>
        <button type="button" className={mode === "auto-favorite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auto-favorite")}>Auto favorite</button>
        <button type="button" className={mode === "no-list" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-list")}>No list</button>
        <button type="button" className={mode === "public-surprise" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("public-surprise")}>Public surprise</button>
        <button type="button" className={mode === "dead-favorite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dead-favorite")}>Dead favorite</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FavoritesGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FavoritesBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FavoritesGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FavoritesBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
