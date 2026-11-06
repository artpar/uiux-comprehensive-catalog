import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type NextActionState = "ready" | "review" | "accepted" | "deferred" | "dismissed" | "alreadyDone" | "stale" | "blocked" | "lowConfidence";

type RecommendedAction = {
  id: string;
  title: string;
  source: string;
  trigger: string;
  evidence: string;
  consequence: string;
  confidence: string;
  owner: string;
  due: string;
  state: NextActionState;
};

const recommendedActionPool: RecommendedAction[] = [
  {
    id: "refund-article",
    title: "Send refund-policy article",
    source: "Smart assist",
    trigger: "Customer asked about refund twice",
    evidence: "Intent: refund question · Similar case: C-8821",
    consequence: "Opens a reply draft; nothing is sent until reviewed.",
    confidence: "High",
    owner: "You",
    due: "Now",
    state: "ready"
  },
  {
    id: "similar-case",
    title: "Review similar case",
    source: "Case matching rule",
    trigger: "Same product, error code, and environment",
    evidence: "Similar case C-7714 resolved with firmware reset",
    consequence: "Opens the matching case in a side panel.",
    confidence: "Medium",
    owner: "You",
    due: "Before reply",
    state: "review"
  },
  {
    id: "retention-offer",
    title: "Review retention offer",
    source: "Business strategy",
    trigger: "High-value renewal with churn risk",
    evidence: "Renewal due in 9 days · Health score dropped 18%",
    consequence: "Opens an offer review; manager approval required.",
    confidence: "Medium",
    owner: "Account owner",
    due: "Today",
    state: "blocked"
  }
];

function RecommendedNextActionCard({
  action,
  compact = false
}: {
  action: RecommendedAction;
  compact?: boolean;
}) {
  const stateCopy: Record<NextActionState, string> = {
    ready: "Eligible",
    review: "Review first",
    accepted: "Accepted",
    deferred: "Deferred",
    dismissed: "Dismissed",
    alreadyDone: "Already done",
    stale: "Refresh needed",
    blocked: "Blocked",
    lowConfidence: "Low confidence"
  };

  return (
    <section className={`recommended-next-action-card is-${action.state} ${compact ? "is-compact" : ""}`} aria-label="Recommended next action">
      <div className="recommended-next-action-header">
        <div>
          <strong>{action.title}</strong>
          <span>{action.source} · {stateCopy[action.state]} · {action.confidence} confidence</span>
        </div>
        <span className="recommended-next-action-due">{action.owner} · {action.due}</span>
      </div>
      <div className="recommended-next-action-reason">
        <p><strong>Why now:</strong> {action.trigger}</p>
        <p><strong>Evidence:</strong> {action.evidence}</p>
        <p><strong>Consequence:</strong> {action.consequence}</p>
      </div>
      <div className="recommended-next-action-controls" aria-label={`${action.title} controls`}>
        <button type="button" className="demo-button small primary" disabled={action.state === "blocked" || action.state === "stale"}>Review action</button>
        <button type="button" className="demo-button small" disabled={action.state === "blocked"}>Defer</button>
        <button type="button" className="demo-button small">Dismiss</button>
        <button type="button" className="demo-button small">Why this?</button>
      </div>
    </section>
  );
}

function RecommendedNextActionGoodUi() {
  return (
    <div className="quality-example recommended-next-action-demo">
      <RecommendedNextActionCard action={recommendedActionPool[0]} />
      <p className="demo-status">The action card names the suggested action, source, trigger, evidence, confidence, owner, due timing, consequence, and review controls before anything is sent or applied.</p>
    </div>
  );
}

