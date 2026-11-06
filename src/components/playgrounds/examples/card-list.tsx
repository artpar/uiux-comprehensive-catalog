import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const cardListItems = [
  { id: "grant-2048", title: "Neighborhood resilience grants", type: "Grant", deadline: "Closes Jun 28", status: "Closing soon", agency: "Civic Fund", amount: "$25k-$80k", summary: "Funding for cooling centers, flood kits, and neighborhood emergency supply rooms.", preview: "NR", hasPreview: true },
  { id: "grant-2052", title: "Library digital access pilots", type: "Pilot", deadline: "Closes Jul 12", status: "Open", agency: "Learning Office", amount: "$10k-$35k", summary: "Support for after-school device lending, digital skills coaching, and accessible kiosks.", preview: "LD", hasPreview: true },
  { id: "grant-2057", title: "Food pantry logistics upgrade", type: "Grant", deadline: "Closes Jul 30", status: "Open", agency: "Health Network", amount: "$15k-$50k", summary: "Cold storage, routing, and volunteer coordination improvements for local pantry partners.", preview: "FP", hasPreview: false },
  { id: "grant-2061", title: "Youth arts microfund", type: "Microfund", deadline: "Closes Aug 9", status: "Review later", agency: "Arts Council", amount: "$2k-$8k", summary: "Small awards for youth-led exhibits, mural workshops, and public performance projects.", preview: "YA", hasPreview: true }
];

