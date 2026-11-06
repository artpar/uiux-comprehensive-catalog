import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ScopeClarificationState =
  | "ambiguousRequest"
  | "originalRequest"
  | "missingBoundary"
  | "clarifyingQuestion"
  | "boundedChoices"
  | "objectSet"
  | "audience"
  | "timeframe"
  | "sourceSet"
  | "actionTarget"
  | "selectedScope"
  | "visibleDefault"
  | "skipClarification"
  | "blockedUntilClarified"
  | "permissionLimited"
  | "conflictingScope"
  | "staleClarification"
  | "resumeAnswer"
  | "changeScope"
  | "mobile";

const scopeClarificationCopy: Record<ScopeClarificationState, {
  label: string;
  message: string;
  boundary: string;
  choices: string[];
  selected: string;
  status: string;
  tone: "neutral" | "working" | "ready" | "warning" | "danger";
}> = {
  ambiguousRequest: {
    label: "Ambiguous request",
    message: "The agent pauses because clean up records does not name which records are in scope.",
    boundary: "Record set",
    choices: ["Visible filtered records", "Selected accounts", "Entire workspace"],
    selected: "Not chosen",
    status: "Clarification needed",
    tone: "warning"
  },
  originalRequest: {
    label: "Original request",
    message: "The original request stays visible so the user knows what will resume after scope is chosen.",
    boundary: "Pending request",
    choices: ["Show request", "Edit request", "Cancel"],
    selected: "Clean up stale records",
    status: "Request preserved",
    tone: "neutral"
  },
  missingBoundary: {
    label: "Missing boundary",
    message: "Missing boundary names exactly what the AI cannot infer safely.",
    boundary: "Which accounts?",
    choices: ["This list", "Owned by me", "All accounts"],
    selected: "Not chosen",
    status: "Action blocked",
    tone: "warning"
  },
  clarifyingQuestion: {
    label: "Clarifying question",
    message: "The question asks for the smallest useful scope before retrieval or tool use.",
    boundary: "What should I clean up?",
    choices: ["Current filter", "Selected 12 records", "Ask me later"],
    selected: "Current filter",
    status: "Ready to continue",
    tone: "ready"
  },
  boundedChoices: {
    label: "Bounded choices",
    message: "Bounded choices avoid a long interview and keep the next step clear.",
    boundary: "Scope choices",
    choices: ["Last 30 days", "This quarter", "Custom range"],
    selected: "Last 30 days",
    status: "Choice captured",
    tone: "ready"
  },
  objectSet: {
    label: "Object set",
    message: "Object set clarification separates selected records from everything the user can access.",
    boundary: "Objects",
    choices: ["Selected records", "Visible filtered records", "All records"],
    selected: "Visible filtered records",
    status: "Scope preview shown",
    tone: "ready"
  },
  audience: {
    label: "Audience",
    message: "Audience clarification changes tone, evidence, and allowed content before drafting.",
    boundary: "Audience",
    choices: ["Internal ops", "Customer admins", "All customers"],
    selected: "Customer admins",
    status: "Draft blocked until chosen",
    tone: "working"
  },
  timeframe: {
    label: "Timeframe",
    message: "Timeframe clarification prevents a broad historical query when recent data is enough.",
    boundary: "Time range",
    choices: ["Last 7 days", "Last 30 days", "This quarter"],
    selected: "Last 30 days",
    status: "Retrieval scoped",
    tone: "ready"
  },
  sourceSet: {
    label: "Source set",
    message: "Source set clarification controls whether the answer uses cited policy only or all workspace data.",
    boundary: "Sources",
    choices: ["Cited policy only", "Approved knowledge", "All workspace data"],
    selected: "Approved knowledge",
    status: "Sources narrowed",
    tone: "ready"
  },
  actionTarget: {
    label: "Action target",
    message: "Action target clarification is required before the agent can edit records.",
    boundary: "Target to edit",
    choices: ["Selected 12", "Visible 48", "All 12,400"],
    selected: "Selected 12",
    status: "Tool scope ready",
    tone: "working"
  },
  selectedScope: {
    label: "Selected scope",
    message: "Selected scope previews exactly what the next answer, plan, or tool call will use.",
    boundary: "Scope preview",
    choices: ["Selected 12 records", "No emails", "No deletes"],
    selected: "Selected 12 records",
    status: "Continue available",
    tone: "ready"
  },
  visibleDefault: {
    label: "Visible default",
    message: "Visible default is low-risk, named, and changeable before continuing.",
    boundary: "Default",
    choices: ["Current filter", "Change scope", "Cancel"],
    selected: "Current filter",
    status: "Default disclosed",
    tone: "neutral"
  },
  skipClarification: {
    label: "Skip clarification",
    message: "Skip clarification is allowed only for low-risk output where a visible default is acceptable.",
    boundary: "Skip behavior",
    choices: ["Use visible default", "Answer broadly", "Cancel"],
    selected: "Use visible default",
    status: "Low-risk only",
    tone: "neutral"
  },
  blockedUntilClarified: {
    label: "Blocked until clarified",
    message: "High-impact record changes stay blocked until target and authority are explicit.",
    boundary: "Required scope",
    choices: ["Select records", "Use filter", "Cancel run"],
    selected: "Not chosen",
    status: "Blocked",
    tone: "danger"
  },
  permissionLimited: {
    label: "Permission-limited scope",
    message: "Permission-limited scope explains why all-workspace cleanup is unavailable.",
    boundary: "Permission",
    choices: ["Owned by me", "Visible records", "All workspace unavailable"],
    selected: "Visible records",
    status: "Broader scope disabled",
    tone: "warning"
  },
  conflictingScope: {
    label: "Conflicting scope",
    message: "Conflicting scope catches incompatible boundaries before the AI proceeds.",
    boundary: "Conflict",
    choices: ["Selected records", "All records", "Resolve conflict"],
    selected: "Resolve conflict",
    status: "Needs repair",
    tone: "danger"
  },
  staleClarification: {
    label: "Stale clarification",
    message: "Stale clarification appears when filters or permissions changed after the user answered.",
    boundary: "Freshness",
    choices: ["Reuse old scope", "Review changed filter", "Ask again"],
    selected: "Review changed filter",
    status: "Scope stale",
    tone: "warning"
  },
  resumeAnswer: {
    label: "Resume answer",
    message: "Resume answer continues the original request with the selected scope attached.",
    boundary: "Resume target",
    choices: ["Answer now", "Preview plan", "Change scope"],
    selected: "Answer now",
    status: "Resuming",
    tone: "working"
  },
  changeScope: {
    label: "Change scope",
    message: "Change scope lets users revise the boundary before high-impact work begins.",
    boundary: "Change before run",
    choices: ["Selected 12", "Visible 48", "Cancel"],
    selected: "Visible 48",
    status: "Scope changed",
    tone: "ready"
  },
  mobile: {
    label: "Mobile clarification",
    message: "Mobile clarification keeps the request, missing boundary, choices, and continue action in one compact sheet.",
    boundary: "Mobile sheet",
    choices: ["Selected", "Visible", "Cancel"],
    selected: "Selected",
    status: "Compact ready",
    tone: "ready"
  }
};

