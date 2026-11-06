import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AiOutputAuditTrailState =
  | "outputGenerated"
  | "promptSnapshot"
  | "responseSnapshot"
  | "responseId"
  | "modelVersion"
  | "systemInstruction"
  | "sourceSnapshot"
  | "retrievedContext"
  | "toolCallRecord"
  | "safetyEvent"
  | "confidenceAtTime"
  | "userViewed"
  | "copiedOutput"
  | "editedOutput"
  | "appliedOutput"
  | "approvedOutput"
  | "rejectedOutput"
  | "regeneratedOutput"
  | "versionChain"
  | "redactedContent"
  | "retentionWindow"
  | "exportEvidence"
  | "investigationFilter"
  | "permissionLimited"
  | "tamperEvidence"
  | "deletionRequest"
  | "mobile";

type AiOutputAuditTrailCopy = {
  label: string;
  message: string;
  prompt: string;
  response: string;
  source: string;
  tool: string;
  action: string;
  retention: string;
  tone: "ready" | "working" | "warning" | "danger" | "neutral";
};

const aiOutputAuditTrailCopy: Record<AiOutputAuditTrailState, AiOutputAuditTrailCopy> = {
  outputGenerated: {
    label: "Output generated",
    message: "Output generated starts the record when the system creates a generated answer.",
    prompt: "Quarterly risk summary request",
    response: "Generated answer v1",
    source: "Policy and ticket snapshots",
    tool: "Search completed",
    action: "Generation recorded",
    retention: "365-day workspace retention",
    tone: "ready"
  },
  promptSnapshot: {
    label: "Prompt snapshot",
    message: "Prompt snapshot preserves the user request and relevant system instruction reference.",
    prompt: "Summarize escalation risk for region C",
    response: "Answer linked to prompt",
    source: "Sources frozen after retrieval",
    tool: "No tool inputs hidden",
    action: "Prompt view permissioned",
    retention: "Legal hold eligible",
    tone: "working"
  },
  responseSnapshot: {
    label: "Response snapshot",
    message: "Response snapshot stores the exact answer that the user saw before edits or approval.",
    prompt: "Stored prompt pair",
    response: "Exact generated response",
    source: "Citations locked to version",
    tool: "Tool result hash saved",
    action: "Viewed by reviewer",
    retention: "Exportable evidence",
    tone: "ready"
  },
  responseId: {
    label: "Response ID",
    message: "Response ID gives support, audit, and review teams a stable generated-output key.",
    prompt: "Prompt linked to resp_72K",
    response: "resp_72K9 audit key",
    source: "Source set src_18",
    tool: "Search run tool_11",
    action: "Copied response ID",
    retention: "ID retained after redaction",
    tone: "neutral"
  },
  modelVersion: {
    label: "Model version",
    message: "Model version records the model used when the output was generated.",
    prompt: "Prompt stored unchanged",
    response: "Answer from model gpt-4.1",
    source: "Same sources as generation",
    tool: "Tool policy version shown",
    action: "Model visible to reviewer",
    retention: "Version retained with answer",
    tone: "working"
  },
  systemInstruction: {
    label: "System instruction reference",
    message: "System instruction reference connects the answer to the governing policy or assistant configuration.",
    prompt: "User prompt plus sys_04",
    response: "Response follows sys_04",
    source: "Retrieval scope explained",
    tool: "Allowed tools listed",
    action: "Config reviewed",
    retention: "Instruction ref retained",
    tone: "working"
  },
  sourceSnapshot: {
    label: "Source snapshot",
    message: "Source snapshot keeps evidence durable even when the current document later changes.",
    prompt: "Prompt tied to sources",
    response: "Answer cites source version",
    source: "Policy.pdf at 10:31",
    tool: "Search index timestamp",
    action: "Source opened",
    retention: "Snapshot under hold",
    tone: "ready"
  },
  retrievedContext: {
    label: "Retrieved context",
    message: "Retrieved context shows which passages were available to the model at generation time.",
    prompt: "Question about escalation",
    response: "Answer grounded in snippets",
    source: "Three retrieved passages",
    tool: "Vector search result set",
    action: "Context inspected",
    retention: "Context hash preserved",
    tone: "working"
  },
  toolCallRecord: {
    label: "Tool call record",
    message: "Tool call record preserves inputs, outputs, redaction state, and side-effect status.",
    prompt: "Find open escalations",
    response: "Answer used CRM search",
    source: "CRM result snapshot",
    tool: "crm.search read-only",
    action: "Tool result reviewed",
    retention: "Inputs redacted as needed",
    tone: "warning"
  },
  safetyEvent: {
    label: "Safety event",
    message: "Safety event records filtering, blocked content, policy limit, or reviewer escalation.",
    prompt: "High-impact request",
    response: "Restricted content omitted",
    source: "Sensitive field excluded",
    tool: "No write tool allowed",
    action: "Safety review required",
    retention: "Event retained for audit",
    tone: "danger"
  },
  confidenceAtTime: {
    label: "Confidence at time",
    message: "Confidence at time preserves the reliability signal that was visible before action.",
    prompt: "Forecast risk summary",
    response: "Low confidence noted",
    source: "Two stale documents",
    tool: "Search warning included",
    action: "Reviewer paused use",
    retention: "Signal retained with version",
    tone: "warning"
  },
  userViewed: {
    label: "User viewed",
    message: "User viewed records who saw the generated output before copying, editing, or applying it.",
    prompt: "Prompt visible to actor",
    response: "Viewed answer v1",
    source: "Sources available",
    tool: "Tool card expanded",
    action: "Aditi Rao viewed",
    retention: "Actor and time retained",
    tone: "neutral"
  },
  copiedOutput: {
    label: "Copied output",
    message: "Copied output distinguishes viewing an answer from taking text outside the AI surface.",
    prompt: "Prompt pair retained",
    response: "Answer copied to clipboard",
    source: "Citation list copied",
    tool: "No side effect executed",
    action: "Copied output",
    retention: "Copy event retained",
    tone: "warning"
  },
  editedOutput: {
    label: "Edited output",
    message: "Edited output preserves the generated version and the user-edited version separately.",
    prompt: "Original prompt retained",
    response: "Edited answer v2",
    source: "Citations checked",
    tool: "No rerun",
    action: "User edited output",
    retention: "Original and edit retained",
    tone: "working"
  },
  appliedOutput: {
    label: "Applied output",
    message: "Applied output records when generated text changed a downstream object.",
    prompt: "Prompt tied to object",
    response: "Answer applied to case note",
    source: "Sources attached",
    tool: "Write tool executed",
    action: "Applied output",
    retention: "Object link retained",
    tone: "danger"
  },
  approvedOutput: {
    label: "Approved output",
    message: "Approved output records what the approver saw before allowing use.",
    prompt: "Prompt visible in review",
    response: "Approved answer v2",
    source: "Source list reviewed",
    tool: "Tool output reviewed",
    action: "Manager approved output",
    retention: "Approval evidence kept",
    tone: "ready"
  },
  rejectedOutput: {
    label: "Rejected output",
    message: "Rejected output records the decision and prevents the same answer from looking active.",
    prompt: "Prompt retained",
    response: "Rejected answer v1",
    source: "Wrong source flagged",
    tool: "No downstream write",
    action: "Reviewer rejected output",
    retention: "Reason retained",
    tone: "warning"
  },
  regeneratedOutput: {
    label: "Regenerated output",
    message: "Regenerated output links the new answer to the prior answer and prompt context.",
    prompt: "Same prompt rerun",
    response: "Answer v2 regenerated",
    source: "Source set changed",
    tool: "Search rerun",
    action: "Regenerated output",
    retention: "Both versions retained",
    tone: "working"
  },
  versionChain: {
    label: "Version chain",
    message: "Version chain shows generated, regenerated, edited, approved, and applied versions together.",
    prompt: "Prompt anchors chain",
    response: "v1 to v2 to applied",
    source: "Source changes visible",
    tool: "Tool runs attached",
    action: "Compare versions",
    retention: "Chain retained",
    tone: "ready"
  },
  redactedContent: {
    label: "Redacted content",
    message: "Redacted content hides sensitive data while preserving enough audit structure to investigate.",
    prompt: "Secret token redacted",
    response: "Private field redacted",
    source: "Restricted source masked",
    tool: "Tool input masked",
    action: "Auditor sees reason",
    retention: "Redaction reason retained",
    tone: "danger"
  },
  retentionWindow: {
    label: "Retention window",
    message: "Retention window explains how long generated-output evidence remains available.",
    prompt: "Prompt retained 365 days",
    response: "Response retained 365 days",
    source: "Source snapshot expires later",
    tool: "Tool record retained",
    action: "Owner can extend hold",
    retention: "365 days plus legal hold",
    tone: "neutral"
  },
  exportEvidence: {
    label: "Export evidence",
    message: "Export evidence packages prompt, response, source, tool, actor, and action details for review.",
    prompt: "Prompt included",
    response: "Response included",
    source: "Sources included",
    tool: "Tool calls included",
    action: "Export evidence",
    retention: "Export logged",
    tone: "ready"
  },
  investigationFilter: {
    label: "Investigation filter",
    message: "Investigation filter lets reviewers find records by actor, response ID, object, source, or event type.",
    prompt: "Filter by prompt term",
    response: "Filter by response ID",
    source: "Filter by source",
    tool: "Filter by tool",
    action: "Filter copied output",
    retention: "Filter export retained",
    tone: "working"
  },
  permissionLimited: {
    label: "Permission-limited view",
    message: "Permission-limited view shows the audit shape without exposing content the reviewer cannot access.",
    prompt: "Prompt content restricted",
    response: "Response visible by role",
    source: "Source title only",
    tool: "Tool input redacted",
    action: "Access request available",
    retention: "Access decision retained",
    tone: "warning"
  },
  tamperEvidence: {
    label: "Tamper evidence",
    message: "Tamper evidence flags missing records, hash mismatch, or altered exports.",
    prompt: "Prompt hash verified",
    response: "Response hash verified",
    source: "Source hash changed",
    tool: "Tool output hash checked",
    action: "Tamper evidence raised",
    retention: "Integrity event retained",
    tone: "danger"
  },
  deletionRequest: {
    label: "Deletion request",
    message: "Deletion request records erasure workflow, policy exceptions, redaction, and retained audit proof.",
    prompt: "Prompt scheduled for removal",
    response: "Response redacted",
    source: "Source snapshot removed",
    tool: "Tool data masked",
    action: "Deletion request opened",
    retention: "Minimal proof retained",
    tone: "warning"
  },
  mobile: {
    label: "Mobile compact trail",
    message: "Mobile compact trail keeps response ID, prompt, response, source, action, and export controls readable.",
    prompt: "Prompt card collapsed",
    response: "Response card expanded",
    source: "Source chips wrap",
    tool: "Tool details drawer",
    action: "Tap to export",
    retention: "Retention chip visible",
    tone: "ready"
  }
};

