import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AgentProgressTraceState = "started" | "currentStep" | "activeTool" | "queuedStep" | "completedStep" | "blocked" | "missingInput" | "approvalWait" | "retry" | "skipped" | "failed" | "cancelled" | "finalOutcome" | "auditHandoff" | "mobile";

type AgentProgressTraceItem = {
  title: string;
  detail: string;
  status: string;
};

type AgentProgressTraceCopy = {
  label: string;
  message: string;
  version: string;
  tone: "working" | "ready" | "warning" | "danger";
  current: string;
  next: string;
  action: string;
  items: AgentProgressTraceItem[];
};

const agentProgressTraceCopy: Record<AgentProgressTraceState, AgentProgressTraceCopy> = {
  started: {
    label: "Run started",
    message: "Agent progress trace starts after execution begins and anchors the run ID to reviewed plan version P-18.",
    version: "Run A-204 / plan P-18",
    tone: "working",
    current: "Starting account research run",
    next: "CRM lookup is queued next",
    action: "Stop run",
    items: [
      { title: "Run started", detail: "Objective: research Acme renewal risk.", status: "Active" },
      { title: "CRM lookup", detail: "Read renewal date and account owner.", status: "Queued" },
      { title: "Policy search", detail: "Search approved knowledge base.", status: "Queued" }
    ]
  },
  currentStep: {
    label: "Current step",
    message: "Current step shows what the agent is doing now, with elapsed time and last event time.",
    version: "Run A-204 / 00:48 elapsed",
    tone: "working",
    current: "Current step: search approved policy",
    next: "Draft email waits for policy result",
    action: "Jump to current step",
    items: [
      { title: "CRM lookup", detail: "Account owner and renewal date found.", status: "Completed" },
      { title: "Search approved policy", detail: "Last event 4 seconds ago.", status: "Active" },
      { title: "Draft renewal email", detail: "Depends on policy match.", status: "Queued" }
    ]
  },
  activeTool: {
    label: "Active tool",
    message: "Active tool state names the tool and offers scoped details without dumping raw private payloads.",
    version: "Tool: knowledge_search",
    tone: "working",
    current: "Active tool: knowledge search",
    next: "Tool-use visibility available",
    action: "View tool details",
    items: [
      { title: "Tool call pending", detail: "Query built from approved source scope.", status: "Completed" },
      { title: "Tool call running", detail: "Searching renewal discount policy.", status: "Active" },
      { title: "Tool result", detail: "Result will be summarized before draft.", status: "Queued" }
    ]
  },
  queuedStep: {
    label: "Queued step",
    message: "Queued step state keeps next work visible without implying it has already executed.",
    version: "3 steps remaining",
    tone: "working",
    current: "Policy search is active",
    next: "Queued step: draft renewal email",
    action: "Review queue",
    items: [
      { title: "Policy search", detail: "Active and still resolving.", status: "Active" },
      { title: "Draft renewal email", detail: "Will create draft only; no send.", status: "Queued" },
      { title: "Approval gate", detail: "Required before sending email.", status: "Queued" }
    ]
  },
  completedStep: {
    label: "Completed step",
    message: "Completed step state records what finished while preserving active and queued context.",
    version: "Last event 12:18:04",
    tone: "ready",
    current: "CRM lookup completed",
    next: "Policy search is running",
    action: "Copy run ID",
    items: [
      { title: "CRM lookup", detail: "Account record found; no write occurred.", status: "Completed" },
      { title: "Policy search", detail: "Checking approved source scope.", status: "Active" },
      { title: "Draft email", detail: "Still queued.", status: "Queued" }
    ]
  },
  blocked: {
    label: "Blocked permission",
    message: "Blocked permission state explains the blocker and exposes the recovery path.",
    version: "Permission required",
    tone: "warning",
    current: "Blocked permission: CRM write scope",
    next: "Grant permission or cancel run",
    action: "Grant permission",
    items: [
      { title: "Policy search", detail: "Completed with approved source.", status: "Completed" },
      { title: "Update opportunity note", detail: "Needs CRM write permission.", status: "Blocked" },
      { title: "Draft email", detail: "Waiting for blocker resolution.", status: "Waiting" }
    ]
  },
  missingInput: {
    label: "Missing input",
    message: "Missing input state shows what user or system data is required before the trace can continue.",
    version: "Input needed",
    tone: "warning",
    current: "Missing input: renewal owner email",
    next: "Provide owner email or skip draft",
    action: "Add input",
    items: [
      { title: "CRM lookup", detail: "Owner name found but email unavailable.", status: "Completed" },
      { title: "Draft renewal email", detail: "Cannot address recipient yet.", status: "Blocked" },
      { title: "Approval gate", detail: "Waiting for draft content.", status: "Waiting" }
    ]
  },
  approvalWait: {
    label: "Approval wait",
    message: "Approval wait state links to the human approval gate and shows where the gate sits in the run.",
    version: "Gate G-42 waiting",
    tone: "warning",
    current: "Human approval gate waiting",
    next: "Send email after approval only",
    action: "Open approval gate",
    items: [
      { title: "Draft renewal email", detail: "Draft prepared from reviewed plan.", status: "Completed" },
      { title: "Approval gate", detail: "Manager approval required before send.", status: "Waiting" },
      { title: "Send email", detail: "Side effect remains blocked.", status: "Queued" }
    ]
  },
  retry: {
    label: "Retry attempt",
    message: "Retry attempt state marks a new attempt without making earlier completed steps look duplicated.",
    version: "Attempt 2 of 3",
    tone: "working",
    current: "Retry attempt: policy search",
    next: "Backoff 8 seconds",
    action: "Cancel retry",
    items: [
      { title: "Policy search attempt 1", detail: "Timed out after 30 seconds.", status: "Failed" },
      { title: "Policy search attempt 2", detail: "Retrying with same source scope.", status: "Active" },
      { title: "Draft email", detail: "Still queued, not rerun.", status: "Queued" }
    ]
  },
  skipped: {
    label: "Skipped step",
    message: "Skipped step state explains why a planned step did not run.",
    version: "Fallback route active",
    tone: "ready",
    current: "Skipped step: update opportunity note",
    next: "Draft summary instead",
    action: "View reason",
    items: [
      { title: "CRM lookup", detail: "Completed normally.", status: "Completed" },
      { title: "Update opportunity note", detail: "Skipped because write scope is absent.", status: "Skipped" },
      { title: "Draft summary", detail: "Fallback step is active.", status: "Active" }
    ]
  },
  failed: {
    label: "Failed step",
    message: "Failed step state preserves context and offers recovery rather than hiding the trace.",
    version: "Run needs recovery",
    tone: "danger",
    current: "Failed step: source retrieval",
    next: "Retry, change source, or cancel",
    action: "Retry failed step",
    items: [
      { title: "CRM lookup", detail: "Completed before failure.", status: "Completed" },
      { title: "Source retrieval", detail: "Knowledge base returned 503.", status: "Failed" },
      { title: "Draft email", detail: "Not started.", status: "Queued" }
    ]
  },
  cancelled: {
    label: "Cancelled run",
    message: "Cancelled run state remains inspectable and shows which side effects did or did not happen.",
    version: "Cancelled by Maya",
    tone: "danger",
    current: "Cancelled run before email send",
    next: "No queued side effects will run",
    action: "View trace",
    items: [
      { title: "CRM lookup", detail: "Completed read-only step.", status: "Completed" },
      { title: "Draft email", detail: "Draft discarded after cancellation.", status: "Cancelled" },
      { title: "Send email", detail: "Never executed.", status: "Cancelled" }
    ]
  },
  finalOutcome: {
    label: "Final outcome",
    message: "Final outcome state confirms completion, skipped items, side effects, and result link.",
    version: "Completed in 03:42",
    tone: "ready",
    current: "Final outcome: account brief created",
    next: "Audit record available",
    action: "Open result",
    items: [
      { title: "Account brief", detail: "Generated and saved as draft.", status: "Completed" },
      { title: "Email send", detail: "Skipped because approval was rejected.", status: "Skipped" },
      { title: "Audit handoff", detail: "Run outcome recorded.", status: "Completed" }
    ]
  },
  auditHandoff: {
    label: "Audit handoff",
    message: "Audit handoff state connects the live trace to durable activity log evidence.",
    version: "Audit event EVT-9041",
    tone: "ready",
    current: "Trace handed off to audit trail",
    next: "Activity log retains final record",
    action: "Open audit",
    items: [
      { title: "Reviewed plan version", detail: "P-18 attached to final record.", status: "Recorded" },
      { title: "Run trace", detail: "Step outcomes summarized.", status: "Recorded" },
      { title: "Activity log", detail: "Event ID and actor retained.", status: "Available" }
    ]
  },
  mobile: {
    label: "Mobile compact trace",
    message: "Mobile compact trace keeps current, previous, next, blocker, and outcome visible without horizontal overflow.",
    version: "Compact run A-204",
    tone: "working",
    current: "Current: policy search",
    next: "Next: approval gate",
    action: "Open details",
    items: [
      { title: "Previous", detail: "CRM lookup completed.", status: "Done" },
      { title: "Current", detail: "Policy search active.", status: "Active" },
      { title: "Next", detail: "Approval gate waits before send.", status: "Queued" }
    ]
  }
};

