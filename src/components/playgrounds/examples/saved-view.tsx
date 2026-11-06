import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SavedViewId = "myUrgent" | "teamBacklog" | "sprintBoard";

type SavedViewColumn = "Ticket" | "Priority" | "Owner" | "SLA" | "Risk";

type SavedViewConfig = {
  id: SavedViewId;
  name: string;
  owner: string;
  visibility: "Private" | "Team" | "Everyone";
  layout: "Table" | "Board";
  groupBy: "Status" | "Owner" | "None";
  sort: string;
  filters: string[];
  columns: SavedViewColumn[];
  count: number;
  isDefault?: boolean;
  invalidField?: string;
};

const savedViewConfigs: Record<SavedViewId, SavedViewConfig> = {
  myUrgent: {
    id: "myUrgent",
    name: "My urgent tickets",
    owner: "You",
    visibility: "Private",
    layout: "Table",
    groupBy: "None",
    sort: "SLA ascending",
    filters: ["Owner is me", "Priority is high", "Status not closed"],
    columns: ["Ticket", "Priority", "Owner", "SLA"],
    count: 18,
    isDefault: true
  },
  teamBacklog: {
    id: "teamBacklog",
    name: "Team backlog",
    owner: "Support ops",
    visibility: "Team",
    layout: "Table",
    groupBy: "Owner",
    sort: "Updated newest",
    filters: ["Team is support", "Status is open"],
    columns: ["Ticket", "Priority", "Owner", "SLA", "Risk"],
    count: 64
  },
  sprintBoard: {
    id: "sprintBoard",
    name: "Sprint board",
    owner: "Support ops",
    visibility: "Team",
    layout: "Board",
    groupBy: "Status",
    sort: "Priority high first",
    filters: ["Milestone is current sprint", "Type is defect"],
    columns: ["Ticket", "Priority", "Risk"],
    count: 27,
    invalidField: "Severity score"
  }
};

const savedViewRows = [
  { id: "TCK-812", title: "Checkout timeout on mobile", priority: "High", owner: "Mina", sla: "48m", risk: "Revenue", status: "Investigating" },
  { id: "TCK-804", title: "Account lockout after SSO", priority: "High", owner: "Jon", sla: "1h 15m", risk: "Security", status: "Waiting" },
  { id: "TCK-799", title: "Refund email delayed", priority: "Medium", owner: "Leah", sla: "4h", risk: "Trust", status: "Ready" }
];

