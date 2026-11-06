import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const listViewRows = [
  { id: "tck-2048", title: "Database backup failed", summary: "Nightly backup stopped at 82% on the billing cluster.", status: "Critical", owner: "Maya", updated: "9 min ago", group: "Urgent", unread: true },
  { id: "tck-2049", title: "Invoice export delayed", summary: "Finance export is queued behind a long-running report job.", status: "Waiting", owner: "Ravi", updated: "18 min ago", group: "Urgent" },
  { id: "tck-2050", title: "New SSO certificate", summary: "Identity team uploaded a certificate that needs rollout review.", status: "Review", owner: "Nora", updated: "42 min ago", group: "Today", pinned: true },
  { id: "tck-2051", title: "Archive old webhooks", summary: "Four inactive endpoints can be removed after customer confirmation.", status: "Planned", owner: "Lee", updated: "2 hr ago", group: "Today" }
];

function ListViewRow({
  row,
  selected,
  active,
  menuOpen,
  onSelect,
  onOpen,
  onMenu
}: {
  row: typeof listViewRows[number];
  selected?: boolean;
  active?: boolean;
  menuOpen?: boolean;
  onSelect?: () => void;
  onOpen?: () => void;
  onMenu?: () => void;
}) {
  return (
    <li className={`list-view-row ${selected ? "is-selected" : ""} ${active ? "is-active" : ""} ${row.unread ? "is-unread" : ""}`}>
      <label className="list-view-check">
        <input type="checkbox" checked={!!selected} onChange={onSelect} readOnly={!onSelect} aria-label={`Select ${row.title}`} />
      </label>
      <button type="button" className="list-view-main" onClick={onOpen}>
        <span className="list-view-icon" aria-hidden="true">{row.status.slice(0, 1)}</span>
        <span className="list-view-copy">
          <strong>{row.title}</strong>
          <span>{row.summary}</span>
          <small>{row.owner} · Updated {row.updated}</small>
        </span>
      </button>
      <span className={`list-view-status is-${row.status.toLowerCase()}`}>{row.status}</span>
      <button type="button" className="demo-button small" onClick={onMenu} aria-expanded={menuOpen} aria-label={`More actions for ${row.title}`}>More</button>
      {menuOpen ? (
        <div className="list-view-menu" role="menu" aria-label={`Actions for ${row.title}`}>
          <button type="button" role="menuitem">Assign {row.id}</button>
          <button type="button" role="menuitem">Archive {row.id}</button>
        </div>
      ) : null}
    </li>
  );
}

function ListViewGoodUi() {
  return (
    <div className="quality-example list-view-demo">
      <div className="list-view-toolbar" id="list-view-ui-label">
        <strong>Ticket queue</strong>
        <span>4 rows</span>
        <span>2 urgent</span>
      </div>
      <ul className="list-view-list" aria-labelledby="list-view-ui-label">
        {listViewRows.slice(0, 3).map((row, index) => (
          <ListViewRow
            key={row.id}
            row={row}
            selected={index === 0}
            active={index === 1}
          />
        ))}
      </ul>
      <p className="demo-status">Each row has a primary label, summary, metadata, status, selection control, and row-scoped action with the ticket identity preserved.</p>
    </div>
  );
}

function ListViewBadUi() {
  return (
    <div className="bad-ui-sample list-view-bad-demo is-fakeTable">
      <div className="list-view-fake" aria-label="Broken ticket rows">
        <div><b>Database backup failed</b><span>Maya</span><span>9 min</span><button type="button">⋯</button><button type="button">×</button></div>
        <div><b>Invoice export delayed</b><span>Ravi</span><span>18 min</span><button type="button">⋯</button><button type="button">×</button></div>
        <div><b>New SSO certificate</b><span>Nora</span><span>42 min</span><button type="button">⋯</button><button type="button">×</button></div>
      </div>
      <p className="demo-status">The broken list imitates table columns without headers, row action labels, selected state, or a clear primary row action.</p>
    </div>
  );
}