function ScopeClarificationPanel({ state }: { state: ScopeClarificationState }) {
  const copy = scopeClarificationCopy[state];

  return (
    <section className={`scope-clarification-shell is-${copy.tone}`} aria-label="Scope clarification">
      <header className="scope-clarification-header">
        <div>
          <strong>{copy.label}</strong>
          <span>{copy.message}</span>
        </div>
        <span className="scope-clarification-state">{copy.status}</span>
      </header>
      <div className="scope-clarification-request">
        <span>Original request</span>
        <p>Clean up stale customer records and draft a short update.</p>
      </div>
      <div className="scope-clarification-question">
        <strong>{copy.boundary}</strong>
        <p>Which scope should I use before I answer, plan, retrieve sources, or run tools?</p>
        <div className="scope-clarification-options" role="list" aria-label="Scope choices">
          {copy.choices.map((choice) => (
            <span key={choice} role="listitem" className={choice === copy.selected ? "is-selected" : ""}>{choice}</span>
          ))}
        </div>
      </div>
      <div className="scope-clarification-grid">
        <span><b>Selected scope</b>{copy.selected}</span>
        <span><b>Visible default</b>Current filtered list only</span>
        <span><b>Resume target</b>Answer and plan after scope is set</span>
        <span><b>Risk rule</b>Tools blocked until clarified</span>
      </div>
      <div className="scope-clarification-actions">
        <button type="button" className="demo-button small">Continue with selected scope</button>
        <button type="button" className="demo-button small">Change scope</button>
        <button type="button" className="demo-button small">Cancel request</button>
      </div>
    </section>
  );
}

