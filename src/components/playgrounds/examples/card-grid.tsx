import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const cardGridItems = [
  { id: "course-101", title: "Design systems foundations", provider: "Northstar Academy", level: "Beginner", duration: "3h 20m", status: "Available", price: "$49", rating: "4.8", preview: "DS", hasPreview: true },
  { id: "course-204", title: "Analytics for product teams", provider: "Signal School", level: "Intermediate", duration: "5h 10m", status: "Available", price: "$89", rating: "4.6", preview: "AP", hasPreview: true },
  { id: "course-317", title: "Accessible motion design", provider: "Motion Lab", level: "Advanced", duration: "2h 45m", status: "Waitlist", price: "$69", rating: "4.9", preview: "AM", hasPreview: false },
  { id: "course-422", title: "Research ops templates", provider: "Field Kit", level: "Beginner", duration: "1h 55m", status: "Available", price: "$29", rating: "4.4", preview: "RO", hasPreview: true },
  { id: "course-508", title: "Service blueprint studio", provider: "Civic Design", level: "Intermediate", duration: "4h 05m", status: "Archived", price: "$39", rating: "4.2", preview: "SB", hasPreview: true },
  { id: "course-612", title: "AI prompt review workflows", provider: "Ops Studio", level: "Advanced", duration: "3h 40m", status: "Available", price: "$79", rating: "4.7", preview: "AI", hasPreview: true }
];

function CardGridCard({
  item,
  saved,
  selected,
  compact,
  onSave,
  onSelect
}: {
  item: typeof cardGridItems[number];
  saved?: boolean;
  selected?: boolean;
  compact?: boolean;
  onSave?: () => void;
  onSelect?: () => void;
}) {
  return (
    <li className={`card-grid-card ${selected ? "is-selected" : ""} ${compact ? "is-compact" : ""} ${!item.hasPreview ? "is-missingThumb" : ""}`}>
      <div className="card-grid-thumb" aria-label={item.hasPreview ? `${item.title} thumbnail` : `No thumbnail available for ${item.title}`}>
        <span>{item.hasPreview ? item.preview : "No thumbnail"}</span>
      </div>
      <div className="card-grid-copy">
        <button type="button" className="card-grid-title" aria-label={`Open ${item.title}`}>{item.title}</button>
        <span>{item.provider}</span>
      </div>
      <div className="card-grid-meta" aria-label={`${item.title} metadata`}>
        <span>{item.level}</span>
        <span>{item.duration}</span>
        <span>{item.price}</span>
        <span>{item.rating} rating</span>
      </div>
      <div className="card-grid-footer">
        <span className={`card-grid-status is-${item.status.toLowerCase()}`}>{item.status}</span>
        <label className="card-grid-select">
          <input type="checkbox" checked={!!selected} onChange={onSelect} readOnly={!onSelect} aria-label={`Select ${item.title}`} />
          <span>Select</span>
        </label>
        <button type="button" className={saved ? "demo-button small primary" : "demo-button small"} onClick={onSave} aria-pressed={saved} aria-label={`${saved ? "Unsave" : "Save"} ${item.title}`}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </li>
  );
}

function CardGridGoodUi() {
  return (
    <div className="quality-example card-grid-demo">
      <div className="card-grid-toolbar" id="card-grid-ui-label">
        <strong>Course marketplace</strong>
        <span>6 courses</span>
        <span>Responsive 3-column grid</span>
      </div>
      <ul className="card-grid-board" aria-labelledby="card-grid-ui-label">
        {cardGridItems.slice(0, 6).map((item, index) => (
          <CardGridCard
            key={item.id}
            item={item}
            saved={index === 1}
            selected={index === 2}
            compact={false}
          />
        ))}
      </ul>
      <p className="demo-status">Each tile keeps thumbnail area, title, provider, metadata, status, Select, and Save in a consistent grid anatomy.</p>
    </div>
  );
}

function CardGridBadUi() {
  return (
    <div className="bad-ui-sample card-grid-bad-demo is-mixedCardRole">
      <div className="card-grid-broken" aria-label="Broken card grid">
        <button type="button"><b>Design systems foundations</b><span>$49</span><small>Course</small></button>
        <button type="button"><span>Browse analytics</span><b>Topic</b><small>12 results</small></button>
        <button type="button"><small>Ad</small><b>Try premium</b><span>Upgrade</span></button>
        <button type="button"><b>Accessible motion design wraps into a tall tile</b><span>No image</span><small>Waitlist</small></button>
      </div>
      <p className="demo-status">The broken grid mixes object cards, category navigation, promotion, and missing media without stable tile anatomy or clear role.</p>
    </div>
  );
}

