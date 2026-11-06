import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type AutomationRuleBuilderState =
  | "ruleName"
  | "triggerSelected"
  | "eventScope"
  | "conditionBuilder"
  | "andOrLogic"
  | "operator"
  | "actionConfigured"
  | "actionTarget"
  | "sideEffects"
  | "permissions"
  | "plainSummary"
  | "saveDraft"
  | "enableRule"
  | "pauseRule"
  | "testRun"
  | "previewMatches"
  | "sampleEvent"
  | "branchTaken"
  | "skippedAction"
  | "conflictWarning"
  | "priorityOrder"
  | "loopRisk"
  | "duplicateAction"
  | "staleField"
  | "naturalLanguage"
  | "activeRule"
  | "versionHistory"
  | "runHistory"
  | "failedRun"
  | "mobile";

const automationRuleBuilderCopy: Record<AutomationRuleBuilderState, {
  label: string;
  message: string;
  trigger: string;
  condition: string;
  action: string;
  test: string;
  status: string;
  tone: "neutral" | "working" | "ready" | "warning" | "danger";
}> = {
  ruleName: {
    label: "Rule name",
    message: "Rule name keeps the automation identifiable in run history, conflict warnings, and alerts.",
    trigger: "Ticket updated",
    condition: "Priority is high",
    action: "Assign to Escalations",
    test: "Not run yet",
    status: "Draft named",
    tone: "neutral"
  },
  triggerSelected: {
    label: "Trigger selected",
    message: "Trigger selected shows the event that starts the future automation.",
    trigger: "When ticket priority changes",
    condition: "No condition yet",
    action: "Action disabled",
    test: "Needs condition",
    status: "Trigger ready",
    tone: "working"
  },
  eventScope: {
    label: "Event scope",
    message: "Event scope shows whether the rule listens to all tickets, one queue, or one channel.",
    trigger: "Support tickets in Billing",
    condition: "Priority changed by user",
    action: "Route inside Billing",
    test: "18 current matches",
    status: "Scope visible",
    tone: "ready"
  },
  conditionBuilder: {
    label: "Condition builder",
    message: "Condition builder uses field-aware rows instead of hidden text instructions.",
    trigger: "Ticket updated",
    condition: "Priority is high and sentiment is negative",
    action: "Assign and notify",
    test: "3 matches in sample",
    status: "Conditions valid",
    tone: "ready"
  },
  andOrLogic: {
    label: "AND OR logic",
    message: "AND OR logic keeps grouped conditions understandable before activation.",
    trigger: "Ticket updated",
    condition: "(Priority high AND sentiment negative) OR SLA breached",
    action: "Escalate queue",
    test: "Branch preview ready",
    status: "Logic grouped",
    tone: "working"
  },
  operator: {
    label: "Operator",
    message: "Operator choices are constrained by field type, null handling, and supported comparisons.",
    trigger: "Ticket updated",
    condition: "SLA hours greater than 4",
    action: "Notify manager",
    test: "Operator accepted",
    status: "Operator valid",
    tone: "ready"
  },
  actionConfigured: {
    label: "Action configured",
    message: "Action configured names the effect before it can run in the background.",
    trigger: "Ticket updated",
    condition: "Priority high",
    action: "Assign to Escalations and notify owner",
    test: "Action payload preview",
    status: "Action ready",
    tone: "ready"
  },
  actionTarget: {
    label: "Action target",
    message: "Action target distinguishes the object changed from the condition that matched.",
    trigger: "Ticket updated",
    condition: "VIP customer",
    action: "Target: escalation queue",
    test: "Target permission checked",
    status: "Target set",
    tone: "ready"
  },
  sideEffects: {
    label: "Side effects",
    message: "Side effects disclose messages, assignments, status changes, and external calls.",
    trigger: "Ticket updated",
    condition: "SLA at risk",
    action: "Send manager alert and set priority",
    test: "External email shown",
    status: "Effects disclosed",
    tone: "warning"
  },
  permissions: {
    label: "Permissions",
    message: "Permissions show whether the rule owner can perform every action at runtime.",
    trigger: "Ticket updated",
    condition: "Billing queue",
    action: "Move to Finance queue",
    test: "Finance permission missing",
    status: "Permission blocked",
    tone: "danger"
  },
  plainSummary: {
    label: "Plain-language summary",
    message: "Plain-language summary updates from structured trigger, condition, and action fields.",
    trigger: "Ticket updated",
    condition: "Priority high and sentiment negative",
    action: "Assign to Escalations",
    test: "Summary matches fields",
    status: "Summary synced",
    tone: "ready"
  },
  saveDraft: {
    label: "Save draft",
    message: "Save draft preserves the rule without enabling future automated runs.",
    trigger: "Ticket updated",
    condition: "Needs legal review",
    action: "Notify team lead",
    test: "Draft saved",
    status: "Disabled draft",
    tone: "neutral"
  },
  enableRule: {
    label: "Enable rule",
    message: "Enable rule is separate from saving and requires validation, test, and permission checks.",
    trigger: "Ticket updated",
    condition: "High priority and negative sentiment",
    action: "Assign to Escalations",
    test: "Test passed",
    status: "Enabled",
    tone: "ready"
  },
  pauseRule: {
    label: "Pause rule",
    message: "Pause rule stops future runs while preserving configuration and run history.",
    trigger: "Ticket updated",
    condition: "High priority",
    action: "Assign to Escalations",
    test: "Future runs paused",
    status: "Paused",
    tone: "warning"
  },
  testRun: {
    label: "Test run",
    message: "Test run shows sample input, branch decision, action preview, and skipped paths.",
    trigger: "Sample ticket update",
    condition: "Matched high priority",
    action: "Would assign queue",
    test: "Dry run complete",
    status: "Test complete",
    tone: "ready"
  },
  previewMatches: {
    label: "Preview matches",
    message: "Preview matches shows current records or sample events that the rule would affect.",
    trigger: "Ticket updated",
    condition: "High priority in Billing",
    action: "Escalate",
    test: "18 current matches",
    status: "Matches shown",
    tone: "working"
  },
  sampleEvent: {
    label: "Sample event",
    message: "Sample event lets users inspect the input that drove a test result.",
    trigger: "Ticket #48291 updated",
    condition: "Priority high",
    action: "Route to Escalations",
    test: "Sample payload visible",
    status: "Sample loaded",
    tone: "neutral"
  },
  branchTaken: {
    label: "Branch taken",
    message: "Branch taken explains why a true path ran instead of another branch.",
    trigger: "Ticket updated",
    condition: "VIP branch matched",
    action: "Notify manager",
    test: "VIP branch taken",
    status: "Branch explained",
    tone: "ready"
  },
  skippedAction: {
    label: "Skipped action",
    message: "Skipped action shows actions that did not run because the condition failed.",
    trigger: "Ticket updated",
    condition: "SLA not breached",
    action: "Manager alert skipped",
    test: "False branch",
    status: "Skipped safely",
    tone: "neutral"
  },
  conflictWarning: {
    label: "Conflict warning",
    message: "Conflict warning names overlapping rules before activation.",
    trigger: "Ticket updated",
    condition: "Priority high",
    action: "Two rules assign owner",
    test: "Conflict with VIP rule",
    status: "Conflict found",
    tone: "danger"
  },
  priorityOrder: {
    label: "Priority order",
    message: "Priority order shows which overlapping rule wins when several match.",
    trigger: "Ticket updated",
    condition: "High priority and VIP",
    action: "VIP rule runs first",
    test: "Order preview",
    status: "Order set",
    tone: "working"
  },
  loopRisk: {
    label: "Loop risk",
    message: "Loop risk warns when an action can retrigger the same rule.",
    trigger: "Owner changed",
    condition: "Owner is empty",
    action: "Set owner",
    test: "Retrigger possible",
    status: "Loop risk",
    tone: "danger"
  },
  duplicateAction: {
    label: "Duplicate action",
    message: "Duplicate action warns about repeated messages, assignments, or field updates.",
    trigger: "Ticket updated",
    condition: "SLA at risk",
    action: "Two rules notify manager",
    test: "Duplicate alert",
    status: "Duplicate found",
    tone: "warning"
  },
  staleField: {
    label: "Stale field",
    message: "Stale field blocks rules that reference renamed or deleted schema fields.",
    trigger: "Ticket updated",
    condition: "Old severity field",
    action: "Route blocked",
    test: "Field missing",
    status: "Needs repair",
    tone: "danger"
  },
  naturalLanguage: {
    label: "Natural-language generated rule",
    message: "Natural-language generated rule is parsed into editable structured fields before enabling.",
    trigger: "Parsed: ticket updated",
    condition: "Parsed: high priority",
    action: "Parsed: assign queue",
    test: "Assumptions visible",
    status: "Review parsed rule",
    tone: "warning"
  },
  activeRule: {
    label: "Active rule",
    message: "Active rule shows enabled state, owner, version, and last successful run.",
    trigger: "Ticket updated",
    condition: "High priority",
    action: "Escalate",
    test: "Last run 4 min ago",
    status: "Active",
    tone: "ready"
  },
  versionHistory: {
    label: "Version history",
    message: "Version history lets users compare edited active rules and roll back safely.",
    trigger: "Ticket updated",
    condition: "Changed condition",
    action: "Same action",
    test: "Version 7 draft",
    status: "Versioned",
    tone: "working"
  },
  runHistory: {
    label: "Run history",
    message: "Run history links each execution to rule version, input event, branch, and outcome.",
    trigger: "Ticket #48291",
    condition: "Matched",
    action: "Assigned",
    test: "Run log visible",
    status: "Logged",
    tone: "ready"
  },
  failedRun: {
    label: "Failed run",
    message: "Failed run links the error back to permission, stale field, payload, or integration failure.",
    trigger: "Ticket updated",
    condition: "Matched",
    action: "Notify Slack failed",
    test: "Integration token expired",
    status: "Failed run",
    tone: "danger"
  },
  mobile: {
    label: "Mobile builder",
    message: "Mobile builder keeps summary, validation, enable, and run status visible in compact form.",
    trigger: "Ticket updated",
    condition: "High priority",
    action: "Escalate",
    test: "Tap to expand test",
    status: "Mobile ready",
    tone: "ready"
  }
};