function AiOutputAuditTrailPanel({ state }: { state: AiOutputAuditTrailState }) {
  const copy = aiOutputAuditTrailCopy[state];

  return (
    <section className={`ai-audit-shell is-${copy.tone}`} aria-label="AI output audit trail">
      <header className="ai-audit-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="ai-audit-state">Generated-output lineage</span>
      </header>
      <div className="ai-audit-hero">
        <span>AI output audit trail</span>
        <p>The trail connects prompt snapshot, response snapshot, response ID, model version, system instruction reference, source snapshot, retrieved context, tool call record, safety event, confidence at time, user actions, and retention.</p>
      </div>
      <div className="ai-audit-grid" aria-label="AI output audit trail details">
        <span><b>Response ID</b>resp_72K9</span>
        <span><b>Prompt snapshot</b>{copy.prompt}</span>
        <span><b>Response snapshot</b>{copy.response}</span>
        <span><b>Model version</b>gpt-4.1 - policy pack 18</span>
        <span><b>Source snapshot</b>{copy.source}</span>
        <span><b>Tool call record</b>{copy.tool}</span>
        <span><b>User action</b>{copy.action}</span>
        <span><b>Retention window</b>{copy.retention}</span>
      </div>
      <div className="ai-audit-path" aria-label="Audit trail path">
        <span>Prompt</span>
        <span>Response</span>
        <span>Sources</span>
        <span>Tools</span>
        <span>Safety</span>
        <span>Actions</span>
        <span>Export</span>
      </div>
      <div className="ai-audit-actions">
        <button type="button" className="demo-button small">Compare versions</button>
        <button type="button" className="demo-button small primary">Export evidence</button>
        <button type="button" className="demo-button small">Copy response ID</button>
        <button type="button" className="demo-button small">Request access</button>
      </div>
    </section>
  );
}

