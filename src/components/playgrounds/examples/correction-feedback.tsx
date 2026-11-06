import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CorrectionFeedbackState =
  | "wrongAnswer"
  | "missingSource"
  | "wrongSource"
  | "harmfulSuggestion"
  | "outdatedAnswer"
  | "userCorrection"
  | "feedbackReason"
  | "selectedClaim"
  | "sourceCorrection"
  | "expectedAnswer"
  | "privateNote"
  | "sendFeedback"
  | "feedbackReceived"
  | "applyThisAnswer"
  | "applyFutureAnswers"
  | "reviewerRouted"
  | "trainingOptOut"
  | "appealDecision"
  | "feedbackHistory"
  | "mobile";

const correctionFeedbackCopy: Record<CorrectionFeedbackState, {
  label: string;
  message: string;
  reason: string;
  scope: string;
  status: string;
  privacy: string;
  tone: "neutral" | "working" | "ready" | "warning" | "danger";
}> = {
  wrongAnswer: {
    label: "Wrong answer",
    message: "Wrong answer feedback is anchored to the answer version and selected claim.",
    reason: "Answer contradicts policy",
    scope: "Apply to this answer",
    status: "Review required",
    privacy: "Private note hidden",
    tone: "danger"
  },
  missingSource: {
    label: "Missing source",
    message: "Missing source feedback asks for evidence instead of sending a vague dislike.",
    reason: "Citation missing",
    scope: "Update source review",
    status: "Queued for source check",
    privacy: "No training use yet",
    tone: "warning"
  },
  wrongSource: {
    label: "Wrong source",
    message: "Wrong source correction keeps the cited source ID and proposed replacement together.",
    reason: "Source does not support claim",
    scope: "Correct source",
    status: "Reviewer routed",
    privacy: "Source title visible",
    tone: "warning"
  },
  harmfulSuggestion: {
    label: "Harmful suggestion",
    message: "Harmful suggestion feedback routes to safety review before answer repair.",
    reason: "Unsafe recommendation",
    scope: "Review only",
    status: "Safety review",
    privacy: "Sensitive text redacted",
    tone: "danger"
  },
  outdatedAnswer: {
    label: "Outdated answer",
    message: "Outdated answer correction captures the stale date and expected current source.",
    reason: "Policy date stale",
    scope: "Refresh future answers",
    status: "Source refresh needed",
    privacy: "Feedback private",
    tone: "warning"
  },
  userCorrection: {
    label: "User correction",
    message: "User correction captures the expected answer and preserves the original AI claim.",
    reason: "User supplied correction",
    scope: "Apply after review",
    status: "Awaiting reviewer",
    privacy: "Private note available",
    tone: "working"
  },
  feedbackReason: {
    label: "Feedback reason",
    message: "Feedback reason choices separate wrong answer, wrong source, missing source, and harmful content.",
    reason: "Wrong answer selected",
    scope: "Reason drives routing",
    status: "Ready to send",
    privacy: "Consent visible",
    tone: "neutral"
  },
  selectedClaim: {
    label: "Selected claim",
    message: "Selected claim keeps feedback attached to the exact sentence being corrected.",
    reason: "Claim span selected",
    scope: "This answer only",
    status: "Claim captured",
    privacy: "No transcript leak",
    tone: "ready"
  },
  sourceCorrection: {
    label: "Source correction",
    message: "Source correction pairs the disputed citation with a proposed replacement.",
    reason: "Corrected source added",
    scope: "Update citation",
    status: "Source owner notified",
    privacy: "Source note private",
    tone: "ready"
  },
  expectedAnswer: {
    label: "Expected answer",
    message: "Expected answer text explains what the AI should have said without becoming a hidden prompt.",
    reason: "Expected answer entered",
    scope: "Reviewer compares",
    status: "Ready to send",
    privacy: "Training choice pending",
    tone: "neutral"
  },
  privateNote: {
    label: "Private note",
    message: "Private note stays out of shared transcript, copied answer, and generated summary.",
    reason: "Sensitive context",
    scope: "Review only",
    status: "Protected",
    privacy: "Private note hidden",
    tone: "ready"
  },
  sendFeedback: {
    label: "Send feedback",
    message: "Send feedback locks duplicate activation and submits reason, scope, consent, and claim.",
    reason: "Correction ready",
    scope: "Scope confirmed",
    status: "Submitting",
    privacy: "Opt-out respected",
    tone: "working"
  },
  feedbackReceived: {
    label: "Feedback received",
    message: "Feedback received gives an accessible receipt and next review step.",
    reason: "Receipt CF-1842",
    scope: "This answer queued",
    status: "Received",
    privacy: "Private note retained",
    tone: "ready"
  },
  applyThisAnswer: {
    label: "Apply to this answer",
    message: "Apply to this answer makes current-output impact explicit before repair.",
    reason: "Correction affects current answer",
    scope: "This answer",
    status: "Correction pending",
    privacy: "Reviewer visible",
    tone: "working"
  },
  applyFutureAnswers: {
    label: "Apply to future answers",
    message: "Apply to future answers separates future behavior from current-answer repair.",
    reason: "Avoid repeating error",
    scope: "Future answers",
    status: "Quality queue",
    privacy: "Training opt-out available",
    tone: "neutral"
  },
  reviewerRouted: {
    label: "Reviewer routed",
    message: "Reviewer routed shows who owns the correction and why automation did not apply it immediately.",
    reason: "Needs policy reviewer",
    scope: "Review only",
    status: "Assigned",
    privacy: "Reviewer note private",
    tone: "working"
  },
  trainingOptOut: {
    label: "Training opt-out",
    message: "Training opt-out separates correction handling from model-improvement data use.",
    reason: "Do not train",
    scope: "Review and source only",
    status: "Opt-out saved",
    privacy: "No training use",
    tone: "ready"
  },
  appealDecision: {
    label: "Appeal decision",
    message: "Appeal decision gives users a path when a correction is rejected or only partially applied.",
    reason: "Disagree with rejection",
    scope: "Appeal review",
    status: "Appeal open",
    privacy: "Appeal note private",
    tone: "warning"
  },
  feedbackHistory: {
    label: "Feedback history",
    message: "Feedback history preserves received, routed, accepted, rejected, and appealed outcomes.",
    reason: "Two prior corrections",
    scope: "History visible",
    status: "Accepted yesterday",
    privacy: "Private notes hidden",
    tone: "ready"
  },
  mobile: {
    label: "Mobile feedback",
    message: "Mobile feedback keeps selected claim, reason, scope, and receipt in one compact sheet.",
    reason: "Claim selected",
    scope: "This answer",
    status: "Receipt visible",
    privacy: "Compact privacy row",
    tone: "ready"
  }
};

