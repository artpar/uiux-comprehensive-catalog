import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CustomDashboardWidgetId = "sla" | "queue" | "revenue" | "escalations" | "finance";

type CustomDashboardWidget = {
  id: CustomDashboardWidgetId;
  title: string;
  source: string;
  freshness: string;
  size: "small" | "wide";
  required?: boolean;
  restricted?: boolean;
};

const customDashboardWidgetCatalog: Record<CustomDashboardWidgetId, CustomDashboardWidget> = {
  sla: {
    id: "sla",
    title: "SLA risk",
    source: "Support queue",
    freshness: "Live, updated 09:42",
    size: "small",
    required: true
  },
  queue: {
    id: "queue",
    title: "My review queue",
    source: "Saved view",
    freshness: "Current data",
    size: "wide"
  },
  revenue: {
    id: "revenue",
    title: "Revenue impact",
    source: "CRM snapshot",
    freshness: "Pinned 09:30",
    size: "small"
  },
  escalations: {
    id: "escalations",
    title: "Escalations",
    source: "Team alerts",
    freshness: "Updated 09:41",
    size: "small"
  },
  finance: {
    id: "finance",
    title: "Finance margin",
    source: "Restricted report",
    freshness: "Requires access",
    size: "small",
    restricted: true
  }
};