function AutomationRuleBuilderPanel({ state }: { state: AutomationRuleBuilderState }) {
  const copy = automationRuleBuilderCopy[state];

  return (
    <section className={`automation-rule-shell is-${copy.tone}`} aria-label="Automation rule builder">
      <header className="automation-rule-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="automation-rule-state">{copy.status}</span>
      </header>
      <div className="automation-rule-summary">
        <span>Plain-language summary</span>
        <p>When a Billing ticket is updated and priority is high with negative sentiment, assign it to Escalations, notify the manager, and log the run.</p>
      </div>
      <div className="automation-rule-flow" aria-label="Rule parts">
        <span><b>Trigger</b>{copy.trigger}</span>
        <span><b>Condition</b>{copy.condition}</span>
        <span><b>Action</b>{copy.action}</span>
      </div>
      <div className="automation-rule-grid">
        <span><b>Event scope</b>Billing support queue only</span>
        <span><b>Permissions</b>{copy.tone === "danger" ? "Needs repair" : "Owner can run action"}</span>
        <span><b>Test run</b>{copy.test}</span>
        <span><b>Activation</b>{state === "enableRule" || state === "activeRule" ? "Enabled after validation" : "Saved as disabled draft"}</span>
        <span><b>Conflict check</b>{state === "conflictWarning" || state === "loopRisk" || state === "duplicateAction" ? copy.status : "No blocking conflict"}</span>
        <span><b>Run history</b>Version 7, last edited today</span>
      </div>
      <div className="automation-rule-actions">
        <button type="button" className="demo-button small">Save draft</button>
        <button type="button" className="demo-button small">Test run</button>
        <button type="button" className="demo-button small primary">Enable rule</button>
        <button type="button" className="demo-button small">Pause rule</button>
      </div>
    </section>
  );
}