function AgentProgressTracePanel({ state }: { state: AgentProgressTraceState }) {
  const copy = agentProgressTraceCopy[state];

  return (
    <section className={`agent-progress-trace-shell is-${copy.tone}`} aria-label="Agent progress trace">
      <header className="agent-progress-trace-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="agent-progress-trace-version">{copy.version}</span>
      </header>
      <div className="agent-progress-trace-summary">
        <span>Run ID: A-204</span>
        <span>Plan version: P-18</span>
        <span>{copy.current}</span>
        <span>{copy.next}</span>
      </div>
      <ol className="agent-progress-trace-items" role="log" aria-label="Run trace milestones">
        {copy.items.map((item) => (
          <li key={`${item.title}-${item.status}`}>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
            <em>{item.status}</em>
          </li>
        ))}
      </ol>
      <div className="agent-progress-trace-actions">
        <button type="button" className="demo-button small">{copy.action}</button>
        <button type="button" className="demo-button small">View details</button>
        <button type="button" className="demo-button small">View audit</button>
      </div>
    </section>
  );
}

function AgentProgressTraceGoodUi() {
  return (
    <div className="quality-example agent-progress-trace-demo">
      <AgentProgressTracePanel state="currentStep" />
      <p className="demo-status">The agent progress trace shows run ID, plan version, current step, active tool context, queued next step, elapsed state, and recovery actions after execution starts.</p>
    </div>
  );
}

