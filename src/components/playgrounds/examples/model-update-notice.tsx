import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ModelUpdateNoticeState =
  | "currentModel"
  | "newModel"
  | "replacementModel"
  | "modelVersion"
  | "lifecycleStage"
  | "effectiveDate"
  | "retirementDate"
  | "shutdownDate"
  | "affectedUsage"
  | "affectedPrompts"
  | "affectedWorkflows"
  | "affectedDeployments"
  | "actionRequired"
  | "noActionRequired"
  | "autoUpgrade"
  | "manualMigration"
  | "previewShortNotice"
  | "behaviorChange"
  | "compatibilityCheck"
  | "testReplacement"
  | "regressionResults"
  | "rolloutPlan"
  | "rollbackPlan"
  | "migrationOwner"
  | "snoozeNotice"
  | "dismissNotice"
  | "completedMigration"
  | "failedMigration"
  | "staleNotice"
  | "postRetirementBlocked"
  | "mobile";

type ModelUpdateNoticeCopy = {
  label: string;
  message: string;
  current: string;
  replacement: string;
  stage: string;
  deadline: string;
  usage: string;
  action: string;
  test: string;
  owner: string;
  tone: "working" | "ready" | "warning" | "danger" | "neutral";
};

const modelUpdateNoticeCopy: Record<ModelUpdateNoticeState, ModelUpdateNoticeCopy> = {
  currentModel: {
    label: "Current model",
    message: "Current model names the live dependency before users compare it with the new model.",
    current: "glm-4.6-production",
    replacement: "glm-5.1-stable",
    stage: "Deprecated",
    deadline: "Retires 2026-08-01",
    usage: "42 prompts, 9 workflows",
    action: "Review migration path",
    test: "Compatibility pending",
    owner: "AI platform",
    tone: "working"
  },
  newModel: {
    label: "New model",
    message: "New model calls out the target model separately from marketing release notes.",
    current: "glm-4.6-production",
    replacement: "glm-5.1-stable available",
    stage: "Replacement live",
    deadline: "Effective 2026-06-20",
    usage: "Same region, higher quota",
    action: "Compare behavior change",
    test: "Evaluation queue ready",
    owner: "Model owner",
    tone: "ready"
  },
  replacementModel: {
    label: "Replacement model",
    message: "Replacement model gives a supported option when the current model is retired.",
    current: "text-embed-legacy",
    replacement: "text-embed-3-large",
    stage: "Migration window",
    deadline: "Shutdown 2026-09-12",
    usage: "Embeddings pipeline",
    action: "Manual migration required",
    test: "Backfill sample first",
    owner: "Search team",
    tone: "warning"
  },
  modelVersion: {
    label: "Model version",
    message: "Model version distinguishes a behavior-only update from a model family change.",
    current: "assistant-model v2026-05-01",
    replacement: "assistant-model v2026-06-20",
    stage: "Version update",
    deadline: "Effective 2026-06-20",
    usage: "12 assistants",
    action: "Review release delta",
    test: "Regression suite ready",
    owner: "Assistant ops",
    tone: "neutral"
  },
  lifecycleStage: {
    label: "Lifecycle stage",
    message: "Lifecycle stage uses terms like preview, deprecated, retired, and blocked consistently.",
    current: "reasoning-preview",
    replacement: "reasoning-stable",
    stage: "Preview short-notice",
    deadline: "May change with 14 days notice",
    usage: "Prototype workflows",
    action: "Pin or migrate",
    test: "Preview evals required",
    owner: "Research apps",
    tone: "warning"
  },
  effectiveDate: {
    label: "Effective date",
    message: "Effective date tells users when behavior or routing changes begin.",
    current: "vision-v1",
    replacement: "vision-v2",
    stage: "Auto-upgrade scheduled",
    deadline: "Effective 2026-07-05",
    usage: "Image triage flow",
    action: "Snooze notice allowed",
    test: "Regression results pass",
    owner: "Safety review",
    tone: "ready"
  },
  retirementDate: {
    label: "Retirement date",
    message: "Retirement date gives the last supported day before the service exits normal operation.",
    current: "chat-legacy",
    replacement: "chat-current",
    stage: "Deprecated",
    deadline: "Retirement date 2026-08-15",
    usage: "Support agent",
    action: "Schedule migration",
    test: "Test replacement",
    owner: "CX automation",
    tone: "warning"
  },
  shutdownDate: {
    label: "Shutdown date",
    message: "Shutdown date warns when post-retirement calls will be blocked.",
    current: "code-model-2024",
    replacement: "code-model-2026",
    stage: "Final shutdown",
    deadline: "Shutdown date 2026-09-30",
    usage: "Developer assistant",
    action: "Block new deployments",
    test: "Rollback plan required",
    owner: "Dev tools",
    tone: "danger"
  },
  affectedUsage: {
    label: "Affected usage",
    message: "Affected usage shows call volume, cost exposure, quotas, regions, and deployment type.",
    current: "chat-legacy",
    replacement: "chat-current",
    stage: "Impact review",
    deadline: "Retires 2026-08-15",
    usage: "2.1M API calls, eu-west",
    action: "Export impacted list",
    test: "Quota check pending",
    owner: "Platform billing",
    tone: "working"
  },
  affectedPrompts: {
    label: "Affected prompts",
    message: "Affected prompts make prompt owners visible instead of leaving migration hidden in logs.",
    current: "prompt-pack-v3",
    replacement: "prompt-pack-v4",
    stage: "Prompt review",
    deadline: "Effective 2026-07-18",
    usage: "42 affected prompts",
    action: "Review prompt diffs",
    test: "Prompt eval required",
    owner: "Prompt library",
    tone: "working"
  },
  affectedWorkflows: {
    label: "Affected workflows",
    message: "Affected workflows name automations and assistant flows that depend on the model.",
    current: "agent-v2",
    replacement: "agent-v3",
    stage: "Migration window",
    deadline: "Retires 2026-08-22",
    usage: "9 workflows, 3 automations",
    action: "Run workflow tests",
    test: "2 failures open",
    owner: "Operations AI",
    tone: "danger"
  },
  affectedDeployments: {
    label: "Affected deployments",
    message: "Affected deployments list regions, environments, fine-tunes, and serving endpoints.",
    current: "private-deploy-13",
    replacement: "private-deploy-19",
    stage: "Deployment swap",
    deadline: "Effective 2026-07-01",
    usage: "Prod and staging",
    action: "Confirm deployment type",
    test: "Canary ready",
    owner: "Infra owner",
    tone: "warning"
  },
  actionRequired: {
    label: "Action required",
    message: "Action required separates mandatory migration from informational notices.",
    current: "rerank-legacy",
    replacement: "rerank-current",
    stage: "Required migration",
    deadline: "Shutdown 2026-08-31",
    usage: "Search ranking API",
    action: "Manual migration required",
    test: "Test replacement",
    owner: "Search lead",
    tone: "danger"
  },
  noActionRequired: {
    label: "No action required",
    message: "No action required still shows model version, timing, and affected usage for trust.",
    current: "summarizer-v5",
    replacement: "summarizer-v5.1",
    stage: "Managed update",
    deadline: "Effective 2026-07-10",
    usage: "Hosted assistants",
    action: "No action required",
    test: "Provider validated",
    owner: "Managed platform",
    tone: "ready"
  },
  autoUpgrade: {
    label: "Auto-upgrade scheduled",
    message: "Auto-upgrade scheduled shows when the platform will move traffic and how to opt into tests.",
    current: "chat-legacy",
    replacement: "chat-current",
    stage: "Auto-upgrade scheduled",
    deadline: "Effective 2026-07-30",
    usage: "Default workspace model",
    action: "Snooze until tested",
    test: "Sandbox comparison ready",
    owner: "Admin team",
    tone: "ready"
  },
  manualMigration: {
    label: "Manual migration required",
    message: "Manual migration required names the owner and the exact assets to update.",
    current: "fine-tuned-v1",
    replacement: "fine-tuned-v2",
    stage: "Manual migration",
    deadline: "Shutdown 2026-09-01",
    usage: "5 fine-tunes",
    action: "Change deployment binding",
    test: "Fine-tune eval pending",
    owner: "ML platform",
    tone: "danger"
  },
  previewShortNotice: {
    label: "Preview short-notice",
    message: "Preview short-notice warns that model behavior or availability can change faster than stable models.",
    current: "research-preview",
    replacement: "stable candidate",
    stage: "Preview short-notice",
    deadline: "7 day minimum notice",
    usage: "Lab workspace",
    action: "Avoid production use",
    test: "Run before each release",
    owner: "Experiment owner",
    tone: "warning"
  },
  behaviorChange: {
    label: "Behavior change",
    message: "Behavior change explains output differences even when API names do not change.",
    current: "classifier-v8",
    replacement: "classifier-v8 behavior update",
    stage: "Behavior-only update",
    deadline: "Effective 2026-06-28",
    usage: "Moderation workflow",
    action: "Review thresholds",
    test: "Regression results changed",
    owner: "Trust systems",
    tone: "warning"
  },
  compatibilityCheck: {
    label: "Compatibility check",
    message: "Compatibility check verifies parameters, tool calls, context length, and response schemas.",
    current: "tools-v1",
    replacement: "tools-v2",
    stage: "Compatibility check",
    deadline: "Retires 2026-08-15",
    usage: "Tool-calling agents",
    action: "Fix schema mismatch",
    test: "2 incompatible calls",
    owner: "Agent platform",
    tone: "danger"
  },
  testReplacement: {
    label: "Test replacement",
    message: "Test replacement gives users a non-destructive way to compare current and replacement behavior.",
    current: "answer-v4",
    replacement: "answer-v5",
    stage: "Testing",
    deadline: "Retires 2026-08-15",
    usage: "Knowledge assistant",
    action: "Run side-by-side test",
    test: "Test replacement started",
    owner: "Knowledge ops",
    tone: "working"
  },
  regressionResults: {
    label: "Regression results",
    message: "Regression results show pass, warning, and fail outcomes before migration is marked complete.",
    current: "answer-v4",
    replacement: "answer-v5",
    stage: "Regression review",
    deadline: "Retires 2026-08-15",
    usage: "Knowledge assistant",
    action: "Review failing cases",
    test: "91 pass, 4 warning, 2 fail",
    owner: "QA owner",
    tone: "warning"
  },
  rolloutPlan: {
    label: "Rollout plan",
    message: "Rollout plan shows phased traffic, canary, and communication steps.",
    current: "chat-legacy",
    replacement: "chat-current",
    stage: "Rollout plan",
    deadline: "Starts 2026-07-12",
    usage: "Production support",
    action: "Approve canary",
    test: "Canary guardrails set",
    owner: "Release manager",
    tone: "working"
  },
  rollbackPlan: {
    label: "Rollback plan",
    message: "Rollback plan explains how to reverse an upgrade before retirement makes rollback impossible.",
    current: "chat-legacy",
    replacement: "chat-current",
    stage: "Rollback available",
    deadline: "Until 2026-08-15",
    usage: "Production support",
    action: "Confirm rollback owner",
    test: "Rollback path tested",
    owner: "Release manager",
    tone: "ready"
  },
  migrationOwner: {
    label: "Migration owner",
    message: "Migration owner prevents notices from becoming unactioned platform noise.",
    current: "agent-v2",
    replacement: "agent-v3",
    stage: "Owner assigned",
    deadline: "Retires 2026-08-22",
    usage: "9 workflows",
    action: "Assigned to Morgan",
    test: "Owner accepted",
    owner: "Morgan Lee",
    tone: "ready"
  },
  snoozeNotice: {
    label: "Snooze notice",
    message: "Snooze notice delays reminders without hiding mandatory migration state.",
    current: "summarizer-v5",
    replacement: "summarizer-v5.1",
    stage: "Reminder snoozed",
    deadline: "Effective 2026-07-10",
    usage: "Hosted assistants",
    action: "Snooze notice 7 days",
    test: "No blocker",
    owner: "Admin team",
    tone: "neutral"
  },
  dismissNotice: {
    label: "Dismiss notice",
    message: "Dismiss notice is allowed only for informational or completed updates.",
    current: "summarizer-v5",
    replacement: "summarizer-v5.1",
    stage: "Informational",
    deadline: "Effective 2026-07-10",
    usage: "Hosted assistants",
    action: "Dismiss notice after review",
    test: "Provider validated",
    owner: "Admin team",
    tone: "ready"
  },
  completedMigration: {
    label: "Completed migration",
    message: "Completed migration records test evidence, owner, date, and new model in use.",
    current: "chat-current",
    replacement: "chat-current active",
    stage: "Completed migration",
    deadline: "Completed 2026-06-12",
    usage: "All workflows moved",
    action: "Monitor regression",
    test: "Regression results pass",
    owner: "AI platform",
    tone: "ready"
  },
  failedMigration: {
    label: "Failed migration",
    message: "Failed migration shows the failed test or deployment and the next recovery action.",
    current: "agent-v2",
    replacement: "agent-v3",
    stage: "Failed migration",
    deadline: "Retires 2026-08-22",
    usage: "Operations workflow",
    action: "Open rollback plan",
    test: "Tool schema failed",
    owner: "Operations AI",
    tone: "danger"
  },
  staleNotice: {
    label: "Stale notice",
    message: "Stale notice is flagged when the notice conflicts with the latest provider lifecycle schedule.",
    current: "embed-old",
    replacement: "embed-new",
    stage: "Stale notice",
    deadline: "Date changed upstream",
    usage: "Search indexer",
    action: "Refresh lifecycle data",
    test: "Schedule unverified",
    owner: "Docs owner",
    tone: "warning"
  },
  postRetirementBlocked: {
    label: "Post-retirement blocked",
    message: "Post-retirement blocked prevents users from selecting retired models for new usage.",
    current: "legacy-image",
    replacement: "image-current",
    stage: "Retired",
    deadline: "Shutdown passed",
    usage: "New deployments blocked",
    action: "Choose replacement model",
    test: "Historical logs only",
    owner: "Platform admin",
    tone: "danger"
  },
  mobile: {
    label: "Mobile notice",
    message: "Mobile notice keeps deadline, action required, impacted assets, and owner readable in compact layouts.",
    current: "chat-legacy",
    replacement: "chat-current",
    stage: "Mobile review",
    deadline: "Retires 2026-08-15",
    usage: "Support workflows",
    action: "Tap for migration path",
    test: "Compact comparison ready",
    owner: "AI platform",
    tone: "ready"
  }
};

