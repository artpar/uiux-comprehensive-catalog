import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

const masterDetailOrders = [
  { id: "ORD-1842", customer: "Maya Chen", status: "Ready to ship", total: "$248.40", summary: "Three warehouse items packed; address needs final carrier label.", detail: "Shipment label, customer note, payment capture, and packing timeline are shown as the selected order's detail destination." },
  { id: "ORD-1843", customer: "Noah Kim", status: "Payment review", total: "$92.10", summary: "Card verification requires review before fulfillment can start.", detail: "Payment risk, verification events, billing address, and review actions are kept with this order's detail route." },
  { id: "ORD-1844", customer: "Priya Shah", status: "Backordered", total: "$431.00", summary: "One item arrives Friday; customer approved split shipment.", detail: "Backorder reason, split-shipment choice, fulfillment notes, and customer messages remain tied to this order." }
];

function MasterDetailList({
  selectedId,
  hiddenSelected,
  onSelect
}: {
  selectedId: string;
  hiddenSelected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const visibleOrders = hiddenSelected
    ? masterDetailOrders.filter((order) => order.id !== selectedId)
    : masterDetailOrders;

  return (
    <div className="master-detail-list" role="listbox" aria-label="Orders" aria-activedescendant={hiddenSelected ? undefined : `master-detail-${selectedId}`}>
      {visibleOrders.map((order) => (
        <button
          key={order.id}
          id={`master-detail-${order.id}`}
          type="button"
          role="option"
          aria-selected={order.id === selectedId && !hiddenSelected}
          className={order.id === selectedId && !hiddenSelected ? "master-detail-row is-selected" : "master-detail-row"}
          onClick={() => onSelect?.(order.id)}
        >
          <span>{order.id}</span>
          <strong>{order.customer}</strong>
          <small>{order.status} - {order.total}</small>
        </button>
      ))}
      {hiddenSelected ? <p className="master-detail-note">{selectedId} is hidden by the active filter.</p> : null}
    </div>
  );
}

function MasterDetailPane({
  order,
  hiddenSelected,
  draft,
  titleId = "master-detail-title",
  onBack,
  onEdit
}: {
  order: typeof masterDetailOrders[number];
  hiddenSelected?: boolean;
  draft?: boolean;
  titleId?: string;
  onBack?: () => void;
  onEdit?: () => void;
}) {
  if (hiddenSelected) {
    return (
      <section className="master-detail-pane is-empty" aria-labelledby={titleId}>
        <h3 id={titleId}>Order hidden by filter</h3>
        <p>{order.id} is still the selected order, but it no longer appears in the filtered master list.</p>
        <button type="button" className="demo-button small" onClick={onBack}>Back to list</button>
      </section>
    );
  }

  return (
    <section className="master-detail-pane" aria-labelledby={titleId}>
      <div className="master-detail-pane-header">
        <button type="button" className="demo-button small master-detail-back" onClick={onBack}>Back to list</button>
        <div>
          <h3 id={titleId}>{`${order.id} ${order.customer}`}</h3>
          <p>{order.detail}</p>
        </div>
        <span>{order.status}</span>
      </div>
      <div className="master-detail-fields">
        <span><strong>Total</strong>{order.total}</span>
        <span><strong>Status</strong>{order.status}</span>
        <span><strong>Draft</strong>{draft ? "Shipping note changed" : "No local changes"}</span>
        <span><strong>Source</strong>Selected from order list</span>
      </div>
      <div className="master-detail-actions">
        <button type="button" className="demo-button small primary" onClick={onEdit}>{draft ? "Review draft" : "Edit note"}</button>
        <button type="button" className="demo-button small">Open full order</button>
      </div>
    </section>
  );
}

function MasterDetailGoodUi() {
  const order = masterDetailOrders[0];
  return (
    <div className="quality-example master-detail-demo">
      <div className="master-detail-shell" aria-label="Order master-detail layout">
        <MasterDetailList selectedId={order.id} />
        <MasterDetailPane order={order} titleId="master-detail-ui-title" />
      </div>
      <p className="demo-status">The master list, selected row, detail heading, detail fields, Back to list control, and full-order action identify the same order.</p>
    </div>
  );
}

function MasterDetailBadUi() {
  return (
    <div className="bad-ui-sample master-detail-bad-demo is-randomDefault">
      <div className="master-detail-broken" aria-label="Broken master-detail layout">
        <div>
          <button type="button">ORD-1842 Maya</button>
          <button type="button" className="is-selected">ORD-1843 Noah</button>
          <button type="button">ORD-1844 Priya</button>
        </div>
        <section>
          <strong>Details</strong>
          <p>Showing ORD-1001 from yesterday. No selected-item name, no empty state, and no mobile return path.</p>
        </section>
      </div>
      <p className="demo-status">The broken layout highlights one order while showing unrelated detail, so the master and detail ownership model is unclear.</p>
    </div>
  );
}

function MasterDetailGoodUx() {
  type Mode = "wide" | "stackedList" | "stackedDetail";
  const [selectedId, setSelectedId] = useState("ORD-1842");
  const [mode, setMode] = useState<Mode>("wide");
  const [hiddenSelected, setHiddenSelected] = useState(false);
  const [draft, setDraft] = useState(false);
  const [message, setMessage] = useState("Wide mode shows the order list and selected order detail together.");
  const selectedOrder = masterDetailOrders.find((order) => order.id === selectedId) ?? masterDetailOrders[0];
  const showList = mode !== "stackedDetail";
  const showDetail = mode !== "stackedList";

  const selectOrder = (id: string) => {
    if (draft && id !== selectedId) {
      setMessage(`Draft review required before replacing ${selectedId} with ${id}.`);
      return;
    }
    setSelectedId(id);
    setHiddenSelected(false);
    if (mode === "stackedList") setMode("stackedDetail");
    setMessage(`${id} selected. The detail heading and actions now target the same order.`);
  };

  const openDetail = () => {
    setMode("stackedDetail");
    setMessage(`${selectedId} opened as the stacked detail destination with Back to list available.`);
  };

  const backToList = () => {
    setMode("stackedList");
    setMessage(`Returned to the order list with ${selectedId} still selected and list position preserved.`);
  };

  return (
    <div className={`quality-example master-detail-demo is-${mode}`}>
      <div className="master-detail-toolbar" id="master-detail-ux-label">
        <strong>Order workspace</strong>
        <span>{mode === "wide" ? "Side-by-side" : mode === "stackedList" ? "Stacked list" : "Stacked detail"}</span>
        <span>{selectedId} selected</span>
        <span>{draft ? "Draft protected" : "No draft"}</span>
        {hiddenSelected ? <span>Selected hidden by filter</span> : null}
      </div>
      <div className="master-detail-shell" aria-labelledby="master-detail-ux-label">
        {showList ? <MasterDetailList selectedId={selectedId} hiddenSelected={hiddenSelected} onSelect={selectOrder} /> : null}
        {showDetail ? <MasterDetailPane order={selectedOrder} hiddenSelected={hiddenSelected} draft={draft} titleId="master-detail-ux-title" onBack={backToList} onEdit={() => {
          setDraft((value) => !value);
          setMessage(!draft ? `${selectedId} draft note changed; changing selection now asks for review.` : `${selectedId} draft review cleared.`);
        }} /> : null}
      </div>
      <div className="demo-row master-detail-controls" aria-label="Master-detail exercise controls">
        <button type="button" className="demo-button small" onClick={() => selectOrder("ORD-1842")}>Select ORD-1842</button>
        <button type="button" className="demo-button small" onClick={() => selectOrder("ORD-1843")}>Select ORD-1843</button>
        <button type="button" className={mode === "wide" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMode("wide");
          setMessage(`Wide mode restored. ${selectedId} appears beside its detail pane.`);
        }}>Wide mode</button>
        <button type="button" className={mode === "stackedList" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMode("stackedList");
          setMessage(`Stacked list mode shows the master list first with ${selectedId} still selected.`);
        }}>Stacked list</button>
        <button type="button" className={mode === "stackedDetail" ? "demo-button small primary" : "demo-button small"} onClick={openDetail}>Open detail</button>
        <button type="button" className="demo-button small" onClick={backToList}>Back to list</button>
        <button type="button" className={draft ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setDraft((value) => !value);
          setMessage(!draft ? `${selectedId} draft note changed; selection changes are now protected.` : `${selectedId} draft note cleared.`);
        }}>Edit draft</button>
        <button type="button" className={hiddenSelected ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setHiddenSelected(true);
          setMessage(`${selectedId} is filtered out. The detail explains the hidden selected state instead of showing stale content.`);
        }}>Filter selected away</button>
        <button type="button" className="demo-button small" onClick={() => {
          setHiddenSelected(false);
          setMessage(`${selectedId} restored to the master list and still owns the detail.`);
        }}>Restore selection</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function MasterDetailBadUx() {
  type Mode = "staleDetail" | "noBack" | "lostState" | "randomDefault" | "indexKeyed" | "inspectorMisuse";
  const [mode, setMode] = useState<Mode>("staleDetail");
  const copy: Record<Mode, string> = {
    staleDetail: "The master row says ORD-1843, but the detail pane still shows ORD-1842.",
    noBack: "Compact detail replaces the list with no Back to list path or browser-history state.",
    lostState: "Rotating from detail to side-by-side resets selection, list scroll, and a shipping-note draft.",
    randomDefault: "Wide mode starts with a random old order instead of a no-selection prompt or intentional default.",
    indexKeyed: "Selection is keyed by visible index, so filtering moves the selected marker to a different order.",
    inspectorMisuse: "A tiny metadata inspector is called master-detail even though it cannot work as a detail destination."
  };

  return (
    <div className={`quality-example master-detail-bad-demo is-${mode}`}>
      <div className="master-detail-broken" aria-label="Broken master-detail">
        <div>
          <button type="button" className={mode === "indexKeyed" ? "" : "is-selected"}>{mode === "staleDetail" ? "ORD-1843 Noah" : "ORD-1842 Maya"}</button>
          <button type="button" className={mode === "indexKeyed" ? "is-selected" : ""}>{mode === "indexKeyed" ? "ORD-1844 Priya" : "ORD-1843 Noah"}</button>
          {mode !== "noBack" ? <button type="button">ORD-1844 Priya</button> : null}
        </div>
        <section>
          <strong>{mode === "randomDefault" ? "ORD-1001 Old detail" : mode === "inspectorMisuse" ? "Inspector" : "ORD-1842 Maya"}</strong>
          <p>{copy[mode]}</p>
          {mode === "noBack" ? <span>No return control</span> : null}
          {mode === "lostState" ? <span>Draft discarded</span> : null}
        </section>
      </div>
      <div className="demo-row master-detail-controls">
        <button type="button" className={mode === "staleDetail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleDetail")}>Stale detail</button>
        <button type="button" className={mode === "noBack" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noBack")}>No back</button>
        <button type="button" className={mode === "lostState" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostState")}>Lost state</button>
        <button type="button" className={mode === "randomDefault" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("randomDefault")}>Random default</button>
        <button type="button" className={mode === "indexKeyed" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("indexKeyed")}>Index keyed</button>
        <button type="button" className={mode === "inspectorMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("inspectorMisuse")}>Inspector misuse</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MasterDetailGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MasterDetailBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MasterDetailGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <MasterDetailBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
