import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type HumanApprovalGateState = "paused" | "eligible" | "selfReview" | "approved" | "edit" | "rejected" | "canceled" | "timeout" | "stale" | "bypass" | "failedResume" | "mobile";

type HumanApprovalGateCopy = {
  title: string;
  status: string;
  tone: "ready" | "working" | "warning" | "danger";
  action: string;
  payload: string;
  rule: string;
  approver: string;
  next: string;
  facts: string[];
};

const humanApprovalGateCopy: Record<HumanApprovalGateState, HumanApprovalGateCopy> = {
  paused: {
    title: "Paused gate",
    status: "The refund automation run is paused before the money-moving tool call executes.",
    tone: "working",
    action: "Proposed action: Issue refund",
    payload: "Payload snapshot: customer C-4821, order ORD-91, amount $184.20",
    rule: "Triggering rule: refunds over $150 require human approval gate",
    approver: "Eligible approver: Billing lead, not the agent requester",
    next: "Approve and resume will run only step refund.issue for this payload version.",
    facts: ["Paused gate", "Proposed action", "Payload snapshot", "Triggering rule", "Run ID R-2048"]
  },
  eligible: {
    title: "Eligible approver",
    status: "Priya Rao can approve because she is in the Billing lead role and did not trigger the automation.",
    tone: "ready",
    action: "Proposed action: Issue refund",
    payload: "Payload snapshot: amount $184.20, policy match verified, source grounding partial",
    rule: "Approver rule: Billing lead or Finance manager",
    approver: "Eligible approver: Priya Rao",
    next: "Decision controls are active and will revalidate the run before resume.",
    facts: ["Eligible approver", "Separation of duties", "Approve", "Reject", "Edit before approve"]
  },
  selfReview: {
    title: "Self-review block",
    status: "The user who triggered the automation cannot approve the gate.",
    tone: "danger",
    action: "Proposed action: Issue refund",
    payload: "Payload snapshot locked until another approver opens the gate",
    rule: "Self-review block: requester cannot approve own automation",
    approver: "Approver needed: another Billing lead",
    next: "Delegate or escalate instead of allowing self approval.",
    facts: ["Self-review block", "Not eligible", "Delegate", "Escalate", "Request approver"]
  },
  approved: {
    title: "Approve and resume",
    status: "Approval accepted after freshness, payload hash, role, and threshold checks passed.",
    tone: "ready",
    action: "Approved action: Issue refund",
    payload: "Payload snapshot: customer C-4821, order ORD-91, amount $184.20",
    rule: "Revalidated: payload hash, policy threshold, source freshness, approver role",
    approver: "Approved by: Priya Rao",
    next: "Run resumed at refund.issue and did not authorize unrelated future steps.",
    facts: ["Approve and resume", "Revalidated", "Run resumed", "Step refund.issue", "Audit recorded"]
  },
  edit: {
    title: "Edit before approve",
    status: "The approver changed the amount and the gate requires revalidation before resume.",
    tone: "warning",
    action: "Edited action: Issue refund",
    payload: "Payload snapshot: amount changed from $184.20 to $142.00",
    rule: "Edit rule: payload changes create a new gate version",
    approver: "Edited by: Billing lead",
    next: "The edited payload is checked again before approval can resume automation.",
    facts: ["Edit before approve", "Payload changed", "Gate version 2", "Revalidation required", "Resume blocked"]
  },
  rejected: {
    title: "Reject gate",
    status: "The gated step is stopped with a reason and fallback path.",
    tone: "danger",
    action: "Rejected action: Issue refund",
    payload: "Payload snapshot retained for audit and retry review",
    rule: "Reject reason required: source grounding is partial",
    approver: "Rejected by: Billing lead",
    next: "Automation stops the refund step and opens manual review.",
    facts: ["Reject", "Reason required", "Fallback path", "Manual review", "Run stopped"]
  },
  canceled: {
    title: "Cancel run",
    status: "The approver cancels the automation run rather than leaving it suspended.",
    tone: "danger",
    action: "Canceled action: Issue refund",
    payload: "Payload snapshot archived with cancel reason",
    rule: "Cancel rule: no safe fallback can run automatically",
    approver: "Canceled by: Finance manager",
    next: "The run enters a terminal canceled state and no tool call executes.",
    facts: ["Cancel", "Terminal state", "No tool call", "Reason captured", "Audit trail"]
  },
  timeout: {
    title: "Timeout",
    status: "The gate is due soon and will expire unless an eligible approver acts.",
    tone: "warning",
    action: "Pending action: Issue refund",
    payload: "Payload snapshot expires in 14 minutes",
    rule: "Timeout rule: escalate after 30 minutes, cancel after 2 hours",
    approver: "Approver: Billing lead or Finance manager",
    next: "Escalation keeps the run paused and refuses late stale approvals.",
    facts: ["Timeout", "Due soon", "Escalate", "Expires", "Late decision blocked"]
  },
  stale: {
    title: "Stale gate",
    status: "The approval opened from notification is refused because the customer balance changed.",
    tone: "danger",
    action: "Stale action: Issue refund",
    payload: "Payload snapshot no longer matches current customer state",
    rule: "Freshness rule: payload hash and account balance changed",
    approver: "Decision refused for all approvers",
    next: "Refresh the gate and review the new payload before any resume.",
    facts: ["Stale gate", "Stale notification", "Payload changed", "Decision refused", "Refresh required"]
  },
  bypass: {
    title: "Bypass override",
    status: "An emergency override requires elevated permission and a visible audit reason.",
    tone: "warning",
    action: "Bypass action: Resume refund automation",
    payload: "Payload snapshot shown with override reason field",
    rule: "Bypass rule: incident commander only, reason required",
    approver: "Bypassed by: Incident commander",
    next: "The audit shows who bypassed, why, and which step resumed.",
    facts: ["Bypass override", "Elevated permission", "Reason required", "Emergency", "Audit reason"]
  },
  failedResume: {
    title: "Failed after approval",
    status: "The approver sees that the tool call failed after approval and can retry or roll back safely.",
    tone: "danger",
    action: "Approved action failed: refund.issue",
    payload: "Payload snapshot kept with failure response from payment provider",
    rule: "Resume result: provider rejected duplicate refund",
    approver: "Approved by: Priya Rao",
    next: "Retry is blocked until the duplicate refund status is checked.",
    facts: ["Failed resume", "Provider failure", "Retry blocked", "Rollback", "Approver notified"]
  },
  mobile: {
    title: "Mobile compact gate",
    status: "The compact approval sheet keeps action, risk, payload, approver rule, and timeout visible before decision.",
    tone: "ready",
    action: "Proposed action: Issue refund",
    payload: "Payload snapshot: C-4821, ORD-91, $184.20",
    rule: "Human approval gate: refund over threshold",
    approver: "Eligible approver: Billing lead",
    next: "Approve, reject, and edit remain reachable after opening details.",
    facts: ["Mobile compact gate", "Action visible", "Risk visible", "Timeout visible", "Decision controls"]
  }
};