function ModelUpdateNoticePanel({ state }: { state: ModelUpdateNoticeState }) {
  const copy = modelUpdateNoticeCopy[state];

  return (
    <section className={`model-update-shell is-${copy.tone}`} aria-label="Model update notice">
      <header className="model-update-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="model-update-state">{copy.stage}</span>
      </header>
      <div className="model-update-summary">
        <span>Model lifecycle notice</span>
        <p>Current model <b>{copy.current}</b> moves to replacement model <b>{copy.replacement}</b>. Users can inspect model version, lifecycle stage, effective date, retirement date, shutdown date, and migration path before behavior changes.</p>
      </div>
      <div className="model-update-grid" aria-label="Model update details">
        <span><b>Current model</b>{copy.current}</span>
        <span><b>Replacement</b>{copy.replacement}</span>
        <span><b>Lifecycle stage</b>{copy.stage}</span>
        <span><b>Deadline</b>{copy.deadline}</span>
        <span><b>Affected usage</b>{copy.usage}</span>
        <span><b>Action required</b>{copy.action}</span>
        <span><b>Test status</b>{copy.test}</span>
        <span><b>Owner</b>{copy.owner}</span>
      </div>
      <div className="model-update-impact" aria-label="Affected assets">
        <span>Affected prompts</span>
        <span>Affected workflows</span>
        <span>Affected deployments</span>
        <span>API calls</span>
        <span>Fine-tunes</span>
        <span>Evaluations</span>
      </div>
      <div className="model-update-actions">
        <button type="button" className="demo-button small">Test replacement</button>
        <button type="button" className="demo-button small primary">Schedule migration</button>
        <button type="button" className="demo-button small">Snooze notice</button>
        <button type="button" className="demo-button small">View affected usage</button>
      </div>
    </section>
  );
}

