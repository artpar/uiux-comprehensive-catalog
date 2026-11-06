import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type StreamingResponseState = "receiving" | "first" | "active" | "citations" | "tool" | "moderation" | "stalled" | "stopped" | "continued" | "failed" | "retry" | "complete" | "copyFinal";

const streamingResponseCopy: Record<StreamingResponseState, { title: string; status: string; tone: string; chunks: string[]; chips: string[] }> = {
  receiving: {
    title: "Receiving stream",
    status: "Request accepted. Waiting for first output event before showing generated text.",
    tone: "working",
    chunks: [],
    chips: ["Queued", "No first token", "Stop available", "Prompt preserved"]
  },
  first: {
    title: "First output",
    status: "First output arrived, but the answer is still partial and final checks are pending.",
    tone: "working",
    chunks: ["The renewal clause creates three risks..."],
    chips: ["First token", "Partial", "Citations pending", "Copy final locked"]
  },
  active: {
    title: "Streaming deltas",
    status: "New chunks append in a stable answer region without moving focus or controls.",
    tone: "working",
    chunks: ["The renewal clause creates three risks.", "First, the 30-day notice window is easy to miss.", "Second, price changes can apply at renewal."],
    chips: ["3 chunks", "Still generating", "Stop generation", "Live status batched"]
  },
  citations: {
    title: "Citations pending",
    status: "Text is visible, but citation chips remain pending until source events resolve.",
    tone: "warning",
    chunks: ["The renewal clause creates three risks.", "Citation 2 is still being resolved before this answer can be treated as sourced."],
    chips: ["Citation 1 ready", "Citation 2 pending", "Source check", "Final copy locked"]
  },
  tool: {
    title: "Tool output pending",
    status: "The answer names a calculation only after the tool result arrives.",
    tone: "warning",
    chunks: ["I am checking the renewal date against the contract calendar.", "Tool event pending: date difference calculation."],
    chips: ["Tool call active", "Arguments streaming", "Result pending", "Do not apply"]
  },
  moderation: {
    title: "Moderation hold",
    status: "Generated text is paused while a content filter decision resolves.",
    tone: "danger",
    chunks: ["The assistant started a sensitive-data explanation.", "Further output is held until the safety check completes."],
    chips: ["Safety check", "Output held", "Partial hidden", "Review needed"]
  },
  stalled: {
    title: "Stream stalled",
    status: "No event received for 18 seconds. Partial output is preserved with recovery controls.",
    tone: "warning",
    chunks: ["The renewal clause creates three risks.", "The third risk is..."],
    chips: ["18s without event", "Copy partial", "Retry", "Discard"]
  },
  stopped: {
    title: "Stopped partial",
    status: "User stopped generation. The answer is labelled partial and can be continued.",
    tone: "warning",
    chunks: ["The renewal clause creates three risks.", "First, the 30-day notice window is easy to miss."],
    chips: ["Stopped by user", "Partial answer", "Continue", "Regenerate"]
  },
  continued: {
    title: "Continued stream",
    status: "Continue resumes from the partial answer and keeps the original prompt attached.",
    tone: "working",
    chunks: ["The renewal clause creates three risks.", "First, the 30-day notice window is easy to miss.", "Continuing: second, renewal pricing must be reviewed before acceptance."],
    chips: ["Continued", "Same prompt", "Partial retained", "Generating"]
  },
  failed: {
    title: "Failed stream",
    status: "Network failure stopped the stream, but prompt, partial output, and source state remain recoverable.",
    tone: "danger",
    chunks: ["The renewal clause creates three risks.", "First, the 30-day notice window is easy to miss."],
    chips: ["Network failed", "Prompt kept", "Retry stream", "Copy partial"]
  },
  retry: {
    title: "Retry stream",
    status: "Retry starts a new stream from the same submitted prompt and labels it as a new attempt.",
    tone: "working",
    chunks: ["Attempt 2 started from the same prompt.", "The renewal clause creates three risks."],
    chips: ["Attempt 2", "Same prompt", "Same sources", "Final pending"]
  },
  complete: {
    title: "Complete answer",
    status: "Terminal event arrived. Citations, tool result, and final status are ready.",
    tone: "ready",
    chunks: ["The renewal clause creates three risks.", "First, the 30-day notice window is easy to miss.", "Second, price changes can apply at renewal.", "Third, auto-renewal may extend the commitment unless notice is sent."],
    chips: ["Complete", "Citations ready", "Tool result ready", "Copy final"]
  },
  copyFinal: {
    title: "Final copied",
    status: "Copy action is enabled only for the completed answer and names what was copied.",
    tone: "ready",
    chunks: ["The renewal clause creates three risks.", "First, the 30-day notice window is easy to miss.", "Second, price changes can apply at renewal.", "Third, auto-renewal may extend the commitment unless notice is sent."],
    chips: ["Copied final", "4 chunks", "Sources included", "Partial excluded"]
  }
};

