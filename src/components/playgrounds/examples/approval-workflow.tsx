import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ApprovalWorkflowStage = "draft" | "submitted" | "route" | "selfReview" | "managerApproved" | "parallel" | "changes" | "rejected" | "delegated" | "timeout" | "approved" | "bypassed";

function ApprovalWorkflowFrame({
  stage = "submitted",
  rule = "Sequential: manager, release manager, production owner",
  approver = "Priya Rao",
  status = "Pending",
  idSuffix = "demo"
}: {
  stage?: ApprovalWorkflowStage;
  rule?: string;
  approver?: string;
  status?: string;
  idSuffix?: string;
}) {
  const title: Record<ApprovalWorkflowStage, string> = {
    draft: "Deployment request ready for approval",
    submitted: "Approval record APR-2048 submitted",
    route: "Release route calculated",
    selfReview: "Self-review blocked",
    managerApproved: "Manager approved, next gate waiting",
    parallel: "Security and SRE approval in parallel",
    changes: "Changes requested by approver",
    rejected: "Request rejected with reason",
    delegated: "Approval delegated to backup owner",
    timeout: "Approval timed out before due date",
    approved: "All required approvals complete",
    bypassed: "Admin bypass recorded"
  };
  const message: Record<ApprovalWorkflowStage, string> = {
    draft: "The requester checks the deployment summary before submitting it into a governed route.",
    submitted: "Submitting creates one durable approval record with version, requester, approver rule, due date, and downstream action.",
    route: "The rule identifies who can decide and whether approval is sequential, parallel, threshold, or external.",
    selfReview: "The requester is in the release manager group, but protected production gates require a different reviewer.",
    managerApproved: "Priya approved the business gate; the request now waits for Omar from Release managers.",
    parallel: "Security and SRE are both active. This route completes only after both teams approve or one rejects.",
    changes: "The approver asks for rollback evidence and returns the same record to the requester for revision.",
    rejected: "The request is stopped with a required reason and a revise path that preserves attachments.",
    delegated: "Priya is unavailable, so the approval is delegated to Omar with an audit note.",
    timeout: "The due date passed, downstream deployment is blocked, and escalation is available.",
    approved: "All gates passed and only now can the production deployment proceed.",
    bypassed: "An admin bypassed the gate with an incident reason; the timeline keeps the override visible."
  };
  const rows = [
    { label: "Requester", value: "Alex Kim", state: stage === "selfReview" ? "Cannot approve" : "Submitted" },
    { label: "Object", value: "payments-api to production", state: "Version v42.7" },
    { label: "Rule", value: rule, state: stage === "parallel" ? "All required" : "Enforced" },
    { label: "Current owner", value: approver, state: stage === "approved" ? "Complete" : stage === "timeout" ? "Escalate" : status }
  ];
  const timeline = [
    stage === "draft" ? "Draft summary prepared" : "APR-2048 submitted",
    stage === "selfReview" ? "Self-review denied by policy" : "Route matched production protection rule",
    stage === "managerApproved" || stage === "parallel" || stage === "approved" ? "Manager approval recorded" : "Waiting for first decision",
    stage === "changes" ? "Changes requested: add rollback proof" : stage === "rejected" ? "Rejected: missing incident plan" : stage === "delegated" ? "Delegated to backup owner" : stage === "timeout" ? "Timed out, deployment blocked" : stage === "bypassed" ? "Bypass reason captured" : stage === "approved" ? "Released to downstream job" : "Next gate pending"
  ];

  return (
    <div className={`approval-workflow-frame is-${stage}`}>
      <section className="approval-workflow-record" aria-labelledby={`approval-workflow-title-${idSuffix}`}>
        <div className="approval-workflow-heading">
          <span>Approval request</span>
          <strong>{status}</strong>
        </div>
        <h4 id={`approval-workflow-title-${idSuffix}`}>{title[stage]}</h4>
        <p>{message[stage]}</p>
        <div className="approval-workflow-fields">
          {rows.map((row) => (
            <div className={row.state === "Cannot approve" || row.state === "Escalate" ? "needs-action" : row.state === "Complete" ? "is-complete" : ""} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <em>{row.state}</em>
            </div>
          ))}
        </div>
        <div className="approval-workflow-actions" aria-label="Approver decision preview">
          <span>Approve</span>
          <span>Reject with reason</span>
          <span>Request changes</span>
        </div>
      </section>
      <aside className="approval-workflow-route" aria-label="Approval timeline">
        <strong>Route timeline</strong>
        <ol>
          {timeline.map((item) => <li key={item}>{item}</li>)}
        </ol>
        <p>{stage === "changes" || stage === "rejected" ? "Requester can revise the same record without losing comments or attachments." : "Every decision keeps actor, time, route rule, version, and comment context."}</p>
      </aside>
    </div>
  );
}

function ApprovalWorkflowGoodUi() {
  return (
    <div className="quality-example approval-workflow-demo">
      <ApprovalWorkflowFrame />
      <p className="demo-status">The approval record names the requester, target, route rule, current approver, due state, decisions, and audit timeline before downstream work can proceed.</p>
    </div>
  );
}