function AgentProgressTraceBadUi() {
  return (
    <div className="bad-ui-sample agent-progress-trace-bad-demo is-spinner-only">
      <div className="agent-progress-trace-bad-card">Working on it</div>
      <div className="agent-progress-trace-broken-grid" aria-label="Broken agent progress trace">
        <span>Spinner-only</span>
        <span>No run ID</span>
        <span>No current step</span>
        <span>No recovery</span>
      </div>
      <p>The broken UI hides active tool, queued step, blocked permission, approval wait, retry attempt, failed step, and final outcome behind one vague working label.</p>
    </div>
  );
}

function AgentProgressTraceGoodUx() {
  const [state, setState] = useState<AgentProgressTraceState>("started");
  const [message, setMessage] = useState("Run started anchors run ID, plan version, and execution status.");
  const choose = (next: AgentProgressTraceState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example agent-progress-trace-demo">
      <div className="agent-progress-trace-controls" aria-label="Agent progress trace exercise controls">
        <button type="button" className={state === "started" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("started", "Run started links the trace to run ID A-204 and reviewed plan P-18.")}>Run started</button>
        <button type="button" className={state === "currentStep" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("currentStep", "Current step shows what the agent is doing now.")}>Current step</button>
        <button type="button" className={state === "activeTool" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("activeTool", "Active tool names the tool and offers scoped details.")}>Active tool</button>
        <button type="button" className={state === "queuedStep" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("queuedStep", "Queued step stays visible without pretending it has run.")}>Queued step</button>
        <button type="button" className={state === "completedStep" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("completedStep", "Completed step preserves context and last event time.")}>Completed step</button>
        <button type="button" className={state === "blocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocked", "Blocked permission explains why the run cannot continue.")}>Blocked permission</button>
        <button type="button" className={state === "missingInput" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("missingInput", "Missing input shows required user or system data.")}>Missing input</button>
        <button type="button" className={state === "approvalWait" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("approvalWait", "Approval wait links to the human approval gate.")}>Approval wait</button>
        <button type="button" className={state === "retry" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retry", "Retry attempt marks a new attempt without duplicating completed steps.")}>Retry attempt</button>
        <button type="button" className={state === "skipped" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("skipped", "Skipped step explains why planned work did not run.")}>Skipped step</button>
        <button type="button" className={state === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "Failed step preserves recovery choices and prior context.")}>Failed step</button>
        <button type="button" className={state === "cancelled" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("cancelled", "Cancelled run remains inspectable and shows side-effect status.")}>Cancelled run</button>
        <button type="button" className={state === "finalOutcome" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("finalOutcome", "Final outcome confirms result, skipped steps, and audit availability.")}>Final outcome</button>
        <button type="button" className={state === "auditHandoff" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("auditHandoff", "Audit handoff links the live trace to durable activity log evidence.")}>Audit handoff</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile compact trace preserves current, previous, next, blocker, and outcome.")}>Mobile compact trace</button>
      </div>
      <AgentProgressTracePanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AgentProgressTraceBadUx() {
  type Mode = "spinner-only" | "raw-tool-log" | "fake-percent" | "hidden-gate" | "duplicate-events" | "vanished-cancel" | "complete-too-early";
  const [mode, setMode] = useState<Mode>("spinner-only");
  const copy: Record<Mode, string> = {
    "spinner-only": "A multi-step agent run is hidden behind one vague working label.",
    "raw-tool-log": "Raw tool log events expose payload noise instead of a readable trace.",
    "fake-percent": "The UI invents a progress percentage for an unbounded agent run.",
    "hidden-gate": "A human approval gate blocks the run but is not shown in the trace.",
    "duplicate-events": "Duplicate events make one completed step look like it ran twice.",
    "vanished-cancel": "A cancelled run disappears before users can inspect side effects.",
    "complete-too-early": "The trace says complete while queued side-effect steps remain unresolved."
  };
  const labels: Record<Mode, string[]> = {
    "spinner-only": ["Spinner-only", "No step", "No gate", "No outcome"],
    "raw-tool-log": ["Raw tool log", "Private payload", "No summary", "No status"],
    "fake-percent": ["Fake percent", "73%", "No total", "Still waiting"],
    "hidden-gate": ["Hidden gate", "Approval wait", "Run blocked", "No link"],
    "duplicate-events": ["Duplicate events", "Step twice", "No attempt", "Confusing"],
    "vanished-cancel": ["Cancelled run", "Trace vanished", "Side effects?", "No audit"],
    "complete-too-early": ["Complete too early", "Queued send", "No final state", "Unsafe"]
  };

  return (
    <div className={`quality-example agent-progress-trace-bad-demo is-${mode}`}>
      <div className="agent-progress-trace-bad-card">{mode === "raw-tool-log" ? "tool.call.delta { ... }" : "Working on it"}</div>
      <div className="agent-progress-trace-broken-grid" aria-label="Broken agent progress trace">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "complete-too-early" ? "Complete too early" : "Progress trace failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row agent-progress-trace-controls">
        <button type="button" className={mode === "spinner-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("spinner-only")}>Spinner-only</button>
        <button type="button" className={mode === "raw-tool-log" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("raw-tool-log")}>Raw tool log</button>
        <button type="button" className={mode === "fake-percent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fake-percent")}>Fake percent</button>
        <button type="button" className={mode === "hidden-gate" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-gate")}>Hidden gate</button>
        <button type="button" className={mode === "duplicate-events" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicate-events")}>Duplicate events</button>
        <button type="button" className={mode === "vanished-cancel" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vanished-cancel")}>Vanished cancel</button>
        <button type="button" className={mode === "complete-too-early" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("complete-too-early")}>Complete too early</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentProgressTraceGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentProgressTraceBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentProgressTraceGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentProgressTraceBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
