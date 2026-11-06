import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

function PromptUi({ good = false }: { good?: boolean }) {
  if (!good) {
    return (
      <div className="bad-ui-sample prompt-bad-ui">
        <button type="button">do it</button>
        <button type="button">better</button>
        <button type="button">more</button>
        <p className="demo-status">Vague chips do not show capability, source, or edit state.</p>
      </div>
    );
  }

  const suggestions = [
    { label: "Summarize thread", prompt: "Summarize the selected support thread and list the unresolved customer questions.", note: "Needs selected thread" },
    { label: "Compare options", prompt: "Compare the migration options in this brief and call out tradeoffs for cost, risk, and rollout effort.", note: "Uses current brief" },
    { label: "Draft reply", prompt: "Draft a concise reply that acknowledges the issue, gives the next step, and avoids promising unsupported timelines.", note: "Review before send" }
  ];

  return (
    <div className="prompt-card">
      {suggestions.map((item) => (
        <button type="button" className="pattern-row prompt-suggestion-card" key={item.label}>
          <span>
            <strong>{item.label}</strong>
            <small>{item.prompt}</small>
          </span>
          <em>{item.note}</em>
        </button>
      ))}
    </div>
  );
}

function PromptGoodUx() {
  const suggestions = [
    {
      label: "Summarize thread",
      prompt: "Summarize the selected support thread and list the unresolved customer questions.",
      boundary: "Uses selected thread only."
    },
    {
      label: "Compare options",
      prompt: "Compare the migration options in this brief and call out tradeoffs for cost, risk, and rollout effort.",
      boundary: "Needs the current brief."
    },
    {
      label: "Draft reply",
      prompt: "Draft a concise reply that acknowledges the issue, gives the next step, and avoids promising unsupported timelines.",
      boundary: "Review before sending."
    }
  ];
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("Choose a starter, then edit before sending.");
  return (
    <div className="quality-example">
      <div className="demo-row">
        {suggestions.map((item) => (
          <button
            type="button"
            className="demo-button small"
            key={item.label}
            onClick={() => {
              setPrompt(item.prompt);
              setStatus(`${item.label} loaded as editable draft. ${item.boundary}`);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <label>
        <span>Prompt</span>
        <textarea
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            setStatus("Draft edited; send remains explicit.");
          }}
          rows={3}
        />
      </label>
      <div className="demo-row">
        <button
          type="button"
          className="demo-button small primary"
          onClick={() => setStatus(prompt.trim() ? `Sent editable prompt: ${prompt.trim().slice(0, 54)}${prompt.trim().length > 54 ? "..." : ""}` : "Choose or write a prompt before sending.")}
        >
          Send prompt
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setPrompt("");
            setStatus("Draft cleared; no prompt was sent.");
          }}
        >
          Clear
        </button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function PromptBadUx() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("No capability boundary or review step.");
  return (
    <div className="quality-example">
      <button
        type="button"
        className="demo-button small"
        onClick={() => {
          setPrompt("Do everything perfectly with all context.");
          setStatus("Auto-filled and submitted a vague prompt that overpromises context.");
        }}
      >
        Auto-fill and submit
      </button>
      <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={3} aria-label="Prompt without useful suggestions" />
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptUi good />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <PromptBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