function ModelUpdateNoticeGoodUi() {
  return (
    <div className="quality-example model-update-demo">
      <ModelUpdateNoticePanel state="retirementDate" />
      <p className="demo-status">The model update notice separates current model, new model, replacement model, model version, lifecycle stage, effective date, retirement date, shutdown date, affected usage, affected prompts, affected workflows, affected deployments, action required, no action required, auto-upgrade scheduled, manual migration required, preview short-notice, behavior change, compatibility check, test replacement, regression results, rollout plan, rollback plan, migration owner, snooze notice, dismiss notice, completed migration, failed migration, stale notice, post-retirement blocked, and mobile notice.</p>
    </div>
  );
}

function ModelUpdateNoticeBadUi() {
  return (
    <div className="bad-ui-sample model-update-bad-demo is-marketing-update">
      <div className="model-update-bad-card">New model is here</div>
      <div className="model-update-broken-grid" aria-label="Broken model update notice">
        <span>Marketing-update</span>
        <span>Hidden-deadline</span>
        <span>No-impact-scope</span>
        <span>No-test-path</span>
      </div>
      <p>The broken UI looks like a release note and hides current model, replacement model, effective date, retirement date, shutdown date, affected prompts, affected workflows, affected deployments, migration owner, test replacement, rollout plan, rollback plan, and post-retirement blocked state.</p>
    </div>
  );
}