function ListViewGoodUx() {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [latestFirst, setLatestFirst] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["tck-2048"]));
  const [activeId, setActiveId] = useState("tck-2049");
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [loadedMore, setLoadedMore] = useState(false);
  const [message, setMessage] = useState("Ticket rows are object summaries. Selection, active detail, unread, and row actions are distinct.");

  const visibleRows = (loadedMore ? [...listViewRows, { id: "tck-2052", title: "Webhook retry noise", summary: "Integration retries are flooding the activity log.", status: "Review", owner: "Ira", updated: "3 hr ago", group: "Older" }] : listViewRows)
    .filter((row) => !criticalOnly || row.status === "Critical")
    .sort((a, b) => {
      if (!latestFirst) return a.title.localeCompare(b.title);
      const order = ["9 min ago", "18 min ago", "42 min ago", "2 hr ago", "3 hr ago"];
      return order.indexOf(a.updated) - order.indexOf(b.updated);
    });
  const hiddenSelected = [...selected].filter((id) => !visibleRows.some((row) => row.id === id)).length;

  const toggleSelected = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      const row = listViewRows.find((item) => item.id === id);
      setMessage(`${row?.title ?? id} ${next.has(id) ? "selected" : "deselected"}. Selection count is separate from active detail.`);
      return next;
    });
  };

  return (
    <div className="quality-example list-view-demo">
      <div className="list-view-toolbar" id="list-view-ux-label">
        <strong>Ticket queue</strong>
        <span>{visibleRows.length} visible</span>
        <span>{selected.size} selected{hiddenSelected ? `, ${hiddenSelected} hidden by filter` : ""}</span>
        <span>{latestFirst ? "Sorted: latest update" : "Sorted: title"}</span>
      </div>
      <ul className="list-view-list" aria-labelledby="list-view-ux-label">
        {visibleRows.map((row) => (
          <ListViewRow
            key={row.id}
            row={row}
            selected={selected.has(row.id)}
            active={activeId === row.id}
            menuOpen={menuFor === row.id}
            onSelect={() => toggleSelected(row.id)}
            onOpen={() => {
              setActiveId(row.id);
              setMessage(`${row.title} opened in the preview context. Active row is not the same as selected row.`);
            }}
            onMenu={() => {
              setMenuFor(menuFor === row.id ? null : row.id);
              setMessage(`Row menu ${menuFor === row.id ? "closed" : "opened"} for ${row.title}; actions name the ticket.`);
            }}
          />
        ))}
      </ul>
      <div className="demo-row list-view-controls" aria-label="List view exercise controls">
        <button type="button" className={criticalOnly ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setCriticalOnly((value) => !value);
          setMessage(!criticalOnly ? "Filtered to Critical tickets. Hidden selected rows remain counted explicitly." : "Filter cleared. Selected rows and active preview context remain understandable.");
        }}>Critical filter</button>
        <button type="button" className="demo-button small" onClick={() => {
          setLatestFirst((value) => !value);
          setMessage("Sort changed. Row identity, selected rows, and active detail stay attached to ticket IDs.");
        }}>Change sort</button>
        <button type="button" className="demo-button small" onClick={() => toggleSelected("tck-2050")}>Select SSO</button>
        <button type="button" className="demo-button small" onClick={() => {
          setActiveId("tck-2048");
          setMessage("Database backup failed is active in the preview, but selection state is unchanged.");
        }}>Preview active</button>
        <button type="button" className={menuFor ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMenuFor(menuFor ? null : activeId);
          setMessage(menuFor ? "Row menu closed and focus returns to the row action." : "Active row menu opened with ticket-specific actions.");
        }}>Row menu</button>
        <button type="button" className="demo-button small" onClick={() => {
          setLoadedMore(true);
          setMessage("Loaded one older ticket. The list announces the new row without moving active context.");
        }}>Load more</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ListViewBadUx() {
  type Mode = "fakeTable" | "actionMaze" | "rowConflict" | "lostSelection" | "virtualJump" | "mobileOverlap";
  const [mode, setMode] = useState<Mode>("fakeTable");
  const copy: Record<Mode, string> = {
    fakeTable: "Rows align pseudo-columns for owner, date, and status without headers, sort state, or table semantics.",
    actionMaze: "Every row exposes five controls, so keyboard users traverse a long action maze before reaching the next row.",
    rowConflict: "The row opens detail, the title navigates, the checkbox selects, and the trailing icon deletes with overlapping hit targets.",
    lostSelection: "Filtering hides selected rows but the bulk action count still applies to them with no explanation.",
    virtualJump: "After one row updates, the virtualized list jumps to the top and focus no longer names the same ticket.",
    mobileOverlap: "On mobile, long titles, chips, timestamps, and actions overlap until row identity and action ownership disappear."
  };

  return (
    <div className={`quality-example list-view-bad-demo is-${mode}`}>
      <div className="list-view-fake" aria-label="Broken list view">
        <div><b>{mode === "virtualJump" ? "Unknown row 48" : "Database backup failed"}</b><span>{mode === "lostSelection" ? "3 selected hidden" : "Maya"}</span><span>{mode === "fakeTable" ? "9 min Critical" : "9 min"}</span><button type="button">{mode === "rowConflict" ? "Open/Delete" : "⋯"}</button><button type="button">{mode === "actionMaze" ? "Pin" : "×"}</button></div>
        <div><b>{mode === "mobileOverlap" ? "Invoice export delayed waiting finance report owner Ravi due today" : "Invoice export delayed"}</b><span>Ravi</span><span>18 min</span><button type="button">⋯</button><button type="button">{mode === "actionMaze" ? "Mute" : "×"}</button></div>
        <div><b>New SSO certificate</b><span>Nora</span><span>42 min</span><button type="button">⋯</button><button type="button">{mode === "actionMaze" ? "Escalate" : "×"}</button></div>
      </div>
      <div className="demo-row list-view-controls">
        <button type="button" className={mode === "fakeTable" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fakeTable")}>Fake table</button>
        <button type="button" className={mode === "actionMaze" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("actionMaze")}>Action maze</button>
        <button type="button" className={mode === "rowConflict" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("rowConflict")}>Row conflict</button>
        <button type="button" className={mode === "lostSelection" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostSelection")}>Lost selection</button>
        <button type="button" className={mode === "virtualJump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("virtualJump")}>Virtual jump</button>
        <button type="button" className={mode === "mobileOverlap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileOverlap")}>Mobile overlap</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ListViewGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ListViewBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ListViewGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ListViewBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
