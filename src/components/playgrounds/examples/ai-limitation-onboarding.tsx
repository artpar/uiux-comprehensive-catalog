import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AiLimitationOnboardingState =
  | "firstRun"
  | "canDo"
  | "cannotDo"
  | "dataScope"
  | "dataNotAvailable"
  | "uncertainty"
  | "lowConfidence"
  | "humanReview"
  | "safeTrial"
  | "feedback"
  | "correction"
  | "manualFallback"
  | "skipForNow"
  | "rememberedLimit"
  | "reOnboarding"
  | "capabilityChange"
  | "dataUseChange"
  | "autonomyIncrease"
  | "policyLimit"
  | "sourceLimit"
  | "privacyBoundary"
  | "highImpact"
  | "mobile";

type AiLimitationOnboardingCopy = {
  label: string;
  message: string;
  can: string;
  cannot: string;
  data: string;
  review: string;
  action: string;
  fallback: string;
  tone: "ready" | "working" | "warning" | "danger" | "neutral";
};

const aiLimitationOnboardingCopy: Record<AiLimitationOnboardingState, AiLimitationOnboardingCopy> = {
  firstRun: {
    label: "First-run welcome",
    message: "First-run welcome explains the AI role before the first answer or action.",
    can: "Summarize selected reports",
    cannot: "Verify files you have not shared",
    data: "Uses selected report only",
    review: "Review before sharing",
    action: "Try sample report",
    fallback: "Open manual summary form",
    tone: "ready"
  },
  canDo: {
    label: "Can do",
    message: "Can do examples show useful task boundaries without implying broad expertise.",
    can: "Find themes, draft bullets, flag gaps",
    cannot: "Make final policy decisions",
    data: "Uses attached sources",
    review: "Human owns final judgment",
    action: "Start safe draft",
    fallback: "Write without AI",
    tone: "ready"
  },
  cannotDo: {
    label: "Cannot do",
    message: "Cannot do examples prevent ask-anything expectations and human-like promise copy.",
    can: "Suggest questions to ask",
    cannot: "Read private spreadsheets or guarantee truth",
    data: "Missing restricted folders",
    review: "Check sensitive claims",
    action: "Review limits",
    fallback: "Request source access",
    tone: "warning"
  },
  dataScope: {
    label: "Data scope",
    message: "Data scope separates connected sources from data not available.",
    can: "Use selected docs and ticket history",
    cannot: "Use billing notes or private chats",
    data: "2 sources connected, 1 excluded",
    review: "Confirm source scope",
    action: "View data scope",
    fallback: "Attach missing file",
    tone: "working"
  },
  dataNotAvailable: {
    label: "Data not available",
    message: "Data not available names the missing source before users rely on an answer.",
    can: "Answer from public handbook",
    cannot: "Inspect restricted legal folder",
    data: "Legal folder unavailable",
    review: "Ask document owner",
    action: "Add source",
    fallback: "Use manual search",
    tone: "danger"
  },
  uncertainty: {
    label: "Uncertainty",
    message: "Uncertainty explains that AI output is probabilistic and may be wrong.",
    can: "Show likely themes",
    cannot: "Guarantee complete coverage",
    data: "Sample may be incomplete",
    review: "Look for missing cases",
    action: "See uncertainty examples",
    fallback: "Use checklist review",
    tone: "warning"
  },
  lowConfidence: {
    label: "Low confidence",
    message: "Low confidence teaches when the system cannot fulfill a request reliably.",
    can: "Explain why confidence is low",
    cannot: "Predict unstable future demand",
    data: "Insufficient recent data",
    review: "Do not automate this result",
    action: "Try narrower request",
    fallback: "Use manual forecast",
    tone: "danger"
  },
  humanReview: {
    label: "Human review",
    message: "Human review identifies outputs that require approval before use.",
    can: "Draft customer reply",
    cannot: "Send high-impact reply alone",
    data: "Uses selected ticket",
    review: "Manager approval required",
    action: "Preview review step",
    fallback: "Compose manually",
    tone: "warning"
  },
  safeTrial: {
    label: "Safe trial",
    message: "Safe trial lets users explore behavior without production risk.",
    can: "Run sample task in sandbox",
    cannot: "Change live customer data",
    data: "Sample report only",
    review: "No approval needed",
    action: "Try sample",
    fallback: "Skip trial",
    tone: "ready"
  },
  feedback: {
    label: "Feedback",
    message: "Feedback explains how user input can improve future behavior.",
    can: "Learn from explicit feedback",
    cannot: "Use private notes without consent",
    data: "Feedback saved to this workspace",
    review: "Owner can audit feedback",
    action: "Give feedback",
    fallback: "Turn off learning",
    tone: "working"
  },
  correction: {
    label: "Correction",
    message: "Correction shows users how to fix wrong output instead of abandoning the task.",
    can: "Accept corrected source",
    cannot: "Silently retrain from every edit",
    data: "Correction scoped to this answer",
    review: "Reviewer sees change",
    action: "Correct answer",
    fallback: "Use manual edit",
    tone: "working"
  },
  manualFallback: {
    label: "Manual fallback",
    message: "Manual fallback keeps the task possible when AI cannot help.",
    can: "Hand off structured draft",
    cannot: "Finish unsupported request",
    data: "No extra AI access",
    review: "User completes task",
    action: "Use manual path",
    fallback: "Manual form ready",
    tone: "ready"
  },
  skipForNow: {
    label: "Skip for now",
    message: "Skip for now avoids blocking low-risk exploration while preserving safety boundaries.",
    can: "Continue with visible reminder",
    cannot: "Skip high-impact review rules",
    data: "Reminder pinned in Help",
    review: "Review appears before send",
    action: "Skip for now",
    fallback: "Open later",
    tone: "neutral"
  },
  rememberedLimit: {
    label: "Remembered limit",
    message: "Remembered limit keeps critical boundaries available after onboarding is dismissed.",
    can: "Show compact reminder",
    cannot: "Hide source limits forever",
    data: "Data scope link stays visible",
    review: "Review badge remains",
    action: "Open limits",
    fallback: "Use help panel",
    tone: "neutral"
  },
  reOnboarding: {
    label: "Re-onboarding",
    message: "Re-onboarding appears when user expectations need recalibration.",
    can: "Explain changed behavior",
    cannot: "Assume old mental model works",
    data: "New source added",
    review: "Review new limits",
    action: "Review update",
    fallback: "Keep old workflow",
    tone: "warning"
  },
  capabilityChange: {
    label: "Capability change",
    message: "Capability change explains new and removed abilities before returning users rely on them.",
    can: "Draft and compare summaries",
    cannot: "Extract handwritten notes yet",
    data: "Same workspace data",
    review: "Review changed output style",
    action: "See what changed",
    fallback: "Use previous method",
    tone: "working"
  },
  dataUseChange: {
    label: "Data-use change",
    message: "Data-use change reintroduces the AI when it starts using different signals.",
    can: "Use ticket history now",
    cannot: "Use private chats",
    data: "New signal: ticket history",
    review: "Confirm data use",
    action: "Review data-use change",
    fallback: "Disable history use",
    tone: "warning"
  },
  autonomyIncrease: {
    label: "Autonomy increase",
    message: "Autonomy increase warns when the AI can move from draft to action.",
    can: "Prepare routing action",
    cannot: "Execute without approval",
    data: "Uses queue rules",
    review: "Approval gate required",
    action: "Preview approval",
    fallback: "Manual routing",
    tone: "danger"
  },
  policyLimit: {
    label: "Policy limit",
    message: "Policy limit explains safety filters without blaming the user.",
    can: "Offer safe alternative",
    cannot: "Generate restricted content",
    data: "Policy filter active",
    review: "Escalate if business need",
    action: "See allowed help",
    fallback: "Contact support",
    tone: "danger"
  },
  sourceLimit: {
    label: "Source limit",
    message: "Source limit explains that missing or stale sources affect answers.",
    can: "Use indexed policy files",
    cannot: "Search archived drives",
    data: "Index updated yesterday",
    review: "Check latest source",
    action: "View source scope",
    fallback: "Open source search",
    tone: "warning"
  },
  privacyBoundary: {
    label: "Privacy boundary",
    message: "Privacy boundary tells users what not to disclose and how data is handled.",
    can: "Use selected non-sensitive text",
    cannot: "Process secrets safely here",
    data: "No sensitive-data reveal",
    review: "Remove private details",
    action: "Review privacy boundary",
    fallback: "Use secure workflow",
    tone: "danger"
  },
  highImpact: {
    label: "High-impact use",
    message: "High-impact use names tasks where AI output is not final authority.",
    can: "Draft analysis for review",
    cannot: "Approve legal, medical, or financial action",
    data: "Evidence may be incomplete",
    review: "Expert review required",
    action: "Open review route",
    fallback: "Escalate to human",
    tone: "danger"
  },
  mobile: {
    label: "Mobile compact",
    message: "Mobile compact keeps benefit, cannot do, review, and fallback visible in a narrow layout.",
    can: "Summarize selected note",
    cannot: "Verify external facts",
    data: "Selected note only",
    review: "Tap to review limits",
    action: "Try sample",
    fallback: "Manual note",
    tone: "ready"
  }
};