function CardListCard({
  item,
  saved,
  selected,
  expanded,
  onSave,
  onSelect,
  onExpand
}: {
  item: typeof cardListItems[number];
  saved?: boolean;
  selected?: boolean;
  expanded?: boolean;
  onSave?: () => void;
  onSelect?: () => void;
  onExpand?: () => void;
}) {
  return (
    <li className={`card-list-card ${selected ? "is-selected" : ""} ${!item.hasPreview ? "is-missingPreview" : ""}`}>
      <div className="card-list-preview" aria-label={item.hasPreview ? `${item.title} preview` : `No preview available for ${item.title}`}>
        <span>{item.hasPreview ? item.preview : "No preview"}</span>
      </div>
      <div className="card-list-body">
        <div className="card-list-title-row">
          <button type="button" className="card-list-title" onClick={onExpand} aria-expanded={expanded}>
            {item.title}
          </button>
          <span className={`card-list-status is-${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span>
        </div>
        <p>{item.summary}</p>
        <div className="card-list-meta">
          <span>{item.type}</span>
          <span>{item.agency}</span>
          <span>{item.deadline}</span>
          <span>{item.amount}</span>
        </div>
        {expanded ? (
          <div className="card-list-expanded">
            Eligibility summary, required attachments, and review notes are visible without replacing the card's title, status, or actions.
          </div>
        ) : null}
      </div>
      <div className="card-list-actions" aria-label={`Actions for ${item.title}`}>
        <label className="card-list-select">
          <input type="checkbox" checked={!!selected} onChange={onSelect} readOnly={!onSelect} aria-label={`Select ${item.title}`} />
          <span>Select</span>
        </label>
        <button type="button" className={saved ? "demo-button small primary" : "demo-button small"} onClick={onSave} aria-pressed={saved} aria-label={`${saved ? "Unsave" : "Save"} ${item.title}`}>
          {saved ? "Saved" : "Save"}
        </button>
        <button type="button" className="demo-button small" aria-label={`More actions for ${item.title}`}>More</button>
      </div>
    </li>
  );
}

function CardListGoodUi() {
  return (
    <div className="quality-example card-list-demo">
      <div className="card-list-toolbar" id="card-list-ui-label">
        <strong>Grant opportunities</strong>
        <span>4 cards</span>
        <span>Single-column rich summaries</span>
      </div>
      <ul className="card-list-stack" aria-labelledby="card-list-ui-label">
        {cardListItems.slice(0, 3).map((item, index) => (
          <CardListCard
            key={item.id}
            item={item}
            saved={index === 0}
            selected={index === 1}
            expanded={index === 0}
          />
        ))}
      </ul>
      <p className="demo-status">Each card keeps preview, title, summary, metadata, status, selection, Save, and More actions in stable positions.</p>
    </div>
  );
}

function CardListBadUi() {
  return (
    <div className="bad-ui-sample card-list-bad-demo is-inconsistentAnatomy">
      <div className="card-list-broken" aria-label="Broken card list">
        <div><b>Neighborhood resilience grants</b><span>$25k-$80k</span><button type="button">Open</button><button type="button">X</button></div>
        <div><button type="button">Save</button><span>Library pilots</span><b>Open</b><span>Jul 12</span></div>
        <div><span>No image</span><b>Food pantry logistics upgrade closes Jul 30 with routing and cold storage notes</b><button type="button">...</button></div>
      </div>
      <p className="demo-status">The broken cards move titles, status, amounts, and actions around, so the list loses predictable card anatomy.</p>
    </div>
  );
}

function CardListGoodUx() {
  const [saved, setSaved] = useState<Set<string>>(() => new Set(["grant-2048"]));
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["grant-2052"]));
  const [expandedId, setExpandedId] = useState("grant-2048");
  const [closingSoon, setClosingSoon] = useState(false);
  const [loadedMore, setLoadedMore] = useState(false);
  const [message, setMessage] = useState("Cards are rich object summaries. Primary activation, Save, Select, and More actions have separate scopes.");

  const allItems = loadedMore
    ? [...cardListItems, { id: "grant-2068", title: "Community clinic translation support", type: "Grant", deadline: "Closes Aug 22", status: "Open", agency: "Care Access", amount: "$8k-$20k", summary: "Interpreter scheduling, translated intake packets, and volunteer language-line training.", preview: "CT", hasPreview: true }]
    : cardListItems;
  const visibleItems = allItems.filter((item) => !closingSoon || item.status === "Closing soon");
  const hiddenSelected = [...selected].filter((id) => !visibleItems.some((item) => item.id === id)).length;

  const toggleSaved = (id: string) => {
    const item = allItems.find((entry) => entry.id === id);
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setMessage(`${item?.title ?? id} ${next.has(id) ? "saved" : "unsaved"}. Save state is separate from card activation.`);
      return next;
    });
  };

  const toggleSelected = (id: string) => {
    const item = allItems.find((entry) => entry.id === id);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      setMessage(`${item?.title ?? id} ${next.has(id) ? "selected" : "deselected"}. Selected count remains visible across filters.`);
      return next;
    });
  };

  return (
    <div className="quality-example card-list-demo">
      <div className="card-list-toolbar" id="card-list-ux-label">
        <strong>Grant opportunities</strong>
        <span>{visibleItems.length} visible</span>
        <span>{saved.size} saved</span>
        <span>{selected.size} selected{hiddenSelected ? `, ${hiddenSelected} hidden by filter` : ""}</span>
      </div>
      <ul className="card-list-stack" aria-labelledby="card-list-ux-label">
        {visibleItems.map((item) => (
          <CardListCard
            key={item.id}
            item={item}
            saved={saved.has(item.id)}
            selected={selected.has(item.id)}
            expanded={expandedId === item.id}
            onSave={() => toggleSaved(item.id)}
            onSelect={() => toggleSelected(item.id)}
            onExpand={() => {
              setExpandedId(expandedId === item.id ? "" : item.id);
              setMessage(expandedId === item.id ? `${item.title} collapsed; card identity and actions remain available.` : `${item.title} expanded with more summary detail in place.`);
            }}
          />
        ))}
      </ul>
      <div className="demo-row card-list-controls" aria-label="Card list exercise controls">
        <button type="button" className="demo-button small" onClick={() => toggleSaved("grant-2057")}>Save pantry</button>
        <button type="button" className="demo-button small" onClick={() => setExpandedId(expandedId === "grant-2057" ? "" : "grant-2057")}>Expand pantry</button>
        <button type="button" className={closingSoon ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setClosingSoon((value) => !value);
          setMessage(!closingSoon ? "Filtered to Closing soon. Hidden selected cards remain counted explicitly." : "Filter cleared. Saved, selected, and expanded card state remain attached to card IDs.");
        }}>Closing soon</button>
        <button type="button" className="demo-button small" onClick={() => toggleSelected("grant-2061")}>Select arts</button>
        <button type="button" className="demo-button small" onClick={() => {
          setLoadedMore(true);
          setMessage("Loaded one more opportunity. Existing card focus and counts remain understandable.");
        }}>Load more</button>
        <button type="button" className="demo-button small" onClick={() => {
          setExpandedId("grant-2057");
          setMessage("Food pantry logistics upgrade shows a missing-preview fallback without collapsing card dimensions.");
        }}>Missing preview</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CardListBadUx() {
  type Mode = "denseRowWrapper" | "actionCollision" | "inconsistentAnatomy" | "hiddenSelection" | "compareCards" | "missingPreview" | "tooManyActions";
  const [mode, setMode] = useState<Mode>("denseRowWrapper");
  const copy: Record<Mode, string> = {
    denseRowWrapper: "Decorative card chrome wraps one-line rows, reducing scan density without adding preview, summary, or decision support.",
    actionCollision: "The whole card opens, the title link navigates elsewhere, and the tiny footer icon deletes with overlapping targets.",
    inconsistentAnatomy: "Every card moves title, status, amount, and action controls, making scanning unpredictable.",
    hiddenSelection: "Filtering hides selected cards but bulk actions still affect them with no hidden-selection count.",
    compareCards: "Users need to compare amounts and deadlines, but values appear in different locations on each card.",
    missingPreview: "Missing images collapse the card, causing focus, status, and actions to jump.",
    tooManyActions: "Each card exposes many visible actions, forcing keyboard users through a long action maze."
  };

  return (
    <div className={`quality-example card-list-bad-demo is-${mode}`}>
      <div className="card-list-broken" aria-label="Broken card list">
        <div><b>{mode === "denseRowWrapper" ? "Grant A" : "Neighborhood resilience grants"}</b><span>{mode === "compareCards" ? "$25k-$80k" : "Closing soon"}</span><button type="button">{mode === "actionCollision" ? "Open/Delete" : "Open"}</button><button type="button">{mode === "tooManyActions" ? "Pin" : "X"}</button></div>
        <div><button type="button">{mode === "tooManyActions" ? "Share" : "Save"}</button><span>{mode === "hiddenSelection" ? "3 selected hidden" : "Library pilots"}</span><b>{mode === "inconsistentAnatomy" ? "Jul 12" : "Open"}</b><span>{mode === "compareCards" ? "Closes Jul 12" : "$10k-$35k"}</span></div>
        <div><span>{mode === "missingPreview" ? "" : "Preview"}</span><b>Food pantry logistics upgrade closes Jul 30 with cold storage notes</b><button type="button">{mode === "tooManyActions" ? "Archive" : "..."}</button></div>
      </div>
      <div className="demo-row card-list-controls">
        <button type="button" className={mode === "denseRowWrapper" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("denseRowWrapper")}>Row wrapper</button>
        <button type="button" className={mode === "actionCollision" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("actionCollision")}>Action collision</button>
        <button type="button" className={mode === "inconsistentAnatomy" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("inconsistentAnatomy")}>Anatomy drift</button>
        <button type="button" className={mode === "hiddenSelection" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenSelection")}>Hidden selection</button>
        <button type="button" className={mode === "compareCards" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("compareCards")}>Compare cards</button>
        <button type="button" className={mode === "missingPreview" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("missingPreview")}>Missing preview</button>
        <button type="button" className={mode === "tooManyActions" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tooManyActions")}>Too many actions</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardListGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardListBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardListGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CardListBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