function AiOutputAuditTrailGoodUi() {
  return (
    <div className="quality-example ai-audit-demo">
      <AiOutputAuditTrailPanel state="outputGenerated" />
      <p className="demo-status">The AI output audit trail shows output generated, prompt snapshot, response snapshot, response ID, model version, system instruction reference, source snapshot, retrieved context, tool call record, safety event, confidence at time, user viewed, copied output, edited output, applied output, approved output, rejected output, regenerated output, version chain, redacted content, retention window, export evidence, investigation filter, permission-limited view, tamper evidence, deletion request, and mobile compact trail states.</p>
    </div>
  );
}

function AiOutputAuditTrailBadUi() {
  return (
    <div className="bad-ui-sample ai-audit-bad-demo is-answer-only">
      <div className="ai-audit-bad-card">Here is the answer</div>
      <div className="ai-audit-broken-grid" aria-label="Broken AI output audit trail">
        <span>Answer-only</span>
        <span>Missing-prompt</span>
        <span>Source-drift</span>
        <span>Retention-mystery</span>
      </div>
      <p>The broken UI hides prompt snapshot, response snapshot, response ID, model version, system instruction reference, source snapshot, retrieved context, tool call record, safety event, confidence at time, user viewed, copied output, edited output, applied output, approved output, rejected output, regenerated output, version chain, redacted content, retention window, export evidence, investigation filter, permission-limited view, tamper evidence, and deletion request.</p>
    </div>
  );
}

