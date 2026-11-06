import { useState } from "react";
import { QualityPanel, type PatternMeta } from './shared';

type AiConfidenceFakePrecisionState =
  | "rawHidden"
  | "calibrationUnavailable"
  | "calibratedRange"
  | "insufficientEvidence"
  | "outOfDistribution"
  | "staleScore"
  | "thresholdChanged"
  | "rankingScore"
  | "copyCaveat";

type AiConfidenceFakePrecisionCopy = {
  title: string;
  badge: string;
  tone: "ready" | "working" | "warning" | "danger";
  shown: string;
  raw: string;
  reason: string;
  details: string[];
  actions: string[];
  applyAllowed: boolean;
};

const aiConfidenceFakePrecisionCopy: Record<AiConfidenceFakePrecisionState, AiConfidenceFakePrecisionCopy> = {
  rawHidden: {
    title: "Raw score hidden",
    badge: "Internal only",
    tone: "ready",
    shown: "Review recommended",
    raw: "Internal score 0.873 is not shown as probability of correctness.",
    reason: "The score is useful for ranking review queues, but it is not calibrated for a user-facing decision.",
    details: ["Raw score hidden", "No exact percent", "Queue rank only", "Review route"],
    actions: ["Open review queue", "Explain hidden score", "Apply classification"],
    applyAllowed: false
  },
  calibrationUnavailable: {
    title: "Calibration unavailable",
    badge: "No probability",
    tone: "danger",
    shown: "Calibration unavailable",
    raw: "The model has no monitored calibration for this claim type.",
    reason: "The UI replaces fake precision with a qualitative reliability state and blocks automation.",
    details: ["Calibration unavailable", "Qualitative label", "No exact decimal", "Reviewer needed"],
    actions: ["Send to reviewer", "Collect evidence", "Block apply"],
    applyAllowed: false
  },
  calibratedRange: {
    title: "Calibrated range",
    badge: "Scoped range",
    tone: "ready",
    shown: "Calibrated range: 71 to 78 percent",
    raw: "Single-value precision is replaced by a task-scoped range.",
    reason: "The range names the review threshold and the population where it is meaningful.",
    details: ["Calibrated range", "Task scope: claims", "Review threshold 80", "Fresh today"],
    actions: ["Open calibration", "Send to review", "Apply classification"],
    applyAllowed: false
  },
  insufficientEvidence: {
    title: "Insufficient evidence",
    badge: "No score",
    tone: "danger",
    shown: "Insufficient evidence",
    raw: "No score is displayed because the invoice, policy source, and account age are missing.",
    reason: "Missing inputs make an exact-looking number misleading, so the recovery path collects evidence first.",
    details: ["Insufficient evidence", "Missing invoice", "Missing policy", "No confidence number"],
    actions: ["Request invoice", "Open source task", "Block apply"],
    applyAllowed: false
  },
  outOfDistribution: {
    title: "Out-of-distribution",
    badge: "Invalid scope",
    tone: "danger",
    shown: "Outside monitored scope",
    raw: "Prior confidence cannot be reused for this unfamiliar claim category.",
    reason: "The product stops showing a number when the input leaves the population used for calibration.",
    details: ["Out-of-distribution", "Scope mismatch", "Confidence invalid", "Specialist review"],
    actions: ["Route specialist", "Explain scope", "Block apply"],
    applyAllowed: false
  },
  staleScore: {
    title: "Stale score",
    badge: "Recompute needed",
    tone: "warning",
    shown: "Previous confidence invalidated",
    raw: "The old 92 percent display was removed after prompt, source, or model changes.",
    reason: "A stale score no longer matches the current answer and must be recomputed before action.",
    details: ["Stale score", "Model changed", "Source changed", "Recompute needed"],
    actions: ["Recompute confidence", "Open audit note", "Block apply"],
    applyAllowed: false
  },
  thresholdChanged: {
    title: "Threshold changed",
    badge: "Rule updated",
    tone: "warning",
    shown: "Review threshold now 90 percent",
    raw: "A prior pass state no longer permits automation under the new policy threshold.",
    reason: "The UI shows the changed threshold before allowing the user to continue.",
    details: ["Threshold changed", "Old rule invalid", "New review threshold", "Audit note"],
    actions: ["Review under new rule", "Open policy", "Block apply"],
    applyAllowed: false
  },
  rankingScore: {
    title: "Ranking score not probability",
    badge: "Rank only",
    tone: "warning",
    shown: "Rank score: used for ordering",
    raw: "Similarity score 0.91 is not probability that the answer is correct.",
    reason: "Retrieval rank and recommendation score are labelled as ordering signals, not certainty.",
    details: ["Ranking score not probability", "Similarity only", "Not correctness", "Open sources"],
    actions: ["Open source grounding", "Explain ranking", "Send to review"],
    applyAllowed: false
  },
  copyCaveat: {
    title: "Copy caveat",
    badge: "Caveat retained",
    tone: "ready",
    shown: "Medium confidence with caveat",
    raw: "Copied text includes calibration scope, threshold, and review requirement.",
    reason: "If a confidence number leaves the product surface, the caveat travels with it.",
    details: ["Copy caveat", "Scope retained", "Threshold retained", "Review label retained"],
    actions: ["Copy with caveat", "Open audit note", "Apply classification"],
    applyAllowed: false
  }
};

