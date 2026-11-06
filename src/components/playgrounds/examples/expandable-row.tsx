import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ExpandableInvoiceId = "inv2048" | "inv2049" | "inv2050" | "inv2051";

type ExpandableInvoice = {
  id: ExpandableInvoiceId;
  code: string;
  vendor: string;
  status: "Exception" | "Ready" | "Paid" | "No detail";
  amount: number;
  due: string;
  summary: string;
  detail?: {
    title: string;
    reason: string;
    lines: string[];
    audit: string;
  };
};

const expandableInvoices: ExpandableInvoice[] = [
  {
    id: "inv2048",
    code: "INV-2048",
    vendor: "Northstar Labs",
    status: "Exception",
    amount: 18400,
    due: "12 Jun",
    summary: "PO mismatch",
    detail: {
      title: "INV-2048 detail",
      reason: "Line 2 is $400 above the approved purchase order.",
      lines: ["2 line items", "Approval history: Priya -> Finance", "Suggested action: request updated PO"],
      audit: "AUD-91F4"
    }
  },
  {
    id: "inv2049",
    code: "INV-2049",
    vendor: "Meridian Freight",
    status: "Ready",
    amount: 6200,
    due: "14 Jun",
    summary: "Matched",
    detail: {
      title: "INV-2049 detail",
      reason: "Three-way match completed with no exception.",
      lines: ["1 line item", "Receipt confirmed 09 Jun", "Ready for payment batch"],
      audit: "AUD-7C21"
    }
  },
  {
    id: "inv2050",
    code: "INV-2050",
    vendor: "PixelWorks Studio",
    status: "Paid",
    amount: 9800,
    due: "Paid",
    summary: "Payment sent",
    detail: {
      title: "INV-2050 detail",
      reason: "Payment confirmation sent to vendor.",
      lines: ["Batch PB-332", "Paid by ACH", "Receipt archived"],
      audit: "AUD-44D0"
    }
  },
  {
    id: "inv2051",
    code: "INV-2051",
    vendor: "Atlas Catering",
    status: "No detail",
    amount: 1290,
    due: "18 Jun",
    summary: "No row detail available"
  }
];