function AiOutputAuditTrailGoodUx() {
  const [state, setState] = useState<AiOutputAuditTrailState>("outputGenerated");
  const [message, setMessage] = useState("Output generated starts the record when the system creates a generated answer.");
  const choose = (next: AiOutputAuditTrailState, note: string) => {
    setState(next);
    setMessage(note);
  };
  const states: Array<[AiOutputAuditTrailState, string, string]> = [
    ["outputGenerated", "Output generated", "Output generated starts the record when the system creates a generated answer."],
    ["promptSnapshot", "Prompt snapshot", "Prompt snapshot preserves the user request and relevant system instruction reference."],
    ["responseSnapshot", "Response snapshot", "Response snapshot stores the exact answer that the user saw before edits or approval."],
    ["responseId", "Response ID", "Response ID gives support, audit, and review teams a stable generated-output key."],
    ["modelVersion", "Model version", "Model version records the model used when the output was generated."],
    ["systemInstruction", "System instruction reference", "System instruction reference connects the answer to the governing policy or assistant configuration."],
    ["sourceSnapshot", "Source snapshot", "Source snapshot keeps evidence durable even when the current document later changes."],
    ["retrievedContext", "Retrieved context", "Retrieved context shows which passages were available to the model at generation time."],
    ["toolCallRecord", "Tool call record", "Tool call record preserves inputs, outputs, redaction state, and side-effect status."],
    ["safetyEvent", "Safety event", "Safety event records filtering, blocked content, policy limit, or reviewer escalation."],
    ["confidenceAtTime", "Confidence at time", "Confidence at time preserves the reliability signal that was visible before action."],
    ["userViewed", "User viewed", "User viewed records who saw the generated output before copying, editing, or applying it."],
    ["copiedOutput", "Copied output", "Copied output distinguishes viewing an answer from taking text outside the AI surface."],
    ["editedOutput", "Edited output", "Edited output preserves the generated version and the user-edited version separately."],
    ["appliedOutput", "Applied output", "Applied output records when generated text changed a downstream object."],
    ["approvedOutput", "Approved output", "Approved output records what the approver saw before allowing use."],
    ["rejectedOutput", "Rejected output", "Rejected output records the decision and prevents the same answer from looking active."],
    ["regeneratedOutput", "Regenerated output", "Regenerated output links the new answer to the prior answer and prompt context."],
    ["versionChain", "Version chain", "Version chain shows generated, regenerated, edited, approved, and applied versions together."],
    ["redactedContent", "Redacted content", "Redacted content hides sensitive data while preserving enough audit structure to investigate."],
    ["retentionWindow", "Retention window", "Retention window explains how long generated-output evidence remains available."],
    ["exportEvidence", "Export evidence", "Export evidence packages prompt, response, source, tool, actor, and action details for review."],
    ["investigationFilter", "Investigation filter", "Investigation filter lets reviewers find records by actor, response ID, object, source, or event type."],
    ["permissionLimited", "Permission-limited view", "Permission-limited view shows the audit shape without exposing content the reviewer cannot access."],
    ["tamperEvidence", "Tamper evidence", "Tamper evidence flags missing records, hash mismatch, or altered exports."],
    ["deletionRequest", "Deletion request", "Deletion request records erasure workflow, policy exceptions, redaction, and retained audit proof."],
    ["mobile", "Mobile compact trail", "Mobile compact trail keeps response ID, prompt, response, source, action, and export controls readable."]
  ];

  return (
    <div className="quality-example ai-audit-demo">
      <div className="ai-audit-controls" aria-label="AI output audit trail exercise controls">
        {states.map(([next, label, note]) => (
          <button key={next} type="button" className={state === next ? "demo-button small primary" : "demo-button small"} onClick={() => choose(next, note)}>{label}</button>
        ))}
      </div>
      <AiOutputAuditTrailPanel state={state} />
      <p className="demo-status" aria-live="polite">{message} The trail keeps prompt snapshot, response snapshot, response ID, model version, source snapshot, retrieved context, tool call record, safety event, confidence at time, user actions, version chain, redacted content, retention window, export evidence, investigation filter, permission-limited view, tamper evidence, and deletion request visible.</p>
    </div>
  );
}