function StreamingResponsePanel({ state }: { state: StreamingResponseState }) {
  const copy = streamingResponseCopy[state];
  const isTerminal = state === "complete" || state === "copyFinal";
  const canContinue = state === "stopped" || state === "stalled" || state === "failed";

  return (
    <section className={`streaming-response-shell is-${copy.tone}`} aria-label="Streaming generated answer">
      <header className="streaming-response-header">
        <div>
          <strong>{copy.title}</strong>
          <span>{copy.status}</span>
        </div>
        <span className="streaming-response-phase">{isTerminal ? "Final" : "Partial"}</span>
      </header>
      <div className="streaming-response-chips" aria-label="Stream state">
        {copy.chips.map((chip) => <span key={chip}>{chip}</span>)}
      </div>
      <div className="streaming-response-output" aria-label="Generated response output" aria-busy={!isTerminal}>
        {copy.chunks.length ? copy.chunks.map((chunk, index) => (
          <p key={`${chunk}-${index}`} className={index === copy.chunks.length - 1 && !isTerminal ? "is-current" : ""}>{chunk}</p>
        )) : <p className="is-current">Waiting for first output event...</p>}
      </div>
      <div className="streaming-response-progress" aria-label="Stream event progress">
        <span className={copy.chunks.length >= 1 ? "is-done" : ""}>request</span>
        <span className={copy.chunks.length >= 1 ? "is-done" : ""}>first output</span>
        <span className={copy.chunks.length >= 3 ? "is-done" : ""}>chunks</span>
        <span className={state === "citations" || isTerminal ? "is-done" : ""}>sources</span>
        <span className={isTerminal ? "is-done" : ""}>complete</span>
      </div>
      <div className="streaming-response-actions">
        <button type="button" className="demo-button small">{isTerminal ? "Regenerate" : "Stop generation"}</button>
        <button type="button" className="demo-button small">{canContinue ? "Continue" : "Retry"}</button>
        <button type="button" className={isTerminal ? "demo-button small primary" : "demo-button small"} disabled={!isTerminal}>Copy final</button>
      </div>
    </section>
  );
}

function StreamingResponseGoodUi() {
  return (
    <div className="quality-example streaming-response-demo">
      <StreamingResponsePanel state="active" />
      <p className="demo-status">The streaming response has a stable output region, partial label, batched stream status, stop control, pending final copy, and visible event progress before completion.</p>
    </div>
  );
}

