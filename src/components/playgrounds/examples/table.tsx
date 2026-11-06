import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const tableDemoRows = [
  { id: "pay-1042", vendor: "Atlas Office", status: "Pending", due: "Jun 12", amount: 1240, owner: "Maya" },
  { id: "pay-1043", vendor: "Blue Harbor", status: "Approved", due: "Jun 15", amount: 860, owner: "Ravi" },
  { id: "pay-1044", vendor: "Civic Print", status: "Pending", due: "Jun 18", amount: 2140, owner: "Nora" }
];

function TableGoodUi() {
  return (
    <div className="quality-example table-static-preview">
      <table className="record-table">
        <caption>June vendor payments awaiting review</caption>
        <thead>
          <tr>
            <th scope="col">Vendor</th>
            <th scope="col">Status</th>
            <th scope="col">Due date</th>
            <th scope="col" className="numeric">Amount</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableDemoRows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.vendor}</th>
              <td><span className={`table-status is-${row.status.toLowerCase()}`}>{row.status}</span></td>
              <td>{row.due}</td>
              <td className="numeric">${row.amount.toLocaleString()}</td>
              <td><button type="button" className="demo-button small">Review {row.vendor}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="demo-status">The table has a caption, column headers, row headers, aligned amounts, and row actions labelled by record.</p>
    </div>
  );
}

function TableBadUi() {
  return (
    <div className="bad-ui-sample table-static-preview bad">
      <div className="fake-table" aria-label="Payment rows without table semantics">
        <div><b>Atlas Office</b><span>Pending</span><span>1240</span><button type="button">Edit</button></div>
        <div><b>Blue Harbor</b><span>Approved</span><span>860</span><button type="button">Edit</button></div>
        <div><b>Civic Print</b><span>Pending</span><span>2140</span><button type="button">Edit</button></div>
      </div>
      <p className="demo-status">The broken version visually imitates columns but has no caption, no table semantics, no header associations, and row actions with ambiguous names.</p>
    </div>
  );
}

