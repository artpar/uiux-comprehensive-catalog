import { useState, type CSSProperties } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

function WindowSplitterGoodUi() {
  return (
    <div className="quality-example splitter-static-preview">
      <div className="splitter-workspace" style={{ "--splitter-primary": "42%" } as CSSProperties}>
        <section className="splitter-pane primary" aria-label="Message list pane">
          <strong>Messages</strong>
          <span className="is-selected">INC-2048 Payment issue</span>
          <span>INC-2049 Refund delay</span>
        </section>
        <div
          className="splitter-handle"
          role="separator"
          aria-label="Resize message list and reading pane"
          aria-orientation="vertical"
          aria-valuemin={28}
          aria-valuemax={72}
          aria-valuenow={42}
          tabIndex={0}
        >
          <span />
        </div>
        <section className="splitter-pane secondary" aria-label="Reading pane">
          <strong>INC-2048 Payment issue</strong>
          <span>Reading pane remains visible while the list pane can be widened or narrowed.</span>
        </section>
      </div>
      <p className="demo-status">The separator is focusable, labelled, value-bearing, and sits between two named panes with usable minimum sizes.</p>
    </div>
  );
}

function WindowSplitterBadUi() {
  return (
    <div className="bad-ui-sample splitter-static-preview bad">
      <div className="splitter-bad-workspace">
        <section>
          <strong>Inbox</strong>
          <span>Selected item hidden after resize</span>
        </section>
        <i aria-hidden="true" />
        <section>
          <strong>Details</strong>
          <span>Pointer-only divider has no name, value, keyboard path, or restore affordance.</span>
        </section>
      </div>
      <p className="demo-status">The broken treatment is just a visual line; users cannot tell if it moves, what value it has, or how to restore panes.</p>
    </div>
  );
}

