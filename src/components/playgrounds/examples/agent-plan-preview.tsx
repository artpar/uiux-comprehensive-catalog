import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AgentPlanPreviewState = "draft" | "editable" | "fixed" | "optional" | "conditional" | "blocked" | "missingInput" | "risk" | "approvalGate" | "stale" | "regenerated" | "runReady" | "runStarted" | "mobile";

type AgentPlanPreviewStep = {
  name: string;
  detail: string;
  tool: string;
  status: string;
};

type AgentPlanPreviewCopy = {
  title: string;
  status: string;
  tone: "ready" | "working" | "warning" | "danger";
  objective: string;
  version: string;
  scope: string;
  output: string;
  steps: AgentPlanPreviewStep[];
  actions: string[];
};

const agentPlanPreviewCopy: Record<AgentPlanPreviewState, AgentPlanPreviewCopy> = {
  draft: {
    title: "Draft plan",
    status: "The agent plan preview shows proposed work before execution starts.",
    tone: "working",
    objective: "Objective: Research Acme renewal risk and prepare an account brief.",
    version: "Plan version P-18, not yet run",
    scope: "Data access: CRM account, approved knowledge base, public web search",
    output: "Expected output: account brief and draft renewal email",
    steps: [
      { name: "Confirm account context", detail: "Read Acme renewal date and owner.", tool: "CRM lookup", status: "Proposed" },
      { name: "Search approved policy", detail: "Find renewal discount rules.", tool: "Knowledge search", status: "Proposed" },
      { name: "Draft renewal email", detail: "Create draft only; do not send.", tool: "Draft generator", status: "Approval gate marker" }
    ],
    actions: ["Edit plan", "Regenerate plan", "Run reviewed plan"]
  },
  editable: {
    title: "Editable step",
    status: "The user can edit safe step details and the plan version updates before run.",
    tone: "ready",
    objective: "Objective: Prepare a brief without contacting the customer.",
    version: "Plan version P-19 after edit",
    scope: "Data access: CRM and approved knowledge only",
    output: "Expected output: internal account brief",
    steps: [
      { name: "Narrow account research", detail: "Recipient scope removed from the plan.", tool: "CRM lookup", status: "Editable step" },
      { name: "Remove email send", detail: "Message step changed to internal draft.", tool: "Draft generator", status: "Edited" },
      { name: "Review changes", detail: "Validate edited plan before run.", tool: "Plan validator", status: "Run-ready after validation" }
    ],
    actions: ["Save edited plan", "Run reviewed plan", "Cancel"]
  },
  fixed: {
    title: "Fixed step",
    status: "Policy-required steps are labelled fixed instead of pretending every step is editable.",
    tone: "warning",
    objective: "Objective: Prepare renewal plan with compliance check.",
    version: "Plan version P-20",
    scope: "Data access: CRM, policy library, compliance rules",
    output: "Expected output: brief with required compliance note",
    steps: [
      { name: "Run compliance check", detail: "Required before any customer-facing draft.", tool: "Policy checker", status: "Fixed step" },
      { name: "Summarize account", detail: "Editable summary order.", tool: "CRM lookup", status: "Editable" },
      { name: "Draft internal note", detail: "No external side effect.", tool: "Draft generator", status: "Proposed" }
    ],
    actions: ["Explain fixed step", "Edit other steps", "Run reviewed plan"]
  },
  optional: {
    title: "Optional step",
    status: "Optional work is visible and can be removed without hiding the base plan.",
    tone: "ready",
    objective: "Objective: Prepare renewal brief with optional competitor scan.",
    version: "Plan version P-21",
    scope: "Data access: CRM, approved knowledge, optional public web",
    output: "Expected output: account brief; optional market notes",
    steps: [
      { name: "Read account record", detail: "Required context.", tool: "CRM lookup", status: "Required" },
      { name: "Scan public web", detail: "Optional competitor check.", tool: "Web search", status: "Optional step" },
      { name: "Write brief", detail: "Include optional section only if run.", tool: "Draft generator", status: "Proposed" }
    ],
    actions: ["Remove optional step", "Run reviewed plan", "Save plan"]
  },
  conditional: {
    title: "Conditional step",
    status: "Conditional logic is visible before run so users know when a step will happen.",
    tone: "working",
    objective: "Objective: Research renewal risk and escalate only if risk is high.",
    version: "Plan version P-22",
    scope: "Data access: CRM risk signals and policy library",
    output: "Expected output: brief; escalation task only if risk exceeds threshold",
    steps: [
      { name: "Calculate renewal risk", detail: "Compare usage and support incidents.", tool: "Risk scorer", status: "Proposed" },
      { name: "Create escalation task", detail: "Only if risk score is high.", tool: "Task creator", status: "Conditional step" },
      { name: "Write brief", detail: "Include risk rationale.", tool: "Draft generator", status: "Proposed" }
    ],
    actions: ["Edit condition", "Run reviewed plan", "Cancel"]
  },
  blocked: {
    title: "Blocked permission",
    status: "The plan cannot run because one planned data source is permission-limited.",
    tone: "danger",
    objective: "Objective: Prepare account brief from CRM and contract repository.",
    version: "Plan version P-23 blocked",
    scope: "Data access: CRM allowed; contract repository permission-limited",
    output: "Expected output blocked until access changes or scope narrows",
    steps: [
      { name: "Read CRM account", detail: "Available.", tool: "CRM lookup", status: "Proposed" },
      { name: "Read contract terms", detail: "Current user lacks repository access.", tool: "Contract search", status: "Blocked permission" },
      { name: "Draft brief", detail: "Blocked because contract terms are required.", tool: "Draft generator", status: "Blocked" }
    ],
    actions: ["Request access", "Change source scope", "Cancel"]
  },
  missingInput: {
    title: "Missing input",
    status: "Run is blocked until the user provides a required account segment.",
    tone: "danger",
    objective: "Objective: Prepare segment-specific renewal plan.",
    version: "Plan version P-24 blocked",
    scope: "Data access: CRM allowed; segment missing",
    output: "Expected output blocked until missing input is provided",
    steps: [
      { name: "Choose customer segment", detail: "Segment input is required.", tool: "User input", status: "Missing input" },
      { name: "Lookup segment policy", detail: "Cannot search until segment is known.", tool: "Knowledge search", status: "Blocked" },
      { name: "Write brief", detail: "Waiting for segment.", tool: "Draft generator", status: "Blocked" }
    ],
    actions: ["Add missing input", "Regenerate plan", "Cancel"]
  },
  risk: {
    title: "Risk warning",
    status: "High-impact side effects are visible before the run starts.",
    tone: "warning",
    objective: "Objective: Prepare renewal brief and draft external message.",
    version: "Plan version P-25",
    scope: "Data access: CRM, policy library; external email draft only",
    output: "Expected output: draft email requiring approval before send",
    steps: [
      { name: "Read account record", detail: "No side effect.", tool: "CRM lookup", status: "Proposed" },
      { name: "Draft customer email", detail: "External communication risk; draft only.", tool: "Email draft", status: "Risk warning" },
      { name: "Send email", detail: "Not included in this run.", tool: "Email sender", status: "Approval gate marker" }
    ],
    actions: ["Remove risky step", "Add approval gate", "Run reviewed plan"]
  },
  approvalGate: {
    title: "Approval gate marker",
    status: "The preview marks where runtime execution will pause for human authorization.",
    tone: "warning",
    objective: "Objective: Draft and optionally send renewal offer.",
    version: "Plan version P-26",
    scope: "Data access: CRM, policy library, email draft",
    output: "Expected output: draft offer; send step pauses at human approval gate",
    steps: [
      { name: "Build offer draft", detail: "Prepare message and offer terms.", tool: "Draft generator", status: "Proposed" },
      { name: "Review send gate", detail: "Human approval required before sending.", tool: "Approval gate", status: "Approval gate marker" },
      { name: "Send email", detail: "Only after gate approval.", tool: "Email sender", status: "Gated" }
    ],
    actions: ["Open gate policy", "Run reviewed plan", "Cancel"]
  },
  stale: {
    title: "Stale plan",
    status: "The plan is no longer runnable because objective, source scope, or permissions changed.",
    tone: "danger",
    objective: "Objective changed after plan generation.",
    version: "Plan version P-27 stale",
    scope: "Data access changed: public web removed",
    output: "Expected output must be regenerated",
    steps: [
      { name: "Search public web", detail: "Source scope removed after plan generation.", tool: "Web search", status: "Stale plan" },
      { name: "Draft brief", detail: "Depends on removed source.", tool: "Draft generator", status: "Stale" },
      { name: "Run", detail: "Disabled until reviewed again.", tool: "Run control", status: "Blocked" }
    ],
    actions: ["Regenerate plan", "Review changes", "Cancel"]
  },
  regenerated: {
    title: "Regenerated plan",
    status: "The plan was regenerated after context changed and needs review before run.",
    tone: "working",
    objective: "Objective: Prepare internal brief only.",
    version: "Plan version P-28 regenerated",
    scope: "Data access: CRM and approved knowledge only",
    output: "Expected output: internal brief with no email draft",
    steps: [
      { name: "Read account record", detail: "Current source scope.", tool: "CRM lookup", status: "Proposed" },
      { name: "Search approved knowledge", detail: "Public web removed.", tool: "Knowledge search", status: "Proposed" },
      { name: "Write internal brief", detail: "No external side effect.", tool: "Draft generator", status: "Regenerated plan" }
    ],
    actions: ["Review regenerated plan", "Run reviewed plan", "Cancel"]
  },
  runReady: {
    title: "Run-ready plan",
    status: "Validation passed and the Run button applies to the reviewed plan version.",
    tone: "ready",
    objective: "Objective: Prepare account renewal brief.",
    version: "Plan version P-29 reviewed",
    scope: "Data access: CRM and approved knowledge validated",
    output: "Expected output: internal brief and draft email, no send",
    steps: [
      { name: "Read account record", detail: "Validated.", tool: "CRM lookup", status: "Run-ready plan" },
      { name: "Search policy", detail: "Validated source scope.", tool: "Knowledge search", status: "Ready" },
      { name: "Create draft", detail: "Draft only.", tool: "Draft generator", status: "Ready" }
    ],
    actions: ["Run reviewed plan", "Save plan", "Cancel"]
  },
  runStarted: {
    title: "Run-started handoff",
    status: "After start, the preview hands off to progress and tool-use visibility while preserving reviewed plan version.",
    tone: "ready",
    objective: "Objective: Prepare account renewal brief.",
    version: "Plan version P-29 now running",
    scope: "Data access: locked to reviewed scope",
    output: "Expected output tracked in progress trace",
    steps: [
      { name: "Read account record", detail: "Execution event started.", tool: "CRM lookup", status: "Run-started handoff" },
      { name: "Search policy", detail: "Waiting in progress trace.", tool: "Knowledge search", status: "Queued" },
      { name: "Create draft", detail: "Queued after search.", tool: "Draft generator", status: "Queued" }
    ],
    actions: ["Open progress", "Open tool events", "Stop run"]
  },
  mobile: {
    title: "Mobile compact plan",
    status: "The compact preview keeps objective, risky steps, approval gate, and run controls visible.",
    tone: "ready",
    objective: "Objective: Prepare account brief.",
    version: "Plan version P-30",
    scope: "Data access: CRM and policy library",
    output: "Expected output: brief and draft",
    steps: [
      { name: "Account lookup", detail: "CRM record and owner.", tool: "CRM lookup", status: "Proposed" },
      { name: "Draft email", detail: "External message draft only.", tool: "Draft generator", status: "Risk warning" },
      { name: "Send gate", detail: "Human approval required.", tool: "Approval gate", status: "Mobile compact plan" }
    ],
    actions: ["Expand plan", "Run reviewed plan", "Cancel"]
  }
};