function CardGridGoodUx() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["course-317"]));
  const [saved, setSaved] = useState<Set<string>>(() => new Set(["course-204"]));
  const [availableOnly, setAvailableOnly] = useState(false);
  const [compact, setCompact] = useState(false);
  const [loadedMore, setLoadedMore] = useState(false);
  const [message, setMessage] = useState("The grid uses object IDs, not visible positions, so selection and saved state survive filtering and density changes.");

  const allItems = loadedMore
    ? [...cardGridItems, { id: "course-719", title: "Inclusive dashboard critique", provider: "Metric Guild", level: "Intermediate", duration: "2h 30m", status: "Available", price: "$59", rating: "4.5", preview: "ID", hasPreview: true }]
    : cardGridItems;
  const visibleItems = allItems.filter((item) => !availableOnly || item.status === "Available");
  const hiddenSelected = [...selected].filter((id) => !visibleItems.some((item) => item.id === id)).length;

  const toggleSelected = (id: string) => {
    const item = allItems.find((entry) => entry.id === id);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setMessage(`${item?.title ?? id} ${next.has(id) ? "selected" : "deselected"}. Selection follows the course ID after grid changes.`);
      return next;
    });
  };

  const toggleSaved = (id: string) => {
    const item = allItems.find((entry) => entry.id === id);
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setMessage(`${item?.title ?? id} ${next.has(id) ? "saved" : "unsaved"}. Saved state is independent of selection.`);
      return next;
    });
  };

  return (
    <div className={`quality-example card-grid-demo ${compact ? "is-compact" : ""}`}>
      <div className="card-grid-toolbar" id="card-grid-ux-label">
        <strong>Course marketplace</strong>
        <span>{visibleItems.length} visible</span>
        <span>{selected.size} selected{hiddenSelected ? `, ${hiddenSelected} hidden by filter` : ""}</span>
        <span>{saved.size} saved</span>
        <span>{compact ? "Compact tiles" : "Comfortable tiles"}</span>
      </div>
      <ul className="card-grid-board" aria-labelledby="card-grid-ux-label">
        {visibleItems.map((item) => (
          <CardGridCard
            key={item.id}
            item={item}
            saved={saved.has(item.id)}
            selected={selected.has(item.id)}
            compact={compact}
            onSave={() => toggleSaved(item.id)}
            onSelect={() => toggleSelected(item.id)}
          />
        ))}
      </ul>
      <div className="demo-row card-grid-controls" aria-label="Card grid exercise controls">
        <button type="button" className={compact ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setCompact((value) => !value);
          setMessage(!compact ? "Compact density keeps the same card fields and row-major order." : "Comfortable density restored without losing selected or saved courses.");
        }}>Toggle density</button>
        <button type="button" className={availableOnly ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setAvailableOnly((value) => !value);
          setMessage(!availableOnly ? "Filtered to Available courses. Hidden selected cards remain counted." : "Filter cleared. Selected and saved state stayed attached to course IDs.");
        }}>Available only</button>
        <button type="button" className="demo-button small" onClick={() => toggleSelected("course-101")}>Select systems</button>
        <button type="button" className="demo-button small" onClick={() => toggleSaved("course-204")}>Save analytics</button>
        <button type="button" className="demo-button small" onClick={() => {
          setLoadedMore(true);
          setMessage("Loaded one more course at the end of the grid and updated visible counts.");
        }}>Load more</button>
        <button type="button" className="demo-button small" onClick={() => {
          setMessage("Accessible motion design reserves thumbnail space and keeps row alignment even without image media.");
          setSelected((current) => new Set(current).add("course-317"));
        }}>Missing thumbnail</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CardGridBadUx() {
  type Mode = "masonryOrder" | "comparisonTrap" | "indexSelection" | "hoverOnly" | "collapsedThumbnail" | "mixedCardRole";
  const [mode, setMode] = useState<Mode>("masonryOrder");
  const copy: Record<Mode, string> = {
    masonryOrder: "A masonry wall changes visual order independently from DOM order, so keyboard users meet cards in a different sequence.",
    comparisonTrap: "The grid asks users to compare price, duration, and rating, but those values land at different heights and cannot be sorted.",
    indexSelection: "Selection is stored by visible position; after filtering, the checkmark moves from one course to another.",
    hoverOnly: "Save and More actions appear only on pointer hover, leaving touch and keyboard users without card actions.",
    collapsedThumbnail: "Missing thumbnails collapse the first column and shift titles, checkboxes, and buttons across the row.",
    mixedCardRole: "Course cards, category cards, promotions, and empty-state actions share the same tile treatment with no role distinction."
  };

  return (
    <div className={`quality-example card-grid-bad-demo is-${mode}`}>
      <div className="card-grid-broken" aria-label="Broken card grid">
        <button type="button"><b>{mode === "mixedCardRole" ? "Browse analytics" : "Design systems foundations"}</b><span>{mode === "comparisonTrap" ? "$49 / 3h 20m / 4.8" : "Course"}</span><small>{mode === "indexSelection" ? "Checked by slot 1" : "Northstar"}</small></button>
        <button type="button"><b>{mode === "collapsedThumbnail" ? "No image course" : "Analytics for product teams"}</b><span>{mode === "hoverOnly" ? "Actions hidden until hover" : "$89"}</span><small>Signal School</small></button>
        <button type="button"><b>Accessible motion design has a much longer title and uneven card height</b><span>{mode === "masonryOrder" ? "Visual slot 6, DOM slot 3" : "Waitlist"}</span><small>Motion Lab</small></button>
        <button type="button"><b>{mode === "mixedCardRole" ? "Upgrade plan" : "Research ops templates"}</b><span>{mode === "comparisonTrap" ? "$29 / 1h 55m / 4.4" : "Available"}</span><small>Field Kit</small></button>
      </div>
      <div className="demo-row card-grid-controls">
        <button type="button" className={mode === "masonryOrder" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("masonryOrder")}>Masonry order</button>
        <button type="button" className={mode === "comparisonTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("comparisonTrap")}>Compare trap</button>
        <button type="button" className={mode === "indexSelection" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("indexSelection")}>Index selection</button>
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "collapsedThumbnail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("collapsedThumbnail")}>Collapsed thumb</button>
        <button type="button" className={mode === "mixedCardRole" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedCardRole")}>Mixed roles</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardGridGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardGridBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardGridGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardGridBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
