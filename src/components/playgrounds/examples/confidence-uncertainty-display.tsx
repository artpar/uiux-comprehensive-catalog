import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ConfidenceUncertaintyState = "high" | "medium" | "low" | "insufficient" | "conflict" | "outOfDistribution" | "stale" | "uncalibrated" | "threshold" | "review" | "explain" | "gated" | "mobile";

type ConfidenceUncertaintyCopy = {
  title: string;
  label: string;
  tone: "ready" | "working" | "warning" | "danger";
  range: string;
  threshold: string;
  reason: string;
  status: string;
  details: string[];
  actions: string[];
};

const confidenceUncertaintyCopy: Record<ConfidenceUncertaintyState, ConfidenceUncertaintyCopy> = {
  high: {
    title: "High confidence",
    label: "High confidence",
    tone: "ready",
    range: "Calibrated range: 88 to 93 percent",
    threshold: "Review threshold: below 80 percent",
    reason: "Recent policy, matching claim type, and complete account signals agree.",
    status: "Apply allowed, with confidence / uncertainty display retained in the audit note.",
    details: ["Prediction reliability", "Calibrated confidence", "Current model", "Source coverage separate"],
    actions: ["Apply classification", "Explain confidence", "Open grounding"]
  },
  medium: {
    title: "Medium confidence",
    label: "Medium confidence",
    tone: "warning",
    range: "Calibrated range: 71 to 78 percent",
    threshold: "Review threshold: below 80 percent",
    reason: "Two signals agree, but the customer history is incomplete.",
    status: "Review recommended before the claim classification is applied.",
    details: ["Medium confidence", "Near threshold", "Missing account history", "Review recommended"],
    actions: ["Send to review", "Collect more input", "Explain confidence"]
  },
  low: {
    title: "Low confidence",
    label: "Low confidence",
    tone: "danger",
    range: "Calibrated range: 42 to 55 percent",
    threshold: "Review threshold: below 80 percent",
    reason: "Input quality is weak and the policy match is ambiguous.",
    status: "Apply gated until a reviewer verifies the decision.",
    details: ["Low confidence", "Apply gated", "Manual review", "Fallback available"],
    actions: ["Request review", "Verify sources", "Use fallback"]
  },
  insufficient: {
    title: "Insufficient evidence",
    label: "Insufficient evidence",
    tone: "danger",
    range: "No calibrated score",
    threshold: "Minimum evidence threshold not met",
    reason: "The invoice, account age, and policy version needed for the decision are absent.",
    status: "The system cannot estimate reliability until missing inputs are collected.",
    details: ["Insufficient evidence", "Missing invoice", "No model confidence", "Collect input"],
    actions: ["Request invoice", "Open checklist", "Do not apply"]
  },
  conflict: {
    title: "Conflicting signals",
    label: "Conflicting signals",
    tone: "danger",
    range: "Confidence withheld",
    threshold: "Review required when key signals disagree",
    reason: "The scanned form suggests approval, but the account rule suggests denial.",
    status: "Human judgment is required before any automated outcome.",
    details: ["Conflicting signals", "Rule disagreement", "Model disagreement", "Review required"],
    actions: ["Open conflict", "Escalate review", "Hold decision"]
  },
  outOfDistribution: {
    title: "Out-of-distribution input",
    label: "Out-of-distribution",
    tone: "danger",
    range: "Confidence not valid",
    threshold: "Automation disabled outside monitored scope",
    reason: "The claim type and language were not present in the monitored operating range.",
    status: "The display blocks automation because the score is not valid for this input.",
    details: ["Out-of-distribution", "Unfamiliar input", "Automation disabled", "Specialist review"],
    actions: ["Route specialist", "Change workflow", "Explain scope"]
  },
  stale: {
    title: "Stale model",
    label: "Stale model",
    tone: "warning",
    range: "Prior range invalidated",
    threshold: "Confidence expires after model or data changes",
    reason: "The model was updated after this score was produced.",
    status: "The prior confidence display must be recomputed before apply or export.",
    details: ["Stale model", "Stale confidence", "Model version changed", "Recompute needed"],
    actions: ["Recompute confidence", "Request review", "Block apply"]
  },
  uncalibrated: {
    title: "Calibration unavailable",
    label: "Calibration unavailable",
    tone: "warning",
    range: "Uncalibrated score hidden",
    threshold: "No numeric threshold available",
    reason: "This model has not been calibrated for the current claim category.",
    status: "The UI avoids a fake percent and routes users to qualitative review.",
    details: ["Calibration unavailable", "Uncalibrated score", "No fake precision", "Review path"],
    actions: ["Use review label", "Explain caveat", "Do not auto-apply"]
  },
  threshold: {
    title: "Threshold changed",
    label: "Threshold changed",
    tone: "warning",
    range: "Old range: 82 to 86 percent",
    threshold: "New review threshold: below 90 percent",
    reason: "Policy changed for claims that affect customer access.",
    status: "A result that was previously allowed now needs review before apply.",
    details: ["Threshold changed", "Policy version 12", "Review threshold", "Apply blocked"],
    actions: ["Review under new threshold", "Open policy", "Block apply"]
  },
  review: {
    title: "Review required",
    label: "Review required",
    tone: "danger",
    range: "Confidence below action threshold",
    threshold: "Manual review required before account impact",
    reason: "The prediction can affect access, so policy requires a reviewer.",
    status: "The review requirement is visible before the action controls.",
    details: ["Review required", "Account impact", "Reviewer queue", "Override reason"],
    actions: ["Send to review", "Add note", "Cancel apply"]
  },
  explain: {
    title: "Explain confidence",
    label: "Explain confidence",
    tone: "ready",
    range: "Calibrated range: 84 to 89 percent",
    threshold: "Review threshold: below 80 percent",
    reason: "Top drivers: exact policy phrase match, matching claim amount, and recent account verification.",
    status: "The explanation names reliability drivers without treating confidence as source proof.",
    details: ["Explain confidence", "Reason drivers", "Not source proof", "Feedback available"],
    actions: ["Open explanation", "Report wrong confidence", "Open grounding"]
  },
  gated: {
    title: "Apply gated",
    label: "Apply gated",
    tone: "danger",
    range: "Confidence below threshold",
    threshold: "Apply gated below 80 percent",
    reason: "The decision affects billing and the estimate is below the allowed threshold.",
    status: "Apply stays disabled and users get review, verification, and fallback actions.",
    details: ["Apply gated", "Billing impact", "Verify sources", "Fallback route"],
    actions: ["Verify sources", "Request reviewer", "Use fallback"]
  },
  mobile: {
    title: "Mobile compact panel",
    label: "Mobile compact panel",
    tone: "ready",
    range: "Range: 88 to 93 percent",
    threshold: "Threshold: review below 80 percent",
    reason: "Compact summary keeps uncertainty, threshold, and actions visible before commit.",
    status: "The narrow layout preserves the reliability label and safe action controls.",
    details: ["Mobile compact panel", "Confidence visible", "Threshold visible", "Apply context"],
    actions: ["Open sheet", "Explain confidence", "Apply classification"]
  }
};