function RecommendedNextActionBadUi() {
  return (
    <div className="bad-ui-sample recommended-next-action-bad-demo is-context-free-button">
      <div className="recommended-next-action-broken-grid">
        {["Continue", "Recommended", "Do it", "Close"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">The broken UI labels a static button as recommended without trigger, evidence, consequence, confidence, eligibility, or a review path.</p>
    </div>
  );
}

function RecommendedNextActionGoodUx() {
  const [action, setAction] = useState<RecommendedAction>(recommendedActionPool[0]);
  const [message, setMessage] = useState("Recommended next action is optional, explainable, and reviewable before applying.");

  const choose = (next: RecommendedAction, note: string) => {
    setAction(next);
    setMessage(note);
  };

  const mutate = (state: NextActionState, note: string) => {
    setAction((current) => ({ ...current, state }));
    setMessage(note);
  };

  return (
    <div className="quality-example recommended-next-action-demo">
      <div className="recommended-next-action-toolbar" aria-label="Recommended next action controls">
        <button type="button" className="demo-button small primary" onClick={() => choose(recommendedActionPool[0], "Refund article suggestion restored from customer intent and similar-case evidence.")}>Refund article</button>
        <button type="button" className="demo-button small" onClick={() => choose(recommendedActionPool[1], "Similar case suggestion requires review before using the prior resolution.")}>Similar case</button>
        <button type="button" className="demo-button small" onClick={() => choose(recommendedActionPool[2], "Retention offer is blocked until manager approval and eligibility are confirmed.")}>Blocked offer</button>
        <button type="button" className="demo-button small" onClick={() => mutate("review", "Review opens a draft/action form; the case is not changed until the user confirms.")}>Review</button>
        <button type="button" className="demo-button small" onClick={() => mutate("accepted", "Action accepted after review; the status message names what changed.")}>Accept</button>
        <button type="button" className="demo-button small" onClick={() => mutate("deferred", "Action deferred until the customer replies; alternatives remain available.")}>Defer</button>
        <button type="button" className="demo-button small" onClick={() => mutate("dismissed", "Suggestion dismissed only; the case, required tasks, and queue rows remain intact.")}>Dismiss</button>
        <button type="button" className="demo-button small" onClick={() => mutate("alreadyDone", "Marked already done, preventing the same suggestion from returning immediately.")}>Already done</button>
        <button type="button" className="demo-button small" onClick={() => mutate("stale", "Recommendation is stale because the case status changed; refresh is required before accept.")}>Stale state</button>
        <button type="button" className="demo-button small" onClick={() => mutate("lowConfidence", "Low-confidence AI output is presented as review-only with alternatives visible.")}>Low confidence</button>
      </div>
      <RecommendedNextActionCard action={action} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function RecommendedNextActionBadUx() {
  type Mode = "context-free-button" | "hidden-reason" | "required-mix" | "instant-apply" | "stale-action" | "no-feedback" | "low-confidence";
  const [mode, setMode] = useState<Mode>("context-free-button");
  const copy: Record<Mode, string> = {
    "context-free-button": "A static Continue button is called recommended even though nothing about it changes with case context.",
    "hidden-reason": "Users cannot inspect the signal, rule, confidence, or evidence behind the suggested action.",
    "required-mix": "Required compliance tasks and optional suggestions share one list, hiding what must happen.",
    "instant-apply": "Accept instantly sends an external message and closes the case without review.",
    "stale-action": "The action applies after the customer already replied and the case state changed.",
    "no-feedback": "Dismiss does nothing durable, so the same suggestion returns with different wording.",
    "low-confidence": "A low-confidence AI suggestion is presented as the only safe next step."
  };
  const labels: Record<Mode, string[]> = {
    "context-free-button": ["Continue", "Next", "Recommended", "OK"],
    "hidden-reason": ["Why?", "Signal?", "Source?", "Score?"],
    "required-mix": ["Required", "Optional", "Approval", "Suggest"],
    "instant-apply": ["Sent", "Closed", "No review", "No undo"],
    "stale-action": ["Old status", "New reply", "Still send", "Mismatch"],
    "no-feedback": ["Dismiss", "Returns", "Dismiss", "Returns"],
    "low-confidence": ["Maybe", "AI says", "Only path", "No source"]
  };

  return (
    <div className={`quality-example recommended-next-action-bad-demo is-${mode}`}>
      <div className="recommended-next-action-broken-grid">
        {labels[mode].map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>
      <strong>{mode === "instant-apply" ? "Committed without review" : mode === "required-mix" ? "Optional and required mixed" : "Unsafe suggestion"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row recommended-next-action-controls">
        <button type="button" className={mode === "context-free-button" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("context-free-button")}>Context-free button</button>
        <button type="button" className={mode === "hidden-reason" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-reason")}>Hidden reason</button>
        <button type="button" className={mode === "required-mix" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("required-mix")}>Required mix</button>
        <button type="button" className={mode === "instant-apply" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("instant-apply")}>Instant apply</button>
        <button type="button" className={mode === "stale-action" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale-action")}>Stale action</button>
        <button type="button" className={mode === "no-feedback" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-feedback")}>No feedback</button>
        <button type="button" className={mode === "low-confidence" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("low-confidence")}>Low confidence</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecommendedNextActionGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecommendedNextActionBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecommendedNextActionGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RecommendedNextActionBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
