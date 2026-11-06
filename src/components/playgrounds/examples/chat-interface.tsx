import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ChatInterfaceState = "turns" | "history" | "streaming" | "stopped" | "failed" | "retry" | "regenerate" | "copied" | "citation" | "older" | "newChat" | "deleted" | "preserved" | "exported";

const chatInterfaceCopy: Record<ChatInterfaceState, { title: string; status: string; tone: string; chips: string[] }> = {
  turns: {
    title: "Policy renewal review",
    status: "Three ordered turns show user prompts, assistant answers, and the follow-up context carried forward.",
    tone: "ready",
    chips: ["History: on", "Work mode", "Context: prior turns", "Conversation: saved"]
  },
  history: {
    title: "History visible",
    status: "Conversation list, active title, retention note, and New chat action are separate from the composer.",
    tone: "ready",
    chips: ["Conversations list", "Pinned", "Retention shown", "New chat"]
  },
  streaming: {
    title: "Answer streaming",
    status: "Assistant response is still streaming; Stop generation is available and focus stays in the composer.",
    tone: "working",
    chips: ["Streaming", "Stop generation", "Source pending", "Draft preserved"]
  },
  stopped: {
    title: "Generation stopped",
    status: "Partial answer is labelled as stopped and can be continued, retried, or left as evidence.",
    tone: "warning",
    chips: ["Stopped", "Partial response", "Continue", "Retry turn"]
  },
  failed: {
    title: "Turn failed",
    status: "Failed response remains attached to its user message with Retry and Edit follow-up controls.",
    tone: "danger",
    chips: ["Network failed", "Prompt kept", "Retry", "Edit follow-up"]
  },
  retry: {
    title: "Retry same turn",
    status: "Retry resends the same prompt, sources, model mode, and conversation state unless a change is shown.",
    tone: "working",
    chips: ["Same prompt", "Same sources", "Same model", "Retry queued"]
  },
  regenerate: {
    title: "Regenerate version",
    status: "Regenerate creates answer version 2 while version 1 stays inspectable with its original sources.",
    tone: "ready",
    chips: ["Version 2", "Old answer kept", "Changed citations", "Compare versions"]
  },
  copied: {
    title: "Copied answer",
    status: "Copied state names the exact assistant turn and does not copy hidden draft or unrelated source text.",
    tone: "ready",
    chips: ["Copied turn 2", "Answer only", "Sources excluded", "Undo copy note"]
  },
  citation: {
    title: "Citation inspected",
    status: "Opening a citation highlights the source used for that answer and preserves transcript scroll.",
    tone: "ready",
    chips: ["Citation 2", "Source: Policy PDF", "Scroll locked", "Return to answer"]
  },
  older: {
    title: "Older history loaded",
    status: "Loading older messages keeps the focused turn and announces that five prior turns were inserted above.",
    tone: "ready",
    chips: ["5 older turns", "Focus preserved", "Scroll anchor", "Transcript search"]
  },
  newChat: {
    title: "New chat ready",
    status: "New chat starts a fresh conversation identity while the previous transcript remains in history.",
    tone: "ready",
    chips: ["Conversation reset", "Old chat saved", "No prior context", "Fresh composer"]
  },
  deleted: {
    title: "Chat deleted",
    status: "Deleted conversation leaves the list, explains what was removed, and offers a short recovery window.",
    tone: "danger",
    chips: ["Deleted", "Removed from history", "Undo available", "Current draft cleared"]
  },
  preserved: {
    title: "Reading older turn",
    status: "A new answer does not auto-scroll while the user is reading, selecting, or inspecting an older turn.",
    tone: "warning",
    chips: ["Reading turn 1", "2 new updates", "Jump to latest", "Draft preserved"]
  },
  exported: {
    title: "Transcript exported",
    status: "Export includes conversation title, visible prompts, answers, timestamps, citations, and history status.",
    tone: "ready",
    chips: ["Exported", "Prompts included", "Citations included", "History note"]
  }
};

