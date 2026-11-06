import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ToolUseVisibilityState = "pending" | "running" | "succeeded" | "failed" | "denied" | "redactedInput" | "redactedOutput" | "rawPayload" | "sideEffectPreview" | "sideEffectExecuted" | "retry" | "stale" | "duplicate" | "mobile";

type ToolUseVisibilityCopy = {
  label: string;
  message: string;
  tool: string;
  status: string;
  permission: string;
  input: string;
  output: string;
  risk: string;
  detail: string;
  tone: "working" | "ready" | "warning" | "danger";
};

const toolUseVisibilityCopy: Record<ToolUseVisibilityState, ToolUseVisibilityCopy> = {
  pending: {
    label: "Pending tool call",
    message: "Pending tool call shows name, purpose, requested permission, and side-effect risk before execution.",
    tool: "CRM lookup",
    status: "Pending",
    permission: "Read account",
    input: "Account ID ACME-104",
    output: "No output yet",
    risk: "Read-only",
    detail: "Call ID T-41 waits for the current trace step.",
    tone: "working"
  },
  running: {
    label: "Running tool call",
    message: "Running tool call shows elapsed state and keeps cancel or details controls scoped to this call.",
    tool: "Knowledge search",
    status: "Running for 12s",
    permission: "Approved source scope",
    input: "Query: renewal discount policy",
    output: "Waiting for result",
    risk: "No side effect",
    detail: "Last event arrived 3 seconds ago.",
    tone: "working"
  },
  succeeded: {
    label: "Succeeded tool call",
    message: "Succeeded tool call summarizes returned data and links output to grounding or citations when used.",
    tool: "Web search",
    status: "Succeeded",
    permission: "Public web",
    input: "Search Acme annual report",
    output: "3 results returned, 1 used",
    risk: "No side effect",
    detail: "Open source and view audit actions are available.",
    tone: "ready"
  },
  failed: {
    label: "Failed tool call",
    message: "Failed tool call preserves sanitized error detail and offers retry or report without hiding context.",
    tool: "File search",
    status: "Failed",
    permission: "Team drive",
    input: "Folder: Renewal policies",
    output: "Timeout after 30 seconds",
    risk: "No side effect",
    detail: "Retry uses the same source scope and call ID lineage.",
    tone: "danger"
  },
  denied: {
    label: "Denied permission",
    message: "Denied permission explains which scope is missing and what can be requested.",
    tool: "CRM write",
    status: "Denied",
    permission: "Write opportunity missing",
    input: "Opportunity note update",
    output: "No write occurred",
    risk: "Record change blocked",
    detail: "Grant permission or open approval gate.",
    tone: "warning"
  },
  redactedInput: {
    label: "Redacted input",
    message: "Redacted input keeps safe context visible while hiding private values.",
    tool: "Payment lookup",
    status: "Pending review",
    permission: "Billing read",
    input: "Card token and customer email redacted",
    output: "No output yet",
    risk: "Sensitive data",
    detail: "Redaction reason: payment privacy policy.",
    tone: "warning"
  },
  redactedOutput: {
    label: "Redacted output",
    message: "Redacted output states whether content is hidden by permission, privacy, safety, or truncation.",
    tool: "Customer profile",
    status: "Succeeded with redaction",
    permission: "Support read",
    input: "Customer ID C-882",
    output: "Address and phone hidden",
    risk: "Private record",
    detail: "Role-gated details available to eligible reviewers.",
    tone: "warning"
  },
  rawPayload: {
    label: "Raw payload gated",
    message: "Raw payload gated state exposes request and response only to eligible users.",
    tool: "API connector",
    status: "Succeeded",
    permission: "Admin detail required",
    input: "Safe summary visible",
    output: "Safe output summary visible",
    risk: "Raw payload hidden",
    detail: "Open raw payload requires elevated role.",
    tone: "ready"
  },
  sideEffectPreview: {
    label: "Side-effect preview",
    message: "Side-effect preview shows the target and consequence before the tool changes anything.",
    tool: "Send email",
    status: "Approval required",
    permission: "Customer email send",
    input: "Draft renewal email to owner",
    output: "No email sent",
    risk: "External message",
    detail: "Human approval gate required before execution.",
    tone: "warning"
  },
  sideEffectExecuted: {
    label: "Side-effect executed",
    message: "Side-effect executed state confirms what changed and links to audit.",
    tool: "Update opportunity",
    status: "Executed",
    permission: "CRM write approved",
    input: "Risk note update",
    output: "Opportunity note changed",
    risk: "Record changed",
    detail: "Audit event EVT-9041 recorded target object and actor.",
    tone: "ready"
  },
  retry: {
    label: "Retry attempt",
    message: "Retry attempt shows attempt number and prevents duplicate side effects.",
    tool: "File search",
    status: "Retry 2 of 3",
    permission: "Team drive",
    input: "Same folder and query",
    output: "Previous attempt timed out",
    risk: "Idempotent read",
    detail: "Attempt lineage keeps the failed call visible.",
    tone: "working"
  },
  stale: {
    label: "Stale result",
    message: "Stale result warns when tool output no longer matches source or plan context.",
    tool: "Knowledge search",
    status: "Stale",
    permission: "Approved source scope",
    input: "Policy version 2025",
    output: "Newer policy version available",
    risk: "Outdated answer risk",
    detail: "Regenerate or rerun source search before using output.",
    tone: "warning"
  },
  duplicate: {
    label: "Duplicate tool event",
    message: "Duplicate tool event state marks repeated events without counting the same tool twice.",
    tool: "CRM lookup",
    status: "Duplicate event",
    permission: "Read account",
    input: "Account ID ACME-104",
    output: "Same response already recorded",
    risk: "No new side effect",
    detail: "Duplicate event collapsed under call ID T-41.",
    tone: "ready"
  },
  mobile: {
    label: "Mobile tool card",
    message: "Mobile tool card preserves tool name, status, permission, redaction, risk, and details access.",
    tool: "Shell command",
    status: "Succeeded",
    permission: "Workspace read",
    input: "Command and path summarized",
    output: "Exit 0, output truncated",
    risk: "Local workspace",
    detail: "Open details keeps context in a compact sheet.",
    tone: "ready"
  }
};

