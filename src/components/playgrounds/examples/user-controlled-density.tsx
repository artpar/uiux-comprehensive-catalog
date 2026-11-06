import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type DensityMode = "comfortable" | "standard" | "compact" | "spacious" | "managed" | "unsafe";

type DensityRow = {
  id: string;
  title: string;
  status: string;
  owner: string;
  updated: string;
  detail: string;
};

const densityRows: DensityRow[] = [
  { id: "case-2048", title: "Payment exception", status: "SLA risk", owner: "Mira", updated: "8 min ago", detail: "Needs finance review before reply." },
  { id: "case-1982", title: "Address mismatch", status: "Waiting", owner: "Jon", updated: "24 min ago", detail: "Customer uploaded proof of address." },
  { id: "case-1775", title: "Renewal discount", status: "Review", owner: "Asha", updated: "1 h ago", detail: "Offer amount changed after approval." }
];

function DensityQueue({
  density,
  selectedId = "case-2048",
  edited = false,
  expanded = true
}: {
  density: DensityMode;
  selectedId?: string;
  edited?: boolean;
  expanded?: boolean;
}) {
  const stateCopy: Record<DensityMode, string> = {
    comfortable: "Comfortable",
    standard: "Standard",
    compact: "Compact",
    spacious: "Spacious",
    managed: "Workspace managed",
    unsafe: "Compact unavailable"
  };

  return (
    <section className={`user-density-queue is-${density}`} aria-label="Case queue density preview">
      <div className="user-density-header">
        <div>
          <strong>Case queue</strong>
          <span>{stateCopy[density]} density · selected row and filters preserved</span>
        </div>
        <span className="user-density-scope">{density === "managed" ? "Workspace policy" : "This table only"}</span>
      </div>
      <div className="user-density-table" role="table" aria-label="Density preview rows">
        <div className="user-density-row is-head" role="row">
          <span role="columnheader">Case</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Owner</span>
          <span role="columnheader">Updated</span>
          <span role="columnheader">Action</span>
        </div>
        {densityRows.map((row) => (
          <div key={row.id} className={`user-density-row ${selectedId === row.id ? "is-selected" : ""} ${edited && row.id === selectedId ? "is-edited" : ""}`} role="row">
            <span role="cell"><strong>{row.title}</strong>{expanded || density !== "compact" ? <small>{row.detail}</small> : null}</span>
            <span role="cell">{row.status}</span>
            <span role="cell">{row.owner}</span>
            <span role="cell">{row.updated}</span>
            <span role="cell"><button type="button" className="demo-button small">{edited && row.id === selectedId ? "Save draft" : "Open"}</button></span>
          </div>
        ))}
      </div>
    </section>
  );
}

function UserControlledDensityGoodUi() {
  return (
    <div className="quality-example user-density-demo">
      <div className="user-density-toolbar" aria-label="Density selector preview">
        <button type="button" className="demo-button small">Comfortable</button>
        <button type="button" className="demo-button small primary">Standard</button>
        <button type="button" className="demo-button small">Compact</button>
        <button type="button" className="demo-button small">Reset</button>
      </div>
      <DensityQueue density="standard" />
      <p className="demo-status">The density selector names each spacing option, shows scope, keeps selected rows and filters stable, and changes row height without removing status, owner, detail, or actions.</p>
    </div>
  );
}

