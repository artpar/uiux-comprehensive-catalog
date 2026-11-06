import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type PromptBoxState = "draft" | "context" | "attached" | "overLimit" | "unavailable" | "blocked" | "submitted" | "pending" | "failed" | "retry" | "edit";

const promptBoxCopy: Record<PromptBoxState, { title: string; status: string; tone: string }> = {
  draft: {
    title: "Draft prompt",
    status: "Draft is editable and has not been sent.",
    tone: "neutral"
  },
  context: {
    title: "Selected context",
    status: "Selected contract text and current page context will be included.",
    tone: "ready"
  },
  attached: {
    title: "File attached",
    status: "Risk-notes.pdf is attached and readable by the model.",
    tone: "ready"
  },
  overLimit: {
    title: "Over limit",
    status: "Prompt is over the context limit; remove text or an attachment before sending.",
    tone: "warning"
  },
  unavailable: {
    title: "Source unavailable",
    status: "The selected contract version is stale; refresh source before send.",
    tone: "warning"
  },
  blocked: {
    title: "Send blocked",
    status: "Safety review required before sending customer personal data to the model.",
    tone: "danger"
  },
  submitted: {
    title: "Prompt submitted",
    status: "Exact prompt was sent with visible context chips and output format.",
    tone: "ready"
  },
  pending: {
    title: "Generation pending",
    status: "Request is running; draft and attachments remain visible while output loads.",
    tone: "working"
  },
  failed: {
    title: "Failed send",
    status: "Network failed, but draft, selected source, and file attachment were preserved.",
    tone: "danger"
  },
  retry: {
    title: "Retry ready",
    status: "Retry will resend the same prompt and visible context, not a hidden changed request.",
    tone: "working"
  },
  edit: {
    title: "Edit and resend",
    status: "Previous prompt is back in the editor so the user can narrow the request before resending.",
    tone: "ready"
  }
};

function PromptBoxComposer({
  state,
  draft = "Summarize renewal risk for a non-lawyer. Use bullet points and cite the selected clause.",
  submitted = false
}: {
  state: PromptBoxState;
  draft?: string;
  submitted?: boolean;
}) {
  const copy = promptBoxCopy[state];
  const blocked = state === "overLimit" || state === "unavailable" || state === "blocked";

  return (
    <section className={`prompt-box-composer is-${copy.tone}`} aria-label="AI prompt composer">
      <header className="prompt-box-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="prompt-box-mode">Mode: Contract review</span>
      </header>
      <label className="prompt-box-editor">
        <span>AI request draft</span>
        <textarea value={draft} readOnly rows={4} />
      </label>
      <div className="prompt-box-chips" aria-label="Prompt context included">
        <span>Selected text: renewal clause</span>
        <span>Source: Contract v4</span>
        <span>Output: bullets</span>
        <span>Tool access: read-only</span>
        {state === "attached" || state === "failed" || state === "retry" ? <span>File: risk-notes.pdf</span> : null}
        {state === "overLimit" ? <span>Limit: 1,240 tokens over</span> : null}
        {state === "unavailable" ? <span>Repair: refresh source</span> : null}
        {state === "blocked" ? <span>Approval: privacy review</span> : null}
      </div>
      <div className="prompt-box-actions">
        <button type="button" className="demo-button small">Attach file</button>
        <button type="button" className="demo-button small">Remove context</button>
        <button type="button" className="demo-button small">Clear draft</button>
        <button type="button" className={blocked ? "demo-button small" : "demo-button small primary"} disabled={blocked}>{submitted ? "Edit and resend" : "Send prompt"}</button>
      </div>
    </section>
  );
}

function PromptBoxGoodUi() {
  return (
    <div className="quality-example prompt-box-demo">
      <PromptBoxComposer state="context" />
      <p className="demo-status">The prompt box exposes editable draft text, selected context, source, output format, read-only tool access, explicit send prompt, generation pending, failed send, retry, and edit and resend recovery before any AI request runs.</p>
    </div>
  );
}