function WindowSplitterGoodUx() {
  const min = 28;
  const max = 72;
  const [size, setSize] = useState(44);
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("INC-2048");
  const [scrollMarker, setScrollMarker] = useState("Activity item 12");
  const [status, setStatus] = useState("Splitter is focused at 44 percent list pane width. Selection and activity scroll state are preserved.");
  const actualSize = collapsed ? min : size;

  const resizeTo = (nextSize: number, reason: string) => {
    const bounded = Math.min(max, Math.max(min, nextSize));
    setCollapsed(false);
    setSize(bounded);
    setStatus(`${bounded}% list pane width. ${reason} Selection ${selected} and ${scrollMarker} remain preserved.`);
  };

  const collapse = () => {
    setCollapsed(true);
    setStatus(`List pane collapsed to its ${min}% minimum with ${selected} still selected and a visible Restore panes control.`);
  };

  const restore = () => {
    setCollapsed(false);
    setSize(44);
    setStatus(`Panes restored to 44%. Selection ${selected} and ${scrollMarker} were not reset.`);
  };

  return (
    <div className="quality-example splitter-demo">
      <div className="splitter-workspace" style={{ "--splitter-primary": `${actualSize}%` } as CSSProperties}>
        <section className="splitter-pane primary" aria-label="Incident list pane">
          <div className="splitter-pane-head">
            <strong>Incidents</strong>
            <span>{actualSize}%</span>
          </div>
          {["INC-2048", "INC-2049", "INC-2050"].map((incident) => (
            <button
              key={incident}
              type="button"
              className={selected === incident ? "is-selected" : ""}
              onClick={() => {
                setSelected(incident);
                setStatus(`${incident} selected; splitter changes will preserve this list selection.`);
              }}
            >
              {incident} {incident === "INC-2048" ? "Payment issue" : incident === "INC-2049" ? "Refund delay" : "Account lock"}
            </button>
          ))}
        </section>
        <div
          className="splitter-handle"
          role="separator"
          aria-label="Resize incident list and detail panes"
          aria-orientation="vertical"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={actualSize}
          tabIndex={0}
        >
          <span />
        </div>
        <section className="splitter-pane secondary" aria-label="Incident detail pane">
          <div className="splitter-pane-head">
            <strong>{selected} detail</strong>
            <span>{scrollMarker}</span>
          </div>
          <p>The detail pane keeps its scroll marker and selected incident while the splitter moves.</p>
          <label>
            Activity scroll marker
            <select
              value={scrollMarker}
              onChange={(event) => {
                setScrollMarker(event.target.value);
                setStatus(`${event.target.value} saved as the detail scroll marker before resizing.`);
              }}
            >
              <option>Activity item 3</option>
              <option>Activity item 12</option>
              <option>Activity item 27</option>
            </select>
          </label>
        </section>
      </div>
      <div className="demo-row splitter-exercise-controls">
        <button type="button" className="demo-button small" onClick={() => resizeTo(size - 5, "Left Arrow narrowed the primary pane within the minimum.")}>Arrow left</button>
        <button type="button" className="demo-button small" onClick={() => resizeTo(size + 5, "Right Arrow widened the primary pane within the maximum.")}>Arrow right</button>
        <button type="button" className="demo-button small" onClick={() => resizeTo(min, "Home moved to the minimum usable list width.")}>Home min</button>
        <button type="button" className="demo-button small" onClick={() => resizeTo(max, "End moved to the maximum usable list width.")}>End max</button>
        <button type="button" className="demo-button small" onClick={collapse}>Collapse pane</button>
        <button type="button" className="demo-button small" onClick={restore}>Restore panes</button>
        <button type="button" className="demo-button small primary" onClick={() => setStatus(`Boundary reached at ${actualSize}%; min ${min}% and max ${max}% remain enforced.`)}>Report value</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function WindowSplitterBadUx() {
  type Mode = "pointerOnly" | "noValue" | "overCollapse" | "stateLoss" | "unlabeled" | "mobileSliver";
  const [mode, setMode] = useState<Mode>("pointerOnly");
  const copy: Record<Mode, string> = {
    pointerOnly: "The divider can only be dragged by pointer, leaving keyboard and assistive-technology users without resize control.",
    noValue: "The separator is focusable but exposes no current value, min, max, or orientation.",
    overCollapse: "Dragging can shrink a pane below usable size and there is no restore affordance.",
    stateLoss: "Every resize resets selected row, form input, preview zoom, and scroll position.",
    unlabeled: "Several splitters share the same generic label, so users cannot tell which panes will resize.",
    mobileSliver: "The narrow-screen layout keeps tiny side-by-side slivers instead of stacking or routing panes."
  };

  return (
    <div className={`quality-example splitter-bad-demo is-${mode}`}>
      <div className="splitter-bad-workspace">
        <section className={mode === "overCollapse" || mode === "mobileSliver" ? "is-sliver" : ""}>
          <strong>{mode === "stateLoss" ? "Selection reset" : "Source pane"}</strong>
          <span>{mode === "stateLoss" ? "No selected row after resize" : "Pane can become unreadable."}</span>
        </section>
        <i aria-hidden="true" />
        <section>
          <strong>{mode === "unlabeled" ? "Another unnamed pane" : "Detail pane"}</strong>
          <span>{copy[mode]}</span>
        </section>
      </div>
      <div className="demo-row splitter-exercise-controls">
        <button type="button" className={mode === "pointerOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("pointerOnly")}>Pointer only</button>
        <button type="button" className={mode === "noValue" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noValue")}>No value</button>
        <button type="button" className={mode === "overCollapse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overCollapse")}>Over collapse</button>
        <button type="button" className={mode === "stateLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stateLoss")}>State loss</button>
        <button type="button" className={mode === "unlabeled" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unlabeled")}>Unlabeled</button>
        <button type="button" className={mode === "mobileSliver" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileSliver")}>Mobile sliver</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WindowSplitterGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WindowSplitterBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WindowSplitterGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <WindowSplitterBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
