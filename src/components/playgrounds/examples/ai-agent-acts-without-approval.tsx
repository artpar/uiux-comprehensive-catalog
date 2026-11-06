import { useState } from "react";
import { QualityPanel, patternMeta, type PatternMeta } from './shared';

type AiAgentApprovalState = "readOnly" | "approvalRequired" | "payloadPreview" | "eligibleApprover" | "selfReviewBlocked" | "approveResume" | "editBeforeApprove" | "reject" | "cancel" | "staleRefused" | "emergencyBypass" | "rollbackAvailable";

type AiAgentApprovalCopy = {
  title: string;
  status: string;
  tone: "ready" | "working" | "warning" | "danger";
  agentStep: string;
  payload: string;
  authorization: string;
  recovery: string;
  facts: string[];
};

const aiAgentApprovalCopy: Record<AiAgentApprovalState, AiAgentApprovalCopy> = {
  readOnly: {
    title: "Read-only step allowed",
    status: "The agent can inspect account records and draft a recommendation, but side effects remain locked.",
    tone: "ready",
    agentStep: "Allowed step: read account profile, invoice history, and entitlement policy.",
    payload: "Draft payload: downgrade team plan and send a retention email, not yet executable.",
    authorization: "Authorization state: read-only tools allowed, write tools require approval.",
    recovery: "Next: request approval before changing plan, sending email, issuing credit, or editing access.",
    facts: ["Read-only step allowed", "No side effect", "Write tools locked", "Run R-7782", "Policy scope shown"]
  },
  approvalRequired: {
    title: "Approval required before side effect",
    status: "The agent stops before changing billing, access, messages, or customer-visible records.",
    tone: "working",
    agentStep: "Blocked step: billing.plan.update for customer C-4821.",
    payload: "Payload preview required before execution: downgrade from Pro to Team trial.",
    authorization: "Required approval: Account owner or Billing lead for this customer segment.",
    recovery: "Next: eligible approver can approve and resume only this side-effect step.",
    facts: ["Approval required before side effect", "Tool call blocked", "Payload version 3", "Approver required", "No broad Run"]
  },
  payloadPreview: {
    title: "Payload preview",
    status: "Approvers see the exact tool, customer, fields, message body, hash, and version before deciding.",
    tone: "working",
    agentStep: "Proposed tool: crm.customer.update followed by email.send.",
    payload: "Payload hash: 1fa9; fields: plan, credit, owner note, email subject, email body.",
    authorization: "Decision applies only to payload version 3 and expires when the payload changes.",
    recovery: "Next: edit before approve creates payload version 4 and reopens review.",
    facts: ["Payload preview", "Tool name visible", "Message body visible", "Hash 1fa9", "Version 3"]
  },
  eligibleApprover: {
    title: "Eligible approver",
    status: "The gate checks role, account relationship, threshold, and separation of duties before enabling approval.",
    tone: "ready",
    agentStep: "Pending step: apply billing credit and notify customer.",
    payload: "Payload preview: $320 service credit, renewal date changed to July 1, 2026.",
    authorization: "Eligible approver: Billing lead who did not start the agent run.",
    recovery: "Next: approved step resumes with an audit record of approver, role, reason, and payload hash.",
    facts: ["Eligible approver", "Role checked", "Separation of duties", "Threshold checked", "Reason required"]
  },
  selfReviewBlocked: {
    title: "Self-review blocked",
    status: "The requester cannot approve their own agent-run side effect.",
    tone: "danger",
    agentStep: "Blocked approval: requester started the account automation agent.",
    payload: "Payload remains visible but approve is disabled for this actor.",
    authorization: "Required: another Billing lead or Finance manager.",
    recovery: "Next: delegate the gate or reject the side-effect request.",
    facts: ["Self-review blocked", "Requester ineligible", "Approve disabled", "Delegate", "Policy enforced"]
  },
  approveResume: {
    title: "Approve and resume",
    status: "Approval revalidates payload freshness and resumes only the gated side-effect step.",
    tone: "ready",
    agentStep: "Resumed step: billing.plan.update for customer C-4821.",
    payload: "Approved payload version 3 matched hash 1fa9 at execution time.",
    authorization: "Approved by: Priya Rao, Billing lead, reason captured.",
    recovery: "Next: unrelated future tools still require their own approval gate.",
    facts: ["Approve and resume", "Freshness rechecked", "Only gated step", "Reason captured", "Audit recorded"]
  },
  editBeforeApprove: {
    title: "Edit before approve",
    status: "An approver can revise fields and force the agent to revalidate the payload before execution.",
    tone: "warning",
    agentStep: "Edited step: credit changed from $320 to $180.",
    payload: "New payload version 4 requires a fresh approval decision.",
    authorization: "Approval disabled until policy, role, and source checks rerun.",
    recovery: "Next: send revised payload back to the gate, not straight to the tool.",
    facts: ["Edit before approve", "Payload version 4", "Revalidation required", "Resume blocked", "Approver edit"]
  },
  reject: {
    title: "Reject",
    status: "Reject stops the side-effect step and records a reason the agent can use for a safer fallback.",
    tone: "danger",
    agentStep: "Rejected step: email.send to customer.",
    payload: "Rejected payload retained with source and policy context.",
    authorization: "Reason: account owner did not request a downgrade.",
    recovery: "Next: open manual review and keep read-only notes for the operator.",
    facts: ["Reject", "Reason required", "Side effect stopped", "Fallback opened", "Audit trail"]
  },
  cancel: {
    title: "Cancel",
    status: "Cancel terminates the pending side effect instead of leaving the agent waiting indefinitely.",
    tone: "danger",
    agentStep: "Canceled step: access.role.remove for teammate Alex.",
    payload: "Payload archived with cancel reason and run context.",
    authorization: "Cancel by: Customer success lead.",
    recovery: "Next: no tool call runs; agent can restart only with a new plan and approval.",
    facts: ["Cancel", "Terminal state", "No side effect", "Run stopped", "Restart requires plan"]
  },
  staleRefused: {
    title: "Stale approval refused",
    status: "An old approval link is refused because the payload, account state, or policy version changed.",
    tone: "danger",
    agentStep: "Refused step: billing.plan.update from stale email link.",
    payload: "Current account balance differs from payload hash 1fa9.",
    authorization: "Decision refused: approval expired and payload version 3 is no longer current.",
    recovery: "Next: refresh the gate, compare the new payload, and collect a fresh decision.",
    facts: ["Stale approval refused", "Payload changed", "Expired decision", "Refresh required", "No stale email"]
  },
  emergencyBypass: {
    title: "Emergency bypass",
    status: "A bypass is visible, rare, permissioned, and requires incident context before execution.",
    tone: "warning",
    agentStep: "Bypass step: suspend compromised integration token.",
    payload: "Payload preview remains visible with risk, customer impact, and rollback instructions.",
    authorization: "Allowed actor: Incident commander; reason and ticket ID required.",
    recovery: "Next: post-bypass review flags the exact actor, reason, and side effect.",
    facts: ["Emergency bypass", "Elevated permission", "Incident reason", "Ticket ID", "Visible audit"]
  },
  rollbackAvailable: {
    title: "Rollback available",
    status: "If an unauthorized side effect occurs, the UI exposes recovery rather than hiding behind a log.",
    tone: "warning",
    agentStep: "Recover step: revert plan change and revoke queued customer email.",
    payload: "Affected payload: plan downgrade, credit memo, email draft, access note.",
    authorization: "Recovery owner: Billing lead, with customer notice task opened.",
    recovery: "Next: run rollback, notify affected users, and preserve the incident audit.",
    facts: ["Rollback available", "Revert plan", "Cancel queued email", "Notify owner", "Audit recovery"]
  }
};