function AiLimitationOnboardingPanel({ state }: { state: AiLimitationOnboardingState }) {
  const copy = aiLimitationOnboardingCopy[state];

  return (
    <section className={`ai-limit-shell is-${copy.tone}`} aria-label="AI limitation onboarding">
      <header className="ai-limit-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="ai-limit-state">Trust calibration</span>
      </header>
      <div className="ai-limit-hero">
        <span>AI limitation onboarding</span>
        <p>This research assistant can help draft and compare report summaries, but it cannot verify missing sources, make final decisions, or replace human review for high-impact use.</p>
      </div>
      <div className="ai-limit-grid" aria-label="AI limitation onboarding details">
        <span><b>Can do</b>{copy.can}</span>
        <span><b>Cannot do</b>{copy.cannot}</span>
        <span><b>Data scope</b>{copy.data}</span>
        <span><b>Human review</b>{copy.review}</span>
        <span><b>Safe trial</b>{copy.action}</span>
        <span><b>Manual fallback</b>{copy.fallback}</span>
      </div>
      <div className="ai-limit-path" aria-label="Onboarding path">
        <span>Benefit</span>
        <span>Limits</span>
        <span>Data used</span>
        <span>Uncertainty</span>
        <span>Review</span>
        <span>Fallback</span>
      </div>
      <div className="ai-limit-actions">
        <button type="button" className="demo-button small primary">Try sample</button>
        <button type="button" className="demo-button small">Review limits</button>
        <button type="button" className="demo-button small">Use manual path</button>
        <button type="button" className="demo-button small">Skip for now</button>
      </div>
    </section>
  );
}

