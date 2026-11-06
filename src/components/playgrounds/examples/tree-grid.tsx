import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type TreeGridRow = {
  id: string;
  parentId?: string;
  label: string;
  owner: string;
  due: string;
  status: string;
  cost: string;
  level: number;
  hasChildren?: boolean;
  dirty?: boolean;
  invalid?: boolean;
  overdue?: boolean;
};

const treeGridRows: TreeGridRow[] = [
  { id: "phase-design", label: "Design", owner: "Maya", due: "Jun 18", status: "2 tasks", cost: "$4.8k", level: 1, hasChildren: true },
  { id: "task-wireframes", parentId: "phase-design", label: "Wireframes", owner: "Maya", due: "Jun 12", status: "Ready", cost: "$1.2k", level: 2 },
  { id: "task-research", parentId: "phase-design", label: "Research synthesis", owner: "Ravi", due: "Jun 14", status: "Overdue", cost: "$2.1k", level: 2, overdue: true, dirty: true },
  { id: "phase-build", label: "Build", owner: "Nora", due: "Jun 28", status: "3 tasks", cost: "$9.4k", level: 1, hasChildren: true },
  { id: "task-api", parentId: "phase-build", label: "API contract", owner: "Lee", due: "Jun 20", status: "Blocked", cost: "$3.0k", level: 2, invalid: true },
  { id: "task-ui", parentId: "phase-build", label: "Grid UI", owner: "Nora", due: "Jun 24", status: "In review", cost: "$2.8k", level: 2 },
  { id: "task-qa", parentId: "phase-build", label: "QA pass", owner: "Ira", due: "Jun 27", status: "Queued", cost: "$1.6k", level: 2 }
];

const treeGridColumns = ["Task", "Owner", "Due", "Status", "Cost"] as const;

function TreeGridGoodUi() {
  const visibleRows = treeGridRows.filter((row) => row.level === 1 || row.parentId === "phase-design");
  return (
    <div className="quality-example tree-grid-demo">
      <div className="tree-grid-toolbar" id="tree-grid-ui-label">
        <strong>Project breakdown</strong>
        <span>Design expanded</span>
        <span>Build collapsed: 1 issue hidden</span>
      </div>
      <div className="tree-grid" role="treegrid" aria-labelledby="tree-grid-ui-label" aria-rowcount={7} aria-colcount={treeGridColumns.length}>
        <div className="tree-grid-row is-header" role="row" aria-rowindex={1}>
          {treeGridColumns.map((column, index) => (
            <div key={column} className="tree-grid-cell" role="columnheader" aria-colindex={index + 1}>{column}</div>
          ))}
        </div>
        {visibleRows.map((row, index) => (
          <div key={row.id} className={`tree-grid-row ${row.dirty ? "has-dirty" : ""} ${row.invalid ? "has-error" : ""}`} role="row" aria-rowindex={index + 2} aria-level={row.level} aria-expanded={row.hasChildren ? row.id === "phase-design" : undefined}>
            <div className="tree-grid-cell tree-grid-name" role="rowheader" aria-colindex={1} tabIndex={row.id === "task-research" ? 0 : -1}>
              <span className="tree-grid-indent" style={{ "--tree-level": row.level } as React.CSSProperties}></span>
              {row.hasChildren ? <span className="tree-grid-toggle" aria-hidden="true">{row.id === "phase-design" ? "−" : "+"}</span> : <span className="tree-grid-leaf" aria-hidden="true"></span>}
              <span>{row.label}</span>
              {row.dirty ? <span className="tree-grid-marker">dirty child</span> : null}
              {row.id === "phase-build" ? <span className="tree-grid-marker">1 issue hidden</span> : null}
            </div>
            <div className="tree-grid-cell" role="gridcell" aria-colindex={2}>{row.owner}</div>
            <div className="tree-grid-cell" role="gridcell" aria-colindex={3}>{row.due}</div>
            <div className="tree-grid-cell" role="gridcell" aria-colindex={4}>{row.status}</div>
            <div className="tree-grid-cell numeric" role="gridcell" aria-colindex={5}>{row.cost}</div>
          </div>
        ))}
      </div>
      <p className="demo-status">Expanded and collapsed parent rows preserve hierarchy, column meaning, child state summaries, and leaf rows without fake disclosure controls.</p>
    </div>
  );
}