function PromptBoxBadUi() {
  return (
    <div className="bad-ui-sample prompt-box-bad-demo is-hidden-context">
      <div className="prompt-box-broken-field">Ask anything...</div>
      <div className="prompt-box-broken-grid">
        {["No label", "Hidden source", "Auto tools", "Enter sends"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI hides context, source, tool access, newline behavior, and blocked-send reasons behind a vague prompt field.</p>
    </div>
  );
}

function PromptBoxGoodUx() {
  const [state, setState] = useState<PromptBoxState>("draft");
  const [draft, setDraft] = useState("Summarize renewal risk for a non-lawyer. Use bullet points and cite the selected clause.");
  const [message, setMessage] = useState("Draft is editable and nothing is sent until the user activates Send prompt.");

  const choose = (next: PromptBoxState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example prompt-box-demo">
      <div className="prompt-box-toolbar" aria-label="Prompt box exercise controls">
        <button type="button" className={state === "draft" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("draft", "Empty-field hint text stays instructional; the editable draft is the only prompt that can be sent.")}>Draft</button>
        <button type="button" className={state === "context" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("context", "Selected text, current page, source, output format, and read-only tool scope are visible before send.")}>Context chips</button>
        <button type="button" className={state === "attached" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("attached", "Attached file is named and validated before it becomes prompt context.")}>Attach file</button>
        <button type="button" className={state === "overLimit" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("overLimit", "Over-limit prompt blocks send and points to removing text or attachments.")}>Over limit</button>
        <button type="button" className={state === "unavailable" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("unavailable", "Unavailable source blocks send until the selected contract context is refreshed.")}>Unavailable source</button>
        <button type="button" className={state === "blocked" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("blocked", "Safety block explains that personal data requires review before model submission.")}>Blocked send</button>
        <button type="button" className={state === "submitted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("submitted", "Submitted state records the exact prompt, visible context, and output expectation.")}>Send prompt</button>
        <button type="button" className={state === "pending" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("pending", "Generation pending keeps draft and attachments visible while response loads.")}>Pending</button>
        <button type="button" className={state === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "Failed request preserved the draft, selected source, file attachment, and focus near retry.")}>Failed send</button>
        <button type="button" className={state === "retry" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retry", "Retry will resend the same visible prompt and context rather than a hidden changed request.")}>Retry</button>
        <button type="button" className={state === "edit" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setDraft("Summarize only renewal termination risk in three bullets for the legal review owner.");
          choose("edit", "Edit and resend returns the previous prompt to the editor so the user can narrow it before sending again.");
        }}>Edit resend</button>
        <button type="button" className="demo-button small" onClick={() => {
          setDraft("");
          choose("draft", "Clear draft removes only editable text, not submitted prompt history or source availability.");
        }}>Clear draft</button>
      </div>
      <PromptBoxComposer state={state} draft={draft || " "} submitted={state === "submitted" || state === "edit"} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function PromptBoxBadUx() {
  type Mode = "hint-submit" | "enter-send" | "hidden-context" | "unreadable-file" | "auto-suggest" | "draft-loss" | "command-disguise";
  const [mode, setMode] = useState<Mode>("hint-submit");
  const copy: Record<Mode, string> = {
    "hint-submit": "Empty-field hint text becomes the submitted prompt, so users send a vague request they never authored.",
    "enter-send": "Enter sends an unfinished multi-line request instead of respecting newline or shortcut expectations.",
    "hidden-context": "The model uses page and workspace data that the prompt box never shows before send.",
    "unreadable-file": "An attached file looks ready, but the model cannot read it and the user learns only after failure.",
    "auto-suggest": "A starter prompt auto-submits instead of loading into an editable draft.",
    "draft-loss": "A rate limit clears the prompt, attachment, and selected source.",
    "command-disguise": "A destructive app command is hidden inside conversational prompt wording."
  };
  const labels: Record<Mode, string[]> = {
    "hint-submit": ["Ask anything", "Sent", "No draft", "No review"],
    "enter-send": ["Line 1", "Enter", "Sent early", "No undo"],
    "hidden-context": ["Uses files", "No chips", "Hidden tools", "Unknown source"],
    "unreadable-file": ["File added", "Unreadable", "Late error", "Draft risk"],
    "auto-suggest": ["Improve this", "Auto-run", "No edit", "Overpromise"],
    "draft-loss": ["429", "Draft gone", "File gone", "Start over"],
    "command-disguise": ["Delete old leads", "Looks chatty", "Runs command", "No approval"]
  };

  return (
    <div className={`quality-example prompt-box-bad-demo is-${mode}`}>
      <div className="prompt-box-broken-field">{mode === "command-disguise" ? "Please clean this up" : "Ask anything..."}</div>
      <div className="prompt-box-broken-grid">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "command-disguise" ? "Command disguised" : mode === "draft-loss" ? "Draft lost" : "Prompt failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row prompt-box-controls">
        <button type="button" className={mode === "hint-submit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hint-submit")}>Hint submit</button>
        <button type="button" className={mode === "enter-send" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("enter-send")}>Enter send</button>
        <button type="button" className={mode === "hidden-context" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-context")}>Hidden context</button>
        <button type="button" className={mode === "unreadable-file" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unreadable-file")}>Unreadable file</button>
        <button type="button" className={mode === "auto-suggest" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auto-suggest")}>Auto suggest</button>
        <button type="button" className={mode === "draft-loss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("draft-loss")}>Draft loss</button>
        <button type="button" className={mode === "command-disguise" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("command-disguise")}>Command disguise</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptBoxGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptBoxBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptBoxGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptBoxBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