function ScopeClarificationGoodUi() {
  return (
    <div className="quality-example scope-clarification-demo">
      <ScopeClarificationPanel state="selectedScope" />
      <p className="demo-status">The scope clarification surface preserves the original request, names the missing boundary, shows bounded choices, selected scope, visible default, blocked state, resume target, and change-scope controls.</p>
    </div>
  );
}

function ScopeClarificationBadUi() {
  return (
    <div className="bad-ui-sample scope-clarification-bad-demo is-broad-assumption">
      <div className="scope-clarification-bad-card">Working on everything</div>
      <div className="scope-clarification-broken-grid" aria-label="Broken scope clarification">
        <span>Broad assumption</span>
        <span>No original request</span>
        <span>No missing boundary</span>
        <span>No selected scope</span>
      </div>
      <p>The broken UI acts across the broadest possible target without asking which records, sources, audience, timeframe, or authority should apply.</p>
    </div>
  );
}

function ScopeClarificationGoodUx() {
  const [state, setState] = useState<ScopeClarificationState>("ambiguousRequest");
  const [message, setMessage] = useState("Ambiguous request pauses before the agent chooses a risky target scope.");
  const choose = (next: ScopeClarificationState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example scope-clarification-demo">
      <div className="scope-clarification-controls" aria-label="Scope clarification exercise controls">
        <button type="button" className={state === "ambiguousRequest" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("ambiguousRequest", "Ambiguous request pauses before the agent chooses a risky target scope.")}>Ambiguous request</button>
        <button type="button" className={state === "originalRequest" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("originalRequest", "Original request stays visible while the user clarifies scope.")}>Original request</button>
        <button type="button" className={state === "missingBoundary" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("missingBoundary", "Missing boundary names exactly what the AI cannot infer.")}>Missing boundary</button>
        <button type="button" className={state === "clarifyingQuestion" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("clarifyingQuestion", "Clarifying question asks the smallest useful scope question.")}>Clarifying question</button>
        <button type="button" className={state === "boundedChoices" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("boundedChoices", "Bounded choices avoid a long interview.")}>Bounded choices</button>
        <button type="button" className={state === "objectSet" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("objectSet", "Object set separates selected records from everything accessible.")}>Object set</button>
        <button type="button" className={state === "audience" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("audience", "Audience clarification changes tone, evidence, and privacy.")}>Audience</button>
        <button type="button" className={state === "timeframe" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("timeframe", "Timeframe clarification prevents accidental broad retrieval.")}>Timeframe</button>
        <button type="button" className={state === "sourceSet" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("sourceSet", "Source set clarification controls which evidence can be used.")}>Source set</button>
        <button type="button" className={state === "actionTarget" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("actionTarget", "Action target clarification is required before tool use.")}>Action target</button>
        <button type="button" className={state === "selectedScope" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("selectedScope", "Selected scope previews exactly what will continue.")}>Selected scope</button>
        <button type="button" className={state === "visibleDefault" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("visibleDefault", "Visible default is named and changeable before continuing.")}>Visible default</button>
        <button type="button" className={state === "skipClarification" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("skipClarification", "Skip clarification is allowed only for low-risk ambiguity.")}>Skip clarification</button>
        <button type="button" className={state === "blockedUntilClarified" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blockedUntilClarified", "Blocked until clarified prevents broad high-impact action.")}>Blocked until clarified</button>
        <button type="button" className={state === "permissionLimited" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permissionLimited", "Permission-limited scope explains unavailable choices.")}>Permission-limited scope</button>
        <button type="button" className={state === "conflictingScope" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("conflictingScope", "Conflicting scope catches incompatible boundaries before proceeding.")}>Conflicting scope</button>
        <button type="button" className={state === "staleClarification" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("staleClarification", "Stale clarification appears after filters or permissions change.")}>Stale clarification</button>
        <button type="button" className={state === "resumeAnswer" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("resumeAnswer", "Resume answer continues the original request with selected scope attached.")}>Resume answer</button>
        <button type="button" className={state === "changeScope" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("changeScope", "Change scope lets users revise the boundary before work begins.")}>Change scope</button>
        <button type="button" className={state === "mobile" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("mobile", "Mobile clarification keeps request, choices, and continue action compact.")}>Mobile clarification</button>
      </div>
      <ScopeClarificationPanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ScopeClarificationBadUx() {
  type Mode = "broad-assumption" | "endless-questions" | "hidden-default" | "prompt-rewrite" | "asks-after-acting" | "option-dump" | "forgets-scope";
  const [mode, setMode] = useState<Mode>("broad-assumption");
  const copy: Record<Mode, string> = {
    "broad-assumption": "Broad assumption lets the assistant answer or act across everything without revealing the chosen target.",
    "endless-questions": "Endless questions turn one missing boundary into a long interview before any useful progress.",
    "hidden-default": "Hidden default uses current filter, all data, or recent records without naming the default.",
    "prompt-rewrite": "Prompt rewrite converts clarification into hidden instruction changes that users cannot inspect.",
    "asks-after-acting": "Asks after acting requests scope only after retrieval, record edits, or messages have already happened.",
    "option-dump": "Option dump exposes every backend scope and permission label instead of likely user choices.",
    "forgets-scope": "Forgets scope asks again or drifts to a broader target after the user already answered."
  };
  const labels: Record<Mode, string[]> = {
    "broad-assumption": ["Broad assumption", "All records", "No question", "No scope preview"],
    "endless-questions": ["Endless questions", "Ten prompts", "No smallest boundary", "No continue"],
    "hidden-default": ["Hidden default", "Current filter assumed", "No change path", "No disclosure"],
    "prompt-rewrite": ["Prompt rewrite", "Hidden instruction", "No task state", "No review"],
    "asks-after-acting": ["Asks after acting", "Tools already ran", "Records edited", "Scope too late"],
    "option-dump": ["Option dump", "Backend labels", "Too many choices", "No recommendation"],
    "forgets-scope": ["Forgets scope", "Answer drift", "Asked again", "No persistence"]
  };

  return (
    <div className={`quality-example scope-clarification-bad-demo is-${mode}`}>
      <div className="scope-clarification-bad-card">{mode === "asks-after-acting" ? "Already ran" : "Assumed scope"}</div>
      <div className="scope-clarification-broken-grid" aria-label="Broken scope clarification">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "hidden-default" ? "Hidden default" : "Scope clarification failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row scope-clarification-controls">
        <button type="button" className={mode === "broad-assumption" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("broad-assumption")}>Broad assumption</button>
        <button type="button" className={mode === "endless-questions" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("endless-questions")}>Endless questions</button>
        <button type="button" className={mode === "hidden-default" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-default")}>Hidden default</button>
        <button type="button" className={mode === "prompt-rewrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("prompt-rewrite")}>Prompt rewrite</button>
        <button type="button" className={mode === "asks-after-acting" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("asks-after-acting")}>Asks after acting</button>
        <button type="button" className={mode === "option-dump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("option-dump")}>Option dump</button>
        <button type="button" className={mode === "forgets-scope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("forgets-scope")}>Forgets scope</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ScopeClarificationGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ScopeClarificationBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ScopeClarificationGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ScopeClarificationBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