function CorrectionFeedbackPanel({ state }: { state: CorrectionFeedbackState }) {
  const copy = correctionFeedbackCopy[state];

  return (
    <section className={`correction-feedback-shell is-${copy.tone}`} aria-label="Correction feedback">
      <header className="correction-feedback-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="correction-feedback-receipt">Answer v3</span>
      </header>
      <blockquote className="correction-feedback-claim">
        <span>Selected claim</span>
        <p>Contractors are always eligible for reimbursement without manager approval.</p>
      </blockquote>
      <div className="correction-feedback-grid">
        <span><b>Feedback reason</b>{copy.reason}</span>
        <span><b>Source correction</b>Use policy HR-42 section 3.1</span>
        <span><b>Expected answer</b>Contractors need manager approval before reimbursement.</span>
        <span><b>Scope</b>{copy.scope}</span>
        <span><b>Status</b>{copy.status}</span>
        <span><b>Privacy</b>{copy.privacy}</span>
      </div>
      <div className="correction-feedback-actions">
        <button type="button" className="demo-button small">Send feedback</button>
        <button type="button" className="demo-button small">Apply to this answer</button>
        <button type="button" className="demo-button small">View feedback history</button>
      </div>
    </section>
  );
}

function CorrectionFeedbackGoodUi() {
  return (
    <div className="quality-example correction-feedback-demo">
      <CorrectionFeedbackPanel state="selectedClaim" />
      <p className="demo-status">The correction feedback surface keeps selected claim, feedback reason, source correction, expected answer, private note, scope, receipt, reviewer routed state, and feedback history visible.</p>
    </div>
  );
}