function SavedViewPreview({
  view,
  columns,
  layout,
  modified,
  invalidField
}: {
  view: SavedViewConfig;
  columns?: SavedViewColumn[];
  layout?: SavedViewConfig["layout"];
  modified?: boolean;
  invalidField?: string | null;
}) {
  const activeColumns = columns ?? view.columns;
  const activeLayout = layout ?? view.layout;

  return (
    <div className={`saved-view-preview is-${activeLayout.toLowerCase()}`}>
      <div className="saved-view-summary">
        <strong>{view.name}</strong>
        <span>{view.visibility}</span>
        <span>{view.owner}</span>
        <span>{activeLayout}</span>
        <span>{view.groupBy === "None" ? "No grouping" : `Grouped by ${view.groupBy}`}</span>
        <span>{view.sort}</span>
        <span>{view.count} current records</span>
        {view.isDefault ? <span>Default</span> : null}
        {modified ? <em>Unsaved changes</em> : null}
      </div>
      <div className="saved-view-criteria" aria-label="Saved view definition">
        <span>Columns: {activeColumns.join(", ")}</span>
        <span>Filters: {view.filters.join("; ")}</span>
        {invalidField ? <strong>Needs repair: {invalidField} was removed</strong> : null}
      </div>
      {activeLayout === "Board" ? (
        <div className="saved-view-board" aria-label={`${view.name} board layout`}>
          {["Investigating", "Waiting", "Ready"].map((status) => (
            <section key={status}>
              <h4>{status}</h4>
              {savedViewRows.filter((row) => row.status === status).map((row) => (
                <article key={row.id}>
                  <strong>{row.id}</strong>
                  <span>{row.title}</span>
                  <small>{row.priority} / {row.risk}</small>
                </article>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <div className="saved-view-table" role="table" aria-label={`${view.name} table layout`}>
          <div role="row" className="saved-view-header">
            {activeColumns.map((column) => <span role="columnheader" key={column}>{column}</span>)}
          </div>
          {savedViewRows.map((row) => (
            <div role="row" key={row.id}>
              {activeColumns.map((column) => {
                const value: Record<SavedViewColumn, string> = {
                  Ticket: `${row.id} ${row.title}`,
                  Priority: row.priority,
                  Owner: row.owner,
                  SLA: row.sla,
                  Risk: row.risk
                };
                return <span role="cell" key={column}>{value[column]}</span>;
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SavedViewTabs({
  active,
  onSelect
}: {
  active: SavedViewId;
  onSelect?: (id: SavedViewId) => void;
}) {
  return (
    <div className="saved-view-tabs" role="tablist" aria-label="Saved support views">
      {(Object.keys(savedViewConfigs) as SavedViewId[]).map((id) => {
        const view = savedViewConfigs[id];
        return (
          <button
            type="button"
            role="tab"
            aria-selected={active === id}
            className={active === id ? "is-active" : ""}
            onClick={() => onSelect?.(id)}
            key={id}
          >
            <strong>{view.name}</strong>
            <span>{view.visibility} / {view.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function SavedViewGoodUi() {
  const view = savedViewConfigs.myUrgent;
  return (
    <div className="quality-example saved-view-demo">
      <SavedViewTabs active="myUrgent" />
      <SavedViewPreview view={view} />
      <p className="demo-status">The active view names owner, visibility, default state, layout, columns, filters, sort, grouping, and current record count before users update or copy it.</p>
    </div>
  );
}

function SavedViewBadUi() {
  return (
    <div className="bad-ui-sample saved-view-bad-demo is-hiddenSettings">
      <div className="saved-view-broken-tabs">
        <span>Saved</span>
        <span>Mine</span>
        <span>Team</span>
        <span>Recent</span>
      </div>
      <div className="saved-view-broken-surface">
        <strong>Queue</strong>
        <span>Rows changed. Columns changed. Layout changed.</span>
      </div>
      <p className="demo-status">The broken version hides which filters, columns, layout, grouping, and permissions were saved, then mixes views with recents and bookmarks.</p>
    </div>
  );
}

function SavedViewGoodUx() {
  const [active, setActive] = useState<SavedViewId>("myUrgent");
  const [layout, setLayout] = useState<SavedViewConfig["layout"]>(savedViewConfigs.myUrgent.layout);
  const [columns, setColumns] = useState<SavedViewColumn[]>(savedViewConfigs.myUrgent.columns);
  const [modified, setModified] = useState(false);
  const [invalidField, setInvalidField] = useState<string | null>(null);
  const [message, setMessage] = useState("My urgent tickets is active as a private default view.");
  const view = savedViewConfigs[active];

  function applyView(id: SavedViewId) {
    const next = savedViewConfigs[id];
    setActive(id);
    setLayout(next.layout);
    setColumns(next.columns);
    setModified(false);
    setInvalidField(next.invalidField ?? null);
    setMessage(`${next.name} applied with ${next.layout.toLowerCase()} layout, ${next.columns.length} columns, ${next.filters.length} filters, and ${next.visibility.toLowerCase()} visibility.`);
  }

  function toggleLayout() {
    const next = layout === "Table" ? "Board" : "Table";
    setLayout(next);
    setModified(true);
    setMessage(`${next} layout is a temporary change until the view is updated or saved as new.`);
  }

  function toggleOwnerColumn() {
    setColumns((current) => {
      const next: SavedViewColumn[] = current.includes("Owner") ? current.filter((column) => column !== "Owner") : [...current, "Owner"];
      setMessage(`${next.includes("Owner") ? "Owner column added" : "Owner column hidden"}; the active view is now modified.`);
      return next;
    });
    setModified(true);
  }

  function addRiskColumn() {
    setColumns((current) => current.includes("Risk") ? current : [...current, "Risk"]);
    setModified(true);
    setMessage("Risk column added to the current view without updating the saved definition yet.");
  }

  return (
    <div className="quality-example saved-view-demo">
      <SavedViewTabs active={active} onSelect={applyView} />
      <SavedViewPreview view={view} columns={columns} layout={layout} modified={modified} invalidField={invalidField} />
      <div className="demo-row saved-view-controls" aria-label="Saved view exercise controls">
        <button type="button" className="demo-button small" onClick={() => applyView("teamBacklog")}>Apply team backlog</button>
        <button type="button" className="demo-button small" onClick={() => applyView("sprintBoard")}>Apply sprint board</button>
        <button type="button" className={layout === "Board" ? "demo-button small primary" : "demo-button small"} onClick={toggleLayout}>Switch layout</button>
        <button type="button" className="demo-button small" onClick={toggleOwnerColumn}>Toggle owner column</button>
        <button type="button" className={columns.includes("Risk") ? "demo-button small primary" : "demo-button small"} onClick={addRiskColumn}>Add risk column</button>
        <button type="button" className="demo-button small" onClick={() => {
          setModified(false);
          setMessage(`${view.name} saved as a private copy. The shared original remains unchanged.`);
        }}>Save as new</button>
        <button type="button" className="demo-button small" onClick={() => {
          setModified(false);
          setMessage(`${view.name} updated after confirming ${view.visibility.toLowerCase()} visibility and saved columns.`);
        }}>Update view</button>
        <button type="button" className="demo-button small" onClick={() => {
          setLayout(view.layout);
          setColumns(view.columns);
          setModified(false);
          setMessage(`Temporary changes discarded; ${view.name} restored from the saved definition.`);
        }}>Discard changes</button>
        <button type="button" className="demo-button small" onClick={() => {
          setInvalidField(null);
          setModified(true);
          setMessage("Removed field repaired; the view remains modified until saved or copied.");
        }}>Repair field</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SavedViewBadUx() {
  type Mode = "snapshot" | "hiddenSettings" | "overwrite" | "mixedSaved" | "silentInvalid" | "privateLeak" | "mobileHidden";
  const [mode, setMode] = useState<Mode>("snapshot");
  const copy: Record<Mode, string> = {
    snapshot: "The saved view freezes today's rows, so new matching tickets never appear.",
    hiddenSettings: "Applying the view changes columns, layout, filters, and grouping without preview.",
    overwrite: "A temporary column tweak overwrites the team default for everyone.",
    mixedSaved: "Saved filters, saved searches, exports, bookmarks, and recents are all mixed in one menu.",
    silentInvalid: "A removed field is dropped silently, changing counts and visible columns.",
    privateLeak: "Private view names and counts appear in a shared sidebar.",
    mobileHidden: "The mobile tab strip hides modified state and view actions."
  };

  return (
    <div className={`quality-example saved-view-bad-demo is-${mode}`}>
      <div className="saved-view-broken-tabs">
        <span>{mode === "mixedSaved" ? "Search" : "Saved"}</span>
        <span>{mode === "privateLeak" ? "CEO escalations 9" : "Mine"}</span>
        <span>{mode === "overwrite" ? "Team default" : "Team"}</span>
        <span>{mode === "mobileHidden" ? "..." : "Recent"}</span>
      </div>
      <div className="saved-view-broken-surface">
        <strong>{mode === "snapshot" ? "14 static rows" : mode === "silentInvalid" ? "Missing field removed" : "Queue changed"}</strong>
        <span>{copy[mode]}</span>
      </div>
      <div className="demo-row saved-view-controls">
        <button type="button" className={mode === "snapshot" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("snapshot")}>Snapshot rows</button>
        <button type="button" className={mode === "hiddenSettings" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenSettings")}>Hidden settings</button>
        <button type="button" className={mode === "overwrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overwrite")}>Overwrite shared</button>
        <button type="button" className={mode === "mixedSaved" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedSaved")}>Mixed saved</button>
        <button type="button" className={mode === "silentInvalid" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silentInvalid")}>Silent invalid</button>
        <button type="button" className={mode === "privateLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("privateLeak")}>Private leak</button>
        <button type="button" className={mode === "mobileHidden" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileHidden")}>Mobile hidden</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SavedViewGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SavedViewBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SavedViewGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SavedViewBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
