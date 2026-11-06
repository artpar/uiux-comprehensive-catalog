import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const dataGridColumns = [
  { key: "invoice", label: "Invoice" },
  { key: "vendor", label: "Vendor" },
  { key: "amount", label: "Amount" },
  { key: "due", label: "Due" },
  { key: "owner", label: "Owner" },
  { key: "status", label: "Status" }
] as const;

const dataGridRows = [
  { id: "inv-2041", invoice: "INV-2041", vendor: "Atlas Office", amount: "$1,240", due: "Jun 12", owner: "Maya", status: "Ready" },
  { id: "inv-2042", invoice: "INV-2042", vendor: "Blue Harbor", amount: "$860", due: "Jun 15", owner: "Ravi", status: "Needs tax" },
  { id: "inv-2043", invoice: "INV-2043", vendor: "Civic Print", amount: "$2,140", due: "Jun 18", owner: "Nora", status: "Ready" },
  { id: "inv-2044", invoice: "INV-2044", vendor: "Delta Freight", amount: "$3,020", due: "Jun 21", owner: "Lee", status: "Draft" }
];

function DataGridGoodUi() {
  return (
    <div className="quality-example data-grid-demo">
      <div className="data-grid-toolbar" id="data-grid-ui-label">
        <strong>Invoice approvals</strong>
        <span>4 visible of 2,000 rows</span>
        <span>Focus: row 2, Amount</span>
      </div>
      <div className="data-grid" role="grid" aria-labelledby="data-grid-ui-label" aria-rowcount={2000} aria-colcount={dataGridColumns.length}>
        <div className="data-grid-row is-header" role="row" aria-rowindex={1}>
          {dataGridColumns.map((column, index) => (
            <div key={column.key} className="data-grid-cell" role="columnheader" aria-colindex={index + 1}>
              {column.label}
            </div>
          ))}
        </div>
        {dataGridRows.slice(0, 3).map((row, rowIndex) => (
          <div key={row.id} className={rowIndex === 1 ? "data-grid-row is-selected" : "data-grid-row"} role="row" aria-rowindex={rowIndex + 2} aria-selected={rowIndex === 1}>
            {dataGridColumns.map((column, columnIndex) => (
              <div
                key={column.key}
                className={`data-grid-cell ${rowIndex === 1 && column.key === "amount" ? "is-focused is-dirty" : ""}`}
                role={column.key === "invoice" ? "rowheader" : "gridcell"}
                aria-colindex={columnIndex + 1}
                aria-readonly={column.key === "invoice"}
                tabIndex={rowIndex === 1 && column.key === "amount" ? 0 : -1}
              >
                {row[column.key]}
                {rowIndex === 1 && column.key === "amount" ? <span className="data-grid-marker">dirty</span> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="demo-status">One managed focused cell, selected row state, dirty-cell marker, row indices, and column headers make the interactive grid inspectable.</p>
    </div>
  );
}

function DataGridBadUi() {
  return (
    <div className="bad-ui-sample data-grid-bad-demo is-tabEveryCell">
      <div className="data-grid-fake" aria-label="Invoice grid with unmanaged controls">
        {dataGridRows.slice(0, 3).map((row) => (
          <div key={row.id}>
            <input aria-label="invoice" defaultValue={row.invoice} />
            <input aria-label="vendor" defaultValue={row.vendor} />
            <input aria-label="amount" defaultValue={row.amount} />
            <button type="button">...</button>
          </div>
        ))}
      </div>
      <p className="demo-status">Every cell is tabbable, headers are missing, focus and selection are indistinguishable, and the ellipsis buttons do not identify their row.</p>
    </div>
  );
}

function DataGridGoodUx() {
  const [focused, setFocused] = useState({ row: 1, col: 2 });
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState("$860");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(() => new Set(["inv-2042"]));
  const [virtualStart, setVirtualStart] = useState(41);
  const [invalid, setInvalid] = useState(false);
  const [message, setMessage] = useState("Focus is on row 42, Amount. Arrow keys move cell focus; Enter starts editing.");

  const moveFocus = (rowDelta: number, colDelta: number) => {
    if (editing) {
      setMessage("Edit mode owns arrow keys inside the amount field. Save or cancel to restore grid navigation.");
      return;
    }
    setFocused((cell) => {
      const next = {
        row: Math.min(dataGridRows.length - 1, Math.max(0, cell.row + rowDelta)),
        col: Math.min(dataGridColumns.length - 1, Math.max(0, cell.col + colDelta))
      };
      setMessage(`Focus moved to row ${virtualStart + next.row}, ${dataGridColumns[next.col].label}.`);
      return next;
    });
  };

  const toggleSelected = () => {
    const row = dataGridRows[focused.row];
    setSelectedRows((current) => {
      const next = new Set(current);
      if (next.has(row.id)) {
        next.delete(row.id);
      } else {
        next.add(row.id);
      }
      setMessage(`${row.invoice} ${next.has(row.id) ? "selected" : "deselected"}. Focus stays on ${dataGridColumns[focused.col].label}.`);
      return next;
    });
  };

  const startEdit = () => {
    if (dataGridColumns[focused.col].key !== "amount") {
      setMessage("Only Amount cells are editable in this exercise; readonly cells still participate in navigation.");
      return;
    }
    setEditing(true);
    setInvalid(false);
    setMessage("Amount cell is in edit mode. Arrow keys now belong to the editor until save or cancel.");
  };

  const saveEdit = () => {
    if (!amount.startsWith("$") || amount.length < 3) {
      setInvalid(true);
      setMessage("Amount was not saved. Keep the editor open and enter a currency value such as $920.");
      return;
    }
    setEditing(false);
    setInvalid(false);
    setMessage(`Saved ${amount} in row ${virtualStart + focused.row}. Focus returned to the amount cell in navigation mode.`);
  };

  const pageRows = () => {
    const next = virtualStart === 41 ? 81 : 41;
    setVirtualStart(next);
    setFocused({ row: 0, col: focused.col });
    setEditing(false);
    setMessage(`Virtual window moved to row ${next}. aria-rowindex and focus location update with the visible rows.`);
  };

  const validatePaste = () => {
    setFocused({ row: 1, col: 2 });
    setEditing(true);
    setAmount("860");
    setInvalid(true);
    setMessage("Pasted value lacks a currency symbol. The invalid cell remains focused and editable.");
  };

  return (
    <div className="quality-example data-grid-demo">
      <div className="data-grid-toolbar" id="data-grid-ux-label">
        <strong>Invoice approvals</strong>
        <span>{selectedRows.size} selected</span>
        <span>Rows {virtualStart}-{virtualStart + 3} of 2,000</span>
        <span>{editing ? "Edit mode" : "Navigation mode"}</span>
      </div>
      <div className="data-grid-shell">
        <div className="data-grid" role="grid" aria-labelledby="data-grid-ux-label" aria-describedby="data-grid-ux-help" aria-rowcount={2000} aria-colcount={dataGridColumns.length} aria-multiselectable="true">
          <div className="data-grid-row is-header" role="row" aria-rowindex={1}>
            {dataGridColumns.map((column, index) => (
              <div key={column.key} className="data-grid-cell" role="columnheader" aria-colindex={index + 1} aria-sort={column.key === "due" ? "ascending" : undefined}>
                {column.label}{column.key === "due" ? " ↑" : ""}
              </div>
            ))}
          </div>
          {dataGridRows.map((row, rowIndex) => (
            <div key={row.id} className={selectedRows.has(row.id) ? "data-grid-row is-selected" : "data-grid-row"} role="row" aria-rowindex={virtualStart + rowIndex} aria-selected={selectedRows.has(row.id)}>
              {dataGridColumns.map((column, columnIndex) => {
                const isFocused = focused.row === rowIndex && focused.col === columnIndex;
                const isEditedAmount = row.id === "inv-2042" && column.key === "amount";
                const value = isEditedAmount ? amount : row[column.key];
                return (
                  <div
                    key={column.key}
                    className={`data-grid-cell ${isFocused ? "is-focused" : ""} ${isEditedAmount && amount !== "$860" ? "is-dirty" : ""} ${isFocused && invalid ? "is-invalid" : ""}`}
                    role={column.key === "invoice" ? "rowheader" : "gridcell"}
                    aria-colindex={columnIndex + 1}
                    aria-selected={selectedRows.has(row.id)}
                    aria-readonly={column.key !== "amount"}
                    aria-invalid={isFocused && invalid ? "true" : undefined}
                    tabIndex={isFocused && !editing ? 0 : -1}
                  >
                    {isFocused && editing ? (
                      <input
                        aria-label={`${row.invoice} amount`}
                        value={amount}
                        onChange={(event) => {
                          setAmount(event.target.value);
                          setInvalid(false);
                        }}
                      />
                    ) : (
                      value
                    )}
                    {isEditedAmount && amount !== "$860" ? <span className="data-grid-marker">dirty</span> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="demo-row data-grid-controls" aria-label="Data grid exercise controls">
        <button type="button" className="demo-button small" onClick={() => moveFocus(0, -1)}>Arrow left</button>
        <button type="button" className="demo-button small" onClick={() => moveFocus(0, 1)}>Arrow right</button>
        <button type="button" className="demo-button small" onClick={() => moveFocus(1, 0)}>Arrow down</button>
        <button type="button" className="demo-button small" onClick={startEdit}>Enter edit</button>
        <button type="button" className="demo-button small" onClick={() => {
          setAmount("$920");
          setMessage("Typed $920. Save keeps the dirty cell in place before any sort or refresh.");
        }}>Type value</button>
        <button type="button" className="demo-button small" onClick={saveEdit}>Save cell</button>
        <button type="button" className="demo-button small" onClick={() => {
          setEditing(false);
          setAmount("$860");
          setInvalid(false);
          setMessage("Escape canceled the amount edit and restored grid navigation on the same cell.");
        }}>Escape cancel</button>
        <button type="button" className="demo-button small" onClick={toggleSelected}>Shift+Space</button>
        <button type="button" className="demo-button small" onClick={pageRows}>Page rows</button>
        <button type="button" className={invalid ? "demo-button small primary" : "demo-button small"} onClick={validatePaste}>Validate paste</button>
        <button type="button" className="demo-button small" onClick={() => setMessage("Tab leaves the grid after the managed cell, instead of visiting every visible cell.")}>Leave grid</button>
      </div>
      <p className="demo-status" id="data-grid-ux-help" aria-live="polite">{message}</p>
    </div>
  );
}

function DataGridBadUx() {
  type Mode = "staticRole" | "tabEveryCell" | "arrowConflict" | "wrongIndex" | "lostFocus" | "mobileTrap";
  const [mode, setMode] = useState<Mode>("staticRole");
  const copy: Record<Mode, string> = {
    staticRole: "The read-only report uses grid semantics and arrow handling even though a normal table would be clearer.",
    tabEveryCell: "Every cell and inner button is tabbable, so the Save button after the grid is effectively buried.",
    arrowConflict: "The active text editor and grid navigation both consume arrow keys, so caret movement and cell movement conflict.",
    wrongIndex: "Virtual rows show row 4 visually but announce row 824 because indices are stale after filtering.",
    lostFocus: "Sorting after a save jumps focus to the first row and hides whether the edited cell was committed.",
    mobileTrap: "The same six-column spreadsheet is squeezed onto mobile with no focused edit route or usable column reduction."
  };

  return (
    <div className={`quality-example data-grid-bad-demo is-${mode}`}>
      <div className="data-grid-fake" role={mode === "staticRole" ? "grid" : undefined} aria-label="Broken invoice grid">
        <div>
          <span>{mode === "wrongIndex" ? "Row 824" : "INV-2041"}</span>
          <input defaultValue={mode === "arrowConflict" ? "Atlas Office" : "$1,240"} aria-label="cell editor" />
          <button type="button">{mode === "lostFocus" ? "Save and jump" : "..."}</button>
        </div>
        <div>
          <span>{mode === "mobileTrap" ? "Vendor amount due owner status tax notes risk" : "INV-2042"}</span>
          <input defaultValue={mode === "tabEveryCell" ? "Tab stop 18" : "$860"} aria-label="cell editor" />
          <button type="button">...</button>
        </div>
        <div>
          <span>INV-2043</span>
          <input defaultValue="invalid" aria-label="cell editor" />
          <button type="button">...</button>
        </div>
      </div>
      <div className="demo-row data-grid-controls">
        <button type="button" className={mode === "staticRole" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staticRole")}>Static role</button>
        <button type="button" className={mode === "tabEveryCell" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tabEveryCell")}>Tab every cell</button>
        <button type="button" className={mode === "arrowConflict" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("arrowConflict")}>Arrow conflict</button>
        <button type="button" className={mode === "wrongIndex" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongIndex")}>Wrong index</button>
        <button type="button" className={mode === "lostFocus" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostFocus")}>Lost focus</button>
        <button type="button" className={mode === "mobileTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileTrap")}>Mobile trap</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataGridGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataGridBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataGridGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataGridBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
