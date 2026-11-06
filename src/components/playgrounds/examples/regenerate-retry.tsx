import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type RegenerateRetryState =
  | "samePrompt"
  | "promptSnapshot"
  | "responseVersion"
  | "previousAnswer"
  | "regenerateAnswer"
  | "retryFailed"
  | "continuePartial"
  | "retryFromStart"
  | "retrySources"
  | "retryTool"
  | "noToolRerun"
  | "changedContext"
  | "changedModel"
  | "compareVersions"
  | "restorePrevious"
  | "cooldown"
  | "rateLimited"
  | "safetyBlocked"
  | "manualEdits"
  | "mobile";

type RegenerateRetryCopy = {
  label: string;
  message: string;
  prompt: string;
  version: string;
  source: string;
  tool: string;
  action: string;
  tone: "ready" | "working" | "warning" | "danger";
};

const regenerateRetryCopy: Record<RegenerateRetryState, RegenerateRetryCopy> = {
  samePrompt: {
    label: "Retry same prompt",
    message: "Retry same prompt repeats the submitted request with the same visible context.",
    prompt: "Prompt snapshot locked",
    version: "Attempt 2 pending",
    source: "Same sources",
    tool: "Same tool scope",
    action: "Retry same prompt",
    tone: "working"
  },
  promptSnapshot: {
    label: "Prompt snapshot",
    message: "Prompt snapshot shows the exact submitted text before the next attempt starts.",
    prompt: "Summarize reimbursement policy",
    version: "Response v1 preserved",
    source: "Source scope visible",
    tool: "Tools unchanged",
    action: "Inspect prompt",
    tone: "ready"
  },
  responseVersion: {
    label: "Response version",
    message: "Response version keeps each generated answer identifiable for compare and restore.",
    prompt: "Same prompt",
    version: "v2 generated",
    source: "Sources refreshed",
    tool: "No side effects",
    action: "Open version",
    tone: "ready"
  },
  previousAnswer: {
    label: "Previous answer",
    message: "Previous answer remains available after regeneration for copied text, review, and audit.",
    prompt: "Prompt unchanged",
    version: "v1 archived",
    source: "Old citations retained",
    tool: "Tool trace retained",
    action: "Restore previous",
    tone: "ready"
  },
  regenerateAnswer: {
    label: "Regenerate answer",
    message: "Regenerate answer creates a new answer version instead of hiding the old one.",
    prompt: "Same prompt",
    version: "Generating v2",
    source: "Same sources",
    tool: "No-tool rerun",
    action: "Regenerate answer",
    tone: "working"
  },
  retryFailed: {
    label: "Retry failed response",
    message: "Retry failed response preserves the failure reason, attempt count, and original prompt.",
    prompt: "Prompt saved",
    version: "Attempt 1 failed",
    source: "Source timeout",
    tool: "No tool side effect",
    action: "Retry failed response",
    tone: "warning"
  },
  continuePartial: {
    label: "Continue partial output",
    message: "Continue partial output resumes a stopped answer without pretending the partial was complete.",
    prompt: "Same prompt",
    version: "Partial answer kept",
    source: "Citations pending",
    tool: "Tool complete",
    action: "Continue partial",
    tone: "working"
  },
  retryFromStart: {
    label: "Retry from start",
    message: "Retry from start discards no visible evidence until the user chooses which version to keep.",
    prompt: "Same prompt",
    version: "New attempt from zero",
    source: "Sources rerun",
    tool: "Tools gated",
    action: "Retry from start",
    tone: "working"
  },
  retrySources: {
    label: "Retry failed sources",
    message: "Retry failed sources reruns retrieval without hiding that answer text may change.",
    prompt: "Prompt unchanged",
    version: "v1 waiting",
    source: "Retrieval retry",
    tool: "Search tool read-only",
    action: "Retry sources",
    tone: "warning"
  },
  retryTool: {
    label: "Retry failed tool",
    message: "Retry failed tool separates tool retry from answer regeneration and shows side-effect risk.",
    prompt: "Prompt unchanged",
    version: "Answer blocked",
    source: "Sources ready",
    tool: "Tool retry gated",
    action: "Retry tool",
    tone: "warning"
  },
  noToolRerun: {
    label: "No-tool rerun",
    message: "No-tool rerun regenerates answer text while preventing a side-effecting tool from running again.",
    prompt: "Same prompt",
    version: "v2 no-tool preview",
    source: "Same citations",
    tool: "External send skipped",
    action: "Run without tool",
    tone: "ready"
  },
  changedContext: {
    label: "Changed context",
    message: "Changed context is called out before users compare the new answer to the old one.",
    prompt: "Same text, new file",
    version: "v2 context changed",
    source: "File scope changed",
    tool: "Tools unchanged",
    action: "Review context",
    tone: "warning"
  },
  changedModel: {
    label: "Changed model",
    message: "Changed model state explains why a new answer may differ from the previous answer.",
    prompt: "Same prompt",
    version: "v2 model changed",
    source: "Sources same",
    tool: "Tools same",
    action: "Review model",
    tone: "warning"
  },
  compareVersions: {
    label: "Compare versions",
    message: "Compare versions lets users inspect previous answer and new answer before replacing either.",
    prompt: "Same prompt",
    version: "v1 beside v2",
    source: "Citation differences shown",
    tool: "Tool differences shown",
    action: "Compare versions",
    tone: "ready"
  },
  restorePrevious: {
    label: "Restore previous",
    message: "Restore previous recovers the prior answer and keeps the regenerated version in history.",
    prompt: "Prompt unchanged",
    version: "v1 restored",
    source: "v1 citations active",
    tool: "v1 tool trace active",
    action: "Restore previous",
    tone: "ready"
  },
  cooldown: {
    label: "Cooldown",
    message: "Cooldown explains the next allowed retry time instead of inviting repeated clicks.",
    prompt: "Prompt preserved",
    version: "Attempt 3 delayed",
    source: "Sources queued",
    tool: "Tools paused",
    action: "Retry after 42s",
    tone: "warning"
  },
  rateLimited: {
    label: "Rate limited",
    message: "Rate limited state keeps the prompt and prior answer visible while retry waits.",
    prompt: "Prompt preserved",
    version: "Quota wait",
    source: "Source scope preserved",
    tool: "No retry yet",
    action: "Wait for quota",
    tone: "warning"
  },
  safetyBlocked: {
    label: "Safety blocked",
    message: "Safety blocked replaces retry with an explanation when repetition cannot resolve the block.",
    prompt: "Prompt saved",
    version: "No new version",
    source: "Source not enough",
    tool: "Tools disabled",
    action: "Revise request",
    tone: "danger"
  },
  manualEdits: {
    label: "Manual edits present",
    message: "Manual edits present blocks overwrite and routes users to compare or regenerate from edit.",
    prompt: "Edited draft exists",
    version: "v1 edited",
    source: "Citation review pending",
    tool: "No automatic rerun",
    action: "Compare edits",
    tone: "danger"
  },
  mobile: {
    label: "Mobile regenerate",
    message: "Mobile regenerate keeps prompt snapshot, previous answer, new answer, and cooldown visible.",
    prompt: "Prompt sheet",
    version: "v1/v2 selector",
    source: "Source chips wrap",
    tool: "Tool status compact",
    action: "Open compare",
    tone: "ready"
  }
};

