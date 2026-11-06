import { useState, type CSSProperties } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type DrillNodeKey = "root" | "apac" | "emea" | "americas" | "india" | "japan" | "australia" | "bengaluru" | "mumbai" | "delhi";

type DrillNode = {
  key: DrillNodeKey;
  label: string;
  level: "Global" | "Region" | "Country" | "Store";
  value: number;
  parent?: DrillNodeKey;
  children: DrillNodeKey[];
};

const drillNodes: Record<DrillNodeKey, DrillNode> = {
  root: { key: "root", label: "Global revenue", level: "Global", value: 520, children: ["apac", "emea", "americas"] },
  apac: { key: "apac", label: "APAC", level: "Region", value: 192, parent: "root", children: ["india", "japan", "australia"] },
  emea: { key: "emea", label: "EMEA", level: "Region", value: 151, parent: "root", children: [] },
  americas: { key: "americas", label: "Americas", level: "Region", value: 177, parent: "root", children: [] },
  india: { key: "india", label: "India", level: "Country", value: 86, parent: "apac", children: ["bengaluru", "mumbai", "delhi"] },
  japan: { key: "japan", label: "Japan", level: "Country", value: 61, parent: "apac", children: [] },
  australia: { key: "australia", label: "Australia", level: "Country", value: 45, parent: "apac", children: [] },
  bengaluru: { key: "bengaluru", label: "Bengaluru", level: "Store", value: 34, parent: "india", children: [] },
  mumbai: { key: "mumbai", label: "Mumbai", level: "Store", value: 29, parent: "india", children: [] },
  delhi: { key: "delhi", label: "Delhi", level: "Store", value: 23, parent: "india", children: [] }
};

function drillPath(parentKey: DrillNodeKey) {
  const path: DrillNode[] = [];
  let current: DrillNode | undefined = drillNodes[parentKey];
  while (current) {
    path.unshift(current);
    current = current.parent ? drillNodes[current.parent] : undefined;
  }
  return path;
}