function StreamingResponseBadUi() {
  return (
    <div className="bad-ui-sample streaming-response-bad-demo is-early-copy">
      <div className="streaming-response-broken-output">The answer is probably final...</div>
      <div className="streaming-response-broken-grid">
        {["No partial label", "Copy enabled", "Sources later", "Cursor forever"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken UI lets partial generated text look complete, exposes early copy, and hides citation, safety, stream, and failure status.</p>
    </div>
  );
}

function StreamingResponseGoodUx() {
  const [state, setState] = useState<StreamingResponseState>("receiving");
  const [message, setMessage] = useState("Waiting for first output event. Prompt and source scope remain attached.");

  const choose = (next: StreamingResponseState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example streaming-response-demo">
      <div className="streaming-response-controls" aria-label="Streaming response exercise controls">
        <button type="button" className={state === "receiving" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("receiving", "Receiving state shows no generated text until the first output event arrives.")}>Receiving</button>
        <button type="button" className={state === "first" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("first", "First output confirms generation started, but the answer remains partial.")}>First output</button>
        <button type="button" className={state === "active" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("active", "Streaming deltas append in a stable output region without focus jumps.")}>Deltas</button>
        <button type="button" className={state === "citations" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("citations", "Citation chips stay pending until source events resolve.")}>Citations pending</button>
        <button type="button" className={state === "tool" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("tool", "Tool output is visible as pending so users do not apply an incomplete calculation.")}>Tool pending</button>
        <button type="button" className={state === "moderation" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("moderation", "Moderation hold pauses visible output and explains that a safety check is resolving.")}>Moderation hold</button>
        <button type="button" className={state === "stalled" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stalled", "Stalled stream preserves partial output and exposes recovery after the event gap threshold.")}>Stalled</button>
        <button type="button" className={state === "stopped" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stopped", "Stopped stream is labelled partial and can be continued, retried, copied as partial, or discarded.")}>Stop</button>
        <button type="button" className={state === "continued" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("continued", "Continue resumes from the preserved partial answer using the same submitted prompt.")}>Continue</button>
        <button type="button" className={state === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "Failed stream keeps the prompt, partial answer, and source state near Retry.")}>Failed</button>
        <button type="button" className={state === "retry" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retry", "Retry starts attempt 2 from the same prompt and labels it as a new stream.")}>Retry</button>
        <button type="button" className={state === "complete" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("complete", "Complete state arrives only after terminal event, citations, tool result, and final metadata.")}>Complete</button>
        <button type="button" className={state === "copyFinal" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copyFinal", "Copy final is enabled only after completion and excludes partial-only text.")}>Copy final</button>
      </div>
      <StreamingResponsePanel state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function StreamingResponseBadUx() {
  type Mode = "early-copy" | "complete-lie" | "noisy-live" | "auto-scroll" | "erased-partial" | "early-citation" | "malformed-code" | "spinner-only";
  const [mode, setMode] = useState<Mode>("early-copy");
  const copy: Record<Mode, string> = {
    "early-copy": "Copy is enabled on partial output before final checks, sources, and terminal metadata arrive.",
    "complete-lie": "A stopped stream is displayed as a complete answer, so users cannot tell generation ended early.",
    "noisy-live": "Every token is sent to the live region, overwhelming assistive technology users.",
    "auto-scroll": "New chunks force scroll to the bottom while the user is reading or selecting earlier output.",
    "erased-partial": "A network failure erases the useful partial answer and submitted prompt.",
    "early-citation": "Citation chips appear final before retrieval and source matching have resolved.",
    "malformed-code": "A half-written code block can be copied before the closing fence and validation arrive.",
    "spinner-only": "The UI hides useful first output behind a spinner even though safe generated text is available."
  };
  const labels: Record<Mode, string[]> = {
    "early-copy": ["Partial text", "Copy ready", "Sources later", "No warning"],
    "complete-lie": ["Stopped", "Looks done", "No continue", "No partial label"],
    "noisy-live": ["Token 1", "Token 2", "Token 3", "Token 4"],
    "auto-scroll": ["Reading top", "New delta", "Jump bottom", "Selection lost"],
    "erased-partial": ["Network error", "Output gone", "Prompt gone", "Retry blind"],
    "early-citation": ["Citation ready", "Source pending", "Claim copied", "Mismatch later"],
    "malformed-code": ["```js", "function x()", "Copy code", "No close"],
    "spinner-only": ["Spinner", "No first token", "No stop", "No partial"]
  };

  return (
    <div className={`quality-example streaming-response-bad-demo is-${mode}`}>
      <div className="streaming-response-broken-output">{mode === "malformed-code" ? "```js function renew() {" : "The renewal answer is being generated..."}</div>
      <div className="streaming-response-broken-grid" aria-label="Broken streaming response">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <strong>{mode === "early-citation" ? "Early citation" : mode === "erased-partial" ? "Partial erased" : "Stream failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row streaming-response-controls">
        <button type="button" className={mode === "early-copy" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("early-copy")}>Early copy</button>
        <button type="button" className={mode === "complete-lie" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("complete-lie")}>Complete lie</button>
        <button type="button" className={mode === "noisy-live" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noisy-live")}>Noisy live</button>
        <button type="button" className={mode === "auto-scroll" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("auto-scroll")}>Auto scroll</button>
        <button type="button" className={mode === "erased-partial" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("erased-partial")}>Erased partial</button>
        <button type="button" className={mode === "early-citation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("early-citation")}>Early citation</button>
        <button type="button" className={mode === "malformed-code" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("malformed-code")}>Malformed code</button>
        <button type="button" className={mode === "spinner-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("spinner-only")}>Spinner only</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StreamingResponseGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StreamingResponseBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StreamingResponseGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <StreamingResponseBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
