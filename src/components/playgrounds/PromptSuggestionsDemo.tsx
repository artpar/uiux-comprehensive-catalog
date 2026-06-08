import { useState } from "react";

const suggestions = [
  "Compare modal dialog and drawer for a settings flow",
  "List required states for faceted search",
  "Review this checkout flow for recovery gaps"
];

export default function PromptSuggestionsDemo() {
  const [prompt, setPrompt] = useState("");
  const [submitted, setSubmitted] = useState("No prompt submitted.");

  return (
    <div className="demo-surface">
      <div className="demo-chips" aria-label="Prompt suggestions">
        {suggestions.map((suggestion) => (
          <button key={suggestion} className="demo-chip" onClick={() => setPrompt(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
      <label>
        Editable prompt
        <textarea
          rows={4}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Select a suggestion or write your own prompt"
        />
      </label>
      <div className="demo-row">
        <button className="demo-button primary" disabled={!prompt.trim()} onClick={() => setSubmitted(`Submitted: ${prompt}`)}>
          Submit prompt
        </button>
        <span className="demo-status" aria-live="polite">{submitted}</span>
      </div>
    </div>
  );
}