function AiAgentApprovalPanel({ state, meta }: { state: AiAgentApprovalState; meta: PatternMeta }) {
  const copy = aiAgentApprovalCopy[state];
  const canApprove = state === "approvalRequired" || state === "payloadPreview" || state === "eligibleApprover";

  return (
    <section className={`agent-no-approval-shell is-${copy.tone}`} aria-label="AI agent approval checkpoint">
      <header className="agent-no-approval-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="agent-no-approval-state">{state === "approveResume" ? "Resumed" : state === "reject" || state === "cancel" || state === "staleRefused" ? "Stopped" : state === "readOnly" ? "Read-only" : "Approval gate"}</span>
      </header>
      <div className="agent-no-approval-grid">
        <div className="agent-no-approval-card">
          <strong>{meta.subject}</strong>
          <span>{copy.agentStep}</span>
          <span>{copy.payload}</span>
        </div>
        <div className="agent-no-approval-card">
          <strong>{meta.field}</strong>
          <span>{copy.authorization}</span>
          <span>{copy.recovery}</span>
        </div>
      </div>
      <div className="agent-no-approval-facts" aria-label="Agent side-effect authorization facts">
        {copy.facts.map((fact) => <span key={fact}>{fact}</span>)}
      </div>
      <div className="agent-no-approval-actions">
        <button type="button" className={canApprove ? "demo-button small primary" : "demo-button small"} disabled={!canApprove}>Approve and resume</button>
        <button type="button" className="demo-button small">Edit before approve</button>
        <button type="button" className="demo-button small">Reject</button>
        <button type="button" className="demo-button small">Rollback</button>
      </div>
    </section>
  );
}