function ChatInterfaceTranscript({ state }: { state: ChatInterfaceState }) {
  const copy = chatInterfaceCopy[state];
  const isWorking = state === "streaming" || state === "retry";
  const isFailed = state === "failed" || state === "deleted";
  const userMessage = state === "newChat" ? "Start a fresh review with no prior chat context." : "Summarize the renewal risks in this supplier policy.";
  const assistantMessage = state === "newChat"
    ? "New conversation ready. Prior turns are not included in the next response."
    : state === "streaming"
      ? "I found three renewal risks: notice period, auto-renewal, and price change..."
      : state === "stopped"
        ? "Partial answer stopped after two risks. Continue to finish the response."
        : state === "failed"
          ? "Response failed before completion. The prompt and sources are still attached."
          : state === "regenerate"
            ? "Version 2 narrows the risk summary and flags changed citations for review."
            : "The main risks are a 30-day notice period, automatic renewal, and a price-change clause. Citation 2 supports the renewal point.";

  return (
    <section className={`chat-interface-shell is-${copy.tone}`} aria-label="AI chat conversation">
      <aside className="chat-interface-list" aria-label="Conversations">
        <strong>Conversations</strong>
        <button type="button" className="is-active">Policy renewal review</button>
        <button type="button">Vendor pricing questions</button>
        <button type="button">Meeting action items</button>
      </aside>
      <div className="chat-interface-main">
        <header className="chat-interface-header">
          <div>
            <strong>{copy.title}</strong>
            <span>{copy.status}</span>
          </div>
          <button type="button" className="demo-button small">New chat</button>
        </header>
        <div className="chat-interface-chips" aria-label="Conversation state">
          {copy.chips.map((chip) => <span key={chip}>{chip}</span>)}
        </div>
        <ol className="chat-interface-log" role="log" aria-label="Conversation transcript" aria-live="polite">
          {state === "older" ? <li className="chat-interface-system">5 older turns loaded above. Focus stayed on the renewal answer.</li> : null}
          <li className="chat-interface-turn is-user">
            <span>User turn 1</span>
            <p>{userMessage}</p>
          </li>
          <li className={`chat-interface-turn is-assistant ${isWorking ? "is-working" : ""} ${isFailed ? "is-error" : ""}`}>
            <span>Assistant turn 1 {state === "regenerate" ? "version 2" : ""}</span>
            <p>{assistantMessage}</p>
            <div className="chat-interface-turn-actions">
              <button type="button" className="demo-button small">{state === "streaming" ? "Stop generation" : "Copy answer"}</button>
              <button type="button" className="demo-button small">{state === "failed" ? "Retry turn" : "Regenerate"}</button>
              <button type="button" className="demo-button small">Citation 2</button>
            </div>
          </li>
          <li className="chat-interface-turn is-user">
            <span>User turn 2</span>
            <p>Compare that answer to the selected renewal clause and keep the same work-mode sources.</p>
          </li>
        </ol>
        <footer className="chat-interface-composer">
          <label>
            <span>Message assistant</span>
            <textarea value={state === "preserved" ? "Add a note about termination fees after I finish reading turn 1." : "Ask a follow-up about renewal timing."} readOnly rows={2} />
          </label>
          <button type="button" className="demo-button small primary">Send</button>
        </footer>
      </div>
    </section>
  );
}

function ChatInterfaceGoodUi() {
  return (
    <div className="quality-example chat-interface-demo">
      <ChatInterfaceTranscript state="turns" />
      <p className="demo-status">The chat interface exposes conversation identity, user and assistant roles, ordered transcript, work-mode context, history state, citations, turn actions, and a separate message composer.</p>
    </div>
  );
}

function ChatInterfaceBadUi() {
  return (
    <div className="bad-ui-sample chat-interface-bad-demo is-role-blur">
      <div className="chat-interface-broken-pane">
        <div>Policy risk? 30 days maybe. Also compare it. New answer loading. Copy. Delete.</div>
        <div>Ask something...</div>
      </div>
      <p className="demo-status">The broken UI blends user prompts, assistant answers, active chat identity, history, source scope, and destructive controls into one unlabeled panel.</p>
    </div>
  );
}