function AiConfidenceFakePrecisionPanel({ state, subject }: { state: AiConfidenceFakePrecisionState; subject: string }) {
  const copy = aiConfidenceFakePrecisionCopy[state];

  return (
    <section className={`ai-fake-precision-shell is-${copy.tone}`} aria-label="AI confidence precision validity">
      <header className="ai-fake-precision-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{subject}</span>
        </div>
        <span className="ai-fake-precision-badge">{copy.badge}</span>
      </header>
      <div className="ai-fake-precision-score" aria-label="Displayed reliability state">
        <span>Displayed to user</span>
        <strong>{copy.shown}</strong>
      </div>
      <div className="ai-fake-precision-explain" aria-label="Precision caveat">
        <strong>Why exact precision is avoided</strong>
        <p>{copy.raw}</p>
        <p>{copy.reason}</p>
      </div>
      <div className="ai-fake-precision-grid" aria-label="Confidence state details">
        {copy.details.map((detail) => <span key={detail}>{detail}</span>)}
      </div>
      <div className="ai-fake-precision-actions">
        {copy.actions.map((action, index) => (
          <button
            type="button"
            key={action}
            className={index === 0 && copy.applyAllowed ? "demo-button small primary" : "demo-button small"}
            disabled={action === "Apply classification" && !copy.applyAllowed}
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}

function AiConfidenceFakePrecisionGoodUi() {
  return (
    <div className="quality-example ai-fake-precision-demo">
      <AiConfidenceFakePrecisionPanel state="calibrationUnavailable" subject="Claim classification assistant" />
      <p className="demo-status">The corrected UI removes the exact-looking raw score, names calibration unavailable, explains why the number is not a probability, and routes the claim to review before action.</p>
    </div>
  );
}

function AiConfidenceFakePrecisionBadUi() {
  return (
    <div className="bad-ui-sample ai-fake-precision-bad-demo is-exactPercent">
      <div className="ai-fake-precision-big-score">97.42% sure</div>
      <div className="ai-fake-precision-broken-grid" aria-label="Fake precision confidence failures">
        {["Exact percent", "No calibration", "No threshold", "Apply enabled"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI converts an unsupported internal score into a precise probability-looking label and puts the apply action before caveats or review.</p>
    </div>
  );
}

function AiConfidenceFakePrecisionGoodUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState<AiConfidenceFakePrecisionState>("rawHidden");
  const [message, setMessage] = useState("Raw score hidden keeps the internal rank from becoming a false probability in the user-facing decision.");

  const choose = (next: AiConfidenceFakePrecisionState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example ai-fake-precision-demo">
      <div className="ai-fake-precision-controls" aria-label="AI confidence fake precision exercise controls">
        <button type="button" className={state === "rawHidden" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rawHidden", "Raw score hidden avoids turning internal ranking math into user-facing certainty.")}>Raw score hidden</button>
        <button type="button" className={state === "calibrationUnavailable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("calibrationUnavailable", "Calibration unavailable uses a qualitative state and review path instead of a precise probability.")}>Calibration unavailable</button>
        <button type="button" className={state === "calibratedRange" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("calibratedRange", "Calibrated range shows scope, threshold, and freshness without false single-value precision.")}>Calibrated range</button>
        <button type="button" className={state === "insufficientEvidence" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("insufficientEvidence", "Insufficient evidence hides confidence until missing inputs are collected.")}>Insufficient evidence</button>
        <button type="button" className={state === "outOfDistribution" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("outOfDistribution", "Out-of-distribution state invalidates confidence outside monitored scope.")}>Out-of-distribution</button>
        <button type="button" className={state === "staleScore" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("staleScore", "Stale score disappears after model, input, source, or threshold changes.")}>Stale score</button>
        <button type="button" className={state === "thresholdChanged" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("thresholdChanged", "Threshold changed invalidates the prior allow or block decision before action.")}>Threshold changed</button>
        <button type="button" className={state === "rankingScore" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rankingScore", "Ranking score not probability labels retrieval similarity as ordering, not correctness.")}>Ranking score not probability</button>
        <button type="button" className={state === "copyCaveat" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copyCaveat", "Copy caveat keeps calibration scope and review requirement attached to exported text.")}>Copy caveat</button>
      </div>
      <AiConfidenceFakePrecisionPanel state={state} subject={meta.subject} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AiConfidenceFakePrecisionBadUx() {
  type Mode = "exactPercent" | "decimalCertainty" | "colorOnlyPrecision" | "gaugePrecision" | "hiddenCaveat" | "confidenceAsSourceProof" | "stalePrecision" | "copiedScore";
  const [mode, setMode] = useState<Mode>("exactPercent");
  const copy: Record<Mode, string> = {
    exactPercent: "A precise percent implies calibrated probability without showing scope, threshold, or caveat.",
    decimalCertainty: "A raw decimal looks scientific even though users cannot interpret it as correctness.",
    colorOnlyPrecision: "Color and precision are doing all the work, leaving no text for meaning or action.",
    gaugePrecision: "A meter-like gauge makes an AI score look like a bounded scalar measurement.",
    hiddenCaveat: "The caveat sits below the primary action, so users act before seeing calibration limits.",
    confidenceAsSourceProof: "A high confidence number replaces source grounding and citation evidence.",
    stalePrecision: "The old precise score survives after the answer, model, threshold, or source changes.",
    copiedScore: "Copied output keeps the impressive score but drops the calibration caveat."
  };
  const labels: Record<Mode, string[]> = {
    exactPercent: ["Exact percent", "97.42%", "No scope", "Apply enabled"],
    decimalCertainty: ["Decimal certainty", "0.873", "Raw score", "Looks exact"],
    colorOnlyPrecision: ["Color-only precision", "Green", "No label", "No reason"],
    gaugePrecision: ["Gauge precision", "Meter-like", "No range", "False scalar"],
    hiddenCaveat: ["Hidden caveat", "Apply first", "Caveat below", "Review missed"],
    confidenceAsSourceProof: ["Confidence as source proof", "No grounding", "No citations", "Still trusted"],
    stalePrecision: ["Stale precision", "Old model", "Old score", "Still active"],
    copiedScore: ["Copied score", "Score copied", "Caveat stripped", "Audit misleading"]
  };

  return (
    <div className={`quality-example ai-fake-precision-bad-demo is-${mode}`}>
      <div className="ai-fake-precision-big-score" aria-label="Misleading confidence score">
        {mode === "decimalCertainty" ? "0.873" : mode === "colorOnlyPrecision" ? "Green 99" : mode === "gaugePrecision" ? "91 / 100" : "97.42% sure"}
      </div>
      <div className="ai-fake-precision-broken-grid" aria-label="Fake precision failure details">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "confidenceAsSourceProof" ? "Confidence as source proof" : mode === "copiedScore" ? "Copied score" : "Fake precision failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row ai-fake-precision-controls">
        <button type="button" className={mode === "exactPercent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("exactPercent")}>Exact percent</button>
        <button type="button" className={mode === "decimalCertainty" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("decimalCertainty")}>Decimal certainty</button>
        <button type="button" className={mode === "colorOnlyPrecision" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("colorOnlyPrecision")}>Color-only precision</button>
        <button type="button" className={mode === "gaugePrecision" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("gaugePrecision")}>Gauge precision</button>
        <button type="button" className={mode === "hiddenCaveat" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenCaveat")}>Hidden caveat</button>
        <button type="button" className={mode === "confidenceAsSourceProof" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confidenceAsSourceProof")}>Confidence as source proof</button>
        <button type="button" className={mode === "stalePrecision" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stalePrecision")}>Stale precision</button>
        <button type="button" className={mode === "copiedScore" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("copiedScore")}>Copied score</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiConfidenceFakePrecisionGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiConfidenceFakePrecisionBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <AiConfidenceFakePrecisionGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiConfidenceFakePrecisionBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