function AiAgentActsWithoutApprovalGoodUi() {
  const meta = patternMeta["ai-agent-acts-without-approval"];

  return (
    <div className="quality-example agent-no-approval-demo">
      <AiAgentApprovalPanel state="approvalRequired" meta={meta} />
      <p className="demo-status">The agent is allowed to inspect and draft, but the side-effect tool call pauses until an eligible human reviews the exact payload, approves the scoped step, or rejects it.</p>
    </div>
  );
}

function AiAgentActsWithoutApprovalBadUi() {
  return (
    <div className="bad-ui-sample agent-no-approval-bad-demo is-silent-execution">
      <div className="agent-no-approval-blind-card">I handled it</div>
      <div className="agent-no-approval-broken-grid" aria-label="Agent acting without approval">
        {["Refund sent", "Email sent", "No gate", "Audit later"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI shows the agent already changed billing and contacted the customer, so any human review is after the damage rather than authorization.</p>
    </div>
  );
}

function AiAgentActsWithoutApprovalGoodUx({ meta }: { meta: PatternMeta }) {
  const [state, setState] = useState<AiAgentApprovalState>("readOnly");
  const [message, setMessage] = useState("Read-only step allowed: the agent may inspect and draft, while side-effect tools stay locked until approval.");

  const choose = (next: AiAgentApprovalState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example agent-no-approval-demo">
      <div className="agent-no-approval-controls" aria-label="AI agent approval exercise controls">
        <button type="button" className={state === "readOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("readOnly", "Read-only step allowed keeps research and drafting separate from account-changing tool calls.")}>Read-only step allowed</button>
        <button type="button" className={state === "approvalRequired" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("approvalRequired", "Approval required before side effect blocks billing, access, messages, and records until a human authorizes the exact step.")}>Approval required before side effect</button>
        <button type="button" className={state === "payloadPreview" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("payloadPreview", "Payload preview shows the tool, fields, message body, hash, and version before approval.")}>Payload preview</button>
        <button type="button" className={state === "eligibleApprover" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("eligibleApprover", "Eligible approver checks role, threshold, account relationship, and separation of duties.")}>Eligible approver</button>
        <button type="button" className={state === "selfReviewBlocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("selfReviewBlocked", "Self-review blocked prevents the requester from approving their own agent-run side effect.")}>Self-review blocked</button>
        <button type="button" className={state === "approveResume" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("approveResume", "Approve and resume revalidates freshness and runs only the authorized side-effect step.")}>Approve and resume</button>
        <button type="button" className={state === "editBeforeApprove" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("editBeforeApprove", "Edit before approve creates a new payload version and requires a fresh gate.")}>Edit before approve</button>
        <button type="button" className={state === "reject" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reject", "Reject stops the side effect with a reason and opens a safer fallback.")}>Reject</button>
        <button type="button" className={state === "cancel" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("cancel", "Cancel terminates the pending side effect so the agent cannot resume silently later.")}>Cancel</button>
        <button type="button" className={state === "staleRefused" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("staleRefused", "Stale approval refused blocks an old email or notification from approving changed payloads.")}>Stale approval refused</button>
        <button type="button" className={state === "emergencyBypass" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("emergencyBypass", "Emergency bypass requires elevated permission, incident context, and a visible audit reason.")}>Emergency bypass</button>
        <button type="button" className={state === "rollbackAvailable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rollbackAvailable", "Rollback available exposes recovery for unauthorized side effects instead of hiding behind audit only.")}>Rollback available</button>
      </div>
      <AiAgentApprovalPanel state={state} meta={meta} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AiAgentActsWithoutApprovalBadUx() {
  type Mode = "silent-execution" | "broad-consent" | "hidden-tool-call" | "post-action-approval" | "stale-approval" | "self-approval" | "no-rollback" | "audit-only";
  const [mode, setMode] = useState<Mode>("silent-execution");
  const copy: Record<Mode, string> = {
    "silent-execution": "Silent execution lets the agent issue a refund, change access, and email the customer before any person sees the payload.",
    "broad-consent": "A broad Run button is treated as consent for future side effects that were never shown or approved.",
    "hidden-tool-call": "The interface hides the actual tool name and payload, so approval cannot be informed.",
    "post-action-approval": "Post-action approval asks for a signoff after the billing change already executed.",
    "stale-approval": "A stale email approves an older payload after account state and policy changed.",
    "self-approval": "The requester approves their own agent action with no separation of duties.",
    "no-rollback": "The agent changes the account and sends the email but offers no revert path or customer notice.",
    "audit-only": "The product relies on an audit log after execution instead of a pre-action authorization gate."
  };
  const labels: Record<Mode, string[]> = {
    "silent-execution": ["Silent execution", "Refund sent", "Email sent", "No approval"],
    "broad-consent": ["Broad consent", "Run all", "Future tools", "No payload"],
    "hidden-tool-call": ["Hidden tool call", "Tool masked", "Payload hidden", "Approve anyway"],
    "post-action-approval": ["Post-action approval", "Already changed", "Sign off now", "No pause"],
    "stale-approval": ["Stale approval", "Old email", "Changed account", "Still approve"],
    "self-approval": ["Self-approval", "Requester approves", "No role check", "Policy bypass"],
    "no-rollback": ["No rollback", "Credit posted", "Email delivered", "No recovery"],
    "audit-only": ["Audit-only", "Log after run", "No checkpoint", "Damage done"]
  };

  return (
    <div className={`quality-example agent-no-approval-bad-demo is-${mode}`}>
      <div className="agent-no-approval-blind-card">{mode === "post-action-approval" ? "Approve after run" : mode === "broad-consent" ? "Run everything" : "I handled it"}</div>
      <div className="agent-no-approval-broken-grid" aria-label="Broken agent approval model">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "post-action-approval" ? "Post-action approval" : mode === "stale-approval" ? "Stale approval" : mode === "audit-only" ? "Audit-only" : "Unauthorized side effect"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row agent-no-approval-controls">
        <button type="button" className={mode === "silent-execution" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silent-execution")}>Silent execution</button>
        <button type="button" className={mode === "broad-consent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("broad-consent")}>Broad consent</button>
        <button type="button" className={mode === "hidden-tool-call" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-tool-call")}>Hidden tool call</button>
        <button type="button" className={mode === "post-action-approval" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("post-action-approval")}>Post-action approval</button>
        <button type="button" className={mode === "stale-approval" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale-approval")}>Stale approval</button>
        <button type="button" className={mode === "self-approval" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("self-approval")}>Self-approval</button>
        <button type="button" className={mode === "no-rollback" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-rollback")}>No rollback</button>
        <button type="button" className={mode === "audit-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("audit-only")}>Audit-only</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiAgentActsWithoutApprovalGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiAgentActsWithoutApprovalBadUi />;
}

function GoodUxExample({ meta }: { patternId: string; meta: PatternMeta }) {
  return <AiAgentActsWithoutApprovalGoodUx meta={meta} />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiAgentActsWithoutApprovalBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