function ToolUseVisibilityPanel({ state }: { state: ToolUseVisibilityState }) {
  const copy = toolUseVisibilityCopy[state];

  return (
    <section className={`tool-use-visibility-shell is-${copy.tone}`} aria-label="Tool-use visibility">
      <header className="tool-use-visibility-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="tool-use-visibility-call">Call ID T-41</span>
      </header>
      <div className="tool-use-visibility-card">
        <strong>{copy.tool}</strong>
        <span>{copy.status}</span>
      </div>
      <div className="tool-use-visibility-grid">
        <span><b>Permission</b>{copy.permission}</span>
        <span><b>Input summary</b>{copy.input}</span>
        <span><b>Output summary</b>{copy.output}</span>
        <span><b>Side-effect risk</b>{copy.risk}</span>
      </div>
      <p>{copy.detail}</p>
      <div className="tool-use-visibility-actions">
        <button type="button" className="demo-button small">Open details</button>
        <button type="button" className="demo-button small">Copy tool ID</button>
        <button type="button" className="demo-button small">View audit</button>
      </div>
    </section>
  );
}

function ToolUseVisibilityGoodUi() {
  return (
    <div className="quality-example tool-use-visibility-demo">
      <ToolUseVisibilityPanel state="running" />
      <p className="demo-status">The tool-use visibility surface names the tool call, input summary, output summary, permission scope, redaction state, side-effect risk, and detail actions.</p>
    </div>
  );
}

function ToolUseVisibilityBadUi() {
  return (
    <div className="bad-ui-sample tool-use-visibility-bad-demo is-vague-tools">
      <div className="tool-use-visibility-bad-card">Using tools</div>
      <div className="tool-use-visibility-broken-grid" aria-label="Broken tool-use visibility">
        <span>Vague tools</span>
        <span>No input</span>
        <span>No output</span>
        <span>No permission</span>
      </div>
      <p>The broken UI hides tool name, tool input, tool output, permission scope, redaction reason, and side-effect risk behind a vague label.</p>
    </div>
  );
}