function AgentPlanPreviewPanel({ state }: { state: AgentPlanPreviewState }) {
  const copy = agentPlanPreviewCopy[state];
  const canRun = state === "draft" || state === "editable" || state === "fixed" || state === "optional" || state === "conditional" || state === "risk" || state === "approvalGate" || state === "regenerated" || state === "runReady" || state === "mobile";

  return (
    <section className={`agent-plan-preview-shell is-${copy.tone}`} aria-label="Agent plan preview">
      <header className="agent-plan-preview-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="agent-plan-preview-version">{copy.version}</span>
      </header>
      <div className="agent-plan-preview-summary">
        <span>{copy.objective}</span>
        <span>{copy.scope}</span>
        <span>{copy.output}</span>
      </div>
      <ol className="agent-plan-preview-steps">
        {copy.steps.map((step) => (
          <li key={`${step.name}-${step.status}`}>
            <strong>{step.name}</strong>
            <span>{step.detail}</span>
            <div>
              <span>{step.tool}</span>
              <span>{step.status}</span>
            </div>
          </li>
        ))}
      </ol>
      <div className="agent-plan-preview-actions">
        {copy.actions.map((action, index) => (
          <button key={action} type="button" className={index === 0 && canRun ? "demo-button small primary" : "demo-button small"} disabled={action === "Run reviewed plan" && !canRun}>
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}

function AgentPlanPreviewGoodUi() {
  return (
    <div className="quality-example agent-plan-preview-demo">
      <AgentPlanPreviewPanel state="draft" />
      <p className="demo-status">The agent plan preview shows objective, ordered steps, planned tools, data access, expected output, approval gate marker, and run controls before execution starts.</p>
    </div>
  );
}

function AgentPlanPreviewBadUi() {
  return (
    <div className="bad-ui-sample agent-plan-preview-bad-demo is-summary-only">
      <div className="agent-plan-preview-bad-card">I will handle this for you.</div>
      <div className="agent-plan-preview-broken-grid" aria-label="Broken agent plan preview">
        {["Summary-only", "Hidden tools", "No data access", "Run now"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI starts agent work from a vague summary without ordered steps, planned tools, data access, risks, or expected output.</p>
    </div>
  );
}

function AgentPlanPreviewGoodUx() {
  const [state, setState] = useState<AgentPlanPreviewState>("draft");
  const [message, setMessage] = useState("Draft plan shows objective, ordered steps, planned tools, data access, and expected output before run.");

  const choose = (next: AgentPlanPreviewState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example agent-plan-preview-demo">
      <div className="agent-plan-preview-controls" aria-label="Agent plan preview exercise controls">
        <button type="button" className={state === "draft" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("draft", "Draft plan distinguishes proposed steps from executed work.")}>Draft plan</button>
        <button type="button" className={state === "editable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("editable", "Editable step updates the plan version before execution can start.")}>Editable step</button>
        <button type="button" className={state === "fixed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("fixed", "Fixed step explains policy or dependency constraints instead of pretending every step can change.")}>Fixed step</button>
        <button type="button" className={state === "optional" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("optional", "Optional step can be removed without hiding the required base plan.")}>Optional step</button>
        <button type="button" className={state === "conditional" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("conditional", "Conditional step shows when the agent will branch during execution.")}>Conditional step</button>
        <button type="button" className={state === "blocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocked", "Blocked permission prevents Run until the source scope changes or access is granted.")}>Blocked permission</button>
        <button type="button" className={state === "missingInput" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("missingInput", "Missing input blocks the plan and routes users to provide the required value.")}>Missing input</button>
        <button type="button" className={state === "risk" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("risk", "Risk warning exposes external side effects before Run.")}>Risk warning</button>
        <button type="button" className={state === "approvalGate" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("approvalGate", "Approval gate marker shows where execution will pause for human authorization.")}>Approval gate marker</button>
        <button type="button" className={state === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Stale plan disables run after objective, source scope, or permissions change.")}>Stale plan</button>
        <button type="button" className={state === "regenerated" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("regenerated", "Regenerated plan must be reviewed again before run.")}>Regenerated plan</button>
        <button type="button" className={state === "runReady" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("runReady", "Run-ready plan validates the reviewed plan version before execution.")}>Run-ready plan</button>
        <button type="button" className={state === "runStarted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("runStarted", "Run-started handoff preserves the reviewed plan and moves to progress/tool visibility.")}>Run-started handoff</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile compact plan preserves objective, risk, approval gate, and run controls.")}>Mobile compact plan</button>
      </div>
      <AgentPlanPreviewPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AgentPlanPreviewBadUx() {
  type Mode = "summary-only" | "hidden-tools" | "executed-as-preview" | "edit-ignored" | "mandatory-recommendation" | "stale-runnable" | "side-effect-hidden";
  const [mode, setMode] = useState<Mode>("summary-only");
  const copy: Record<Mode, string> = {
    "summary-only": "The agent runs from a one-line summary without objective, ordered steps, planned tools, or expected output.",
    "hidden-tools": "Planned tool calls and data access are hidden until after execution starts.",
    "executed-as-preview": "Completed tool events are labelled as preview, so users cannot tell what already happened.",
    "edit-ignored": "The user edits step order, but the agent executes the original unseen plan.",
    "mandatory-recommendation": "An optional recommendation is dressed up as a required agent plan.",
    "stale-runnable": "A stale plan remains runnable after source scope or permissions changed.",
    "side-effect-hidden": "The plan hides that a step sends email or updates customer records."
  };
  const labels: Record<Mode, string[]> = {
    "summary-only": ["Summary-only", "No steps", "No tools", "Run now"],
    "hidden-tools": ["Hidden tools", "Unknown data", "No permissions", "Surprise calls"],
    "executed-as-preview": ["Already ran", "Called tool", "Preview label", "No consent"],
    "edit-ignored": ["Edited plan", "Old version", "Wrong run", "No diff"],
    "mandatory-recommendation": ["Optional idea", "Looks required", "No dismiss", "No scope"],
    "stale-runnable": ["Stale plan", "Run enabled", "Scope changed", "Unsafe"],
    "side-effect-hidden": ["Send email", "Hidden side effect", "No approval", "No warning"]
  };

  return (
    <div className={`quality-example agent-plan-preview-bad-demo is-${mode}`}>
      <div className="agent-plan-preview-bad-card">{mode === "executed-as-preview" ? "Tool call complete" : "I will handle this for you."}</div>
      <div className="agent-plan-preview-broken-grid" aria-label="Broken agent plan preview">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "executed-as-preview" ? "Executed as preview" : mode === "side-effect-hidden" ? "Side-effect hidden" : "Plan preview failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row agent-plan-preview-controls">
        <button type="button" className={mode === "summary-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("summary-only")}>Summary-only</button>
        <button type="button" className={mode === "hidden-tools" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-tools")}>Hidden tools</button>
        <button type="button" className={mode === "executed-as-preview" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("executed-as-preview")}>Executed as preview</button>
        <button type="button" className={mode === "edit-ignored" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("edit-ignored")}>Edit ignored</button>
        <button type="button" className={mode === "mandatory-recommendation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mandatory-recommendation")}>Mandatory recommendation</button>
        <button type="button" className={mode === "stale-runnable" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale-runnable")}>Stale-runnable</button>
        <button type="button" className={mode === "side-effect-hidden" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("side-effect-hidden")}>Side-effect hidden</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentPlanPreviewGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentPlanPreviewBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentPlanPreviewGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AgentPlanPreviewBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
