import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AdaptiveDefaultState = "ready" | "edited" | "remembered" | "reset" | "stale" | "lowConfidence" | "policy" | "review";

type AdaptiveDefaultValue = {
  id: string;
  label: string;
  value: string;
  neutral: string;
  source: string;
  scope: string;
  reason: string;
  consequence: string;
  state: AdaptiveDefaultState;
};

const adaptiveDefaultPool: AdaptiveDefaultValue[] = [
  {
    id: "export-scope",
    label: "Export scope",
    value: "Current queue",
    neutral: "Choose scope",
    source: "Last used yesterday",
    scope: "This export only",
    reason: "You exported Current queue as CSV from this workspace yesterday.",
    consequence: "Export includes 42 visible cases; account settings stay unchanged.",
    state: "ready"
  },
  {
    id: "meeting-time-zone",
    label: "Meeting time zone",
    value: "Asia/Kolkata",
    neutral: "Detect at submit",
    source: "Device time zone",
    scope: "This booking",
    reason: "The device and calendar are both using Asia/Kolkata.",
    consequence: "Invite times are shown locally; guests can still choose their zone.",
    state: "ready"
  },
  {
    id: "retention-period",
    label: "Data retention",
    value: "90 days",
    neutral: "Workspace default",
    source: "Workspace policy",
    scope: "Inherited by project",
    reason: "Finance workspace policy sets exports to 90-day retention.",
    consequence: "The field is inherited; request an exception before changing it.",
    state: "policy"
  }
];

function AdaptiveDefaultCard({ item }: { item: AdaptiveDefaultValue }) {
  const stateCopy: Record<AdaptiveDefaultState, string> = {
    ready: "Adapted",
    edited: "Changed once",
    remembered: "Remembered",
    reset: "Neutral",
    stale: "Refresh source",
    lowConfidence: "Low confidence",
    policy: "Inherited",
    review: "Review required"
  };

  return (
    <section className={`adaptive-defaults-card is-${item.state}`} aria-label="Adaptive default field">
      <div className="adaptive-defaults-header">
        <div>
          <strong>{item.label}</strong>
          <span>{stateCopy[item.state]} · {item.scope}</span>
        </div>
        <span className="adaptive-defaults-source">{item.source}</span>
      </div>
      <label className="adaptive-defaults-field">
        <span>Starting value</span>
        <input value={item.state === "reset" ? item.neutral : item.value} readOnly />
      </label>
      <div className="adaptive-defaults-reason">
        <p><strong>Why this value:</strong> {item.reason}</p>
        <p><strong>Effect:</strong> {item.consequence}</p>
      </div>
      <div className="adaptive-defaults-controls" aria-label={`${item.label} default controls`}>
        <button type="button" className="demo-button small primary" disabled={item.state === "policy"}>{item.state === "review" ? "Review before apply" : "Change"}</button>
        <button type="button" className="demo-button small" disabled={item.state === "policy"}>Remember</button>
        <button type="button" className="demo-button small">Reset</button>
        <button type="button" className="demo-button small">Stop adapting</button>
      </div>
    </section>
  );
}

function AdaptiveDefaultsGoodUi() {
  return (
    <div className="quality-example adaptive-defaults-demo">
      <AdaptiveDefaultCard item={adaptiveDefaultPool[0]} />
      <p className="demo-status">The adapted field shows the proposed value, source, scope, reason, consequence, and controls to change, remember, reset, or stop adapting before export.</p>
    </div>
  );
}