function HumanApprovalGatePanel({ state }: { state: HumanApprovalGateState }) {
  const copy = humanApprovalGateCopy[state];
  const canApprove = state === "paused" || state === "eligible" || state === "mobile";

  return (
    <section className={`human-approval-gate-shell is-${copy.tone}`} aria-label="Human approval gate">
      <header className="human-approval-gate-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="human-approval-gate-state">{state === "approved" ? "Resumed" : state === "rejected" || state === "canceled" ? "Stopped" : state === "stale" ? "Stale" : "Paused"}</span>
      </header>
      <div className="human-approval-gate-grid">
        <div className="human-approval-gate-card">
          <strong>{copy.action}</strong>
          <span>{copy.payload}</span>
          <span>{copy.rule}</span>
        </div>
        <div className="human-approval-gate-card">
          <strong>{copy.approver}</strong>
          <span>{copy.next}</span>
          <span>Audit: actor, role, reason, payload hash, gate version, and resume result.</span>
        </div>
      </div>
      <div className="human-approval-gate-facts" aria-label="Gate facts">
        {copy.facts.map((fact) => <span key={fact}>{fact}</span>)}
      </div>
      <div className="human-approval-gate-actions">
        <button type="button" className={canApprove ? "demo-button small primary" : "demo-button small"} disabled={!canApprove}>Approve and resume</button>
        <button type="button" className="demo-button small">Edit before approve</button>
        <button type="button" className="demo-button small">Reject</button>
        <button type="button" className="demo-button small">Cancel run</button>
      </div>
    </section>
  );
}

function HumanApprovalGateGoodUi() {
  return (
    <div className="quality-example human-approval-gate-demo">
      <HumanApprovalGatePanel state="paused" />
      <p className="demo-status">The human approval gate pauses the exact automation step, shows the proposed action, payload snapshot, triggering rule, eligible approver, timeout, and what approve and resume will execute.</p>
    </div>
  );
}