function ConfidenceUncertaintyPanel({ state }: { state: ConfidenceUncertaintyState }) {
  const copy = confidenceUncertaintyCopy[state];
  const isBlocked = copy.tone === "danger" || state === "threshold" || state === "stale" || state === "uncalibrated";

  return (
    <section className={`confidence-uncertainty-shell is-${copy.tone}`} aria-label="Confidence / uncertainty display">
      <header className="confidence-uncertainty-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="confidence-uncertainty-label">{copy.label}</span>
      </header>
      <div className="confidence-uncertainty-scale" aria-label="Calibrated confidence range and review threshold">
        <div>
          <span>{copy.range}</span>
          <strong>{copy.threshold}</strong>
        </div>
        <div className="confidence-uncertainty-track" aria-hidden="true">
          <span className={`confidence-uncertainty-band is-${copy.tone}`} />
        </div>
      </div>
      <p className="confidence-uncertainty-reason">{copy.reason}</p>
      <div className="confidence-uncertainty-cards">
        {copy.details.map((detail) => <span key={detail}>{detail}</span>)}
      </div>
      <div className="confidence-uncertainty-actions">
        {copy.actions.map((action, index) => (
          <button
            type="button"
            key={action}
            className={index === 0 && !isBlocked ? "demo-button small primary" : "demo-button small"}
            disabled={action === "Apply classification" && isBlocked}
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}

function ConfidenceUncertaintyDisplayGoodUi() {
  return (
    <div className="quality-example confidence-uncertainty-demo">
      <ConfidenceUncertaintyPanel state="medium" />
      <p className="demo-status">The confidence / uncertainty display names prediction reliability, calibrated confidence, review threshold, uncertainty reason, and the safe action before users apply the classification.</p>
    </div>
  );
}

function ConfidenceUncertaintyDisplayBadUi() {
  return (
    <div className="bad-ui-sample confidence-uncertainty-bad-demo is-fake-percent">
      <div className="confidence-uncertainty-fake-score">97% sure</div>
      <div className="confidence-uncertainty-broken-grid" aria-label="Broken confidence display">
        {["Fake percent", "Color-only confidence", "No threshold", "Apply now"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI uses an uncalibrated number as proof, hides the review threshold, and lets users apply the decision without uncertainty context.</p>
    </div>
  );
}

function ConfidenceUncertaintyDisplayGoodUx() {
  const [state, setState] = useState<ConfidenceUncertaintyState>("high");
  const [message, setMessage] = useState("High confidence shows calibrated range, review threshold, reason, and source coverage as a separate concern.");

  const choose = (next: ConfidenceUncertaintyState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example confidence-uncertainty-demo">
      <div className="confidence-uncertainty-controls" aria-label="Confidence uncertainty exercise controls">
        <button type="button" className={state === "high" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("high", "High confidence still names calibration scope, threshold, and separate source coverage.")}>High confidence</button>
        <button type="button" className={state === "medium" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("medium", "Medium confidence sits near the review threshold and recommends review.")}>Medium confidence</button>
        <button type="button" className={state === "low" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("low", "Low confidence gates apply and routes users to review or fallback.")}>Low confidence</button>
        <button type="button" className={state === "insufficient" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("insufficient", "Insufficient evidence avoids a score until missing inputs are collected.")}>Insufficient evidence</button>
        <button type="button" className={state === "conflict" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("conflict", "Conflicting signals withhold confidence and require human judgment.")}>Conflicting signals</button>
        <button type="button" className={state === "outOfDistribution" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("outOfDistribution", "Out-of-distribution input disables automation because confidence is not valid for this case.")}>Out-of-distribution</button>
        <button type="button" className={state === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale model invalidates the old confidence display and requires recomputation.")}>Stale model</button>
        <button type="button" className={state === "uncalibrated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("uncalibrated", "Calibration unavailable hides fake precision and uses a qualitative review label.")}>Calibration unavailable</button>
        <button type="button" className={state === "threshold" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("threshold", "Threshold changed updates the review rule before apply can proceed.")}>Threshold changed</button>
        <button type="button" className={state === "review" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("review", "Review required is visible before account-impacting actions.")}>Review required</button>
        <button type="button" className={state === "explain" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("explain", "Explain confidence names reliability drivers without treating confidence as source proof.")}>Explain confidence</button>
        <button type="button" className={state === "gated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("gated", "Apply gated keeps the risky action disabled and exposes verification and fallback.")}>Apply gated</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile compact panel keeps uncertainty and threshold visible before commit.")}>Mobile compact panel</button>
      </div>
      <ConfidenceUncertaintyPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ConfidenceUncertaintyDisplayBadUx() {
  type Mode = "fake-percent" | "color-only" | "no-threshold" | "hidden-uncertainty" | "confidence-as-proof" | "stale-confidence" | "uncalibrated-score" | "buried-review";
  const [mode, setMode] = useState<Mode>("fake-percent");
  const copy: Record<Mode, string> = {
    "fake-percent": "A fake percent suggests precision even though the model score is not calibrated.",
    "color-only": "Color-only confidence hides the reliability state from users who cannot perceive the color.",
    "no-threshold": "The UI shows a score but no threshold, so users cannot tell when review is required.",
    "hidden-uncertainty": "The primary action appears before low confidence, missing evidence, and conflict details.",
    "confidence-as-proof": "Confidence is treated as source proof even though grounding and citations are separate.",
    "stale-confidence": "Stale confidence remains visible after the model, data, or threshold changes.",
    "uncalibrated-score": "An uncalibrated score is shown as a probability and drives automation.",
    "buried-review": "The review path is hidden below the apply action even when confidence is low."
  };
  const labels: Record<Mode, string[]> = {
    "fake-percent": ["97% sure", "No calibration", "No caveat", "Apply now"],
    "color-only": ["Green dot", "No label", "No text", "No threshold"],
    "no-threshold": ["82%", "No threshold", "No review rule", "Guess action"],
    "hidden-uncertainty": ["Apply", "Details below", "Low confidence", "Conflict hidden"],
    "confidence-as-proof": ["High confidence", "No source proof", "No grounding", "No citations"],
    "stale-confidence": ["Old model", "Stale confidence", "Policy changed", "Still active"],
    "uncalibrated-score": ["0.74", "Looks exact", "No calibration", "Auto apply"],
    "buried-review": ["Apply primary", "Review link", "Below fold", "Risk hidden"]
  };

  return (
    <div className={`quality-example confidence-uncertainty-bad-demo is-${mode}`}>
      <div className="confidence-uncertainty-fake-score">{mode === "color-only" ? "Green dot" : mode === "uncalibrated-score" ? "0.74" : "97% sure"}</div>
      <div className="confidence-uncertainty-broken-grid" aria-label="Broken confidence uncertainty display">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "confidence-as-proof" ? "Confidence as proof" : mode === "stale-confidence" ? "Stale confidence" : "Uncertainty failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row confidence-uncertainty-controls">
        <button type="button" className={mode === "fake-percent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fake-percent")}>Fake percent</button>
        <button type="button" className={mode === "color-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("color-only")}>Color-only confidence</button>
        <button type="button" className={mode === "no-threshold" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-threshold")}>No threshold</button>
        <button type="button" className={mode === "hidden-uncertainty" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-uncertainty")}>Hidden uncertainty</button>
        <button type="button" className={mode === "confidence-as-proof" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confidence-as-proof")}>Confidence as proof</button>
        <button type="button" className={mode === "stale-confidence" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale-confidence")}>Stale confidence</button>
        <button type="button" className={mode === "uncalibrated-score" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("uncalibrated-score")}>Uncalibrated score</button>
        <button type="button" className={mode === "buried-review" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("buried-review")}>Buried review</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfidenceUncertaintyDisplayGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfidenceUncertaintyDisplayBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfidenceUncertaintyDisplayGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ConfidenceUncertaintyDisplayBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
