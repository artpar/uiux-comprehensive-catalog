import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CompareItemId = "atlas" | "nova" | "pixel" | "terra";

type CompareAttribute = {
  id: string;
  group: "Performance" | "Display" | "Portability" | "Support";
  label: string;
  values: Record<CompareItemId, string>;
};

const compareItems: Record<CompareItemId, { name: string; price: string; status: string; tone: string }> = {
  atlas: { name: "Atlas Pro 14", price: "$1,499", status: "In stock", tone: "blue" },
  nova: { name: "Nova Air 13", price: "$1,249", status: "Ships Friday", tone: "teal" },
  pixel: { name: "PixelBook Studio", price: "$1,699", status: "Low stock", tone: "gold" },
  terra: { name: "Terra Lite", price: "$999", status: "Preorder", tone: "slate" }
};

const compareAttributes: CompareAttribute[] = [
  { id: "cpu", group: "Performance", label: "Processor", values: { atlas: "M4 Pro", nova: "M4", pixel: "Core Ultra 7", terra: "Ryzen 7" } },
  { id: "memory", group: "Performance", label: "Memory", values: { atlas: "24 GB", nova: "16 GB", pixel: "32 GB", terra: "16 GB" } },
  { id: "storage", group: "Performance", label: "Storage", values: { atlas: "1 TB", nova: "512 GB", pixel: "1 TB", terra: "512 GB" } },
  { id: "screen", group: "Display", label: "Screen", values: { atlas: "14.2 in mini-LED", nova: "13.6 in LCD", pixel: "14 in OLED", terra: "14 in LCD" } },
  { id: "brightness", group: "Display", label: "Brightness", values: { atlas: "1,000 nits", nova: "500 nits", pixel: "550 nits", terra: "400 nits" } },
  { id: "weight", group: "Portability", label: "Weight", values: { atlas: "3.4 lb", nova: "2.7 lb", pixel: "3.2 lb", terra: "2.9 lb" } },
  { id: "battery", group: "Portability", label: "Battery estimate", values: { atlas: "18 hours", nova: "20 hours", pixel: "15 hours", terra: "16 hours" } },
  { id: "ports", group: "Portability", label: "Ports", values: { atlas: "3 TB4 + HDMI", nova: "2 TB4", pixel: "2 USB-C + HDMI", terra: "2 USB-C" } },
  { id: "warranty", group: "Support", label: "Warranty", values: { atlas: "1 year", nova: "1 year", pixel: "2 years", terra: "1 year" } },
  { id: "returns", group: "Support", label: "Return window", values: { atlas: "30 days", nova: "30 days", pixel: "30 days", terra: "30 days" } }
];