function RegenerateRetryPanel({ state }: { state: RegenerateRetryState }) {
  const copy = regenerateRetryCopy[state];

  return (
    <section className={`regenerate-retry-shell is-${copy.tone}`} aria-label="Regenerate retry">
      <header className="regenerate-retry-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="regenerate-retry-attempt">Attempt 2 of 3</span>
      </header>
      <div className="regenerate-retry-versions" aria-label="Response version comparison">
        <article>
          <strong>Previous answer</strong>
          <span>v1 says contractors are eligible after manager approval.</span>
        </article>
        <article>
          <strong>New answer</strong>
          <span>v2 checks refreshed policy sources before changing the conclusion.</span>
        </article>
      </div>
      <div className="regenerate-retry-grid">
        <span><b>Prompt snapshot</b>{copy.prompt}</span>
        <span><b>Response version</b>{copy.version}</span>
        <span><b>Source scope</b>{copy.source}</span>
        <span><b>Tool scope</b>{copy.tool}</span>
      </div>
      <div className="regenerate-retry-actions">
        <button type="button" className="demo-button small">Compare versions</button>
        <button type="button" className="demo-button small">Restore previous</button>
        <button type="button" className="demo-button small">{copy.action}</button>
      </div>
    </section>
  );
}

function RegenerateRetryGoodUi() {
  return (
    <div className="quality-example regenerate-retry-demo">
      <RegenerateRetryPanel state="compareVersions" />
      <p className="demo-status">The regenerate retry surface keeps retry same prompt, prompt snapshot, response version, previous answer, new answer, source scope, tool scope, compare versions, and restore previous controls visible.</p>
    </div>
  );
}