function ModelUpdateNoticeGoodUx() {
  const [state, setState] = useState<ModelUpdateNoticeState>("currentModel");
  const [message, setMessage] = useState("Current model names the live dependency before users compare it with the new model.");
  const choose = (next: ModelUpdateNoticeState, note: string) => {
    setState(next);
    setMessage(note);
  };
  const states: Array<[ModelUpdateNoticeState, string, string]> = [
    ["currentModel", "Current model", "Current model names the live dependency before users compare it with the new model."],
    ["newModel", "New model", "New model calls out the target model separately from marketing release notes."],
    ["replacementModel", "Replacement model", "Replacement model gives a supported option when the current model is retired."],
    ["modelVersion", "Model version", "Model version distinguishes a behavior-only update from a model family change."],
    ["lifecycleStage", "Lifecycle stage", "Lifecycle stage uses terms like preview, deprecated, retired, and blocked consistently."],
    ["effectiveDate", "Effective date", "Effective date tells users when behavior or routing changes begin."],
    ["retirementDate", "Retirement date", "Retirement date gives the last supported day before the service exits normal operation."],
    ["shutdownDate", "Shutdown date", "Shutdown date warns when post-retirement calls will be blocked."],
    ["affectedUsage", "Affected usage", "Affected usage shows call volume, cost exposure, quotas, regions, and deployment type."],
    ["affectedPrompts", "Affected prompts", "Affected prompts make prompt owners visible instead of leaving migration hidden in logs."],
    ["affectedWorkflows", "Affected workflows", "Affected workflows name automations and assistant flows that depend on the model."],
    ["affectedDeployments", "Affected deployments", "Affected deployments list regions, environments, fine-tunes, and serving endpoints."],
    ["actionRequired", "Action required", "Action required separates mandatory migration from informational notices."],
    ["noActionRequired", "No action required", "No action required still shows model version, timing, and affected usage for trust."],
    ["autoUpgrade", "Auto-upgrade scheduled", "Auto-upgrade scheduled shows when the platform will move traffic and how to opt into tests."],
    ["manualMigration", "Manual migration required", "Manual migration required names the owner and the exact assets to update."],
    ["previewShortNotice", "Preview short-notice", "Preview short-notice warns that model behavior or availability can change faster than stable models."],
    ["behaviorChange", "Behavior change", "Behavior change explains output differences even when API names do not change."],
    ["compatibilityCheck", "Compatibility check", "Compatibility check verifies parameters, tool calls, context length, and response schemas."],
    ["testReplacement", "Test replacement", "Test replacement gives users a non-destructive way to compare current and replacement behavior."],
    ["regressionResults", "Regression results", "Regression results show pass, warning, and fail outcomes before migration is marked complete."],
    ["rolloutPlan", "Rollout plan", "Rollout plan shows phased traffic, canary, and communication steps."],
    ["rollbackPlan", "Rollback plan", "Rollback plan explains how to reverse an upgrade before retirement makes rollback impossible."],
    ["migrationOwner", "Migration owner", "Migration owner prevents notices from becoming unactioned platform noise."],
    ["snoozeNotice", "Snooze notice", "Snooze notice delays reminders without hiding mandatory migration state."],
    ["dismissNotice", "Dismiss notice", "Dismiss notice is allowed only for informational or completed updates."],
    ["completedMigration", "Completed migration", "Completed migration records test evidence, owner, date, and new model in use."],
    ["failedMigration", "Failed migration", "Failed migration shows the failed test or deployment and the next recovery action."],
    ["staleNotice", "Stale notice", "Stale notice is flagged when the notice conflicts with the latest provider lifecycle schedule."],
    ["postRetirementBlocked", "Post-retirement blocked", "Post-retirement blocked prevents users from selecting retired models for new usage."],
    ["mobile", "Mobile notice", "Mobile notice keeps deadline, action required, impacted assets, and owner readable in compact layouts."]
  ];

  return (
    <div className="quality-example model-update-demo">
      <div className="model-update-controls" aria-label="Model update notice exercise controls">
        {states.map(([next, label, note]) => (
          <button key={next} type="button" className={state === next ? "demo-button small primary" : "demo-button small"} onClick={() => choose(next, note)}>{label}</button>
        ))}
      </div>
      <ModelUpdateNoticePanel state={state} />
      <p className="demo-status" aria-live="polite">{message} The notice keeps current model, new model, replacement model, model version, lifecycle stage, effective date, retirement date, shutdown date, affected usage, migration owner, test replacement, rollout plan, and rollback plan visible.</p>
    </div>
  );
}