function TableGoodUx() {
  const [sortDirection, setSortDirection] = useState<"none" | "ascending" | "descending">("none");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [selected, setSelected] = useState("pay-1042");
  const [page, setPage] = useState(1);
  const [responsiveLabels, setResponsiveLabels] = useState(false);
  const [status, setStatus] = useState("Three payment rows shown. Caption, headers, row actions, sort, filter, and page state are synchronized.");

  const rows = tableDemoRows
    .filter((row) => !pendingOnly || row.status === "Pending")
    .sort((a, b) => {
      if (sortDirection === "ascending") return a.amount - b.amount;
      if (sortDirection === "descending") return b.amount - a.amount;
      return 0;
    });

  const toggleSort = () => {
    const next = sortDirection === "descending" ? "ascending" : "descending";
    setSortDirection(next);
    setPage(1);
    setStatus(`Amount sorted ${next}; the full filtered table was reordered and pagination returned to page 1.`);
  };

  const toggleFilter = () => {
    const next = !pendingOnly;
    setPendingOnly(next);
    setPage(1);
    if (next && !tableDemoRows.find((row) => row.id === selected && row.status === "Pending")) {
      setSelected("pay-1042");
    }
    setStatus(next ? "Filtered to pending rows. Active filter, row count, selection, and sort state remain visible." : "Filter cleared. All rows return with the current sort state preserved.");
  };

  const changePage = () => {
    const next = page === 1 ? 2 : 1;
    setPage(next);
    setStatus(`Moved to page ${next}; caption, active filter, amount sort, and selected row context stay attached to the table.`);
  };

  return (
    <div className={`quality-example table-demo ${responsiveLabels ? "is-stacked" : ""}`}>
      <div className="table-toolbar">
        <span>{rows.length} rows</span>
        <span>{pendingOnly ? "Filter: Pending" : "Filter: All statuses"}</span>
        <span>{sortDirection === "none" ? "Sort: Source order" : `Amount: ${sortDirection}`}</span>
        <span>Page {page} of 2</span>
      </div>
      <table className="record-table">
        <caption>June vendor payments awaiting review</caption>
        <thead>
          <tr>
            <th scope="col">Vendor</th>
            <th scope="col">Status</th>
            <th scope="col">Due date</th>
            <th scope="col" className="numeric" aria-sort={sortDirection === "none" ? "none" : sortDirection}>
              <button type="button" onClick={toggleSort}>Amount {sortDirection === "descending" ? "down" : sortDirection === "ascending" ? "up" : "sort"}</button>
            </th>
            <th scope="col">Owner</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={selected === row.id ? "is-selected" : ""}>
              <th scope="row" data-label="Vendor">{row.vendor}</th>
              <td data-label="Status"><span className={`table-status is-${row.status.toLowerCase()}`}>{row.status}</span></td>
              <td data-label="Due date">{row.due}</td>
              <td data-label="Amount" className="numeric">${row.amount.toLocaleString()}</td>
              <td data-label="Owner">{row.owner}</td>
              <td data-label="Action">
                <button
                  type="button"
                  className="demo-button small"
                  onClick={() => {
                    setSelected(row.id);
                    setStatus(`${row.vendor} selected. Row action label, row header, and highlighted state refer to the same record.`);
                  }}
                >
                  Review {row.vendor}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="demo-row table-exercise-controls">
        <button type="button" className="demo-button small" onClick={toggleSort}>Sort amount</button>
        <button type="button" className={pendingOnly ? "demo-button small primary" : "demo-button small"} onClick={toggleFilter}>Pending filter</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSelected("pay-1044");
          setStatus("Civic Print selected. Selection remains attached to the row through table updates unless filtering removes it.");
        }}>Select row</button>
        <button type="button" className="demo-button small" onClick={changePage}>Move page</button>
        <button type="button" className={responsiveLabels ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setResponsiveLabels((value) => !value);
          setStatus("Responsive stacked mode toggled; each cell keeps its header label before the value.");
        }}>Responsive labels</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function TableBadUx() {
  type Mode = "divTable" | "headerlessMobile" | "wrongRowAction" | "sortMismatch" | "dataGridMisuse" | "crampedColumns";
  const [mode, setMode] = useState<Mode>("divTable");
  const copy: Record<Mode, string> = {
    divTable: "Rows are built from generic containers, so table navigation cannot expose row, column, caption, or header relationships.",
    headerlessMobile: "The narrow layout drops column labels, leaving values such as Pending, Jun 12, and 1240 without meaning.",
    wrongRowAction: "Every action is labelled Edit, so keyboard users cannot tell which vendor will open.",
    sortMismatch: "The Amount header says sorted descending, but rows are still in source order and the result summary is stale.",
    dataGridMisuse: "Editable cells and menus were added without data-grid keyboard behavior or stable focus rules.",
    crampedColumns: "Too many columns and long notes are packed into one row instead of using a detail panel, expandable row, or reduced column set."
  };

  return (
    <div className={`quality-example table-bad-demo is-${mode}`}>
      <div className="fake-table" aria-label="Broken payment table">
        <div>
          <b>{mode === "headerlessMobile" ? "Atlas Office" : "Vendor"}</b>
          <span>{mode === "headerlessMobile" ? "Pending" : "Status"}</span>
          <span>{mode === "sortMismatch" ? "Amount sorted desc" : mode === "crampedColumns" ? "Due, owner, tax, PO, notes, region, risk" : "Amount"}</span>
          <button type="button">{mode === "wrongRowAction" ? "Edit" : mode === "dataGridMisuse" ? "Edit cell" : "Action"}</button>
        </div>
        <div>
          <b>Blue Harbor</b>
          <span>Approved</span>
          <span>{mode === "crampedColumns" ? "Jun 15 Ravi tax pending PO-88 note too long" : "$860"}</span>
          <button type="button">{mode === "wrongRowAction" ? "Edit" : "Open"}</button>
        </div>
        <div>
          <b>Civic Print</b>
          <span>Pending</span>
          <span>{mode === "sortMismatch" ? "$2,140 appears after $860 despite desc label" : "$2,140"}</span>
          <button type="button">{mode === "wrongRowAction" ? "Edit" : "Open"}</button>
        </div>
      </div>
      <div className="demo-row table-exercise-controls">
        <button type="button" className={mode === "divTable" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("divTable")}>Div table</button>
        <button type="button" className={mode === "headerlessMobile" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("headerlessMobile")}>Headerless mobile</button>
        <button type="button" className={mode === "wrongRowAction" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongRowAction")}>Wrong row action</button>
        <button type="button" className={mode === "sortMismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("sortMismatch")}>Sort mismatch</button>
        <button type="button" className={mode === "dataGridMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dataGridMisuse")}>Grid misuse</button>
        <button type="button" className={mode === "crampedColumns" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("crampedColumns")}>Cramped columns</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TableGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TableBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TableGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <TableBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