function ChatInterfaceGoodUx() {
  const [state, setState] = useState<ChatInterfaceState>("turns");
  const [message, setMessage] = useState("Transcript is ordered by turn. The next prompt can visibly use prior turns, work-mode sources, and selected files.");

  const choose = (next: ChatInterfaceState, note: string) => {
    setState(next);
    setMessage(note);
  };

  return (
    <div className="quality-example chat-interface-demo">
      <div className="chat-interface-controls" aria-label="Chat interface exercise controls">
        <button type="button" className={state === "turns" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("turns", "User and assistant turns stay ordered with visible role labels and follow-up context.")}>Turns</button>
        <button type="button" className={state === "history" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("history", "History list, active title, retention note, and New chat are conversation-level controls.")}>History</button>
        <button type="button" className={state === "streaming" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("streaming", "Streaming answer announces progress, keeps Stop available, and preserves draft focus.")}>Streaming</button>
        <button type="button" className={state === "stopped" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stopped", "Stopped generation is marked partial with Continue and Retry rather than shown as complete.")}>Stop</button>
        <button type="button" className={state === "failed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("failed", "Failed answer stays attached to the submitted prompt with Retry and Edit follow-up controls.")}>Failed</button>
        <button type="button" className={state === "retry" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("retry", "Retry uses the same prompt, model mode, sources, and conversation state unless a change is shown.")}>Retry</button>
        <button type="button" className={state === "regenerate" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("regenerate", "Regenerate keeps answer version 1 inspectable and labels version 2 with changed citations.")}>Regenerate</button>
        <button type="button" className={state === "copied" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("copied", "Copy feedback names the exact assistant turn and copy scope.")}>Copy</button>
        <button type="button" className={state === "citation" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("citation", "Citation inspection opens source detail while keeping transcript scroll anchored.")}>Citation</button>
        <button type="button" className={state === "older" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("older", "Older history loads above the focused turn and announces the insertion.")}>Older history</button>
        <button type="button" className={state === "newChat" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("newChat", "New chat creates a fresh conversation identity and states that prior context is not included.")}>New chat</button>
        <button type="button" className={state === "deleted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("deleted", "Delete chat removes the saved conversation, explains the effect, and offers recovery.")}>Delete</button>
        <button type="button" className={state === "preserved" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("preserved", "Streaming does not auto-scroll away from an older turn being read or cited.")}>Preserve scroll</button>
        <button type="button" className={state === "exported" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("exported", "Export includes visible prompts, answers, citations, timestamps, and history status.")}>Export</button>
      </div>
      <ChatInterfaceTranscript state={state} />
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ChatInterfaceBadUx() {
  type Mode = "latest-only" | "role-blur" | "hidden-memory" | "overwrite-regen" | "scroll-jump" | "lost-draft" | "human-chat-mix";
  const [mode, setMode] = useState<Mode>("latest-only");
  const copy: Record<Mode, string> = {
    "latest-only": "Only the latest answer remains, so users cannot inspect the prompt, sources, or prior answer that shaped the follow-up.",
    "role-blur": "User prompts, assistant answers, system notices, and tool progress share the same visual style and reading order.",
    "hidden-memory": "The UI says history is off, but the next response still uses prior turns and work data without explanation.",
    "overwrite-regen": "Regenerate replaces the old answer and citations, breaking auditability for copied recommendations.",
    "scroll-jump": "Streaming output forces scroll to the bottom while the user is reading an older cited turn.",
    "lost-draft": "A failed response clears the follow-up draft, active source, and selected transcript text.",
    "human-chat-mix": "Human review comments and assistant output share one chat stream, hiding author identity and moderation needs."
  };
  const labels: Record<Mode, string[]> = {
    "latest-only": ["Answer only", "No prompt", "No history", "No source"],
    "role-blur": ["Maybe user", "Maybe bot", "Tool?", "System?"],
    "hidden-memory": ["History off", "Still remembers", "Work data used", "No notice"],
    "overwrite-regen": ["Version gone", "Citations changed", "Copy unclear", "No compare"],
    "scroll-jump": ["Reading turn 1", "Jump bottom", "Selection lost", "No return"],
    "lost-draft": ["Failed", "Draft gone", "Source gone", "Start over"],
    "human-chat-mix": ["Maya said", "AI said", "No author", "No moderation"]
  };

  return (
    <div className={`quality-example chat-interface-bad-demo is-${mode}`}>
      <div className="chat-interface-broken-pane" aria-label="Broken chat interface">
        {labels[mode].map((label, index) => <div key={`${label}-${index}`}>{label}</div>)}
      </div>
      <strong>{mode === "hidden-memory" ? "Hidden memory" : mode === "overwrite-regen" ? "Overwrite regenerate" : "Chat failure"}</strong>
      <p>{copy[mode]}</p>
      <div className="demo-row chat-interface-controls">
        <button type="button" className={mode === "latest-only" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("latest-only")}>Latest only</button>
        <button type="button" className={mode === "role-blur" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("role-blur")}>Role blur</button>
        <button type="button" className={mode === "hidden-memory" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hidden-memory")}>Hidden memory</button>
        <button type="button" className={mode === "overwrite-regen" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overwrite-regen")}>Overwrite regen</button>
        <button type="button" className={mode === "scroll-jump" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("scroll-jump")}>Scroll jump</button>
        <button type="button" className={mode === "lost-draft" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lost-draft")}>Lost draft</button>
        <button type="button" className={mode === "human-chat-mix" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("human-chat-mix")}>Human chat mix</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChatInterfaceGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChatInterfaceBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChatInterfaceGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ChatInterfaceBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