function AiOutputAuditTrailBadUx() {
  type Mode = "answer-only" | "missing-prompt" | "source-drift" | "editable-no-history" | "audit-after-action-only" | "raw-secret-log" | "retention-mystery";
  const [mode, setMode] = useState<Mode>("answer-only");
  const copy: Record<Mode, string> = {
    "answer-only": "Answer-only keeps generated text but loses prompt snapshot, response ID, model version, sources, tools, actions, and export evidence.",
    "missing-prompt": "Missing-prompt records a response but cannot prove what user request or system instruction reference shaped it.",
    "source-drift": "Source-drift points to the current document instead of the source snapshot and retrieved context used at generation time.",
    "editable-no-history": "Editable-no-history allows user changes without preserving generated, edited, approved, applied, or rejected versions.",
    "audit-after-action-only": "Audit-after-action-only logs downstream changes but loses user viewed, copied output, confidence at time, and approval context.",
    "raw-secret-log": "Raw-secret-log exposes sensitive prompt, response, source, or tool data instead of using redacted content and permission-limited view.",
    "retention-mystery": "Retention-mystery hides retention window, deletion request status, export evidence, and tamper evidence."
  };
  const labels: Record<Mode, string[]> = {
    "answer-only": ["Answer-only", "No response ID", "No model version", "No export evidence"],
    "missing-prompt": ["Missing-prompt", "No prompt snapshot", "No system instruction", "No request context"],
    "source-drift": ["Source-drift", "Current source only", "No retrieved context", "No source snapshot"],
    "editable-no-history": ["Editable-no-history", "No original", "No edited version", "No approval link"],
    "audit-after-action-only": ["Audit-after-action-only", "No user viewed", "No copied output", "No confidence at time"],
    "raw-secret-log": ["Raw-secret-log", "Sensitive prompt shown", "Tool secrets exposed", "No redaction"],
    "retention-mystery": ["Retention-mystery", "No retention window", "No deletion request", "No tamper evidence"]
  };

  return (
    <div className={`quality-example ai-audit-bad-demo is-${mode}`}>
      <div className="ai-audit-bad-card">{mode === "raw-secret-log" ? "Full raw transcript" : "Generated answer"}</div>
      <div className="ai-audit-broken-grid" aria-label="Broken AI output audit trail">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "raw-secret-log" ? "Audit trail leaks restricted content" : "AI output audit trail failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row ai-audit-controls">
        <button type="button" className={mode === "answer-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("answer-only")}>Answer-only</button>
        <button type="button" className={mode === "missing-prompt" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("missing-prompt")}>Missing-prompt</button>
        <button type="button" className={mode === "source-drift" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("source-drift")}>Source-drift</button>
        <button type="button" className={mode === "editable-no-history" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("editable-no-history")}>Editable-no-history</button>
        <button type="button" className={mode === "audit-after-action-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("audit-after-action-only")}>Audit-after-action-only</button>
        <button type="button" className={mode === "raw-secret-log" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("raw-secret-log")}>Raw-secret-log</button>
        <button type="button" className={mode === "retention-mystery" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("retention-mystery")}>Retention-mystery</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiOutputAuditTrailGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiOutputAuditTrailBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiOutputAuditTrailGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AiOutputAuditTrailBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
