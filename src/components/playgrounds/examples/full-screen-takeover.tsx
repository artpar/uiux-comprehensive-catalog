import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

function FullScreenTakeoverGoodUi() {
  return (
    <div className="quality-example takeover-static-preview">
      <div className="takeover-parent-strip" aria-hidden="true">
        <strong>Expense report</strong>
        <span>Selected row EXP-1042 and Travel filter stay behind the temporary mode.</span>
      </div>
      <section
        className="takeover-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="takeover-good-title"
      >
        <header className="takeover-topbar">
          <button type="button" className="demo-button small">Close</button>
          <strong id="takeover-good-title">Attach receipt for EXP-1042</strong>
          <button type="button" className="demo-button small primary">Save scan</button>
        </header>
        <div className="takeover-stage">
          <div className="takeover-camera-frame">
            <span>Receipt edges detected</span>
          </div>
          <aside>
            <strong>Full-screen capture mode</strong>
            <span>Parent controls are inactive, the task has an explicit exit, and the save outcome returns to the expense row.</span>
          </aside>
        </div>
      </section>
      <p className="demo-status">The takeover uses the whole viewport for a focused capture task while naming the temporary mode and keeping exit and save controls visible.</p>
    </div>
  );
}

function FullScreenTakeoverBadUi() {
  return (
    <div className="bad-ui-sample takeover-static-preview bad">
      <div className="takeover-bad-shell">
        <header>
          <button type="button">X</button>
          <strong>Details</strong>
          <button type="button">Back</button>
        </header>
        <div className="takeover-bad-stage">
          <span>Looks like a page, acts like an overlay.</span>
          <button type="button">Open another overlay</button>
        </div>
      </div>
      <p className="demo-status">The broken version hides whether Back, X, browser back, or the nested layer will close one step, the whole mode, or the parent page.</p>
    </div>
  );
}