function AiLimitationOnboardingGoodUi() {
  return (
    <div className="quality-example ai-limit-demo">
      <AiLimitationOnboardingPanel state="firstRun" />
      <p className="demo-status">The AI limitation onboarding screen separates first-run welcome, can do, cannot do, data scope, data not available, uncertainty, low confidence, human review, safe trial, feedback, correction, manual fallback, skip for now, remembered limit, re-onboarding, capability change, data-use change, autonomy increase, policy limit, source limit, privacy boundary, high-impact use, and mobile compact states.</p>
    </div>
  );
}

function AiLimitationOnboardingBadUi() {
  return (
    <div className="bad-ui-sample ai-limit-bad-demo is-human-like">
      <div className="ai-limit-bad-card">Meet your expert teammate</div>
      <div className="ai-limit-broken-grid" aria-label="Broken AI limitation onboarding">
        <span>Human-like promise</span>
        <span>Ask-anything</span>
        <span>Hidden data scope</span>
        <span>No fallback</span>
      </div>
      <p>The broken UI starts with a human-like promise, hides cannot do limits, data not available, uncertainty, source limit, human review, safe trial, feedback, correction, manual fallback, and re-onboarding.</p>
    </div>
  );
}

function AiLimitationOnboardingGoodUx() {
  const [state, setState] = useState<AiLimitationOnboardingState>("firstRun");
  const [message, setMessage] = useState("First-run welcome explains the AI role before the first answer or action.");
  const choose = (next: AiLimitationOnboardingState, note: string) => {
    setState(next);
    setMessage(note);
  };
  const states: Array<[AiLimitationOnboardingState, string, string]> = [
    ["firstRun", "First-run welcome", "First-run welcome explains the AI role before the first answer or action."],
    ["canDo", "Can do", "Can do examples show useful task boundaries without implying broad expertise."],
    ["cannotDo", "Cannot do", "Cannot do examples prevent ask-anything expectations and human-like promise copy."],
    ["dataScope", "Data scope", "Data scope separates connected sources from data not available."],
    ["dataNotAvailable", "Data not available", "Data not available names the missing source before users rely on an answer."],
    ["uncertainty", "Uncertainty", "Uncertainty explains that AI output is probabilistic and may be wrong."],
    ["lowConfidence", "Low confidence", "Low confidence teaches when the system cannot fulfill a request reliably."],
    ["humanReview", "Human review", "Human review identifies outputs that require approval before use."],
    ["safeTrial", "Safe trial", "Safe trial lets users explore behavior without production risk."],
    ["feedback", "Feedback", "Feedback explains how user input can improve future behavior."],
    ["correction", "Correction", "Correction shows users how to fix wrong output instead of abandoning the task."],
    ["manualFallback", "Manual fallback", "Manual fallback keeps the task possible when AI cannot help."],
    ["skipForNow", "Skip for now", "Skip for now avoids blocking low-risk exploration while preserving safety boundaries."],
    ["rememberedLimit", "Remembered limit", "Remembered limit keeps critical boundaries available after onboarding is dismissed."],
    ["reOnboarding", "Re-onboarding", "Re-onboarding appears when user expectations need recalibration."],
    ["capabilityChange", "Capability change", "Capability change explains new and removed abilities before returning users rely on them."],
    ["dataUseChange", "Data-use change", "Data-use change reintroduces the AI when it starts using different signals."],
    ["autonomyIncrease", "Autonomy increase", "Autonomy increase warns when the AI can move from draft to action."],
    ["policyLimit", "Policy limit", "Policy limit explains safety filters without blaming the user."],
    ["sourceLimit", "Source limit", "Source limit explains that missing or stale sources affect answers."],
    ["privacyBoundary", "Privacy boundary", "Privacy boundary tells users what not to disclose and how data is handled."],
    ["highImpact", "High-impact use", "High-impact use names tasks where AI output is not final authority."],
    ["mobile", "Mobile compact", "Mobile compact keeps benefit, cannot do, review, and fallback visible in a narrow layout."]
  ];

  return (
    <div className="quality-example ai-limit-demo">
      <div className="ai-limit-controls" aria-label="AI limitation onboarding exercise controls">
        {states.map(([next, label, note]) => (
          <button key={next} type="button" className={state === next ? "demo-button small primary" : "demo-button small"} onClick={() => choose(next, note)}>{label}</button>
        ))}
      </div>
      <AiLimitationOnboardingPanel state={state} />
      <p className="demo-status" aria-live="polite">{message} The flow keeps AI capabilities, limits, data scope, uncertainty, human review, safe trial, feedback, correction, manual fallback, skip for now, remembered limit, and re-onboarding discoverable.</p>
    </div>
  );
}

