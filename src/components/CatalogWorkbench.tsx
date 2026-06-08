import { useMemo, useState } from "react";
import PatternPlayground from "@/components/PatternPlayground";
import type { ComparisonEntry, PatternEntry } from "@/schemas/catalog";

type CatalogWorkbenchProps = {
  patterns: PatternEntry[];
  comparisons: ComparisonEntry[];
  categories: string[];
  platforms: string[];
  maturities: string[];
  baseUrl: string;
};

type JobGroup = {
  id: string;
  label: string;
  decisionPrompt: string;
  patternIds: string[];
  categories: string[];
};

const jobGroups: JobGroup[] = [
  {
    id: "navigate",
    label: "Navigate",
    decisionPrompt: "Move between a small number of destinations.",
    patternIds: ["bottom-navigation"],
    categories: ["Navigation And Wayfinding"]
  },
  {
    id: "search",
    label: "Search / Narrow",
    decisionPrompt: "Find, filter, or recover from a narrowed result set.",
    patternIds: ["faceted-search", "no-results-recovery"],
    categories: ["Search, Browse, And Discovery"]
  },
  {
    id: "recover",
    label: "Recover",
    decisionPrompt: "Recover from mistakes, errors, or system failure.",
    patternIds: ["undo", "no-results-recovery", "toast-only-critical-error"],
    categories: ["Error Prevention And Recovery"]
  },
  {
    id: "decide",
    label: "Decide",
    decisionPrompt: "Choose a focused or high-consequence action.",
    patternIds: ["confirmation-dialog", "modal-dialog"],
    categories: ["Selection And Choice", "Disclosure And Attention Management"]
  },
  {
    id: "status",
    label: "System Status",
    decisionPrompt: "Show current system state without hiding important outcomes.",
    patternIds: ["toast-only-critical-error"],
    categories: ["Feedback, Status, And System State"]
  },
  {
    id: "attention",
    label: "Manage Attention",
    decisionPrompt: "Interrupt, focus, or defer attention intentionally.",
    patternIds: ["modal-dialog", "confirmation-dialog"],
    categories: ["Disclosure And Attention Management"]
  },
  {
    id: "ai",
    label: "AI / Automation",
    decisionPrompt: "Help users understand and control an AI capability.",
    patternIds: ["prompt-suggestions"],
    categories: ["AI And Automation UX"]
  }
];