function ToolUseVisibilityGoodUx() {
  const [state, setState] = useState<ToolUseVisibilityState>("pending");
  const [message, setMessage] = useState("Pending tool call shows requested permission and side-effect risk.");
  const choose = (next: ToolUseVisibilityState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example tool-use-visibility-demo">
      <div className="tool-use-visibility-controls" aria-label="Tool-use visibility exercise controls">
        <button type="button" className={state === "pending" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pending", "Pending tool call shows name, purpose, permission, and risk.")}>Pending tool call</button>
        <button type="button" className={state === "running" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("running", "Running tool call keeps elapsed state and controls scoped.")}>Running tool call</button>
        <button type="button" className={state === "succeeded" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("succeeded", "Succeeded tool call summarizes returned data and source use.")}>Succeeded tool call</button>
        <button type="button" className={state === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "Failed tool call preserves sanitized error detail and recovery.")}>Failed tool call</button>
        <button type="button" className={state === "denied" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("denied", "Denied permission explains missing scope and recovery.")}>Denied permission</button>
        <button type="button" className={state === "redactedInput" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("redactedInput", "Redacted input keeps safe context while hiding private values.")}>Redacted input</button>
        <button type="button" className={state === "redactedOutput" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("redactedOutput", "Redacted output explains hidden returned data.")}>Redacted output</button>
        <button type="button" className={state === "rawPayload" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rawPayload", "Raw payload access is role-gated.")}>Raw payload gated</button>
        <button type="button" className={state === "sideEffectPreview" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sideEffectPreview", "Side-effect preview shows target and consequence before action.")}>Side-effect preview</button>
        <button type="button" className={state === "sideEffectExecuted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sideEffectExecuted", "Side-effect executed confirms what changed and links audit.")}>Side-effect executed</button>
        <button type="button" className={state === "retry" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retry", "Retry attempt shows attempt number and duplicate protection.")}>Retry attempt</button>
        <button type="button" className={state === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale result warns when tool output no longer matches context.")}>Stale result</button>
        <button type="button" className={state === "duplicate" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("duplicate", "Duplicate tool event is collapsed under the same call ID.")}>Duplicate tool event</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile tool card preserves status, permission, redaction, risk, and details.")}>Mobile tool card</button>
      </div>
      <ToolUseVisibilityPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ToolUseVisibilityBadUx() {
  type Mode = "vague-tools" | "raw-secret-dump" | "false-success" | "hidden-side-effect" | "unsafe-retry" | "missing-redaction" | "audit-disconnect";
  const [mode, setMode] = useState<Mode>("vague-tools");
  const copy: Record<Mode, string> = {
    "vague-tools": "A vague Using tools label hides tool name, input, output, permission, and side-effect risk.",
    "raw-secret-dump": "Raw payload dumps secrets, private records, and hidden diagnostic text.",
    "false-success": "The tool is marked success even though output was partial, stale, or unused.",
    "hidden-side-effect": "A side-effecting tool runs without preview, permission, or approval visibility.",
    "unsafe-retry": "Retry can duplicate a side effect because target and idempotency are hidden.",
    "missing-redaction": "Sensitive input and output appear without redaction reason or role gate.",
    "audit-disconnect": "The final audit record cannot connect back to tool call ID and run ID."
  };
  const labels: Record<Mode, string[]> = {
    "vague-tools": ["Vague tools", "No input", "No output", "No scope"],
    "raw-secret-dump": ["Raw secret dump", "Token visible", "Private record", "No gate"],
    "false-success": ["False success", "Partial output", "Stale data", "Used anyway"],
    "hidden-side-effect": ["Hidden side effect", "Email sent", "No preview", "No approval"],
    "unsafe-retry": ["Unsafe retry", "Same target", "Duplicate write", "No attempt"],
    "missing-redaction": ["Missing redaction", "PII visible", "No reason", "No role gate"],
    "audit-disconnect": ["Audit disconnect", "No call ID", "No run ID", "No actor"]
  };

  return (
    <div className={`quality-example tool-use-visibility-bad-demo is-${mode}`}>
      <div className="tool-use-visibility-bad-card">{mode === "raw-secret-dump" ? "raw_request: token=..." : "Using tools"}</div>
      <div className="tool-use-visibility-broken-grid" aria-label="Broken tool-use visibility">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "raw-secret-dump" ? "Raw secret dump" : "Tool-use visibility failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row tool-use-visibility-controls">
        <button type="button" className={mode === "vague-tools" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague-tools")}>Vague tools</button>
        <button type="button" className={mode === "raw-secret-dump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("raw-secret-dump")}>Raw secret dump</button>
        <button type="button" className={mode === "false-success" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("false-success")}>False success</button>
        <button type="button" className={mode === "hidden-side-effect" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-side-effect")}>Hidden side effect</button>
        <button type="button" className={mode === "unsafe-retry" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unsafe-retry")}>Unsafe retry</button>
        <button type="button" className={mode === "missing-redaction" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("missing-redaction")}>Missing redaction</button>
        <button type="button" className={mode === "audit-disconnect" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("audit-disconnect")}>Audit disconnect</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolUseVisibilityGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolUseVisibilityBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolUseVisibilityGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ToolUseVisibilityBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