function ModelUpdateNoticeBadUx() {
  type Mode = "marketing-update" | "hidden-deadline" | "no-impact-scope" | "dismiss-required" | "no-test-path" | "stale-picker" | "confidence-confusion";
  const [mode, setMode] = useState<Mode>("marketing-update");
  const copy: Record<Mode, string> = {
    "marketing-update": "Marketing-update says a new model is exciting but omits old model, replacement model, lifecycle stage, deadline, and action required.",
    "hidden-deadline": "Hidden-deadline gives no effective date, retirement date, shutdown date, or post-retirement blocked state.",
    "no-impact-scope": "No-impact-scope hides affected prompts, affected workflows, affected deployments, API calls, fine-tunes, regions, quotas, and owners.",
    "dismiss-required": "Dismiss-required lets users hide a mandatory migration before completed migration or verified migration completion.",
    "no-test-path": "No-test-path offers no compatibility check, test replacement, regression results, rollout plan, or rollback plan.",
    "stale-picker": "Stale-picker leaves a retired model selectable and healthy even though new usage should be blocked.",
    "confidence-confusion": "Confidence-confusion shows confidence percentages or source citations instead of lifecycle, migration, and impact facts."
  };
  const labels: Record<Mode, string[]> = {
    "marketing-update": ["Marketing-update", "No old model", "No replacement", "No action"],
    "hidden-deadline": ["Hidden-deadline", "No effective date", "No retirement date", "No shutdown date"],
    "no-impact-scope": ["No-impact-scope", "No prompts", "No workflows", "No deployments"],
    "dismiss-required": ["Dismiss-required", "Hides required work", "No completion check", "No owner"],
    "no-test-path": ["No-test-path", "No compatibility check", "No regression results", "No rollback"],
    "stale-picker": ["Stale-picker", "Retired selectable", "Healthy badge", "New usage allowed"],
    "confidence-confusion": ["Confidence-confusion", "Confidence only", "Source citations only", "No lifecycle"]
  };

  return (
    <div className={`quality-example model-update-bad-demo is-${mode}`}>
      <div className="model-update-bad-card">{mode === "stale-picker" ? "Retired model selectable" : "Model announcement"}</div>
      <div className="model-update-broken-grid" aria-label="Broken model update notice">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "confidence-confusion" ? "Lifecycle notice replaced by confidence display" : "Model update notice failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row model-update-controls">
        <button type="button" className={mode === "marketing-update" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("marketing-update")}>Marketing-update</button>
        <button type="button" className={mode === "hidden-deadline" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-deadline")}>Hidden-deadline</button>
        <button type="button" className={mode === "no-impact-scope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-impact-scope")}>No-impact-scope</button>
        <button type="button" className={mode === "dismiss-required" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dismiss-required")}>Dismiss-required</button>
        <button type="button" className={mode === "no-test-path" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("no-test-path")}>No-test-path</button>
        <button type="button" className={mode === "stale-picker" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale-picker")}>Stale-picker</button>
        <button type="button" className={mode === "confidence-confusion" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("confidence-confusion")}>Confidence-confusion</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ModelUpdateNoticeGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ModelUpdateNoticeBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ModelUpdateNoticeGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ModelUpdateNoticeBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