function FullScreenTakeoverGoodUx() {
  type Phase = "capture" | "review";
  const [open, setOpen] = useState(true);
  const [phase, setPhase] = useState<Phase>("capture");
  const [dirty, setDirty] = useState(false);
  const [exitReview, setExitReview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("Takeover open on Capture. Parent row EXP-1042, Travel filter, and scroll marker are preserved behind the mode.");

  const openTakeover = () => {
    setOpen(true);
    setPhase("capture");
    setDirty(false);
    setExitReview(false);
    setStatus("Takeover opened from EXP-1042. Focus moved to the capture title and parent controls are inactive.");
  };

  const capture = () => {
    setDirty(true);
    setSaved(false);
    setStatus("Receipt captured but not saved. Every exit route now opens the same leave-review state.");
  };

  const review = () => {
    setPhase("review");
    setStatus("Review step shown inside the takeover. Internal Back returns to Capture without leaving the mode.");
  };

  const internalBack = () => {
    if (phase === "review") {
      setPhase("capture");
      setStatus("Internal Back returned to Capture. Close still means leave the full-screen mode.");
      return;
    }
    requestExit("Back at first step");
  };

  const requestExit = (source: string) => {
    if (dirty) {
      setExitReview(true);
      setStatus(`${source} requested exit, but unsaved scan review is shown before leaving.`);
      return;
    }
    setOpen(false);
    setStatus(`${source} closed the takeover and returned focus to EXP-1042 in the filtered expense list.`);
  };

  const keepEditing = () => {
    setExitReview(false);
    setStatus("Exit cancelled. The captured receipt and current takeover step remain available.");
  };

  const discard = () => {
    setDirty(false);
    setExitReview(false);
    setOpen(false);
    setStatus("Unsaved scan discarded. Focus and parent state returned to EXP-1042 with Travel filter intact.");
  };

  const save = () => {
    setDirty(false);
    setSaved(true);
    setExitReview(false);
    setOpen(false);
    setStatus("Scan saved and attached to EXP-1042. Parent row, filter, and scroll marker were restored.");
  };

  return (
    <div className="quality-example takeover-demo">
      <div className="takeover-parent-card">
        <strong>Expense report queue</strong>
        <span>Filter: Travel. Selected: EXP-1042. Scroll marker: row 18.</span>
        <button type="button" className="demo-button small" onClick={openTakeover}>Open takeover</button>
      </div>

      {open ? (
        <section
          className={`takeover-shell is-${phase}${exitReview ? " has-review" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="takeover-ux-title"
        >
          <header className="takeover-topbar">
            <button type="button" className="demo-button small" onClick={() => requestExit("Close")}>Close</button>
            <strong id="takeover-ux-title">{phase === "capture" ? "Attach receipt for EXP-1042" : "Review receipt for EXP-1042"}</strong>
            <button type="button" className="demo-button small primary" onClick={save}>Save scan</button>
          </header>

          <div className="takeover-stage">
            <div className="takeover-camera-frame">
              <span>{phase === "capture" ? (dirty ? "Captured receipt preview" : "Camera ready") : "Review crop and amount"}</span>
            </div>
            <aside>
              <strong>{phase === "capture" ? "Capture step" : "Review step"}</strong>
              <span>{dirty ? "Unsaved scan exists. Close, Escape, and browser back use the same review." : "No unsaved scan yet. Close can return directly."}</span>
              <span>{saved ? "Saved attachment visible on parent row." : "Parent queue remains blocked until the takeover closes."}</span>
            </aside>
          </div>

          {exitReview ? (
            <div className="takeover-exit-review" role="alertdialog" aria-label="Leave receipt capture">
              <strong>Leave without saving scan?</strong>
              <span>The captured receipt has not been attached to EXP-1042.</span>
              <div className="demo-row">
                <button type="button" className="demo-button small" onClick={keepEditing}>Keep editing</button>
                <button type="button" className="demo-button small danger" onClick={discard}>Discard scan</button>
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        <div className="takeover-closed-state">
          <strong>Returned to expense report queue</strong>
          <span>{saved ? "EXP-1042 now has a saved receipt attachment." : "EXP-1042 is still selected with no saved attachment."}</span>
        </div>
      )}

      <div className="demo-row takeover-exercise-controls">
        <button type="button" className="demo-button small" onClick={capture}>Capture receipt</button>
        <button type="button" className="demo-button small" onClick={review}>Review scan</button>
        <button type="button" className="demo-button small" onClick={internalBack}>Internal Back</button>
        <button type="button" className="demo-button small" onClick={() => requestExit("Escape")}>Escape close</button>
        <button type="button" className="demo-button small" onClick={() => requestExit("Browser back")}>Browser back</button>
        <button type="button" className="demo-button small primary" onClick={save}>Save scan</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function FullScreenTakeoverBadUx() {
  type Mode = "noExit" | "ambiguousBack" | "silentDiscard" | "routeTrap" | "focusLeak" | "stacked";
  const [mode, setMode] = useState<Mode>("noExit");
  const copy: Record<Mode, string> = {
    noExit: "The full-screen mode has no labelled close path, so users cannot tell how to return to the invoking context.",
    ambiguousBack: "Back, X, and browser back all close different levels, making users guess which one preserves their place.",
    silentDiscard: "A captured receipt disappears when the user presses Escape or phone back, with no save or discard review.",
    routeTrap: "The overlay pretends to be a page but has no durable URL, saved progress, or refresh recovery.",
    focusLeak: "Keyboard focus can still reach the parent Delete and Navigate controls behind the takeover.",
    stacked: "A second full-screen overlay opens on top, hiding which title and close button own the current task."
  };

  return (
    <div className={`quality-example takeover-bad-demo is-${mode}`}>
      <div className="takeover-bad-shell">
        <header>
          <button type="button">{mode === "noExit" ? "?" : "X"}</button>
          <strong>{mode === "routeTrap" ? "/expense/scan" : "Details"}</strong>
          <button type="button">Back</button>
        </header>
        <div className="takeover-bad-stage">
          <span>{copy[mode]}</span>
          {mode === "stacked" ? (
            <div className="takeover-nested-layer">
              <strong>Nested viewer</strong>
              <button type="button">X</button>
            </div>
          ) : null}
          {mode === "focusLeak" ? <button type="button">Parent Delete still reachable</button> : <button type="button">Continue</button>}
        </div>
      </div>
      <div className="demo-row takeover-exercise-controls">
        <button type="button" className={mode === "noExit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noExit")}>No exit</button>
        <button type="button" className={mode === "ambiguousBack" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("ambiguousBack")}>Ambiguous back</button>
        <button type="button" className={mode === "silentDiscard" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silentDiscard")}>Silent discard</button>
        <button type="button" className={mode === "routeTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("routeTrap")}>Route trap</button>
        <button type="button" className={mode === "focusLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusLeak")}>Focus leak</button>
        <button type="button" className={mode === "stacked" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stacked")}>Stacked overlay</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FullScreenTakeoverGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FullScreenTakeoverBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FullScreenTakeoverGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FullScreenTakeoverBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