function ChartDrilldownChart({
  parentKey,
  selectedKey,
  showTable,
  stale,
  onDrill,
  onBreadcrumb
}: {
  parentKey: DrillNodeKey;
  selectedKey: DrillNodeKey;
  showTable: boolean;
  stale?: boolean;
  onDrill: (node: DrillNode) => void;
  onBreadcrumb: (node: DrillNode) => void;
}) {
  const parent = drillNodes[parentKey];
  const children = parent.children.map((key) => drillNodes[key]);
  const max = Math.max(...children.map((node) => node.value), 1);
  const childLevel = children[0]?.level ?? "Store";
  const path = drillPath(parentKey);

  return (
    <div className={`drill-shell is-${parentKey}${stale ? " is-stale" : ""}`}>
      <div className="drill-context">
        <nav aria-label="Chart drill path" className="drill-breadcrumbs">
          {path.map((node, index) => (
            <button
              type="button"
              className={index === path.length - 1 ? "is-current" : ""}
              onClick={() => onBreadcrumb(node)}
              key={node.key}
            >
              {node.key === "root" ? "Global" : node.label}
            </button>
          ))}
        </nav>
        <span>{parent.key === "root" ? "Viewing all regions" : `Parent: ${parent.label}`}</span>
        <span>{stale ? "Child data updated yesterday" : "Updated 09:00"}</span>
      </div>
      <div className="drill-chart" aria-label={`${childLevel} level chart for ${parent.label}, USD thousands`}>
        <div className="drill-y-axis">
          <span>$200k</span>
          <span>$100k</span>
          <span>0</span>
        </div>
        <div className="drill-bars" role="list" aria-label={`${childLevel} child marks`}>
          {children.map((node, index) => {
            const hasChildren = node.children.length > 0;
            const selected = node.key === selectedKey;
            return (
              <button
                type="button"
                className={`drill-bar${selected ? " is-selected" : ""}${hasChildren ? " is-drillable" : " is-leaf"}`}
                style={{ "--drill-height": `${Math.max(14, (node.value / max) * 100)}%`, "--drill-index": index } as CSSProperties}
                onClick={() => onDrill(node)}
                aria-label={`${node.label}, $${node.value}k, ${hasChildren ? `drill to ${drillNodes[node.children[0]].level} level` : "terminal leaf"}`}
                key={node.key}
              >
                <span className="drill-bar-mark" />
                <span className="drill-bar-label">{node.label}</span>
                <span className="drill-bar-value">${node.value}k</span>
              </button>
            );
          })}
        </div>
        <div className="drill-tooltip" aria-label="Selected drill context">
          <strong>{drillNodes[selectedKey]?.label ?? parent.label}</strong>
          <span>{drillNodes[selectedKey]?.children.length ? "Has child series" : "Terminal level"}</span>
          <span>Path: {path.map((node) => node.key === "root" ? "Global" : node.label).join(" / ")}</span>
        </div>
      </div>
      {showTable ? (
        <table className="drill-data-table">
          <caption>{childLevel} values under {parent.key === "root" ? "Global" : parent.label}</caption>
          <thead>
            <tr>
              <th>Child</th>
              <th>Revenue</th>
              <th>Next level</th>
            </tr>
          </thead>
          <tbody>
            {children.map((node) => (
              <tr className={node.key === selectedKey ? "is-selected" : ""} key={node.key}>
                <th scope="row">{node.label}</th>
                <td>${node.value}k</td>
                <td>{node.children.length ? drillNodes[node.children[0]].level : "Leaf"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

function ChartDrilldownGoodUi() {
  return (
    <div className="quality-example drill-demo">
      <div className="drill-toolbar">
        <strong>Revenue hierarchy</strong>
        <span>Country level</span>
        <span>USD thousands</span>
        <span>Filter: FY 2026</span>
      </div>
      <ChartDrilldownChart
        parentKey="apac"
        selectedKey="india"
        showTable={false}
        onDrill={() => undefined}
        onBreadcrumb={() => undefined}
      />
      <p className="demo-status">The chart names the level, selected parent, metric, units, inherited filter, breadcrumb path, selected child, and terminal leaf affordance.</p>
    </div>
  );
}

function ChartDrilldownBadUi() {
  return (
    <div className="bad-ui-sample drill-bad-demo is-noBreadcrumb">
      <div className="drill-broken" aria-label="Broken drilldown chart">
        <span style={{ height: "74%" }} />
        <span style={{ height: "48%" }} />
        <span style={{ height: "36%" }} />
      </div>
      <p className="demo-status">The chart changes to smaller bars without a parent label, breadcrumb, level name, unit continuity, selected mark, or way back.</p>
    </div>
  );
}

function ChartDrilldownGoodUx() {
  const [parentKey, setParentKey] = useState<DrillNodeKey>("root");
  const [selectedKey, setSelectedKey] = useState<DrillNodeKey>("apac");
  const [showTable, setShowTable] = useState(false);
  const [stale, setStale] = useState(false);
  const [message, setMessage] = useState("Region level is visible. APAC is drillable because it has country children.");

  function moveToParent(nextParent: DrillNodeKey) {
    const parent = drillNodes[nextParent];
    setParentKey(nextParent);
    setSelectedKey(parent.children[0] ?? nextParent);
  }

  function drillNode(node: DrillNode) {
    setSelectedKey(node.key);
    if (node.children.length) {
      setParentKey(node.key);
      setSelectedKey(node.children[0]);
      setMessage(`Drilled into ${node.label}. Breadcrumb, child bars, tooltip, and table now use ${drillNodes[node.children[0]].level} level.`);
      return;
    }
    setMessage(`${node.label} is a terminal leaf. The chart explains there is no deeper child series instead of acting broken.`);
  }

  function drillUp() {
    const parent = drillNodes[parentKey];
    if (!parent.parent) {
      setMessage("Already at the root level; reset remains available but does not change the chart.");
      return;
    }
    const previousParent = drillNodes[parent.parent];
    setParentKey(previousParent.key);
    setSelectedKey(parent.key);
    setMessage(`Drilled up to ${previousParent.key === "root" ? "Global" : previousParent.label}; ${parent.label} remains selected as the return point.`);
  }

  function reset() {
    setParentKey("root");
    setSelectedKey("apac");
    setMessage("Reset to Global region level with APAC selected and FY 2026 filter preserved.");
  }

  return (
    <div className="quality-example drill-demo">
      <div className="drill-toolbar">
        <strong>Revenue hierarchy</strong>
        <span>{drillNodes[parentKey].children[0] ? `${drillNodes[drillNodes[parentKey].children[0]].level} level` : "Terminal level"}</span>
        <span>{stale ? "Stale child disclosure" : "Fresh child data"}</span>
        <span>{showTable ? "Child table visible" : "Chart view"}</span>
      </div>
      <ChartDrilldownChart
        parentKey={parentKey}
        selectedKey={selectedKey}
        showTable={showTable}
        stale={stale}
        onDrill={drillNode}
        onBreadcrumb={(node) => {
          moveToParent(node.key);
          setMessage(`Breadcrumb moved to ${node.key === "root" ? "Global" : node.label} without losing the FY 2026 filter.`);
        }}
      />
      <div className="demo-row drill-controls" aria-label="Chart drilldown exercise controls">
        <button type="button" className="demo-button small" onClick={() => drillNode(drillNodes.apac)}>Drill APAC</button>
        <button type="button" className="demo-button small" onClick={() => {
          moveToParent("apac");
          setMessage("Moved directly to APAC so India can be drilled as the selected country aggregate.");
        }}>Select APAC</button>
        <button type="button" className="demo-button small" onClick={() => drillNode(drillNodes.india)}>Drill India</button>
        <button type="button" className="demo-button small" onClick={() => {
          moveToParent("india");
          drillNode(drillNodes.bengaluru);
        }}>Terminal leaf</button>
        <button type="button" className="demo-button small" onClick={drillUp}>Drill up</button>
        <button type="button" className="demo-button small" onClick={reset}>Reset</button>
        <button type="button" className={showTable ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setShowTable((value) => !value);
          setMessage(!showTable ? "Child table shown with the same selected path and values as the chart." : "Child table hidden; selected child context remains visible.");
        }}>Child table</button>
        <button type="button" className={stale ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStale((value) => !value);
          setMessage(!stale ? "Stale child data disclosure is visible before users compare child marks." : "Fresh child data restored with current timestamp.");
        }}>Stale child</button>
        <button type="button" className="demo-button small" onClick={() => {
          setMessage(`Export includes path ${drillPath(parentKey).map((node) => node.key === "root" ? "Global" : node.label).join(" / ")}, metric, unit, FY 2026 filter, selected child, and timestamp.`);
        }}>Export path</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ChartDrilldownBadUx() {
  type Mode = "noBreadcrumb" | "metricChange" | "fakeChild" | "hoverOnly" | "noAnnouncement" | "deepTrap" | "brokenLeaf";
  const [mode, setMode] = useState<Mode>("noBreadcrumb");
  const copy: Record<Mode, string> = {
    noBreadcrumb: "The aggregate disappears into child bars with no parent, level, breadcrumb, or drill-up path.",
    metricChange: "The drill level silently changes from revenue to margin, so parent and child values cannot be compared.",
    fakeChild: "The child bars are not a real breakdown of APAC, turning drilldown into misleading navigation.",
    hoverOnly: "Users can discover drillability only by pointer hover, leaving keyboard and touch users without the path.",
    noAnnouncement: "The data changes after activation but no text announces the new level or selected parent.",
    deepTrap: "The chart keeps drilling into sparse levels without reset, peer totals, or orientation.",
    brokenLeaf: "Terminal marks still look drillable and behave like broken buttons when no child series exists."
  };

  return (
    <div className={`quality-example drill-bad-demo is-${mode}`}>
      <div className="drill-broken" aria-label="Broken chart drilldown behavior">
        <strong>{mode === "metricChange" ? "Margin?" : mode === "fakeChild" ? "Random detail" : mode === "deepTrap" ? "Level 5" : "Click bars"}</strong>
        <span style={{ height: mode === "deepTrap" ? "18%" : "74%" }} />
        <span style={{ height: mode === "metricChange" ? "88%" : "48%" }} />
        <span style={{ height: mode === "brokenLeaf" ? "12%" : "36%" }} />
      </div>
      <div className="demo-row drill-controls">
        <button type="button" className={mode === "noBreadcrumb" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noBreadcrumb")}>No breadcrumb</button>
        <button type="button" className={mode === "metricChange" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("metricChange")}>Metric change</button>
        <button type="button" className={mode === "fakeChild" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fakeChild")}>Fake child</button>
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "noAnnouncement" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noAnnouncement")}>No announce</button>
        <button type="button" className={mode === "deepTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("deepTrap")}>Deep trap</button>
        <button type="button" className={mode === "brokenLeaf" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("brokenLeaf")}>Broken leaf</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChartDrilldownGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChartDrilldownBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChartDrilldownGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChartDrilldownBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