function AiLimitationOnboardingBadUx() {
  type Mode = "human-like" | "ask-anything" | "disclaimer-wall" | "no-fallback" | "hidden-data-scope" | "no-reboarding" | "confidence-substitute";
  const [mode, setMode] = useState<Mode>("human-like");
  const copy: Record<Mode, string> = {
    "human-like": "Human-like promise introduces the AI as an expert teammate without capability boundaries, human review, or user responsibility.",
    "ask-anything": "Ask-anything implies full data access and broad competence even when the AI cannot do restricted, private, or high-impact tasks.",
    "disclaimer-wall": "Disclaimer wall gives dense caution text without benefit, examples, safe trial, feedback, correction, or manual fallback.",
    "no-fallback": "No fallback leaves users stuck when the AI cannot answer, has low confidence, or hits a policy limit.",
    "hidden-data-scope": "Hidden data scope hides connected sources, data not available, source limits, stale sources, and privacy boundary details.",
    "no-reboarding": "No re-onboarding changes capability, data use, or autonomy without helping returning users recalibrate trust.",
    "confidence-substitute": "Confidence substitute shows a score instead of explaining can do, cannot do, data scope, review needs, and fallback."
  };
  const labels: Record<Mode, string[]> = {
    "human-like": ["Human-like promise", "Expert teammate", "No limits", "No review"],
    "ask-anything": ["Ask-anything", "Full access implied", "No cannot do", "No source limit"],
    "disclaimer-wall": ["Disclaimer wall", "Dense policy", "No safe trial", "No examples"],
    "no-fallback": ["No fallback", "Dead end", "No manual path", "No recovery"],
    "hidden-data-scope": ["Hidden data scope", "No sources", "No privacy boundary", "No missing data"],
    "no-reboarding": ["No re-onboarding", "Changed autonomy", "Changed data use", "No reminder"],
    "confidence-substitute": ["Confidence substitute", "Score only", "No limits", "No fallback"]
  };

  return (
    <div className={`quality-example ai-limit-bad-demo is-${mode}`}>
      <div className="ai-limit-bad-card">{mode === "disclaimer-wall" ? "Please read all terms" : "Ask the AI anything"}</div>
      <div className="ai-limit-broken-grid" aria-label="Broken AI limitation onboarding">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "confidence-substitute" ? "Confidence shown instead of onboarding" : "AI limitation onboarding failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row ai-limit-controls">
        <button type="button" className={mode === "human-like" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("human-like")}>Human-like promise</button>
        <button type="button" className={mode === "ask-anything" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("ask-anything")}>Ask-anything</button>
        <button type="button" className={mode === "disclaimer-wall" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("disclaimer-wall")}>Disclaimer wall</button>
        <button type="button" className={mode === "no-fallback" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-fallback")}>No fallback</button>
        <button type="button" className={mode === "hidden-data-scope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-data-scope")}>Hidden data scope</button>
        <button type="button" className={mode === "no-reboarding" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-reboarding")}>No re-onboarding</button>
        <button type="button" className={mode === "confidence-substitute" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confidence-substitute")}>Confidence substitute</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiLimitationOnboardingGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiLimitationOnboardingBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiLimitationOnboardingGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiLimitationOnboardingBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