function CompareMatrix({
  selected,
  differencesOnly,
  highlightDifferences,
  pinned,
  mobilePair,
  grouped,
  onRemove,
  onChoose
}: {
  selected: CompareItemId[];
  differencesOnly: boolean;
  highlightDifferences: boolean;
  pinned: boolean;
  mobilePair: boolean;
  grouped: boolean;
  onRemove?: (item: CompareItemId) => void;
  onChoose?: (item: CompareItemId) => void;
}) {
  const visibleItems = mobilePair ? selected.slice(0, 2) : selected;
  const rows = compareAttributes.filter((attribute) => {
    if (!differencesOnly) return true;
    return new Set(visibleItems.map((item) => attribute.values[item])).size > 1;
  });
  const groups = grouped ? [...new Set(rows.map((row) => row.group))] : ["Comparison"];

  return (
    <div className={`compare-matrix-shell${pinned ? " is-pinned" : ""}${mobilePair ? " is-mobile-pair" : ""}`}>
      <div className="compare-items-row" role="row">
        <div className="compare-row-label" role="columnheader">Attribute</div>
        {visibleItems.map((itemId) => {
          const item = compareItems[itemId];
          return (
            <div className={`compare-item-card is-${item.tone}`} role="columnheader" key={itemId}>
              <span className="compare-chip">{item.status}</span>
              <strong>{item.name}</strong>
              <span>{item.price}</span>
              <div className="compare-item-actions">
                {onChoose ? <button type="button" className="demo-button small" onClick={() => onChoose(itemId)}>Choose</button> : null}
                {onRemove ? <button type="button" className="demo-button small" onClick={() => onRemove(itemId)}>Remove</button> : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="compare-rows" role="table" aria-label="Laptop comparison attributes">
        {groups.map((group) => (
          <div className="compare-group" key={group}>
            {grouped ? <h4>{group}</h4> : null}
            {rows.filter((row) => !grouped || row.group === group).map((row) => {
              const different = new Set(visibleItems.map((item) => row.values[item])).size > 1;
              return (
                <div className={`compare-attribute-row${different ? " is-different" : " is-same"}${highlightDifferences && different ? " is-highlighted" : ""}`} role="row" key={row.id}>
                  <div className="compare-row-label" role="rowheader">{row.label}</div>
                  {visibleItems.map((item) => (
                    <div className="compare-value" role="cell" key={item}>
                      <span>{row.values[item]}</span>
                      {highlightDifferences && different ? <em>Differs</em> : null}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareViewGoodUi() {
  return (
    <div className="quality-example compare-demo">
      <div className="compare-toolbar">
        <strong>3 laptops compared</strong>
        <span>Limit 4</span>
        <span>Grouped specs</span>
        <span>Sticky item identity</span>
      </div>
      <CompareMatrix
        selected={["atlas", "nova", "pixel"]}
        differencesOnly={false}
        highlightDifferences
        pinned
        mobilePair={false}
        grouped
      />
      <p className="demo-status">The view keeps item identity, prices, status, remove actions, grouped attribute rows, units, and highlighted differences visible in one comparison surface.</p>
    </div>
  );
}

function CompareViewBadUi() {
  return (
    <div className="bad-ui-sample compare-bad-demo is-tooMany">
      <div className="compare-broken" aria-label="Broken comparison view">
        <strong>Compare everything</strong>
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index}>Model {index + 1}<small>Fast, bright, powerful, lightweight, premium, advanced, best value</small></span>
        ))}
      </div>
      <p className="demo-status">The broken compare view crams too many products into unlabeled columns, repeats marketing copy, hides row labels, and gives no remove or difference controls.</p>
    </div>
  );
}

function CompareViewGoodUx() {
  const [selected, setSelected] = useState<CompareItemId[]>(["atlas", "nova", "pixel"]);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [pinned, setPinned] = useState(true);
  const [mobilePair, setMobilePair] = useState(false);
  const [grouped, setGrouped] = useState(true);
  const [message, setMessage] = useState("Three laptops are compared with grouped specs, sticky item identity, and highlighted differences.");

  function removeItem(item: CompareItemId) {
    if (selected.length <= 1) {
      setMessage("One item remains; another item is needed for a meaningful comparison.");
      return;
    }
    const next = selected.filter((value) => value !== item);
    setSelected(next);
    setMessage(`${compareItems[item].name} removed. ${next.length} item${next.length === 1 ? "" : "s"} remain in the shortlist.`);
  }

  function addTerra() {
    if (selected.includes("terra")) {
      setMessage("Terra Lite is already in the compared shortlist.");
      return;
    }
    if (selected.length >= 4) {
      setMessage("Compare limit reached. Remove one item before adding another candidate.");
      return;
    }
    setSelected([...selected, "terra"]);
    setMessage("Terra Lite added from the shortlist tray without losing existing compared items.");
  }

  return (
    <div className="quality-example compare-demo">
      <div className="compare-toolbar">
        <strong>{selected.length} compared</strong>
        <span>{differencesOnly ? "Only differences" : "All attributes"}</span>
        <span>{highlightDifferences ? "Differences highlighted" : "Plain rows"}</span>
        <span>{mobilePair ? "Mobile pair mode" : "Desktop columns"}</span>
      </div>
      <div className="compare-selected-tray" aria-label="Selected items for comparison">
        {selected.map((item) => (
          <span key={item}>{compareItems[item].name}</span>
        ))}
      </div>
      <CompareMatrix
        selected={selected}
        differencesOnly={differencesOnly}
        highlightDifferences={highlightDifferences}
        pinned={pinned}
        mobilePair={mobilePair}
        grouped={grouped}
        onRemove={removeItem}
        onChoose={(item) => setMessage(`${compareItems[item].name} chosen; the action is tied to that compared column.`)}
      />
      <div className="demo-row compare-controls" aria-label="Compare view exercise controls">
        <button type="button" className="demo-button small" onClick={addTerra}>Add Terra</button>
        <button type="button" className={differencesOnly ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setDifferencesOnly((value) => !value);
          setMessage(!differencesOnly ? "Identical rows hidden so users can focus on decision-changing attributes." : "All attributes restored with identical rows included.");
        }}>Hide identical</button>
        <button type="button" className={highlightDifferences ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setHighlightDifferences((value) => !value);
          setMessage(!highlightDifferences ? "Difference highlighting restored with text labels, not color alone." : "Difference highlighting removed while row labels and values remain aligned.");
        }}>Highlight diffs</button>
        <button type="button" className={pinned ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPinned((value) => !value);
          setMessage(!pinned ? "Sticky item identity restored for long comparisons." : "Pinned header disabled; this illustrates why long comparisons need persistent identity.");
        }}>Pin header</button>
        <button type="button" className={mobilePair ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMobilePair((value) => !value);
          setMessage(!mobilePair ? "Mobile pair mode limits visible columns to two while preserving the full selected tray." : "Desktop comparison restored with all selected columns visible.");
        }}>Mobile pair</button>
        <button type="button" className={grouped ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setGrouped((value) => !value);
          setMessage(!grouped ? "Attribute groups restored so related specs stay together." : "Grouping removed; the values stay comparable but scanning is harder.");
        }}>Group specs</button>
        <button type="button" className="demo-button small" onClick={() => {
          setMessage(`Export keeps ${selected.length} compared items, visible filters, difference mode, ${grouped ? "grouped" : "ungrouped"} attributes, prices, status, and timestamp.`);
        }}>Export shortlist</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CompareViewBadUx() {
  type Mode = "tooMany" | "hiddenCompare" | "noSticky" | "identicalClutter" | "inconsistentSpecs" | "mobileCrush" | "lostShortlist";
  const [mode, setMode] = useState<Mode>("tooMany");
  const copy: Record<Mode, string> = {
    tooMany: "The view permits seven items, so the columns become too narrow for meaningful tradeoff reading.",
    hiddenCompare: "Compare selection appears only on hover, excluding keyboard, touch, and scanning users.",
    noSticky: "Users scroll through long rows after the model names disappear and must remember which column is which.",
    identicalClutter: "Identical attributes dominate the matrix and users must manually hunt for the few differences.",
    inconsistentSpecs: "Attributes are missing or named differently across items, so values are not truly comparable.",
    mobileCrush: "The desktop-wide matrix is squeezed into mobile, clipping columns instead of limiting the pair.",
    lostShortlist: "Returning to browse or removing one item clears the entire shortlist."
  };

  return (
    <div className={`quality-example compare-bad-demo is-${mode}`}>
      <div className="compare-broken" aria-label="Broken comparison behavior">
        <strong>{mode === "hiddenCompare" ? "Hover to compare" : mode === "noSticky" ? "Specs only" : mode === "mobileCrush" ? "Desktop table" : "Compare everything"}</strong>
        {Array.from({ length: mode === "tooMany" || mode === "mobileCrush" ? 7 : 4 }, (_, index) => (
          <span key={index}>
            {mode === "inconsistentSpecs" && index === 2 ? "GPU-ish" : `Model ${index + 1}`}
            <small>{mode === "identicalClutter" ? "Same, same, same" : mode === "lostShortlist" ? "Selection reset" : "Fast, bright, powerful"}</small>
          </span>
        ))}
      </div>
      <div className="demo-row compare-controls">
        <button type="button" className={mode === "tooMany" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tooMany")}>Too many</button>
        <button type="button" className={mode === "hiddenCompare" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenCompare")}>Hidden compare</button>
        <button type="button" className={mode === "noSticky" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noSticky")}>No sticky</button>
        <button type="button" className={mode === "identicalClutter" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("identicalClutter")}>Identical clutter</button>
        <button type="button" className={mode === "inconsistentSpecs" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("inconsistentSpecs")}>Inconsistent specs</button>
        <button type="button" className={mode === "mobileCrush" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileCrush")}>Mobile crush</button>
        <button type="button" className={mode === "lostShortlist" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostShortlist")}>Lost shortlist</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompareViewGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompareViewBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompareViewGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CompareViewBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