function RegenerateRetryBadUi() {
  return (
    <div className="bad-ui-sample regenerate-retry-bad-demo is-vague-try-again">
      <div className="regenerate-retry-bad-card">Try again</div>
      <div className="regenerate-retry-broken-grid" aria-label="Broken regenerate retry">
        <span>Vague try again</span>
        <span>No prompt snapshot</span>
        <span>No previous answer</span>
        <span>No version</span>
      </div>
      <p>The broken UI hides whether retry changes prompt, context, model, source, tool, or answer version.</p>
    </div>
  );
}

function RegenerateRetryGoodUx() {
  const [state, setState] = useState<RegenerateRetryState>("samePrompt");
  const [message, setMessage] = useState("Retry same prompt repeats the submitted request with preserved context.");
  const choose = (next: RegenerateRetryState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example regenerate-retry-demo">
      <div className="regenerate-retry-controls" aria-label="Regenerate retry exercise controls">
        <button type="button" className={state === "samePrompt" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("samePrompt", "Retry same prompt preserves the submitted request and context.")}>Retry same prompt</button>
        <button type="button" className={state === "promptSnapshot" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("promptSnapshot", "Prompt snapshot shows exactly what will rerun.")}>Prompt snapshot</button>
        <button type="button" className={state === "responseVersion" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("responseVersion", "Response version keeps each answer identifiable.")}>Response version</button>
        <button type="button" className={state === "previousAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("previousAnswer", "Previous answer stays available after regeneration.")}>Previous answer</button>
        <button type="button" className={state === "regenerateAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("regenerateAnswer", "Regenerate answer creates a new answer version.")}>Regenerate answer</button>
        <button type="button" className={state === "retryFailed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retryFailed", "Retry failed response preserves failure reason and attempt count.")}>Retry failed response</button>
        <button type="button" className={state === "continuePartial" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("continuePartial", "Continue partial output resumes without calling it complete.")}>Continue partial output</button>
        <button type="button" className={state === "retryFromStart" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retryFromStart", "Retry from start keeps old evidence until the user chooses.")}>Retry from start</button>
        <button type="button" className={state === "retrySources" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retrySources", "Retry failed sources reruns retrieval as a separate action.")}>Retry failed sources</button>
        <button type="button" className={state === "retryTool" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retryTool", "Retry failed tool separates tool risk from answer text.")}>Retry failed tool</button>
        <button type="button" className={state === "noToolRerun" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("noToolRerun", "No-tool rerun avoids repeating side-effecting tools.")}>No-tool rerun</button>
        <button type="button" className={state === "changedContext" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("changedContext", "Changed context is visible before comparison.")}>Changed context</button>
        <button type="button" className={state === "changedModel" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("changedModel", "Changed model explains answer drift between versions.")}>Changed model</button>
        <button type="button" className={state === "compareVersions" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("compareVersions", "Compare versions shows previous answer and new answer side by side.")}>Compare versions</button>
        <button type="button" className={state === "restorePrevious" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("restorePrevious", "Restore previous recovers v1 without deleting v2.")}>Restore previous</button>
        <button type="button" className={state === "cooldown" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("cooldown", "Cooldown explains next retry timing.")}>Cooldown</button>
        <button type="button" className={state === "rateLimited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("rateLimited", "Rate limited keeps the prompt and previous answer visible.")}>Rate limited</button>
        <button type="button" className={state === "safetyBlocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("safetyBlocked", "Safety blocked replaces repeat attempts with an explanation.")}>Safety blocked</button>
        <button type="button" className={state === "manualEdits" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("manualEdits", "Manual edits present blocks overwrite and routes to compare.")}>Manual edits present</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile regenerate preserves version and source context in compact form.")}>Mobile regenerate</button>
      </div>
      <RegenerateRetryPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function RegenerateRetryBadUx() {
  type Mode = "vague-try-again" | "silent-overwrite" | "hidden-context-change" | "duplicate-tool-side-effect" | "automatic-retry-loop" | "lost-partial" | "prompt-edit-disguise";
  const [mode, setMode] = useState<Mode>("vague-try-again");
  const copy: Record<Mode, string> = {
    "vague-try-again": "Vague try again hides whether the action retries the same prompt, edits prompt, retries sources, retries tools, or regenerates answer.",
    "silent-overwrite": "Silent overwrite replaces the previous answer and citations with no compare versions or restore previous path.",
    "hidden-context-change": "Hidden context change swaps model, source scope, or carried files without showing why the new answer differs.",
    "duplicate-tool-side-effect": "Duplicate tool side effect reruns an external tool while presenting the action as harmless answer regeneration.",
    "automatic-retry-loop": "Automatic retry loop keeps retrying through rate limited and safety blocked states.",
    "lost-partial": "Lost partial deletes stopped output instead of offering continue partial output or retry from start.",
    "prompt-edit-disguise": "Prompt edit disguise changes the request before generation while labeling the action retry same prompt."
  };
  const labels: Record<Mode, string[]> = {
    "vague-try-again": ["Vague try again", "No prompt snapshot", "No version", "No source state"],
    "silent-overwrite": ["Silent overwrite", "Previous answer lost", "No compare", "No restore"],
    "hidden-context-change": ["Hidden context change", "Changed model", "Changed sources", "No notice"],
    "duplicate-tool-side-effect": ["Duplicate tool side effect", "Tool ran twice", "No idempotency", "No gate"],
    "automatic-retry-loop": ["Automatic retry loop", "Rate limited", "Safety blocked", "No cooldown"],
    "lost-partial": ["Lost partial", "Partial output gone", "No continue", "No copy partial"],
    "prompt-edit-disguise": ["Prompt edit disguise", "Prompt changed", "Same prompt label", "No review"]
  };

  return (
    <div className={`quality-example regenerate-retry-bad-demo is-${mode}`}>
      <div className="regenerate-retry-bad-card">{mode === "automatic-retry-loop" ? "Retrying..." : "Try again"}</div>
      <div className="regenerate-retry-broken-grid" aria-label="Broken regenerate retry">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "silent-overwrite" ? "Silent overwrite" : "Regenerate retry failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row regenerate-retry-controls">
        <button type="button" className={mode === "vague-try-again" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague-try-again")}>Vague try again</button>
        <button type="button" className={mode === "silent-overwrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silent-overwrite")}>Silent overwrite</button>
        <button type="button" className={mode === "hidden-context-change" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-context-change")}>Hidden context change</button>
        <button type="button" className={mode === "duplicate-tool-side-effect" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicate-tool-side-effect")}>Duplicate tool side effect</button>
        <button type="button" className={mode === "automatic-retry-loop" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("automatic-retry-loop")}>Automatic retry loop</button>
        <button type="button" className={mode === "lost-partial" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lost-partial")}>Lost partial</button>
        <button type="button" className={mode === "prompt-edit-disguise" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("prompt-edit-disguise")}>Prompt edit disguise</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RegenerateRetryGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RegenerateRetryBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RegenerateRetryGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <RegenerateRetryBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