function CustomDashboardCanvas({
  widgetIds,
  editing = false,
  mobilePreview = false,
  includeRestricted = false,
  resizedQueue = false,
  scope = "Personal"
}: {
  widgetIds: CustomDashboardWidgetId[];
  editing?: boolean;
  mobilePreview?: boolean;
  includeRestricted?: boolean;
  resizedQueue?: boolean;
  scope?: "Personal" | "Team";
}) {
  const widgets = widgetIds
    .concat(includeRestricted && !widgetIds.includes("finance") ? ["finance"] : [])
    .map((id) => customDashboardWidgetCatalog[id]);

  return (
    <div className={`custom-dashboard-canvas ${editing ? "is-editing" : ""} ${mobilePreview ? "is-mobile-preview" : ""}`}>
      <div className="custom-dashboard-toolbar">
        <div>
          <strong>My support dashboard</strong>
          <span>{scope} layout · {editing ? "Customizing" : "Read only"} · Last saved 09:20</span>
        </div>
        <div className="custom-dashboard-chips" aria-label="Dashboard layout status">
          <span>{widgets.length} widgets</span>
          <span>{mobilePreview ? "Mobile preview" : "Desktop order"}</span>
          <span>{editing ? "Unsaved changes visible" : "Saved layout"}</span>
        </div>
      </div>
      <div className="custom-dashboard-grid" aria-label="Custom dashboard widgets">
        {widgets.map((widget, index) => {
          const isWide = widget.id === "queue" && resizedQueue ? true : widget.size === "wide";
          return (
            <article key={widget.id} className={`custom-dashboard-widget is-${isWide ? "wide" : "small"} ${widget.required ? "is-required" : ""} ${widget.restricted ? "is-restricted" : ""}`}>
              <div>
                <strong>{widget.title}</strong>
                <span>Position {index + 1} · {widget.source}</span>
              </div>
              <p>{widget.restricted ? "Access needed before this widget can show metrics." : widget.freshness}</p>
              {editing ? (
                <div className="custom-dashboard-actions" aria-label={`${widget.title} layout actions`}>
                  <button type="button" className="demo-button small">Move earlier</button>
                  <button type="button" className="demo-button small">Resize</button>
                  <button type="button" className="demo-button small" disabled={widget.required}>Remove</button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      {editing ? (
        <aside className="custom-dashboard-gallery" aria-label="Available dashboard widgets">
          <strong>Widget gallery</strong>
          <span>Escalations · Team alerts · Add</span>
          <span>Finance margin · Restricted · Request access</span>
          <span>Required SLA risk cannot be removed</span>
        </aside>
      ) : null}
    </div>
  );
}

function CustomDashboardGoodUi() {
  return (
    <div className="quality-example custom-dashboard-demo">
      <CustomDashboardCanvas widgetIds={["queue", "sla", "revenue"]} editing />
      <p className="demo-status">The custom dashboard separates edit mode from reading, labels personal scope, shows widget order, source, freshness, required state, gallery choices, and saveable layout changes.</p>
    </div>
  );
}

function CustomDashboardBadUi() {
  return (
    <div className="bad-ui-sample custom-dashboard-bad-demo is-dragOnly">
      <div className="custom-dashboard-broken-grid">
        {["Chart", "Metric", "Stuff", "More"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken dashboard looks draggable but hides edit mode, widget purpose, source, saved scope, required widgets, and whether the new arrangement persists.</p>
    </div>
  );
}

function CustomDashboardGoodUx() {
  const [widgetIds, setWidgetIds] = useState<CustomDashboardWidgetId[]>(["queue", "sla", "revenue"]);
  const [editing, setEditing] = useState(true);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [resizedQueue, setResizedQueue] = useState(false);
  const [scope, setScope] = useState<"Personal" | "Team">("Personal");
  const [message, setMessage] = useState("Customize mode is active; layout changes are unsaved and scoped to your personal dashboard.");

  const addEscalations = () => {
    setWidgetIds((current) => current.includes("escalations") ? current : ["escalations", ...current]);
    setMessage("Escalations widget added at the top, focus and mobile order move with the new widget.");
  };

  const moveSlaFirst = () => {
    setWidgetIds((current) => ["sla", ...current.filter((id) => id !== "sla")]);
    setMessage("SLA risk moved to position 1; the visible, keyboard, and mobile order now match.");
  };

  return (
    <div className="quality-example custom-dashboard-demo">
      <CustomDashboardCanvas
        widgetIds={widgetIds}
        editing={editing}
        mobilePreview={mobilePreview}
        includeRestricted={restricted}
        resizedQueue={resizedQueue}
        scope={scope}
      />
      <div className="demo-row custom-dashboard-controls" aria-label="Custom dashboard exercise controls">
        <button type="button" className="demo-button small primary" onClick={() => {
          setEditing(true);
          setMessage("Customize mode entered; dashboard reading controls are separated from layout editing controls.");
        }}>Customize</button>
        <button type="button" className={widgetIds.includes("escalations") ? "demo-button small primary" : "demo-button small"} onClick={addEscalations}>Add widget</button>
        <button type="button" className={widgetIds[0] === "sla" ? "demo-button small primary" : "demo-button small"} onClick={moveSlaFirst}>Move SLA first</button>
        <button type="button" className={resizedQueue ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setResizedQueue((current) => !current);
          setMessage(resizedQueue ? "Review queue returned to its saved width." : "Review queue resized wide and remains in the same keyboard order.");
        }}>Resize queue</button>
        <button type="button" className={mobilePreview ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMobilePreview((current) => !current);
          setMessage(mobilePreview ? "Desktop preview restored." : "Mobile preview shows the saved stack before committing the desktop arrangement.");
        }}>Mobile preview</button>
        <button type="button" className={restricted ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRestricted((current) => !current);
          setMessage(restricted ? "Restricted finance widget removed from the draft layout." : "Restricted finance widget added as a request-access card instead of a blank tile.");
        }}>Permission widget</button>
        <button type="button" className={scope === "Personal" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setScope("Personal");
          setEditing(false);
          setMessage("Personal layout saved; team dashboard and embedded saved views were not changed.");
        }}>Save personal</button>
        <button type="button" className={scope === "Team" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setScope("Team");
          setEditing(true);
          setMessage("Team save requires shared-edit permission, audience warning, and review before committing.");
        }}>Save team</button>
        <button type="button" className="demo-button small" onClick={() => {
          setWidgetIds(["queue", "sla", "revenue"]);
          setEditing(true);
          setMobilePreview(false);
          setRestricted(false);
          setResizedQueue(false);
          setScope("Personal");
          setMessage("Dashboard reset to the default personal layout without changing filters or saved views inside widgets.");
        }}>Reset default</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CustomDashboardBadUx() {
  type Mode = "dragOnly" | "sharedOverwrite" | "hiddenRequired" | "mobileOrder" | "blankPermission" | "filterConfusion" | "unsavedLoss";
  const [mode, setMode] = useState<Mode>("dragOnly");
  const copy: Record<Mode, string> = {
    dragOnly: "Widgets move only by pointer drag, leaving keyboard and touch users without a layout path.",
    sharedOverwrite: "A personal rearrangement overwrites the team dashboard with no audience warning or rollback.",
    hiddenRequired: "A required SLA queue can be removed with no policy explanation or restore path.",
    mobileOrder: "Desktop customization saves but mobile order buries the urgent queue below decorative charts.",
    blankPermission: "A restricted finance tile becomes empty space instead of a request-access or remove state.",
    filterConfusion: "Changing a saved view filter inside one widget is mistaken for editing dashboard layout.",
    unsavedLoss: "Users navigate away after arranging widgets because the screen never exposed unsaved layout state."
  };

  return (
    <div className={`quality-example custom-dashboard-bad-demo is-${mode}`}>
      <div className="custom-dashboard-broken-grid">
        {["Drag", "Chart", mode === "blankPermission" ? "" : "Queue", mode === "mobileOrder" ? "Urgent below fold" : "Metric"].map((label, index) => (
          <span key={`${label}-${index}`}>{label || "Blank"}</span>
        ))}
      </div>
      <strong>{mode === "sharedOverwrite" ? "Saved for everyone" : mode === "filterConfusion" ? "View changed" : "Dashboard"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row custom-dashboard-controls">
        <button type="button" className={mode === "dragOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dragOnly")}>Drag only</button>
        <button type="button" className={mode === "sharedOverwrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("sharedOverwrite")}>Shared overwrite</button>
        <button type="button" className={mode === "hiddenRequired" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenRequired")}>Hidden required</button>
        <button type="button" className={mode === "mobileOrder" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileOrder")}>Mobile order</button>
        <button type="button" className={mode === "blankPermission" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blankPermission")}>Blank permission</button>
        <button type="button" className={mode === "filterConfusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("filterConfusion")}>Filter confusion</button>
        <button type="button" className={mode === "unsavedLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unsavedLoss")}>Unsaved loss</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CustomDashboardGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CustomDashboardBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CustomDashboardGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CustomDashboardBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