function money(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function ExpandableInvoiceTable({
  rows,
  expanded,
  loadingId,
  failedId,
  mobileStack,
  onToggle,
  onCopyAudit
}: {
  rows: ExpandableInvoice[];
  expanded: Set<ExpandableInvoiceId>;
  loadingId?: ExpandableInvoiceId | null;
  failedId?: ExpandableInvoiceId | null;
  mobileStack?: boolean;
  onToggle?: (row: ExpandableInvoice) => void;
  onCopyAudit?: (row: ExpandableInvoice) => void;
}) {
  return (
    <div className={`expand-row-shell${mobileStack ? " is-mobile-stack" : ""}`}>
      <table className="expand-row-table">
        <caption>June invoice review queue</caption>
        <thead>
          <tr>
            <th scope="col">Detail</th>
            <th scope="col">Invoice</th>
            <th scope="col">Status</th>
            <th scope="col">Amount</th>
            <th scope="col">Due</th>
            <th scope="col">Collapsed summary</th>
          </tr>
        </thead>
        <tbody>
          {rows.flatMap((row) => {
            const isExpanded = expanded.has(row.id);
            const hasDetail = Boolean(row.detail);
            const isLoading = loadingId === row.id;
            const isFailed = failedId === row.id;
            const controlLabel = hasDetail ? `${isExpanded ? "Hide" : "Show"} details for ${row.code}` : `No details available for ${row.code}`;
            const expansionProps = hasDetail
              ? {
                  "aria-expanded": isExpanded,
                  "aria-controls": `expand-row-detail-${row.id}`
                }
              : {};
            return [
              <tr className={isExpanded ? "is-expanded" : ""} key={`${row.id}-main`}>
                <td data-label="Detail">
                  <button
                    type="button"
                    className="expand-row-toggle"
                    disabled={!hasDetail}
                    onClick={() => onToggle?.(row)}
                    {...expansionProps}
                  >
                    <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                    {controlLabel}
                  </button>
                </td>
                <th scope="row" data-label="Invoice">
                  <strong>{row.code}</strong>
                  <span>{row.vendor}</span>
                </th>
                <td data-label="Status"><span className={`expand-row-status is-${row.status.toLowerCase().replace(/\s+/g, "-")}`}>{row.status}</span></td>
                <td data-label="Amount">{money(row.amount)}</td>
                <td data-label="Due">{row.due}</td>
                <td data-label="Collapsed summary">{row.summary}</td>
              </tr>,
              isExpanded ? (
                <tr className="expand-row-detail-row" key={`${row.id}-detail`}>
                  <td colSpan={6}>
                    <section id={`expand-row-detail-${row.id}`} className="expand-row-detail" aria-label={`Details for ${row.code}`}>
                      {isLoading ? (
                        <p className="demo-status">Loading current row detail for {row.code}...</p>
                      ) : isFailed ? (
                        <div className="expand-row-error">
                          <strong>Detail failed to load</strong>
                          <span>The row remains expanded and tied to {row.code}; retry keeps focus near the row.</span>
                        </div>
                      ) : row.detail ? (
                        <>
                          <div>
                            <strong>{row.detail.title}</strong>
                            <span>{row.detail.reason}</span>
                          </div>
                          <ul>
                            {row.detail.lines.map((line) => <li key={line}>{line}</li>)}
                          </ul>
                          <button type="button" className="demo-button small" onClick={() => onCopyAudit?.(row)}>Copy {row.detail.audit}</button>
                        </>
                      ) : (
                        <p className="demo-status">No row detail exists for {row.code}; the collapsed row says so instead of showing a dead control.</p>
                      )}
                    </section>
                  </td>
                </tr>
              ) : null
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}

function ExpandableRowGoodUi() {
  return (
    <div className="quality-example expand-row-demo">
      <div className="expand-row-toolbar">
        <strong>4 invoices</strong>
        <span>1 expanded</span>
        <span>ID-keyed detail</span>
        <span>Collapsed summaries</span>
      </div>
      <ExpandableInvoiceTable
        rows={expandableInvoices}
        expanded={new Set<ExpandableInvoiceId>(["inv2048"])}
      />
      <p className="demo-status">The expanded detail sits directly after INV-2048, repeats row identity, preserves the table caption and headers, and keeps the exception reason summarized while collapsed.</p>
    </div>
  );
}

function ExpandableRowBadUi() {
  return (
    <div className="bad-ui-sample expand-row-bad-demo is-chevronOnly">
      <div className="expand-row-broken-table" aria-label="Broken expandable rows">
        {["⌄", "⌄", "⌄", "⌄"].map((icon, index) => (
          <span key={index}>{icon}<small>{index === 2 ? "Nothing opens" : "More"}</small></span>
        ))}
      </div>
      <div className="expand-row-detached-card">
        <strong>Details</strong>
        <span>Line item mismatch, comments, files, edits, approvals, history, delete, refund, settings...</span>
      </div>
      <p className="demo-status">The broken version uses anonymous chevrons, dead controls, detached detail, and an overstuffed area that no longer belongs to one row.</p>
    </div>
  );
}

function ExpandableRowGoodUx() {
  const [expanded, setExpanded] = useState<Set<ExpandableInvoiceId>>(() => new Set(["inv2048"]));
  const [sortDesc, setSortDesc] = useState(false);
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const [loadingId, setLoadingId] = useState<ExpandableInvoiceId | null>(null);
  const [failedId, setFailedId] = useState<ExpandableInvoiceId | null>(null);
  const [mobileStack, setMobileStack] = useState(false);
  const [message, setMessage] = useState("INV-2048 is expanded. Expansion is keyed by invoice ID, not visual row index.");

  const rows = expandableInvoices
    .filter((row) => !exceptionsOnly || row.status === "Exception")
    .sort((a, b) => sortDesc ? b.amount - a.amount : a.amount - b.amount);

  function toggleRow(row: ExpandableInvoice) {
    if (!row.detail) {
      setMessage(`${row.code} has no extra row detail, so the control is disabled and the collapsed row says why.`);
      return;
    }
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(row.id)) {
        next.delete(row.id);
        setMessage(`${row.code} collapsed; focus stays on the row detail control.`);
      } else {
        next.add(row.id);
        setMessage(`${row.code} expanded directly below its owning row.`);
      }
      return next;
    });
  }

  function refreshDetail() {
    setFailedId(null);
    setLoadingId("inv2048");
    setExpanded((current) => new Set([...current, "inv2048"]));
    setMessage("Refreshing INV-2048 detail while keeping the expanded row tied to the invoice ID.");
    window.setTimeout(() => {
      setLoadingId(null);
      setMessage("INV-2048 detail refreshed without moving expansion to another visual row.");
    }, 450);
  }

  function failDetail() {
    setLoadingId(null);
    setFailedId("inv2048");
    setExpanded((current) => new Set([...current, "inv2048"]));
    setMessage("The detail load failed, but the expanded region stays below INV-2048 with a retry-ready error state.");
  }

  return (
    <div className="quality-example expand-row-demo">
      <div className="expand-row-toolbar">
        <strong>{rows.length} visible</strong>
        <span>{expanded.size} expanded</span>
        <span>{sortDesc ? "Amount high to low" : "Amount low to high"}</span>
        <span>{exceptionsOnly ? "Exceptions only" : "All statuses"}</span>
      </div>
      <ExpandableInvoiceTable
        rows={rows}
        expanded={expanded}
        loadingId={loadingId}
        failedId={failedId}
        mobileStack={mobileStack}
        onToggle={toggleRow}
        onCopyAudit={(row) => setMessage(`${row.detail?.audit ?? "Audit ID"} copied from ${row.code}; the action is scoped to the expanded row.`)}
      />
      <div className="demo-row expand-row-controls" aria-label="Expandable row exercise controls">
        <button type="button" className="demo-button small" onClick={() => toggleRow(expandableInvoices[0])}>Toggle INV-2048</button>
        <button type="button" className={sortDesc ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSortDesc((value) => !value);
          setMessage("Rows sorted by amount; expanded state remains attached to invoice IDs.");
        }}>Sort amount</button>
        <button type="button" className={exceptionsOnly ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setExceptionsOnly((value) => !value);
          setMessage(!exceptionsOnly ? "Filtered to exception rows; nonvisible expanded rows are preserved by ID for restore." : "All invoices restored with any still-visible expanded row in place.");
        }}>Filter exceptions</button>
        <button type="button" className="demo-button small" onClick={refreshDetail}>Refresh detail</button>
        <button type="button" className="demo-button small" onClick={failDetail}>Fail detail load</button>
        <button type="button" className={mobileStack ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMobileStack((value) => !value);
          setMessage(!mobileStack ? "Mobile stacking enabled with data labels preserved for each cell." : "Desktop table restored with column headers.");
        }}>Mobile stack</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ExpandableRowBadUx() {
  type Mode = "indexKeyed" | "chevronOnly" | "noSummary" | "deadChevron" | "detachedDetail" | "overstuffed" | "mobileUnlabeled";
  const [mode, setMode] = useState<Mode>("indexKeyed");
  const copy: Record<Mode, string> = {
    indexKeyed: "Expansion is stored as visual row 2, so sorting opens detail under the wrong invoice.",
    chevronOnly: "The control is just a rotating icon; users do not hear row identity or expanded state.",
    noSummary: "Critical failure reasons are hidden, forcing users to expand every row to triage.",
    deadChevron: "Rows with no extra detail still look expandable and produce empty panels.",
    detachedDetail: "Detail appears away from the row and loses which record owns it.",
    overstuffed: "The expanded area becomes a full workflow with comments, edits, files, history, and destructive actions.",
    mobileUnlabeled: "Mobile rows drop table labels, so expanded values and actions lose row context."
  };

  return (
    <div className={`quality-example expand-row-bad-demo is-${mode}`}>
      <div className="expand-row-broken-table" aria-label="Broken expandable row behavior">
        {["INV-1", "INV-2", "INV-3", "INV-4"].map((label, index) => (
          <span key={label}>
            {mode === "chevronOnly" || mode === "deadChevron" ? "⌄" : label}
            <small>{mode === "noSummary" ? "Status hidden" : mode === "mobileUnlabeled" ? "$9,800 / Failed / More" : index === 1 ? "Open detail" : "Row"}</small>
          </span>
        ))}
      </div>
      <div className="expand-row-detached-card">
        <strong>{mode === "detachedDetail" ? "Floating detail" : mode === "overstuffed" ? "Everything editor" : "Expanded area"}</strong>
        <span>{copy[mode]}</span>
      </div>
      <div className="demo-row expand-row-controls">
        <button type="button" className={mode === "indexKeyed" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("indexKeyed")}>Index-keyed</button>
        <button type="button" className={mode === "chevronOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("chevronOnly")}>Chevron only</button>
        <button type="button" className={mode === "noSummary" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noSummary")}>No summary</button>
        <button type="button" className={mode === "deadChevron" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deadChevron")}>Dead chevron</button>
        <button type="button" className={mode === "detachedDetail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("detachedDetail")}>Detached</button>
        <button type="button" className={mode === "overstuffed" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overstuffed")}>Overstuffed</button>
        <button type="button" className={mode === "mobileUnlabeled" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileUnlabeled")}>Mobile unlabeled</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExpandableRowGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExpandableRowBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExpandableRowGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ExpandableRowBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