function AdaptiveDefaultsBadUi() {
  return (
    <div className="bad-ui-sample adaptive-defaults-bad-demo is-hidden-source">
      <div className="adaptive-defaults-broken-grid">
        {["Auto", "$500", "Team", "Submit"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken UI preselects values without source, scope, reset, or review, so users cannot tell which choices were adapted.</p>
    </div>
  );
}

function AdaptiveDefaultsGoodUx() {
  const [item, setItem] = useState<AdaptiveDefaultValue>(adaptiveDefaultPool[0]);
  const [message, setMessage] = useState("Adaptive defaults reduce setup but remain visible, scoped, and reversible.");

  const choose = (next: AdaptiveDefaultValue, note: string) => {
    setItem(next);
    setMessage(note);
  };

  const mutate = (state: AdaptiveDefaultState, note: string, value?: string) => {
    setItem((current) => ({ ...current, state, value: value ?? current.value }));
    setMessage(note);
  };

  return (
    <div className="quality-example adaptive-defaults-demo">
      <div className="adaptive-defaults-toolbar" aria-label="Adaptive defaults controls">
        <button type="button" className="demo-button small primary" onClick={() => choose(adaptiveDefaultPool[0], "Export scope restored from recent use; the setting remains this export only.")}>Export scope</button>
        <button type="button" className="demo-button small" onClick={() => choose(adaptiveDefaultPool[1], "Time zone default comes from device and calendar context, not an account-wide change.")}>Local schedule</button>
        <button type="button" className="demo-button small" onClick={() => choose(adaptiveDefaultPool[2], "Policy default is inherited and blocks direct editing until an exception is requested.")}>Policy default</button>
        <button type="button" className="demo-button small" onClick={() => mutate("edited", "Changed once for this task; future defaults are unchanged unless the user remembers it.", "All open cases")}>Change once</button>
        <button type="button" className="demo-button small" onClick={() => mutate("remembered", "Correction remembered for this export field only, with other settings and saved filters unchanged.", "All open cases")}>Remember correction</button>
        <button type="button" className="demo-button small" onClick={() => mutate("reset", "Reset returned this field to its neutral system value without clearing history or settings.")}>Reset neutral</button>
        <button type="button" className="demo-button small" onClick={() => mutate("stale", "The recent-use signal is stale after the queue changed; refresh before applying.")}>Stale signal</button>
        <button type="button" className="demo-button small" onClick={() => mutate("lowConfidence", "Low-confidence source falls back to reviewable text and keeps the neutral value reachable.")}>Low confidence</button>
        <button type="button" className="demo-button small" onClick={() => mutate("review", "External recipient and retention changes require review before apply.")}>Review required</button>
        <button type="button" className="demo-button small" onClick={() => mutate("reset", "Adaptation stopped for this field; the product shows the neutral starting value next time.")}>Stop adapting</button>
      </div>
      <AdaptiveDefaultCard item={item} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AdaptiveDefaultsBadUx() {
  type Mode = "hidden-source" | "saved-accident" | "sensitive-history" | "stale-context" | "conversion-push" | "no-reset" | "correction-ignored";
  const [mode, setMode] = useState<Mode>("hidden-source");
  const copy: Record<Mode, string> = {
    "hidden-source": "The form shows adapted values but hides which signal filled them.",
    "saved-accident": "A one-time changed value becomes the account default with no scope warning.",
    "sensitive-history": "Private activity from a shared device appears as a visible field default.",
    "stale-context": "Yesterday's project, currency, and recipient remain selected after the workspace changed.",
    "conversion-push": "The highest-priced option is preselected because it benefits the business, not the user.",
    "no-reset": "Users can edit the value but cannot return to the neutral system default or stop adaptation.",
    "correction-ignored": "The user corrects the same field repeatedly, but the wrong value returns every time."
  };
  const labels: Record<Mode, string[]> = {
    "hidden-source": ["Auto", "Filled", "Why?", "Unknown"],
    "saved-accident": ["This task", "Saved all", "No warning", "Later wrong"],
    "sensitive-history": ["Private query", "Shared screen", "Visible", "No consent"],
    "stale-context": ["Old project", "Old team", "Old currency", "Still active"],
    "conversion-push": ["Premium", "Annual", "Donate max", "Preselected"],
    "no-reset": ["Change", "No reset", "No stop", "Returns"],
    "correction-ignored": ["Wrong office", "Corrected", "Wrong again", "No learning"]
  };

  return (
    <div className={`quality-example adaptive-defaults-bad-demo is-${mode}`}>
      <div className="adaptive-defaults-broken-grid">
        {labels[mode].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <strong>{mode === "conversion-push" ? "Biased default" : mode === "saved-accident" ? "Scope changed" : "Unsafe adaptation"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row adaptive-defaults-controls">
        <button type="button" className={mode === "hidden-source" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-source")}>Hidden source</button>
        <button type="button" className={mode === "saved-accident" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("saved-accident")}>Saved accident</button>
        <button type="button" className={mode === "sensitive-history" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("sensitive-history")}>Sensitive history</button>
        <button type="button" className={mode === "stale-context" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale-context")}>Stale context</button>
        <button type="button" className={mode === "conversion-push" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("conversion-push")}>Conversion push</button>
        <button type="button" className={mode === "no-reset" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-reset")}>No reset</button>
        <button type="button" className={mode === "correction-ignored" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("correction-ignored")}>Correction ignored</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AdaptiveDefaultsGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AdaptiveDefaultsBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AdaptiveDefaultsGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AdaptiveDefaultsBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