function UserControlledDensityBadUi() {
  return (
    <div className="bad-ui-sample user-density-bad-demo is-target-shrink">
      <div className="user-density-broken-grid">
        {["Tiny row", "No labels", "Lost selection", "Shared?"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken UI treats density as a way to hide labels and shrink targets instead of preserving the same task with different spacing.</p>
    </div>
  );
}

function UserControlledDensityGoodUx() {
  const [density, setDensity] = useState<DensityMode>("standard");
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(false);
  const [message, setMessage] = useState("Density changes spacing only; filters, selected row, and queue content stay intact.");

  const choose = (next: DensityMode, note: string) => {
    setDensity(next);
    setMessage(note);
  };

  return (
    <div className="quality-example user-density-demo">
      <div className="user-density-toolbar" aria-label="User density controls">
        <button type="button" className={density === "comfortable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("comfortable", "Comfortable density gives each row more reading space while keeping the same queue order.")}>Comfortable</button>
        <button type="button" className={density === "standard" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("standard", "Standard density restored; selected row, filter, scroll anchor, and open action remain stable.")}>Standard</button>
        <button type="button" className={density === "compact" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("compact", "Compact density reduces row padding for scanning but keeps labels, status, and actions visible.")}>Compact</button>
        <button type="button" className={density === "spacious" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("spacious", "Spacious density increases touch comfort without changing the dataset.")}>Spacious</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(false);
          choose("compact", "Previewing compact for this table only; saving personal scope is a separate action.");
        }}>Preview compact</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(true);
          setMessage("Density saved for this user account only; team saved views and filters were not changed.");
        }}>Save personal</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSaved(false);
          setEdited(false);
          choose("standard", "Reset restored only display density to the system default.");
        }}>Reset density</button>
        <button type="button" className="demo-button small" onClick={() => choose("managed", "Workspace-managed density explains the owner and disables personal save.")}>Managed</button>
        <button type="button" className="demo-button small" onClick={() => choose("unsafe", "Compact density is unavailable because touch mode and long labels would make row actions unsafe.")}>Unsafe compact</button>
        <button type="button" className="demo-button small" onClick={() => {
          setEdited(true);
          setMessage("Unsaved row draft and selected case remain visible after density changes.");
        }}>Preserve draft</button>
      </div>
      <DensityQueue density={density} edited={edited} expanded={density !== "compact"} />
      <p className="demo-status" aria-live="polite">{saved ? "Saved personal density. " : ""}{message}</p>
    </div>
  );
}

function UserControlledDensityBadUx() {
  type Mode = "hidden-labels" | "state-loss" | "shared-overwrite" | "saved-view-mix" | "target-shrink" | "mobile-scroll" | "no-reset";
  const [mode, setMode] = useState<Mode>("hidden-labels");
  const copy: Record<Mode, string> = {
    "hidden-labels": "Compact mode removes helper text and status labels, so rows no longer carry the same meaning.",
    "state-loss": "Changing density clears filters, selected rows, expanded detail, and unsaved edits.",
    "shared-overwrite": "A personal compact choice becomes the team's shared default without scope warning.",
    "saved-view-mix": "The product stores density inside a saved view, so spacing changes also change columns and filters.",
    "target-shrink": "Row actions, checkboxes, and menus shrink until touch and keyboard focus are unreliable.",
    "mobile-scroll": "Desktop compact density is copied to mobile and creates horizontal scrolling.",
    "no-reset": "Users can switch density but cannot return to system default or see which scope changed."
  };
  const labels: Record<Mode, string[]> = {
    "hidden-labels": ["Case", "?", "No status", "No detail"],
    "state-loss": ["Filter gone", "Row lost", "Draft gone", "Top"],
    "shared-overwrite": ["My compact", "Team changed", "No owner", "No undo"],
    "saved-view-mix": ["Compact view", "Columns gone", "Filter changed", "Sort reset"],
    "target-shrink": ["12px", "Tiny menu", "Miss click", "No focus"],
    "mobile-scroll": ["Wide table", "Swipe", "Hidden action", "Cut off"],
    "no-reset": ["Compact", "Standard?", "Default?", "No reset"]
  };

  return (
    <div className={`quality-example user-density-bad-demo is-${mode}`}>
      <div className="user-density-broken-grid">
        {labels[mode].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <strong>{mode === "shared-overwrite" ? "Shared scope changed" : mode === "saved-view-mix" ? "View and density mixed" : "Density failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row user-density-controls">
        <button type="button" className={mode === "hidden-labels" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-labels")}>Hidden labels</button>
        <button type="button" className={mode === "state-loss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("state-loss")}>State loss</button>
        <button type="button" className={mode === "shared-overwrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("shared-overwrite")}>Shared overwrite</button>
        <button type="button" className={mode === "saved-view-mix" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("saved-view-mix")}>Saved view mix</button>
        <button type="button" className={mode === "target-shrink" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("target-shrink")}>Target shrink</button>
        <button type="button" className={mode === "mobile-scroll" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobile-scroll")}>Mobile scroll</button>
        <button type="button" className={mode === "no-reset" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-reset")}>No reset</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledDensityGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledDensityBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledDensityGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <UserControlledDensityBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
