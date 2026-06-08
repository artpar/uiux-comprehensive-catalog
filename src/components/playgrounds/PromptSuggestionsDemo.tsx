import { useState } from "react";

const initialSuggestions = [
  { text: "Compare modal dialog and drawer for a settings flow", rank: "Best fit", boundary: "Use when attention must be contained." },
  { text: "List required states for faceted search", rank: "Specific", boundary: "Requires known result attributes." },
  { text: "Review this checkout flow for recovery gaps", rank: "Audit", boundary: "May need screenshots or flow steps." }
];

export default function PromptSuggestionsDemo() {
  const [prompt, setPrompt] = useState("");
  const [submitted, setSubmitted] = useState("No prompt submitted.");
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  return (
    <div className="demo-surface">
      <div className="demo-chips" aria-label="Prompt suggestions">
        {suggestions.map((suggestion) => (
          <span key={suggestion.text} className="suggestion-card">
            <button className="demo-chip" onClick={() => setPrompt(suggestion.text)}>
              <strong>{suggestion.rank}</strong>
              {suggestion.text}
            </button>
            <small>{suggestion.boundary}</small>
            <button
              type="button"
              className="demo-button small"
              onClick={() => setSuggestions((current) => current.filter((item) => item.text !== suggestion.text))}
            >
              Dismiss
            </button>
          </span>
        ))}
      </div>
      <label>
        Editable prompt
        <textarea
          name="prompt-suggestion-text"
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