function matchesText(pattern: PatternEntry, query: string) {
  const text = [
    pattern.name,
    pattern.aliases.join(" "),
    pattern.category,
    pattern.problem,
    pattern.solution,
    pattern.selectionRules.join(" "),
    pattern.requiredStates.join(" "),
    pattern.commonMisuses.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(query.toLowerCase());
}

function matchesJob(pattern: PatternEntry, jobId: string) {
  if (jobId === "all") return true;
  const job = jobGroups.find((item) => item.id === jobId);
  if (!job) return true;
  return job.patternIds.includes(pattern.id) || job.categories.includes(pattern.category);
}

function sourceCountLabel(pattern: PatternEntry) {
  return `${pattern.sources.length} ${pattern.sources.length === 1 ? "source" : "sources"}`;
}

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function getMatchReason(pattern: PatternEntry, jobId: string, query: string) {
  const reasons: string[] = [];
  const job = jobGroups.find((item) => item.id === jobId);
  if (job && matchesJob(pattern, jobId)) {
    reasons.push(job.decisionPrompt);
  }

  if (query.trim()) {
    reasons.push(`Matches "${query.trim()}" in pattern guidance.`);
  }

  if (!reasons.length) {
    reasons.push(pattern.selectionRules[0]);
  }

  return reasons[0];
}

function buildAgentBrief(pattern: PatternEntry, jobId: string, query: string) {
  const job = jobGroups.find((item) => item.id === jobId);
  const lines = [
    `Pattern: ${pattern.name}`,
    `Problem: ${pattern.problem}`,
    `Use when: ${pattern.useWhen.slice(0, 2).join(" ")}`,
    `Avoid when: ${pattern.avoidWhen.slice(0, 2).join(" ")}`,
    `Required states: ${pattern.requiredStates.slice(0, 4).join("; ")}`,
    `Interaction contract: ${pattern.interactionContract.slice(0, 3).join("; ")}`,
    `Common generated-UI mistakes: ${pattern.commonMisuses.slice(0, 3).join("; ")}`
  ];

  if (job) lines.unshift(`User job: ${job.label} - ${job.decisionPrompt}`);
  if (query.trim()) lines.unshift(`Current search: ${query.trim()}`);

  return lines.join("\n");
}

export default function CatalogWorkbench({
  patterns,
  comparisons,
  categories,
  platforms,
  maturities,
  baseUrl
}: CatalogWorkbenchProps) {
  const [query, setQuery] = useState("");
  const [job, setJob] = useState("all");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [maturity, setMaturity] = useState("all");
  const [showAntiPatterns, setShowAntiPatterns] = useState(true);
  const [selectedId, setSelectedId] = useState(patterns[0]?.id ?? "");
  const [copyStatus, setCopyStatus] = useState("Ready to copy.");

  const filtered = useMemo(() => {
    return patterns.filter((pattern) => {
      if (!showAntiPatterns && pattern.maturity === "anti-pattern") return false;
      if (!matchesJob(pattern, job)) return false;
      if (category !== "all" && pattern.category !== category) return false;
      if (platform !== "all" && !pattern.platforms.includes(platform as never)) return false;
      if (maturity !== "all" && pattern.maturity !== maturity) return false;
      if (query.trim() && !matchesText(pattern, query.trim())) return false;
      return true;
    });
  }, [patterns, query, job, category, platform, maturity, showAntiPatterns]);

  const selected = filtered.find((pattern) => pattern.id === selectedId) ?? filtered[0] ?? patterns[0];
  const agentBrief = selected ? buildAgentBrief(selected, job, query) : "";
  const selectedComparisons = selected
    ? comparisons.filter((comparison) => comparison.patternIds.includes(selected.id))
    : [];
  const activeJob = jobGroups.find((item) => item.id === job);

  async function copyAgentBrief() {
    if (!agentBrief) return;
    try {
      await navigator.clipboard.writeText(agentBrief);
      setCopyStatus("Copied selected pattern brief.");
    } catch {
      setCopyStatus("Copy failed. Select the text and copy manually.");
    }
  }

  return (
    <section className="workbench decision-workbench" aria-label="Pattern decision workbench">
      {selected && (
        <article className="lab-panel" aria-labelledby="selected-pattern-title">
          <div className="lab-titlebar">
            <div>
              <span className="eyebrow">Selected pattern</span>
              <h2 id="selected-pattern-title">{selected.name}</h2>
              <p>{selected.problem}</p>
            </div>
            <div className="lab-actions" aria-label="Selected pattern actions">
              <a className="action-link" href={`${baseUrl}patterns/${selected.id}/`}>
                Full contract
              </a>
              {selectedComparisons[0] && (
                <a className="action-link" href={`${baseUrl}compare/${selectedComparisons[0].id}/`}>
                  Compare
                </a>
              )}
            </div>
          </div>

          <div className="meta-strip compact-meta">
            <span>{selected.category}</span>
            <span>{formatLabel(selected.maturity)}</span>
            {selected.platforms.map((item) => (
              <span key={item}>{formatLabel(item)}</span>
            ))}
            <span>{sourceCountLabel(selected)}</span>
          </div>

          <PatternPlayground pattern={selected} variant="preview" />

          <div className="contract-strip" aria-label="Pattern contract snapshot">
            <section>
              <h3>Use When</h3>
              <ul>
                {selected.useWhen.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Avoid When</h3>
              <ul>
                {selected.avoidWhen.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Red Flags</h3>
              <ul>
                {selected.commonMisuses.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      )}

      <aside className="finder-panel" aria-label="Find candidate patterns">
        <div className="finder-head">
          <span className="rail-label">Find candidates</span>
          <strong>{filtered.length} matches</strong>
        </div>

        <label>
          <span>Search by problem, risk, state, or misuse</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Example: irreversible action"
          />
        </label>

        <div className="job-chips" role="group" aria-label="User job filters">
          <button
            className={job === "all" ? "is-active" : ""}
            aria-pressed={job === "all"}
            onClick={() => setJob("all")}
          >
            All jobs
          </button>
          {jobGroups.map((item) => (
            <button
              key={item.id}
              className={job === item.id ? "is-active" : ""}
              aria-pressed={job === item.id}
              onClick={() => setJob(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeJob && <p className="finder-context">{activeJob.decisionPrompt}</p>}

        <details className="filter-details">
          <summary>Advanced filters</summary>
          <div className="filter-content">
            <label>
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="filter-pair">
              <label>
                <span>Platform</span>
                <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
                  <option value="all">All platforms</option>
                  {platforms.map((item) => (
                    <option key={item} value={item}>
                      {formatLabel(item)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Maturity</span>
                <select value={maturity} onChange={(event) => setMaturity(event.target.value)}>
                  <option value="all">All levels</option>
                  {maturities.map((item) => (
                    <option key={item} value={item}>
                      {formatLabel(item)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showAntiPatterns}
                onChange={(event) => setShowAntiPatterns(event.target.checked)}
              />
              Include anti-patterns in candidates
            </label>
          </div>
        </details>

        <div className="pattern-list candidate-list" aria-label="Candidate patterns">
          {filtered.length === 0 && (
            <div className="empty-catalog-state">
              <h3>No matching patterns</h3>
              <p>Clear a filter or broaden the search to inspect candidates again.</p>
              <button
                className="demo-button small"
                onClick={() => {
                  setQuery("");
                  setJob("all");
                  setCategory("all");
                  setPlatform("all");
                  setMaturity("all");
                  setShowAntiPatterns(true);
                }}
              >
                Reset filters
              </button>
            </div>
          )}

          {filtered.map((pattern) => (
            <button
              key={pattern.id}
              className={pattern.id === selected?.id ? "pattern-row is-selected" : "pattern-row"}
              onClick={() => setSelectedId(pattern.id)}
              aria-current={pattern.id === selected?.id ? "true" : undefined}
            >
              <span className="row-title">{pattern.name}</span>
              <span className="row-problem">{getMatchReason(pattern, job, query)}</span>
              <span className="row-meta">
                <span>{formatLabel(pattern.maturity)}</span>
                <span>{sourceCountLabel(pattern)}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {selected && (
        <aside className="decision-panel" aria-label="Decision guidance and agent export">
          <section className="decision-card fit-card">
            <span className="rail-label">Why this candidate</span>
            <p>{getMatchReason(selected, job, query)}</p>
          </section>

          <section className="decision-card">
            <h3>Required States</h3>
            <ul className="check-list">
              {selected.requiredStates.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="decision-card">
            <h3>Interaction Contract</h3>
            <ul className="check-list">
              {selected.interactionContract.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {selectedComparisons.length > 0 && (
            <section className="decision-card">
              <h3>Compare Alternatives</h3>
              <div className="comparison-links">
                {selectedComparisons.map((comparison) => (
                  <a key={comparison.id} href={`${baseUrl}compare/${comparison.id}/`}>
                    {comparison.title}
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="decision-card agent-brief-card">
            <div className="decision-card-head">
              <h3>Agent Brief</h3>
              <button className="demo-button small" onClick={copyAgentBrief}>
                Copy
              </button>
            </div>
            <textarea readOnly value={agentBrief} rows={9} aria-label="Selected pattern agent brief" />
            <p className="demo-status" aria-live="polite">
              {copyStatus}
            </p>
          </section>
        </aside>
      )}
    </section>
  );
}
