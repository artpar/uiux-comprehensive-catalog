import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type DashboardTile = {
  id: string;
  title: string;
  value: string;
  detail: string;
  status: "good" | "warn" | "bad";
  freshness: string;
  affected: boolean;
};

const dashboardTiles: DashboardTile[] = [
  {
    id: "sla",
    title: "SLA risk",
    value: "18",
    detail: "tickets breach in 2h",
    status: "bad",
    freshness: "Updated 09:42",
    affected: true
  },
  {
    id: "backlog",
    title: "Open backlog",
    value: "642",
    detail: "64 in West region",
    status: "warn",
    freshness: "Updated 09:40",
    affected: true
  },
  {
    id: "firstReply",
    title: "First reply",
    value: "42m",
    detail: "target under 1h",
    status: "good",
    freshness: "Updated 09:39",
    affected: true
  },
  {
    id: "csat",
    title: "CSAT",
    value: "91%",
    detail: "survey data delayed",
    status: "warn",
    freshness: "Stale: 2h old",
    affected: false
  }
];

function DashboardLayoutCanvas({
  region = "All regions",
  collapsed = false,
  partial = false,
  permission = false,
  drilled = false
}: {
  region?: string;
  collapsed?: boolean;
  partial?: boolean;
  permission?: boolean;
  drilled?: boolean;
}) {
  return (
    <div className="dashboard-layout-canvas">
      <div className="dashboard-layout-header">
        <div>
          <strong>Support operations</strong>
          <span>{region} · Last dashboard refresh 09:42 · 4 of 5 widgets current</span>
        </div>
        <div className="dashboard-layout-filter" aria-label="Dashboard scope">
          <span>Date: Last 7 days</span>
          <span>Region: {region}</span>
          <span>{drilled ? "Drill: SLA risk" : "No drill active"}</span>
        </div>
      </div>
      <section className="dashboard-layout-section is-priority" aria-label="Priority indicators">
        <h4>Priority indicators</h4>
        <div className="dashboard-layout-kpis">
          {dashboardTiles.map((tile) => (
            <article key={tile.id} className={`dashboard-layout-tile is-${tile.status} ${!tile.affected ? "is-unaffected" : ""}`}>
              <span>{tile.title}</span>
              <strong>{tile.value}</strong>
              <small>{tile.detail}</small>
              <em>{tile.affected ? `${region} filter applies` : "Unaffected by region filter"}</em>
              <small>{partial && tile.id === "csat" ? "Refresh failed at 09:42" : tile.freshness}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="dashboard-layout-section" aria-label="Exceptions and trends">
        <h4>{collapsed ? "Exceptions collapsed" : "Exceptions and trends"}</h4>
        {collapsed ? (
          <button type="button" className="demo-button small">Expand exceptions</button>
        ) : (
          <div className="dashboard-layout-detail">
            <article>
              <strong>SLA breach queue</strong>
              <span>18 urgent tickets · opens saved support view</span>
              <button type="button" className="demo-button small">Open detail</button>
            </article>
            <article>
              <strong>Backlog trend</strong>
              <span>Up 12% since Monday · chart uses same date filter</span>
              <div className="dashboard-layout-bars" aria-label="Backlog trend bars">
                <span style={{ height: "38%" }} />
                <span style={{ height: "52%" }} />
                <span style={{ height: "66%" }} />
                <span style={{ height: "74%" }} />
              </div>
            </article>
            {permission ? (
              <article className="is-limited">
                <strong>Revenue impact hidden</strong>
                <span>Ask Finance analytics for access. Layout position is preserved.</span>
              </article>
            ) : (
              <article>
                <strong>Revenue impact</strong>
                <span>$84k at risk · source CRM snapshot 09:30</span>
              </article>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function DashboardLayoutGoodUi() {
  return (
    <div className="quality-example dashboard-layout-demo">
      <DashboardLayoutCanvas />
      <p className="demo-status">The dashboard makes purpose, filter scope, freshness, KPI priority, unaffected tiles, exceptions, and drill destinations visible before users act.</p>
    </div>
  );
}

function DashboardLayoutBadUi() {
  return (
    <div className="bad-ui-sample dashboard-layout-bad-demo is-equalWeight">
      <div className="dashboard-layout-noise-grid">
        {["Performance", "Overview", "Chart", "Stats", "Summary", "More"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken dashboard gives every tile equal weight, hides filters and freshness, and uses vague titles that do not explain metric, unit, source, or action.</p>
    </div>
  );
}

function DashboardLayoutGoodUx() {
  const [region, setRegion] = useState("All regions");
  const [collapsed, setCollapsed] = useState(false);
  const [partial, setPartial] = useState(false);
  const [permission, setPermission] = useState(false);
  const [drilled, setDrilled] = useState(false);
  const [message, setMessage] = useState("Dashboard shows all regions, current priority KPIs, exception section, and shared refresh status.");

  return (
    <div className="quality-example dashboard-layout-demo">
      <DashboardLayoutCanvas region={region} collapsed={collapsed} partial={partial} permission={permission} drilled={drilled} />
      <div className="demo-row dashboard-layout-controls" aria-label="Dashboard layout exercise controls">
        <button type="button" className={region === "West" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRegion("West");
          setMessage("Region filter set to West; affected KPI tiles and exception summaries label the shared scope.");
        }}>Filter West</button>
        <button type="button" className={drilled ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setDrilled((current) => !current);
          setMessage(drilled ? "SLA drill cleared; dashboard returns to the global overview." : "SLA risk drill is active with a visible reset path and detail destination.");
        }}>Toggle drill</button>
        <button type="button" className={collapsed ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setCollapsed((current) => !current);
          setMessage(collapsed ? "Exceptions expanded below the KPI tier without losing dashboard context." : "Exceptions collapsed while their section heading and restore action remain visible.");
        }}>Collapse section</button>
        <button type="button" className={partial ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPartial((current) => !current);
          setMessage(partial ? "Partial refresh warning cleared after the widget refresh recovered." : "Partial refresh shown: CSAT failed while other widgets remain current.");
        }}>Partial refresh</button>
        <button type="button" className={permission ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPermission((current) => !current);
          setMessage(permission ? "Revenue impact widget restored for this role." : "Permission-limited widget keeps its layout slot and explains the missing metric without leaking values.");
        }}>Permission gap</button>
        <button type="button" className="demo-button small" onClick={() => {
          setRegion("All regions");
          setCollapsed(false);
          setPartial(false);
          setPermission(false);
          setDrilled(false);
          setMessage("Dashboard reset to all regions with current widgets, visible exceptions, and no drill state.");
        }}>Reset dashboard</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DashboardLayoutBadUx() {
  type Mode = "equalWeight" | "hiddenFilter" | "staleTile" | "snapshotLive" | "crossFilter" | "permissionGap" | "mobileBury";
  const [mode, setMode] = useState<Mode>("equalWeight");
  const copy: Record<Mode, string> = {
    equalWeight: "Every widget has the same visual priority, so the urgent SLA risk competes with decorative charts.",
    hiddenFilter: "A region filter applies to half the dashboard but the affected widgets are not labelled.",
    staleTile: "A two-hour-old CSAT tile sits beside live metrics with no stale-data warning.",
    snapshotLive: "Pinned snapshot tiles look like live operational data.",
    crossFilter: "Clicking a chart silently narrows the whole page with no reset state.",
    permissionGap: "A restricted revenue widget disappears and shifts the layout without explanation.",
    mobileBury: "Mobile reflow puts filters and exceptions below low-value charts."
  };

  return (
    <div className={`quality-example dashboard-layout-bad-demo is-${mode}`}>
      <div className="dashboard-layout-noise-grid">
        {["Revenue", "Pulse", "Decor", "SLA", "CSAT", "Map"].map((label) => (
          <span key={label}>{mode === "mobileBury" && label === "SLA" ? "SLA below fold" : label}</span>
        ))}
      </div>
      <strong>{mode === "hiddenFilter" ? "West only?" : mode === "staleTile" ? "Updated sometime" : "Overview"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row dashboard-layout-controls">
        <button type="button" className={mode === "equalWeight" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("equalWeight")}>Equal weight</button>
        <button type="button" className={mode === "hiddenFilter" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenFilter")}>Hidden filter</button>
        <button type="button" className={mode === "staleTile" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleTile")}>Stale tile</button>
        <button type="button" className={mode === "snapshotLive" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("snapshotLive")}>Snapshot live</button>
        <button type="button" className={mode === "crossFilter" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("crossFilter")}>Cross-filter</button>
        <button type="button" className={mode === "permissionGap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("permissionGap")}>Permission gap</button>
        <button type="button" className={mode === "mobileBury" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileBury")}>Mobile bury</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DashboardLayoutGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DashboardLayoutBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DashboardLayoutGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DashboardLayoutBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