function CorrectionFeedbackBadUi() {
  return (
    <div className="bad-ui-sample correction-feedback-bad-demo is-thumbs-only">
      <div className="correction-feedback-bad-card">Thumbs down</div>
      <div className="correction-feedback-broken-grid" aria-label="Broken correction feedback">
        <span>Thumbs-only</span>
        <span>No selected claim</span>
        <span>No correction reason</span>
        <span>No receipt</span>
      </div>
      <p>The broken UI collects sentiment but loses what was wrong, which source failed, what answer was expected, and what happens next.</p>
    </div>
  );
}

function CorrectionFeedbackGoodUx() {
  const [state, setState] = useState<CorrectionFeedbackState>("wrongAnswer");
  const [message, setMessage] = useState("Wrong answer feedback anchors the correction to the answer version and selected claim.");
  const choose = (next: CorrectionFeedbackState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example correction-feedback-demo">
      <div className="correction-feedback-controls" aria-label="Correction feedback exercise controls">
        <button type="button" className={state === "wrongAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("wrongAnswer", "Wrong answer feedback records the claim, reason, and expected answer.")}>Wrong answer</button>
        <button type="button" className={state === "missingSource" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("missingSource", "Missing source feedback asks for evidence instead of a vague dislike.")}>Missing source</button>
        <button type="button" className={state === "wrongSource" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("wrongSource", "Wrong source feedback captures the disputed citation and replacement source.")}>Wrong source</button>
        <button type="button" className={state === "harmfulSuggestion" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("harmfulSuggestion", "Harmful suggestion feedback routes to safety review.")}>Harmful suggestion</button>
        <button type="button" className={state === "outdatedAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("outdatedAnswer", "Outdated answer feedback captures stale policy and refresh scope.")}>Outdated answer</button>
        <button type="button" className={state === "userCorrection" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("userCorrection", "User correction preserves the expected answer as review evidence.")}>User correction</button>
        <button type="button" className={state === "feedbackReason" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("feedbackReason", "Feedback reason routes wrong answer, wrong source, and harmful suggestions differently.")}>Feedback reason</button>
        <button type="button" className={state === "selectedClaim" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("selectedClaim", "Selected claim keeps feedback attached to the exact sentence.")}>Selected claim</button>
        <button type="button" className={state === "sourceCorrection" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sourceCorrection", "Source correction pairs the bad citation with a corrected source.")}>Source correction</button>
        <button type="button" className={state === "expectedAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("expectedAnswer", "Expected answer explains the correction without becoming a hidden prompt.")}>Expected answer</button>
        <button type="button" className={state === "privateNote" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("privateNote", "Private note stays out of shared transcript and copied output.")}>Private note</button>
        <button type="button" className={state === "sendFeedback" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sendFeedback", "Send feedback locks duplicate submission and sends reason, scope, and consent.")}>Send feedback</button>
        <button type="button" className={state === "feedbackReceived" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("feedbackReceived", "Feedback received gives an accessible receipt and review path.")}>Feedback received</button>
        <button type="button" className={state === "applyThisAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("applyThisAnswer", "Apply to this answer makes current-answer impact explicit.")}>Apply to this answer</button>
        <button type="button" className={state === "applyFutureAnswers" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("applyFutureAnswers", "Apply to future answers separates current repair from future behavior.")}>Apply to future answers</button>
        <button type="button" className={state === "reviewerRouted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reviewerRouted", "Reviewer routed explains who owns the correction.")}>Reviewer routed</button>
        <button type="button" className={state === "trainingOptOut" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("trainingOptOut", "Training opt-out separates correction handling from model improvement use.")}>Training opt-out</button>
        <button type="button" className={state === "appealDecision" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("appealDecision", "Appeal decision gives a path after rejected or partial corrections.")}>Appeal decision</button>
        <button type="button" className={state === "feedbackHistory" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("feedbackHistory", "Feedback history keeps received, routed, accepted, rejected, and appealed states visible.")}>Feedback history</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile feedback keeps claim, reason, scope, and receipt in a compact sheet.")}>Mobile feedback</button>
      </div>
      <CorrectionFeedbackPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CorrectionFeedbackBadUx() {
  type Mode = "thumbs-only" | "no-scope" | "silent-learning" | "prompt-confusion" | "lost-correction" | "public-leak" | "no-follow-up";
  const [mode, setMode] = useState<Mode>("thumbs-only");
  const copy: Record<Mode, string> = {
    "thumbs-only": "Thumbs-only feedback captures sentiment but loses selected claim, source correction, expected answer, and feedback reason.",
    "no-scope": "No-scope feedback hides whether the correction applies to this answer, future answers, source review, or training use.",
    "silent-learning": "Silent learning trains on correction text without showing consent, retention, or opt-out controls.",
    "prompt-confusion": "Prompt confusion treats feedback as a hidden prompt edit instead of a traceable correction.",
    "lost-correction": "Lost correction accepts the form but provides no receipt, retry, reviewer route, or feedback history.",
    "public-leak": "Public leak exposes a private correction note in the shared transcript and generated summary.",
    "no-follow-up": "No follow-up leaves accepted, rejected, appealed, and partially applied outcomes invisible."
  };
  const labels: Record<Mode, string[]> = {
    "thumbs-only": ["Thumbs-only", "No reason", "No claim", "No expected answer"],
    "no-scope": ["No scope", "This answer unclear", "Future use unclear", "No consent"],
    "silent-learning": ["Silent learning", "Training assumed", "No opt-out", "No retention"],
    "prompt-confusion": ["Prompt confusion", "Hidden prompt edit", "No correction record", "Answer drift"],
    "lost-correction": ["Lost correction", "No receipt", "No retry", "No history"],
    "public-leak": ["Public leak", "Private note shown", "Shared transcript", "Copied output"],
    "no-follow-up": ["No follow-up", "Reviewer hidden", "No outcome", "No appeal"]
  };

  return (
    <div className={`quality-example correction-feedback-bad-demo is-${mode}`}>
      <div className="correction-feedback-bad-card">{mode === "lost-correction" ? "Sent?" : "Feedback"}</div>
      <div className="correction-feedback-broken-grid" aria-label="Broken correction feedback">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "public-leak" ? "Public leak" : "Correction feedback failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row correction-feedback-controls">
        <button type="button" className={mode === "thumbs-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("thumbs-only")}>Thumbs-only</button>
        <button type="button" className={mode === "no-scope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-scope")}>No scope</button>
        <button type="button" className={mode === "silent-learning" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silent-learning")}>Silent learning</button>
        <button type="button" className={mode === "prompt-confusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("prompt-confusion")}>Prompt confusion</button>
        <button type="button" className={mode === "lost-correction" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lost-correction")}>Lost correction</button>
        <button type="button" className={mode === "public-leak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("public-leak")}>Public leak</button>
        <button type="button" className={mode === "no-follow-up" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-follow-up")}>No follow-up</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CorrectionFeedbackGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CorrectionFeedbackBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CorrectionFeedbackGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CorrectionFeedbackBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