function AutomationRuleBuilderGoodUi() {
  return (
    <div className="quality-example automation-rule-demo">
      <AutomationRuleBuilderPanel state="conditionBuilder" />
      <p className="demo-status">The automation rule builder separates rule name, trigger selected, event scope, condition builder, AND OR logic, operator, action configured, action target, side effects, permissions, plain-language summary, save draft, enable rule, pause rule, test run, preview matches, conflicts, version history, run history, and failed run recovery.</p>
    </div>
  );
}

function AutomationRuleBuilderBadUi() {
  return (
    <div className="bad-ui-sample automation-rule-bad-demo is-prompt-only">
      <div className="automation-rule-bad-card">Make this automatic</div>
      <div className="automation-rule-broken-grid" aria-label="Broken automation rule builder">
        <span>Prompt-only</span>
        <span>Hidden-scope</span>
        <span>No-test</span>
        <span>Auto-enable</span>
      </div>
      <p>The broken UI accepts an automation instruction without parsed trigger, condition builder, action target, side effects, permissions, preview matches, conflict warning, pause rule, or run history.</p>
    </div>
  );
}

function AutomationRuleBuilderGoodUx() {
  const [state, setState] = useState<AutomationRuleBuilderState>("ruleName");
  const [message, setMessage] = useState("Rule name keeps the automation identifiable in run history, conflict warnings, and alerts.");
  const choose = (next: AutomationRuleBuilderState, note: string) => {
    setState(next);
    setMessage(note);
  };
  const states: Array<[AutomationRuleBuilderState, string, string]> = [
    ["ruleName", "Rule name", "Rule name keeps the automation identifiable in run history, conflict warnings, and alerts."],
    ["triggerSelected", "Trigger selected", "Trigger selected shows the event that starts the future automation."],
    ["eventScope", "Event scope", "Event scope shows whether the rule listens to all tickets, one queue, or one channel."],
    ["conditionBuilder", "Condition builder", "Condition builder uses field-aware rows instead of hidden text instructions."],
    ["andOrLogic", "AND OR logic", "AND OR logic keeps grouped conditions understandable before activation."],
    ["operator", "Operator", "Operator choices are constrained by field type, null handling, and supported comparisons."],
    ["actionConfigured", "Action configured", "Action configured names the effect before it can run in the background."],
    ["actionTarget", "Action target", "Action target distinguishes the object changed from the condition that matched."],
    ["sideEffects", "Side effects", "Side effects disclose messages, assignments, status changes, and external calls."],
    ["permissions", "Permissions", "Permissions show whether the rule owner can perform every action at runtime."],
    ["plainSummary", "Plain-language summary", "Plain-language summary updates from structured trigger, condition, and action fields."],
    ["saveDraft", "Save draft", "Save draft preserves the rule without enabling future automated runs."],
    ["enableRule", "Enable rule", "Enable rule is separate from saving and requires validation, test, and permission checks."],
    ["pauseRule", "Pause rule", "Pause rule stops future runs while preserving configuration and run history."],
    ["testRun", "Test run", "Test run shows sample input, branch decision, action preview, and skipped paths."],
    ["previewMatches", "Preview matches", "Preview matches shows current records or sample events that the rule would affect."],
    ["sampleEvent", "Sample event", "Sample event lets users inspect the input that drove a test result."],
    ["branchTaken", "Branch taken", "Branch taken explains why a true path ran instead of another branch."],
    ["skippedAction", "Skipped action", "Skipped action shows actions that did not run because the condition failed."],
    ["conflictWarning", "Conflict warning", "Conflict warning names overlapping rules before activation."],
    ["priorityOrder", "Priority order", "Priority order shows which overlapping rule wins when several match."],
    ["loopRisk", "Loop risk", "Loop risk warns when an action can retrigger the same rule."],
    ["duplicateAction", "Duplicate action", "Duplicate action warns about repeated messages, assignments, or field updates."],
    ["staleField", "Stale field", "Stale field blocks rules that reference renamed or deleted schema fields."],
    ["naturalLanguage", "Natural-language generated rule", "Natural-language generated rule is parsed into editable structured fields before enabling."],
    ["activeRule", "Active rule", "Active rule shows enabled state, owner, version, and last successful run."],
    ["versionHistory", "Version history", "Version history lets users compare edited active rules and roll back safely."],
    ["runHistory", "Run history", "Run history links each execution to rule version, input event, branch, and outcome."],
    ["failedRun", "Failed run", "Failed run links the error back to permission, stale field, payload, or integration failure."],
    ["mobile", "Mobile builder", "Mobile builder keeps summary, validation, enable, and run status visible in compact form."]
  ];

  return (
    <div className="quality-example automation-rule-demo">
      <div className="automation-rule-controls" aria-label="Automation rule builder exercise controls">
        {states.map(([next, label, note]) => (
          <button key={next} type="button" className={state === next ? "demo-button small primary" : "demo-button small"} onClick={() => choose(next, note)}>{label}</button>
        ))}
      </div>
      <AutomationRuleBuilderPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AutomationRuleBuilderBadUx() {
  type Mode = "prompt-only" | "auto-enable" | "hidden-scope" | "no-test" | "conflict-blind" | "summary-mismatch" | "no-pause";
  const [mode, setMode] = useState<Mode>("prompt-only");
  const copy: Record<Mode, string> = {
    "prompt-only": "Prompt-only accepts a natural-language instruction without parsed trigger, condition, action, or assumptions.",
    "auto-enable": "Auto-enable saves and activates the rule at the same time before validation or preview.",
    "hidden-scope": "Hidden-scope conceals which events, queues, records, or recipients will match.",
    "no-test": "No-test offers no sample event, preview matches, branch taken, skipped action, or dry run.",
    "conflict-blind": "Conflict-blind ignores overlapping rules, priority order, loop risk, and duplicate action warnings.",
    "summary-mismatch": "Summary-mismatch says one thing while the structured trigger or condition does another.",
    "no-pause": "No-pause gives no pause rule, rollback, disable, failed run recovery, or version history."
  };
  const labels: Record<Mode, string[]> = {
    "prompt-only": ["Prompt-only", "No trigger", "No condition", "No action"],
    "auto-enable": ["Auto-enable", "No draft", "No validation", "Runs now"],
    "hidden-scope": ["Hidden-scope", "All records", "No recipients", "No preview"],
    "no-test": ["No-test", "No sample event", "No branch taken", "No skipped action"],
    "conflict-blind": ["Conflict-blind", "No priority order", "Loop risk hidden", "Duplicate action"],
    "summary-mismatch": ["Summary-mismatch", "Parsed rule differs", "Assumptions hidden", "Wrong condition"],
    "no-pause": ["No-pause", "No rollback", "No version history", "No failed run recovery"]
  };

  return (
    <div className={`quality-example automation-rule-bad-demo is-${mode}`}>
      <div className="automation-rule-bad-card">{mode === "auto-enable" ? "Enabled now" : "Automation prompt"}</div>
      <div className="automation-rule-broken-grid" aria-label="Broken automation rule builder">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "conflict-blind" ? "Conflict warning is missing" : "Automation rule builder failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row automation-rule-controls">
        <button type="button" className={mode === "prompt-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("prompt-only")}>Prompt-only</button>
        <button type="button" className={mode === "auto-enable" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auto-enable")}>Auto-enable</button>
        <button type="button" className={mode === "hidden-scope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-scope")}>Hidden-scope</button>
        <button type="button" className={mode === "no-test" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-test")}>No-test</button>
        <button type="button" className={mode === "conflict-blind" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("conflict-blind")}>Conflict-blind</button>
        <button type="button" className={mode === "summary-mismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("summary-mismatch")}>Summary-mismatch</button>
        <button type="button" className={mode === "no-pause" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-pause")}>No-pause</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AutomationRuleBuilderGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AutomationRuleBuilderBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AutomationRuleBuilderGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <AutomationRuleBuilderBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
