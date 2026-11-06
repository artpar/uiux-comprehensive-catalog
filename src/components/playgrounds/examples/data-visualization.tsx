import { useState, type CSSProperties } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type VizMetric = "revenue" | "conversion";

type VizSeries = "Enterprise" | "Self-serve";

type VizPoint = {
  month: string;
  enterprise: number;
  selfServe: number;
  conversion: number;
  note?: string;
};

const vizPoints: VizPoint[] = [
  { month: "Jan", enterprise: 62, selfServe: 38, conversion: 4.2 },
  { month: "Feb", enterprise: 68, selfServe: 42, conversion: 4.6 },
  { month: "Mar", enterprise: 74, selfServe: 46, conversion: 5.1, note: "Pricing test started" },
  { month: "Apr", enterprise: 82, selfServe: 51, conversion: 5.5 },
  { month: "May", enterprise: 91, selfServe: 57, conversion: 6.2, note: "Partner launch" },
  { month: "Jun", enterprise: 88, selfServe: 63, conversion: 6.0 }
];

function DataVisualizationChart({
  metric,
  selectedMonth,
  highlightedSeries,
  normalized,
  annotation,
  onSelectMonth,
  showTable = false
}: {
  metric: VizMetric;
  selectedMonth: string;
  highlightedSeries: VizSeries | "All";
  normalized: boolean;
  annotation: boolean;
  onSelectMonth: (month: string) => void;
  showTable?: boolean;
}) {
  const maxRevenue = Math.max(...vizPoints.map((point) => point.enterprise + point.selfServe));
  const maxConversion = Math.max(...vizPoints.map((point) => point.conversion));
  const selectedPoint = vizPoints.find((point) => point.month === selectedMonth) ?? vizPoints[0];
  const selectedTotal = selectedPoint.enterprise + selectedPoint.selfServe;
  const unit = metric === "revenue" ? (normalized ? "% of monthly total" : "$k revenue") : "% conversion";

  return (
    <div className={`viz-shell is-${metric}${normalized ? " is-normalized" : ""}`}>
      <div className="viz-chart" aria-label={`Revenue trend chart, ${unit}`}>
        <div className="viz-y-axis">
          <span>{metric === "revenue" ? (normalized ? "100%" : "$160k") : "7%"}</span>
          <span>{metric === "revenue" ? (normalized ? "50%" : "$80k") : "3.5%"}</span>
          <span>0</span>
        </div>
        <div className="viz-plot">
          <div className="viz-target-line"><span>{metric === "revenue" ? "Target $140k" : "Target 6%"}</span></div>
          {annotation ? <div className="viz-annotation">Partner launch changed the May slope</div> : null}
          {vizPoints.map((point, index) => {
            const enterpriseValue = normalized ? (point.enterprise / (point.enterprise + point.selfServe)) * 100 : point.enterprise;
            const selfServeValue = normalized ? (point.selfServe / (point.enterprise + point.selfServe)) * 100 : point.selfServe;
            const conversionHeight = (point.conversion / maxConversion) * 100;
            const enterpriseHeight = metric === "revenue" ? (enterpriseValue / (normalized ? 100 : maxRevenue)) * 100 : conversionHeight;
            const selfServeHeight = metric === "revenue" ? (selfServeValue / (normalized ? 100 : maxRevenue)) * 100 : 0;
            const isSelected = point.month === selectedMonth;
            const isDimmed = highlightedSeries !== "All" && metric === "revenue";
            return (
              <button
                type="button"
                className={`viz-month${isSelected ? " is-selected" : ""}`}
                style={{ "--viz-index": index } as CSSProperties}
                onClick={() => onSelectMonth(point.month)}
                aria-label={`${point.month}, ${metric === "revenue" ? `$${point.enterprise + point.selfServe}k total revenue` : `${point.conversion}% conversion`}`}
                key={point.month}
              >
                <span className="viz-bars">
                  <i
                    className={`viz-bar enterprise${isDimmed && highlightedSeries !== "Enterprise" ? " is-muted" : ""}`}
                    style={{ height: `${enterpriseHeight}%` }}
                  />
                  {metric === "revenue" ? (
                    <i
                      className={`viz-bar selfserve${isDimmed && highlightedSeries !== "Self-serve" ? " is-muted" : ""}`}
                      style={{ height: `${selfServeHeight}%` }}
                    />
                  ) : null}
                </span>
                <span className="viz-x-label">{point.month}</span>
              </button>
            );
          })}
        </div>
        <div className="viz-tooltip" aria-label={`Selected data point ${selectedPoint.month}`}>
          <strong>{selectedPoint.month}</strong>
          <span>{metric === "revenue" ? `$${selectedTotal}k total` : `${selectedPoint.conversion}% conversion`}</span>
          <span>{normalized ? "Normalized to monthly total" : "Baseline starts at 0"}</span>
          {selectedPoint.note ? <span>{selectedPoint.note}</span> : null}
        </div>
      </div>
      <div className="viz-legend" aria-label="Chart legend">
        <span><i className="enterprise" /> Enterprise</span>
        <span><i className="selfserve" /> Self-serve</span>
        <span><i className="target" /> Target</span>
      </div>
      {showTable ? (
        <table className="viz-data-table">
          <caption>Chart data table, January through June</caption>
          <thead>
            <tr>
              <th>Month</th>
              <th>Enterprise</th>
              <th>Self-serve</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            {vizPoints.map((point) => (
              <tr className={point.month === selectedMonth ? "is-selected" : ""} key={point.month}>
                <th scope="row">{point.month}</th>
                <td>${point.enterprise}k</td>
                <td>${point.selfServe}k</td>
                <td>{point.conversion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

function DataVisualizationGoodUi() {
  return (
    <div className="quality-example viz-demo">
      <div className="viz-toolbar">
        <strong>Revenue trend</strong>
        <span>Jan-Jun 2026</span>
        <span>USD thousands</span>
        <span>Zero baseline</span>
        <span>Updated 09:00</span>
      </div>
      <DataVisualizationChart metric="revenue" selectedMonth="May" highlightedSeries="All" normalized={false} annotation onSelectMonth={() => undefined} />
      <p className="demo-status">The chart shows an analytic title, axes, units, legend, target line, selected-point detail, annotation, freshness, and data-source scope.</p>
    </div>
  );
}

function DataVisualizationBadUi() {
  return (
    <div className="bad-ui-sample viz-bad-demo is-decorativeChart">
      <div className="viz-broken" aria-label="Broken decorative chart">
        <span style={{ height: "34%" }} />
        <span style={{ height: "76%" }} />
        <span style={{ height: "52%" }} />
        <span style={{ height: "88%" }} />
        <span style={{ height: "44%" }} />
      </div>
      <p className="demo-status">The broken chart has unlabeled bars, no axis, no unit, no baseline, no scale, no source, no selected value, and no data alternative.</p>
    </div>
  );
}

function DataVisualizationGoodUx() {
  const [metric, setMetric] = useState<VizMetric>("revenue");
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [highlightedSeries, setHighlightedSeries] = useState<VizSeries | "All">("All");
  const [normalized, setNormalized] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [annotation, setAnnotation] = useState(true);
  const [message, setMessage] = useState("Revenue chart uses zero baseline, visible legend, selected May detail, and data freshness context.");

  function selectMonth(month: string) {
    setSelectedMonth(month);
    const point = vizPoints.find((item) => item.month === month);
    if (point) setMessage(`${month} selected. Tooltip and table row expose ${metric === "revenue" ? `$${point.enterprise + point.selfServe}k revenue` : `${point.conversion}% conversion`} from the same data.`);
  }

  return (
    <div className="quality-example viz-demo">
      <div className="viz-toolbar">
        <strong>{metric === "revenue" ? "Revenue trend" : "Conversion trend"}</strong>
        <span>{normalized ? "Normalized view" : "Absolute values"}</span>
        <span>{highlightedSeries === "All" ? "All series" : `${highlightedSeries} highlighted`}</span>
        <span>{showTable ? "Data table visible" : "Chart view"}</span>
      </div>
      <DataVisualizationChart
        metric={metric}
        selectedMonth={selectedMonth}
        highlightedSeries={highlightedSeries}
        normalized={normalized}
        annotation={annotation}
        showTable={showTable}
        onSelectMonth={selectMonth}
      />
      <div className="demo-row viz-controls" aria-label="Data visualization exercise controls">
        <button type="button" className={metric === "conversion" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setMetric((value) => value === "revenue" ? "conversion" : "revenue");
          setMessage(metric === "revenue" ? "Metric switched to conversion; y-axis unit and selected-point detail changed together." : "Metric switched to revenue; bars, units, and target line use revenue scale again.");
        }}>Switch metric</button>
        <button type="button" className="demo-button small" onClick={() => selectMonth(selectedMonth === "May" ? "Mar" : "May")}>Select month</button>
        <button type="button" className={highlightedSeries === "Enterprise" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setHighlightedSeries((value) => value === "Enterprise" ? "All" : "Enterprise");
          setMessage(highlightedSeries === "Enterprise" ? "All series restored with legend and bars visible." : "Enterprise series highlighted while Self-serve remains labeled, not hidden by color alone.");
        }}>Highlight series</button>
        <button type="button" className={normalized ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setNormalized((value) => !value);
          setMessage(!normalized ? "Normalized view enabled; disclosure states values are percent of monthly total." : "Absolute revenue restored with zero baseline disclosure.");
        }}>Normalize</button>
        <button type="button" className={showTable ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setShowTable((value) => !value);
          setMessage(!showTable ? "Data table shown so exact values are available without hover." : "Data table hidden; chart still keeps selected-point detail visible.");
        }}>Data table</button>
        <button type="button" className={annotation ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setAnnotation((value) => !value);
          setMessage(!annotation ? "Annotation restored and tied to May campaign context." : "Annotation hidden while axis, legend, and selected value remain readable.");
        }}>Annotation</button>
        <button type="button" className="demo-button small" onClick={() => {
          setMessage("Export keeps title, date range, filters, units, baseline, source, and selected point metadata.");
        }}>Export context</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function DataVisualizationBadUx() {
  type Mode = "wrongChart" | "missingAxes" | "truncatedScale" | "colorOnly" | "tooltipOnly" | "staleData" | "decorativeChart";
  const [mode, setMode] = useState<Mode>("decorativeChart");
  const copy: Record<Mode, string> = {
    wrongChart: "A pie-style comparison is used for monthly trend, hiding the ordered change over time.",
    missingAxes: "Users cannot tell unit, scale, baseline, or whether the values are revenue or conversion.",
    truncatedScale: "The y-axis starts near the data and exaggerates a small change without disclosure.",
    colorOnly: "Series and threshold meaning depend on color alone with no labels, symbols, or table values.",
    tooltipOnly: "Exact values exist only on pointer hover, so keyboard and screen-reader users lose the data.",
    staleData: "The chart appears current but source freshness and missing June data are hidden.",
    decorativeChart: "The visual is chart-shaped decoration and does not answer an analytic question."
  };

  return (
    <div className={`quality-example viz-bad-demo is-${mode}`}>
      <div className="viz-broken" aria-label="Broken chart behavior">
        <span style={{ height: mode === "truncatedScale" ? "72%" : "34%" }} />
        <span style={{ height: mode === "wrongChart" ? "48%" : "76%" }} />
        <span style={{ height: mode === "staleData" ? "22%" : "52%" }} />
        <span style={{ height: mode === "colorOnly" ? "76%" : "88%" }} />
        <span style={{ height: mode === "tooltipOnly" ? "60%" : "44%" }} />
        <strong>{mode === "missingAxes" ? "Big growth" : mode === "staleData" ? "Current?" : "Looks good"}</strong>
      </div>
      <div className="demo-row viz-controls">
        <button type="button" className={mode === "wrongChart" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongChart")}>Wrong chart</button>
        <button type="button" className={mode === "missingAxes" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("missingAxes")}>Missing axes</button>
        <button type="button" className={mode === "truncatedScale" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("truncatedScale")}>Truncated scale</button>
        <button type="button" className={mode === "colorOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("colorOnly")}>Color only</button>
        <button type="button" className={mode === "tooltipOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tooltipOnly")}>Tooltip only</button>
        <button type="button" className={mode === "staleData" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleData")}>Stale data</button>
        <button type="button" className={mode === "decorativeChart" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("decorativeChart")}>Decorative chart</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataVisualizationGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataVisualizationBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataVisualizationGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <DataVisualizationBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