function HumanApprovalGateBadUi() {
  return (
    <div className="bad-ui-sample human-approval-gate-bad-demo is-blind-approve">
      <div className="human-approval-gate-blind-card">Approval needed</div>
      <div className="human-approval-gate-broken-grid" aria-label="Broken human approval gate">
        {["Blind approve", "No payload", "No approver rule", "Hidden resume"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI asks for approval without the action, payload, eligibility, timeout, or resume consequence.</p>
    </div>
  );
}

function HumanApprovalGateGoodUx() {
  const [state, setState] = useState<HumanApprovalGateState>("paused");
  const [message, setMessage] = useState("Paused gate shows proposed action, payload snapshot, triggering rule, eligible approver, and resume behavior.");

  const choose = (next: HumanApprovalGateState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example human-approval-gate-demo">
      <div className="human-approval-gate-controls" aria-label="Human approval gate exercise controls">
        <button type="button" className={state === "paused" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("paused", "Paused gate exposes the proposed action, payload snapshot, triggering rule, and resume scope.")}>Paused gate</button>
        <button type="button" className={state === "eligible" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("eligible", "Eligible approver state activates controls only for the required human role.")}>Eligible approver</button>
        <button type="button" className={state === "selfReview" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("selfReview", "Self-review block prevents the automation requester from approving their own gated run.")}>Self-review block</button>
        <button type="button" className={state === "approved" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("approved", "Approve and resume revalidates freshness and resumes only the gated step.")}>Approve and resume</button>
        <button type="button" className={state === "edit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("edit", "Edit before approve creates a new payload version and requires revalidation.")}>Edit before approve</button>
        <button type="button" className={state === "rejected" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rejected", "Reject stops the gated step with a reason and fallback path.")}>Reject</button>
        <button type="button" className={state === "canceled" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("canceled", "Cancel run makes the automation terminal instead of leaving it suspended.")}>Cancel</button>
        <button type="button" className={state === "timeout" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("timeout", "Timeout state escalates or expires the gate and blocks late stale decisions.")}>Timeout</button>
        <button type="button" className={state === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale gate refuses notification approval after the payload or source state changes.")}>Stale gate</button>
        <button type="button" className={state === "bypass" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("bypass", "Bypass override requires elevated permission and an audit reason.")}>Bypass override</button>
        <button type="button" className={state === "failedResume" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failedResume", "Failed resume keeps the approver informed when the post-approval tool call fails.")}>Failed resume</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile compact gate keeps action, risk, payload, approver rule, and timeout visible.")}>Mobile compact gate</button>
      </div>
      <HumanApprovalGatePanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function HumanApprovalGateBadUx() {
  type Mode = "blind-approve" | "post-action-audit" | "stale-notification" | "any-viewer" | "confidence-only" | "stuck-rejection" | "hidden-resume";
  const [mode, setMode] = useState<Mode>("blind-approve");
  const copy: Record<Mode, string> = {
    "blind-approve": "Approve appears without the exact action, payload snapshot, risk, approver rule, or resume consequence.",
    "post-action-audit": "The UI records human approval after the tool call already ran, so it is audit rather than a gate.",
    "stale-notification": "An old notification can approve a changed payload without opening the current gate.",
    "any-viewer": "Any viewer can approve even though the gate requires a specific role and separation of duties.",
    "confidence-only": "A confidence score replaces the human authorization decision and hides the armed action.",
    "stuck-rejection": "Reject leaves the automation suspended forever with no cancel, retry, revise, or fallback path.",
    "hidden-resume": "Users cannot tell which step will resume or whether future steps are also authorized."
  };
  const labels: Record<Mode, string[]> = {
    "blind-approve": ["Blind approve", "No payload", "No risk", "No resume"],
    "post-action-audit": ["Action ran", "Audit later", "No pause", "No gate"],
    "stale-notification": ["Old email", "Changed payload", "Still approve", "Unsafe resume"],
    "any-viewer": ["Any viewer", "No role check", "Self approval", "Policy bypass"],
    "confidence-only": ["91% confident", "No human gate", "No payload", "No control"],
    "stuck-rejection": ["Rejected", "Still paused", "No fallback", "No cancel"],
    "hidden-resume": ["Approve run", "Unknown step", "Future actions", "Scope hidden"]
  };

  return (
    <div className={`quality-example human-approval-gate-bad-demo is-${mode}`}>
      <div className="human-approval-gate-blind-card">{mode === "confidence-only" ? "91% confident" : "Approval needed"}</div>
      <div className="human-approval-gate-broken-grid" aria-label="Broken human approval gate">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "post-action-audit" ? "Post-action audit" : mode === "stale-notification" ? "Stale notification" : "Gate failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row human-approval-gate-controls">
        <button type="button" className={mode === "blind-approve" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blind-approve")}>Blind approve</button>
        <button type="button" className={mode === "post-action-audit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("post-action-audit")}>Post-action audit</button>
        <button type="button" className={mode === "stale-notification" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale-notification")}>Stale notification</button>
        <button type="button" className={mode === "any-viewer" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("any-viewer")}>Any-viewer approval</button>
        <button type="button" className={mode === "confidence-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confidence-only")}>Confidence-only gate</button>
        <button type="button" className={mode === "stuck-rejection" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stuck-rejection")}>Stuck rejection</button>
        <button type="button" className={mode === "hidden-resume" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-resume")}>Hidden resume</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HumanApprovalGateGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HumanApprovalGateBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HumanApprovalGateGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <HumanApprovalGateBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