function ApprovalWorkflowBadUi() {
  return (
    <div className="bad-ui-sample approval-workflow-bad-demo is-blindApprove">
      <strong>Needs approval</strong>
      <div className="approval-workflow-bad-grid">
        {["Approve", "Reject", "No requester", "No rule", "No version", "No reason"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken surface asks for a decision without the request summary, approver rule, current version, due date, reason field, or route status.</p>
    </div>
  );
}

function ApprovalWorkflowGoodUx() {
  const [stage, setStage] = useState<ApprovalWorkflowStage>("submitted");
  const [rule, setRule] = useState("Sequential: manager, release manager, production owner");
  const [approver, setApprover] = useState("Priya Rao");
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("Submitting creates APR-2048 and blocks production deployment until required approval conditions pass.");

  function choose(nextStage: ApprovalWorkflowStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example approval-workflow-demo">
      <ApprovalWorkflowFrame stage={stage} rule={rule} approver={approver} status={status} idSuffix="good-ux" />
      <div className="demo-row approval-workflow-controls" aria-label="Approval workflow exercise controls">
        <button type="button" className={stage === "draft" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRule("Sequential: manager, release manager, production owner");
          setApprover("Priya Rao");
          setStatus("Ready");
          choose("draft", "The requester sees the exact production deployment before it enters a routed approval workflow.");
        }}>Draft</button>
        <button type="button" className={stage === "submitted" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Pending");
          choose("submitted", "Submit creates one approval record with route, due date, requester, version, and downstream deployment attached.");
        }}>Submit</button>
        <button type="button" className={stage === "route" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRule("Production gate: one release manager, no self-review");
          setApprover("Release managers");
          setStatus("Pending");
          choose("route", "Route calculation shows the eligible group and policy before anyone can approve.");
        }}>Route</button>
        <button type="button" className={stage === "selfReview" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRule("Protected environment, self-review disabled");
          setApprover("Omar Singh");
          setStatus("Blocked");
          choose("selfReview", "Alex cannot approve their own deployment; the request remains pending for another eligible reviewer.");
        }}>Self-review</button>
        <button type="button" className={stage === "managerApproved" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRule("Sequential: manager approved, release manager next");
          setApprover("Omar Singh");
          setStatus("Pending");
          choose("managerApproved", "The first approval advances the route but does not release production until later gates pass.");
        }}>Next gate</button>
        <button type="button" className={stage === "parallel" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setRule("Parallel: Security and SRE both approve");
          setApprover("Security + SRE");
          setStatus("2 needed");
          choose("parallel", "Parallel approval states show whether everyone, first response, or threshold rules control completion.");
        }}>Parallel</button>
        <button type="button" className={stage === "changes" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Changes");
          choose("changes", "Request changes preserves comments and attachments and returns the same record to the requester for revision.");
        }}>Changes</button>
        <button type="button" className={stage === "rejected" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Rejected");
          choose("rejected", "Reject requires a reason, stops downstream work, and gives the requester a revise or close path.");
        }}>Reject</button>
        <button type="button" className={stage === "delegated" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setApprover("Mina Patel");
          setStatus("Delegated");
          choose("delegated", "Delegation changes the current approver while preserving who delegated and why.");
        }}>Delegate</button>
        <button type="button" className={stage === "timeout" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Timed out");
          choose("timeout", "Timeout blocks deployment and offers escalation instead of leaving the request waiting forever.");
        }}>Timeout</button>
        <button type="button" className={stage === "approved" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Approved");
          choose("approved", "Only after every required gate passes does the downstream production deployment proceed.");
        }}>Approved</button>
        <button type="button" className={stage === "bypassed" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Bypassed");
          choose("bypassed", "Admin bypass requires an incident reason and remains visible in the route timeline.");
        }}>Bypass</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ApprovalWorkflowBadUx() {
  type Mode = "blindApprove" | "firstDone" | "noReason" | "selfApprove" | "lostRevision" | "staleEmail";
  const [mode, setMode] = useState<Mode>("blindApprove");
  const copy: Record<Mode, string> = {
    blindApprove: "Approvers are asked to approve without request version, impact, attachments, route rule, or due date.",
    firstDone: "The first approval releases production even though the route required manager and release approval.",
    noReason: "Reject works without a reason, so the requester cannot tell what must change.",
    selfApprove: "The requester approves their own protected deployment despite the no-self-review policy.",
    lostRevision: "Requested changes start a blank request and lose comments, files, and prior decisions.",
    staleEmail: "An old email approval applies after the deployment version changed."
  };
  const labels: Record<Mode, string[]> = {
    blindApprove: ["Approve", "No summary", "No rule"],
    firstDone: ["1 of 3", "Released", "Route ignored"],
    noReason: ["Rejected", "No comment", "No revise step"],
    selfApprove: ["Requester", "Approver", "Same person"],
    lostRevision: ["Changes", "Blank form", "Files gone"],
    staleEmail: ["Old email", "Version v41", "Applied to v42"]
  };
  return (
    <div className={`quality-example approval-workflow-bad-demo is-${mode}`}>
      <strong>{mode === "firstDone" ? "Approved" : mode === "staleEmail" ? "Email decision" : "Approval request"}</strong>
      <div className="approval-workflow-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row approval-workflow-controls">
        <button type="button" className={mode === "blindApprove" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("blindApprove")}>Blind approve</button>
        <button type="button" className={mode === "firstDone" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("firstDone")}>First done</button>
        <button type="button" className={mode === "noReason" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noReason")}>No reason</button>
        <button type="button" className={mode === "selfApprove" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("selfApprove")}>Self approve</button>
        <button type="button" className={mode === "lostRevision" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostRevision")}>Lost revision</button>
        <button type="button" className={mode === "staleEmail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleEmail")}>Stale email</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ApprovalWorkflowGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ApprovalWorkflowBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ApprovalWorkflowGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ApprovalWorkflowBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