function TreeGridBadUi() {
  return (
    <div className="bad-ui-sample tree-grid-bad-demo is-flatGrid">
      <div className="tree-grid-fake" aria-label="Broken project breakdown">
        <div><button type="button">›</button><b>Design</b><span>Maya</span><span>Ready</span><span>$4.8k</span></div>
        <div><button type="button">›</button><b>Wireframes</b><span>Maya</span><span>Ready</span><span>$1.2k</span></div>
        <div><button type="button">›</button><b>Research synthesis</b><span>Ravi</span><span>Hidden error</span><span>$2.1k</span></div>
      </div>
      <p className="demo-status">Every row receives a chevron, leaves look expandable, hierarchy is only visual, and hidden descendant state has no parent summary.</p>
    </div>
  );
}

function TreeGridGoodUx() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["phase-design", "phase-build"]));
  const [focusedId, setFocusedId] = useState("task-research");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["task-research"]));
  const [dirtyRows, setDirtyRows] = useState<Set<string>>(() => new Set(["task-research"]));
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [message, setMessage] = useState("Focus is on Research synthesis. Parent rows expose expansion while child rows preserve column context.");

  const rowMatchesFilter = (row: TreeGridRow) => !overdueOnly || row.overdue || (row.hasChildren && treeGridRows.some((child) => child.parentId === row.id && child.overdue));
  const visibleRows = treeGridRows.filter((row) => {
    if (!rowMatchesFilter(row)) return false;
    if (row.level === 1) return true;
    return expanded.has(row.parentId ?? "") && (!overdueOnly || row.overdue);
  });
  const focusedIndex = Math.max(0, visibleRows.findIndex((row) => row.id === focusedId));
  const focusedRow = visibleRows[focusedIndex] ?? visibleRows[0];

  const focusRow = (nextIndex: number) => {
    const next = visibleRows[Math.min(visibleRows.length - 1, Math.max(0, nextIndex))];
    if (!next) return;
    setFocusedId(next.id);
    setMessage(`Focus moved to ${next.label}, level ${next.level}.`);
  };

  const toggleExpanded = (id: string) => {
    const row = treeGridRows.find((item) => item.id === id) ?? focusedRow;
    if (!row.hasChildren) {
      setMessage(`${row.label} is a leaf row, so no expansion state is exposed.`);
      return;
    }
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(row.id)) {
        next.delete(row.id);
        setFocusedId(row.id);
        const dirtyChildren = treeGridRows.filter((child) => child.parentId === row.id && dirtyRows.has(child.id)).length;
        setMessage(`${row.label} collapsed. Focus returns to the parent row${dirtyChildren ? ` and ${dirtyChildren} dirty child remains summarized.` : "."}`);
      } else {
        next.add(row.id);
        const child = treeGridRows.find((item) => item.parentId === row.id);
        if (child) setFocusedId(child.id);
        setMessage(`${row.label} expanded. The first child is visible with the same columns.`);
      }
      return next;
    });
  };

  const toggleSelected = () => {
    if (!focusedRow) return;
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(focusedRow.id)) {
        next.delete(focusedRow.id);
      } else {
        next.add(focusedRow.id);
      }
      setMessage(`${focusedRow.label} ${next.has(focusedRow.id) ? "selected" : "deselected"}; selection is separate from focus.`);
      return next;
    });
  };

  const toggleOverdue = () => {
    const next = !overdueOnly;
    setOverdueOnly(next);
    setExpanded(new Set(["phase-design"]));
    setFocusedId(next ? "task-research" : "phase-design");
    setMessage(next ? "Filtered to overdue descendants. Design remains because it contains a matching child." : "Filter cleared. Expanded state and hierarchy return to the full project breakdown.");
  };

  const markDirty = () => {
    setDirtyRows((current) => new Set(current).add("task-research"));
    setFocusedId("task-research");
    setExpanded((current) => new Set(current).add("phase-design"));
    setMessage("Research synthesis is dirty. Collapsing Design keeps a dirty-child summary on the parent.");
  };

  return (
    <div className="quality-example tree-grid-demo">
      <div className="tree-grid-toolbar" id="tree-grid-ux-label">
        <strong>Project breakdown</strong>
        <span>{visibleRows.length} visible rows</span>
        <span>{selected.size} selected</span>
        <span>{overdueOnly ? "Filter: Overdue descendants" : "Filter: All rows"}</span>
      </div>
      <div className="tree-grid-shell">
        <div className="tree-grid" role="treegrid" aria-labelledby="tree-grid-ux-label" aria-describedby="tree-grid-ux-help" aria-rowcount={treeGridRows.length} aria-colcount={treeGridColumns.length} aria-multiselectable="true">
          <div className="tree-grid-row is-header" role="row" aria-rowindex={1}>
            {treeGridColumns.map((column, index) => (
              <div key={column} className="tree-grid-cell" role="columnheader" aria-colindex={index + 1} aria-sort={column === "Due" ? "ascending" : undefined}>{column}{column === "Due" ? " ↑" : ""}</div>
            ))}
          </div>
          {visibleRows.map((row, index) => {
            const parentDirtyCount = row.hasChildren ? treeGridRows.filter((child) => child.parentId === row.id && dirtyRows.has(child.id)).length : 0;
            const isFocused = focusedId === row.id;
            const isSelected = selected.has(row.id);
            return (
              <div
                key={row.id}
                className={`tree-grid-row ${isFocused ? "is-focused" : ""} ${isSelected ? "is-selected" : ""} ${dirtyRows.has(row.id) ? "has-dirty" : ""} ${row.invalid ? "has-error" : ""}`}
                role="row"
                aria-rowindex={index + 2}
                aria-level={row.level}
                aria-posinset={row.level === 1 ? treeGridRows.filter((item) => item.level === 1).findIndex((item) => item.id === row.id) + 1 : treeGridRows.filter((item) => item.parentId === row.parentId).findIndex((item) => item.id === row.id) + 1}
                aria-setsize={row.level === 1 ? treeGridRows.filter((item) => item.level === 1).length : treeGridRows.filter((item) => item.parentId === row.parentId).length}
                aria-expanded={row.hasChildren ? expanded.has(row.id) : undefined}
                aria-selected={isSelected}
              >
                <div className="tree-grid-cell tree-grid-name" role="rowheader" aria-colindex={1} tabIndex={isFocused ? 0 : -1}>
                  <span className="tree-grid-indent" style={{ "--tree-level": row.level } as React.CSSProperties}></span>
                  {row.hasChildren ? <button type="button" className="tree-grid-toggle" aria-label={`${expanded.has(row.id) ? "Collapse" : "Expand"} ${row.label}`} onClick={() => toggleExpanded(row.id)}>{expanded.has(row.id) ? "−" : "+"}</button> : <span className="tree-grid-leaf" aria-hidden="true"></span>}
                  <span>{row.label}</span>
                  {dirtyRows.has(row.id) ? <span className="tree-grid-marker">dirty</span> : null}
                  {parentDirtyCount ? <span className="tree-grid-marker">{parentDirtyCount} dirty child</span> : null}
                  {row.invalid ? <span className="tree-grid-marker danger">invalid</span> : null}
                </div>
                <div className="tree-grid-cell" role="gridcell" aria-colindex={2}>{row.owner}</div>
                <div className="tree-grid-cell" role="gridcell" aria-colindex={3}>{row.due}</div>
                <div className="tree-grid-cell" role="gridcell" aria-colindex={4}>{row.status}</div>
                <div className="tree-grid-cell numeric" role="gridcell" aria-colindex={5}>{row.cost}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="demo-row tree-grid-controls" aria-label="Tree grid exercise controls">
        <button type="button" className="demo-button small" onClick={() => focusRow(focusedIndex - 1)}>Arrow up</button>
        <button type="button" className="demo-button small" onClick={() => focusRow(focusedIndex + 1)}>Arrow down</button>
        <button type="button" className="demo-button small" onClick={() => toggleExpanded(focusedRow.id)}>Left/Right expand</button>
        <button type="button" className="demo-button small" onClick={() => toggleExpanded("phase-design")}>Toggle Design</button>
        <button type="button" className="demo-button small" onClick={markDirty}>Mark child dirty</button>
        <button type="button" className={overdueOnly ? "demo-button small primary" : "demo-button small"} onClick={toggleOverdue}>Overdue filter</button>
        <button type="button" className="demo-button small" onClick={toggleSelected}>Shift+Space</button>
        <button type="button" className="demo-button small" onClick={() => {
          setFocusedId("task-research");
          setExpanded((current) => new Set(current).add("phase-design"));
          setMessage("Focus restored to Research synthesis after re-expanding Design.");
        }}>Restore focus</button>
      </div>
      <p className="demo-status" id="tree-grid-ux-help" aria-live="polite">{message}</p>
    </div>
  );
}

function TreeGridBadUx() {
  type Mode = "flatGrid" | "fakeLeaf" | "hiddenDirty" | "sortBreak" | "staleIndex" | "mobileCrush";
  const [mode, setMode] = useState<Mode>("flatGrid");
  const copy: Record<Mode, string> = {
    flatGrid: "A flat data grid uses treegrid treatment even though rows do not own children.",
    fakeLeaf: "Leaf rows expose chevrons and expansion state, so users cannot tell which rows actually contain descendants.",
    hiddenDirty: "Collapsing Design hides a dirty child row without a parent badge, warning, or restore path.",
    sortBreak: "Sorting by Due date scatters child tasks away from their parent phases and destroys containment.",
    staleIndex: "After filtering, visible row 3 still reports an old virtual row index and level.",
    mobileCrush: "The full hierarchy and six columns are squeezed into a narrow layout instead of offering a focused detail route."
  };

  return (
    <div className={`quality-example tree-grid-bad-demo is-${mode}`}>
      <div className="tree-grid-fake" role={mode === "flatGrid" ? "treegrid" : undefined} aria-label="Broken tree grid">
        <div>
          <button type="button">{mode === "fakeLeaf" ? "›" : mode === "hiddenDirty" ? "+" : "−"}</button>
          <b>{mode === "sortBreak" ? "Research synthesis" : "Design"}</b>
          <span>{mode === "staleIndex" ? "row 421" : "Maya"}</span>
          <span>{mode === "mobileCrush" ? "owner due status cost risk notes approval" : "Jun 18"}</span>
          <span>{mode === "hiddenDirty" ? "Clean" : "$4.8k"}</span>
        </div>
        <div>
          <button type="button">›</button>
          <b>{mode === "sortBreak" ? "Build" : "Wireframes"}</b>
          <span>Nora</span>
          <span>{mode === "fakeLeaf" ? "Leaf with chevron" : "Jun 20"}</span>
          <span>$1.2k</span>
        </div>
        <div>
          <button type="button">›</button>
          <b>{mode === "sortBreak" ? "Design" : "API contract"}</b>
          <span>Lee</span>
          <span>{mode === "staleIndex" ? "level 9" : "Blocked"}</span>
          <span>$3.0k</span>
        </div>
      </div>
      <div className="demo-row tree-grid-controls">
        <button type="button" className={mode === "flatGrid" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("flatGrid")}>Flat grid</button>
        <button type="button" className={mode === "fakeLeaf" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fakeLeaf")}>Fake leaf</button>
        <button type="button" className={mode === "hiddenDirty" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenDirty")}>Hidden dirty</button>
        <button type="button" className={mode === "sortBreak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("sortBreak")}>Sort breaks tree</button>
        <button type="button" className={mode === "staleIndex" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleIndex")}>Stale index</button>
        <button type="button" className={mode === "mobileCrush" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileCrush")}>Mobile crush</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TreeGridGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TreeGridBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TreeGridGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TreeGridBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
