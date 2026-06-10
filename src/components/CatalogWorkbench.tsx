import { useEffect, useMemo, useRef, useState } from "react";
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

type DecisionStatus = "reviewing" | "selected" | "rejected" | "compare";
type CandidateMode = "recommended" | "all" | "audit";

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

const searchSynonyms: Record<string, string[]> = {
  delete: ["destructive", "remove", "irreversible"],
  destructive: ["delete", "remove", "danger"],
  error: ["failure", "recovery", "failed"],
  ai: ["automation", "prompt", "suggestion"],
  filter: ["facet", "narrow", "search"],
  mobile: ["navigation", "bottom"],
  popup: ["modal", "dialog"],
  undo: ["recover", "restore", "reversible"]
};

function formatPatternType(value: PatternEntry["patternType"]) {
  if (value === "ui") return "UI";
  if (value === "ux") return "UX";
  return "UI + UX";
}

function searchText(pattern: PatternEntry) {
  return [
    pattern.name,
    pattern.aliases.join(" "),
    pattern.category,
    formatPatternType(pattern.patternType),
    pattern.surfaceType,
    pattern.problem,
    pattern.solution,
    pattern.uiGuidance.join(" "),
    pattern.uxGuidance.join(" "),
    pattern.uiExamples.good.join(" "),
    pattern.uiExamples.bad.join(" "),
    pattern.uxExamples.good.join(" "),
    pattern.uxExamples.bad.join(" "),
    pattern.selectionRules.join(" "),
    pattern.requiredStates.join(" "),
    pattern.commonMisuses.join(" "),
    pattern.implementationChecklist.join(" "),
    pattern.variants.join(" "),
    pattern.avoidWhen.join(" "),
    pattern.failureModes.join(" "),
    pattern.critiqueQuestions.join(" ")
  ].join(" ");
}

function searchFields(pattern: PatternEntry) {
  return [
    { label: "name", value: pattern.name },
    { label: "aliases", value: pattern.aliases.join(" ") },
    { label: "problem", value: pattern.problem },
    { label: "solution", value: pattern.solution },
    { label: "UI/UX type", value: `${formatPatternType(pattern.patternType)} ${pattern.surfaceType}` },
    { label: "UI guidance", value: pattern.uiGuidance.join(" ") },
    { label: "UX guidance", value: pattern.uxGuidance.join(" ") },
    { label: "good UI", value: pattern.uiExamples.good.join(" ") },
    { label: "bad UI", value: pattern.uiExamples.bad.join(" ") },
    { label: "good UX", value: pattern.uxExamples.good.join(" ") },
    { label: "bad UX", value: pattern.uxExamples.bad.join(" ") },
    { label: "selection rule", value: pattern.selectionRules.join(" ") },
    { label: "required state", value: pattern.requiredStates.join(" ") },
    { label: "misuse", value: pattern.commonMisuses.join(" ") },
    { label: "checklist", value: pattern.implementationChecklist.join(" ") },
    { label: "variant", value: pattern.variants.join(" ") },
    { label: "avoid rule", value: pattern.avoidWhen.join(" ") },
    { label: "failure mode", value: pattern.failureModes.join(" ") },
    { label: "critique question", value: pattern.critiqueQuestions.join(" ") }
  ].filter((field) => field.value.trim());
}

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function editDistanceAtMost(a: string, b: string, maxDistance: number) {
  if (Math.abs(a.length - b.length) > maxDistance) return false;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    let lastDiagonal = previous[0];
    previous[0] = i;
    let rowMin = previous[0];

    for (let j = 1; j <= b.length; j += 1) {
      const nextDiagonal = previous[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, lastDiagonal + cost);
      lastDiagonal = nextDiagonal;
      rowMin = Math.min(rowMin, previous[j]);
    }

    if (rowMin > maxDistance) return false;
  }

  return previous[b.length] <= maxDistance;
}

function queryTerms(query: string) {
  return normalizeSearch(query)
    .split(" ")
    .filter(Boolean)
    .flatMap((term) => [term, ...(searchSynonyms[term] ?? [])]);
}

function matchesText(pattern: PatternEntry, query: string) {
  const text = normalizeSearch(searchText(pattern));
  const words = text.split(" ");
  return queryTerms(query).some((term) => {
    if (text.includes(term)) return true;
    if (term.length < 4) return false;
    return words.some((word) => editDistanceAtMost(term, word, term.length > 7 ? 2 : 1));
  });
}

function getSearchExplanation(pattern: PatternEntry, query: string) {
  if (!query.trim()) return "";
  const evidence = getSearchEvidence(pattern, query);
  if (!evidence) return "Matched by fuzzy search across aliases, rules, states, and misuse guidance.";
  return `Matched ${evidence.label}: ${evidence.snippet}`;
}

function firstMatchedTerm(pattern: PatternEntry, query: string) {
  if (!query.trim()) return "";
  return getSearchEvidence(pattern, query)?.term ?? "";
}

function getSearchEvidence(pattern: PatternEntry, query: string) {
  const terms = queryTerms(query);
  for (const field of searchFields(pattern)) {
    const normalized = normalizeSearch(field.value);
    const term = terms.find((item) => normalized.includes(item));
    if (term) return { label: field.label, snippet: field.value, term };
  }

  for (const field of searchFields(pattern)) {
    const words = normalizeSearch(field.value).split(" ");
    for (const item of terms) {
      if (item.length < 4) continue;
      const matchedWord = words.find((word) => editDistanceAtMost(item, word, item.length > 7 ? 2 : 1));
      if (matchedWord) return { label: field.label, snippet: field.value, term: matchedWord };
    }
  }

  return null;
}

function HighlightedText({ text, term }: { text: string; term: string }) {
  if (!term.trim()) return <>{text}</>;
  const normalizedTerm = term.toLowerCase();
  const index = text.toLowerCase().indexOf(normalizedTerm);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  );
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

function isCandidateMode(value: string | null): value is CandidateMode {
  return value === "recommended" || value === "audit" || value === "all";
}

function candidateModeFromParam(value: string | null): CandidateMode | null {
  if (value === "patterns") return "recommended";
  return isCandidateMode(value) ? value : null;
}

function getMatchReason(pattern: PatternEntry, jobId: string, query: string) {
  const reasons: string[] = [];
  const job = jobGroups.find((item) => item.id === jobId);
  if (job && matchesJob(pattern, jobId)) {
    reasons.push(job.decisionPrompt);
  }

  if (query.trim()) {
    reasons.push(getSearchExplanation(pattern, query));
  }

  if (!reasons.length) {
    reasons.push(pattern.selectionRules[0]);
  }

  return reasons[0];
}

function buildAgentBrief({
  pattern,
  jobId,
  query,
  platform,
  risk,
  recovery,
  urgency,
  confidence,
  interruptionCost,
  decisionStatus,
  shortlist
}: {
  pattern: PatternEntry;
  jobId: string;
  query: string;
  platform: string;
  risk: string;
  recovery: string;
  urgency: string;
  confidence: string;
  interruptionCost: string;
  decisionStatus: DecisionStatus;
  shortlist: PatternEntry[];
}) {
  const job = jobGroups.find((item) => item.id === jobId);
  const lines = [
    `Pattern: ${pattern.name}`,
    `Pattern type: ${formatPatternType(pattern.patternType)} - ${pattern.surfaceType}`,
    `Decision status: ${formatLabel(decisionStatus)}`,
    `Problem: ${pattern.problem}`,
    `UI guidance: ${pattern.uiGuidance.slice(0, 2).join(" ")}`,
    `UX guidance: ${pattern.uxGuidance.slice(0, 2).join(" ")}`,
    `Good UI examples: ${pattern.uiExamples.good.slice(0, 2).join(" ")}`,
    `Bad UI examples: ${pattern.uiExamples.bad.slice(0, 2).join(" ")}`,
    `Good UX examples: ${pattern.uxExamples.good.slice(0, 2).join(" ")}`,
    `Bad UX examples: ${pattern.uxExamples.bad.slice(0, 2).join(" ")}`,
    `Context: risk=${risk}; reversibility=${recovery}; urgency=${urgency}; system-confidence=${confidence}; interruption-cost=${interruptionCost}; platform=${platform === "all" ? "unspecified" : platform}`,
    `Use when: ${pattern.useWhen.slice(0, 2).join(" ")}`,
    `Avoid when: ${pattern.avoidWhen.slice(0, 2).join(" ")}`,
    `Required states: ${pattern.requiredStates.slice(0, 4).join("; ")}`,
    `Interaction contract: ${pattern.interactionContract.slice(0, 3).join("; ")}`,
    `Common generated-UI mistakes: ${pattern.commonMisuses.slice(0, 3).join("; ")}`,
    `Critique questions: ${pattern.critiqueQuestions.slice(0, 3).join("; ")}`
  ];

  if (job) lines.unshift(`User job: ${job.label} - ${job.decisionPrompt}`);
  if (query.trim()) lines.unshift(`Current search: ${query.trim()}`);
  if (shortlist.length > 0) lines.push(`Shortlist: ${shortlist.map((item) => item.name).join(", ")}`);

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
  const [candidateMode, setCandidateMode] = useState<CandidateMode>("recommended");
  const [selectedId, setSelectedId] = useState(patterns[0]?.id ?? "");
  const [copyStatus, setCopyStatus] = useState("Ready to copy.");
  const [risk, setRisk] = useState("medium");
  const [recovery, setRecovery] = useState("reversible");
  const [urgency, setUrgency] = useState("normal");
  const [confidence, setConfidence] = useState("known");
  const [interruptionCost, setInterruptionCost] = useState("medium");
  const [shortlistIds, setShortlistIds] = useState<string[]>([]);
  const [decisionById, setDecisionById] = useState<Record<string, DecisionStatus>>({});
  const [critiqueNote, setCritiqueNote] = useState("");
  const [expandedLab, setExpandedLab] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const scopedAcceptedCandidates = useMemo(() => {
    return patterns.filter((pattern) => {
      if (pattern.maturity === "anti-pattern") return false;
      if (!matchesJob(pattern, job)) return false;
      if (category !== "all" && pattern.category !== category) return false;
      if (platform !== "all" && !pattern.platforms.includes(platform as never)) return false;
      if (maturity !== "all" && pattern.maturity !== maturity) return false;
      if (query.trim() && !matchesText(pattern, query.trim())) return false;
      return true;
    });
  }, [patterns, query, job, category, platform, maturity]);

  const auditCandidates = useMemo(() => {
    return patterns.filter((pattern) => {
      if (pattern.maturity !== "anti-pattern") return false;
      if (!matchesJob(pattern, job)) return false;
      if (category !== "all" && pattern.category !== category) return false;
      if (platform !== "all" && !pattern.platforms.includes(platform as never)) return false;
      if (query.trim() && !matchesText(pattern, query.trim())) return false;
      return true;
    });
  }, [patterns, query, job, category, platform]);

  const recommendedCandidates = useMemo(() => {
    const activeJob = jobGroups.find((item) => item.id === job);
    return [...scopedAcceptedCandidates]
      .sort((a, b) => {
        const score = (pattern: PatternEntry) => {
          let value = 0;
          if (activeJob?.patternIds.includes(pattern.id)) value += 80;
          if (activeJob?.categories.includes(pattern.category)) value += 40;
          if (pattern.maturity === "standard" || pattern.maturity === "established") value += 20;
          if (shortlistIds.includes(pattern.id)) value += 10;
          if (selectedId === pattern.id) value += 5;
          return value;
        };
        return score(b) - score(a) || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [job, scopedAcceptedCandidates, selectedId, shortlistIds]);

  const filtered = useMemo(() => {
    if (candidateMode === "audit") return auditCandidates;
    if (candidateMode === "all") return scopedAcceptedCandidates;
    return recommendedCandidates;
  }, [auditCandidates, candidateMode, recommendedCandidates, scopedAcceptedCandidates]);

  const selectedWasFilteredOut = Boolean(selectedId) && filtered.length > 0 && !filtered.some((pattern) => pattern.id === selectedId);
  const selected = patterns.find((pattern) => pattern.id === selectedId) ?? filtered[0] ?? patterns[0];
  const selectedComparisons = selected
    ? comparisons.filter((comparison) => comparison.patternIds.includes(selected.id))
    : [];
  const activeJob = jobGroups.find((item) => item.id === job);
  const filteredSummary = useMemo(() => {
    const antiPatternCount = filtered.filter((pattern) => pattern.maturity === "anti-pattern").length;
    const categoriesShown = new Set(filtered.map((pattern) => pattern.category)).size;
    const completeCount = filtered.filter((pattern) => pattern.completionStatus === "complete").length;
    const stubCount = filtered.filter((pattern) => pattern.completionStatus === "stub").length;
    return `${categoriesShown} families, ${completeCount} complete, ${stubCount} stubs, ${antiPatternCount} audit flags`;
  }, [filtered]);
  const candidateCountLabel =
    candidateMode === "recommended"
      ? `${filtered.length} recommended`
      : candidateMode === "audit"
        ? `${filtered.length} audit flags`
        : `${filtered.length} patterns`;
  const shortlist = shortlistIds
    .map((id) => patterns.find((pattern) => pattern.id === id))
    .filter((pattern): pattern is PatternEntry => Boolean(pattern));
  const decisionStatus = selected ? decisionById[selected.id] ?? "reviewing" : "reviewing";
  const sourceConfidence = selected
    ? `${selected.sources.length} source-backed ${selected.sources.length === 1 ? "claim" : "claims"}, verified ${selected.lastVerified}`
    : "";
  const agentBrief = selected
    ? buildAgentBrief({
        pattern: selected,
        jobId: job,
        query,
        platform,
        risk,
        recovery,
        urgency,
        confidence,
        interruptionCost,
        decisionStatus,
        shortlist
      })
    : "";
  const contextParams = new URLSearchParams();
  if (selected) contextParams.set("selected", selected.id);
  if (shortlistIds.length > 0) contextParams.set("shortlist", shortlistIds.join(","));
  if (job !== "all") contextParams.set("job", job);
  if (query.trim()) contextParams.set("query", query.trim());
  contextParams.set("mode", candidateMode);
  if (category !== "all") contextParams.set("category", category);
  if (platform !== "all") contextParams.set("platform", platform);
  if (maturity !== "all") contextParams.set("maturity", maturity);
  contextParams.set("risk", risk);
  contextParams.set("recovery", recovery);
  contextParams.set("urgency", urgency);
  contextParams.set("confidence", confidence);
  contextParams.set("interruption", interruptionCost);

  function comparisonHref(comparison: ComparisonEntry) {
    const suffix = contextParams.toString();
    return `${baseUrl}compare/${comparison.id}/${suffix ? `?${suffix}` : ""}`;
  }

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const patternId = params.get("pattern") ?? params.get("selected");
    if (patternId && patterns.some((pattern) => pattern.id === patternId)) {
      setSelectedId(patternId);
    }

    const shortlist = params
      .get("shortlist")
      ?.split(",")
      .filter((id) => patterns.some((pattern) => pattern.id === id));
    if (shortlist?.length) setShortlistIds(shortlist);

    const queryParam = params.get("query");
    if (queryParam) setQuery(queryParam);

    const jobParam = params.get("job");
    if (jobParam && (jobParam === "all" || jobGroups.some((item) => item.id === jobParam))) setJob(jobParam);

    const modeParam = candidateModeFromParam(params.get("mode"));
    if (modeParam) setCandidateMode(modeParam);

    const categoryParam = params.get("category");
    if (categoryParam && (categoryParam === "all" || categories.includes(categoryParam))) setCategory(categoryParam);

    const platformParam = params.get("platform");
    if (platformParam && (platformParam === "all" || platforms.includes(platformParam))) setPlatform(platformParam);

    const maturityParam = params.get("maturity");
    if (maturityParam && (maturityParam === "all" || maturities.includes(maturityParam))) setMaturity(maturityParam);

    const riskParam = params.get("risk");
    if (riskParam === "low" || riskParam === "medium" || riskParam === "high") setRisk(riskParam);

    const recoveryParam = params.get("recovery");
    if (recoveryParam === "reversible" || recoveryParam === "delayed" || recoveryParam === "irreversible") {
      setRecovery(recoveryParam);
    }

    const urgencyParam = params.get("urgency");
    if (urgencyParam === "low" || urgencyParam === "normal" || urgencyParam === "urgent") setUrgency(urgencyParam);

    const confidenceParam = params.get("confidence");
    if (confidenceParam === "known" || confidenceParam === "uncertain" || confidenceParam === "low") {
      setConfidence(confidenceParam);
    }

    const interruptionParam = params.get("interruption");
    if (interruptionParam === "low" || interruptionParam === "medium" || interruptionParam === "high") {
      setInterruptionCost(interruptionParam);
    }
  }, [categories, maturities, patterns, platforms]);

  useEffect(() => {
    if (!selected) return;
    const url = new URL(window.location.href);
    url.searchParams.set("pattern", selected.id);
    url.searchParams.set("mode", candidateMode);
    if (shortlistIds.length > 0) url.searchParams.set("shortlist", shortlistIds.join(","));
    else url.searchParams.delete("shortlist");
    if (job !== "all") url.searchParams.set("job", job);
    else url.searchParams.delete("job");
    if (query.trim()) url.searchParams.set("query", query.trim());
    else url.searchParams.delete("query");
    if (category !== "all") url.searchParams.set("category", category);
    else url.searchParams.delete("category");
    if (platform !== "all") url.searchParams.set("platform", platform);
    else url.searchParams.delete("platform");
    if (maturity !== "all") url.searchParams.set("maturity", maturity);
    else url.searchParams.delete("maturity");
    url.searchParams.set("risk", risk);
    url.searchParams.set("recovery", recovery);
    url.searchParams.set("urgency", urgency);
    url.searchParams.set("confidence", confidence);
    url.searchParams.set("interruption", interruptionCost);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [
    candidateMode,
    category,
    confidence,
    interruptionCost,
    job,
    maturity,
    platform,
    query,
    recovery,
    risk,
    selected,
    shortlistIds,
    urgency
  ]);

  useEffect(() => {
    if (!selected && filtered[0]) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selected]);

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
    }

    function moveSelection(direction: 1 | -1) {
      if (!selected || filtered.length === 0) return;
      const currentIndex = filtered.findIndex((pattern) => pattern.id === selected.id);
      const nextIndex = Math.max(0, Math.min(filtered.length - 1, currentIndex + direction));
      setSelectedId(filtered[nextIndex].id);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (isTypingTarget(event.target)) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelection(-1);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [filtered, selected]);

  async function copyAgentBrief() {
    if (!agentBrief) return;
    try {
      await navigator.clipboard.writeText(agentBrief);
      setCopyStatus("Copied selected pattern brief.");
    } catch {
      setCopyStatus("Copy failed. Select the text and copy manually.");
    }
  }

  function toggleShortlist(patternId: string) {
    setShortlistIds((current) =>
      current.includes(patternId) ? current.filter((id) => id !== patternId) : [...current, patternId]
    );
  }

  function setPatternDecisionStatus(status: DecisionStatus) {
    if (!selected) return;
    setDecisionById((current) => ({ ...current, [selected.id]: status }));
  }

  return (
    <section
      className="workbench decision-workbench"
      aria-label="Pattern decision workbench"
      aria-busy={!hydrated}
    >
      {!hydrated && <p className="hydration-status" role="status">Preparing interactive controls...</p>}
      {selected && (
        <article
          className={expandedLab ? "lab-panel is-expanded" : "lab-panel"}
          aria-labelledby="selected-pattern-title"
        >
          <div className="lab-titlebar">
            <div>
              <span className="eyebrow">Selected pattern</span>
              <h2 id="selected-pattern-title">{selected.name}</h2>
              <div className="type-strip" aria-label="UI and UX classification">
                <span>{formatPatternType(selected.patternType)}</span>
                <span>{selected.surfaceType}</span>
              </div>
              <p>{selected.problem}</p>
            </div>
            <div className="lab-actions" aria-label="Selected pattern actions">
              <button
                className="action-link action-button"
                type="button"
                onClick={() => toggleShortlist(selected.id)}
                aria-pressed={shortlistIds.includes(selected.id)}
              >
                <span className="action-mark" aria-hidden="true">{shortlistIds.includes(selected.id) ? "-" : "+"}</span>
                {shortlistIds.includes(selected.id) ? "Shortlisted" : "Shortlist"}
              </button>
              <button
                className="action-link action-button"
                type="button"
                onClick={() => setExpandedLab((current) => !current)}
                aria-pressed={expandedLab}
              >
                <span className="action-mark" aria-hidden="true">{expandedLab ? "[]" : "[ ]"}</span>
                {expandedLab ? "Compact lab" : "Expand lab"}
              </button>
              <a className="action-link" href={`${baseUrl}patterns/${selected.id}/`}>
                <span className="action-mark" aria-hidden="true">-&gt;</span>
                Full contract
              </a>
              {selectedComparisons[0] && (
                <a className="action-link" href={comparisonHref(selectedComparisons[0])}>
                  <span className="action-mark" aria-hidden="true">&lt;&gt;</span>
                  Compare
                </a>
              )}
            </div>
          </div>

          <div className="meta-strip compact-meta">
            <span>{formatPatternType(selected.patternType)}</span>
            <span>{selected.category}</span>
            <span>{formatLabel(selected.maturity)}</span>
            <span>{formatLabel(selected.completionStatus)}</span>
            {selected.platforms.map((item) => (
              <span key={item}>{formatLabel(item)}</span>
            ))}
            <span>{sourceCountLabel(selected)}</span>
          </div>

          <PatternPlayground pattern={selected} variant="preview" />

          <div className="decision-status" aria-label="Pattern decision result">
            <span className="rail-label">Decision result</span>
            <div className="decision-buttons">
              {(["reviewing", "selected", "compare", "rejected"] as DecisionStatus[]).map((status) => (
                <button
                  key={status}
                  className={decisionStatus === status ? "is-active" : ""}
                  type="button"
                  aria-pressed={decisionStatus === status}
                  onClick={() => setPatternDecisionStatus(status)}
                >
                  {formatLabel(status)}
                </button>
              ))}
            </div>
          </div>

          <div className="contract-strip" aria-label="Pattern contract snapshot">
            <section>
              <h3>UI</h3>
              <ul>
                {selected.uiGuidance.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>UX</h3>
              <ul>
                {selected.uxGuidance.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Decision</h3>
              <ul>
                {selected.useWhen.slice(0, 1).concat(selected.avoidWhen.slice(0, 1)).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      )}

      <aside className="finder-panel" aria-label="Find candidate patterns">
        <div className="finder-head">
          <span className="rail-label">Pattern switcher</span>
          <strong>{candidateCountLabel}</strong>
        </div>
        <p className="result-summary compact-only" aria-live="polite">{filteredSummary}</p>

        <label>
          <span>Search</span>
          <input
            ref={searchRef}
            type="search"
            name="catalog-query"
            aria-keyshortcuts="/"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Example: irreversible action"
          />
        </label>

        <details className="filter-details compact-disclosure">
          <summary>{activeJob ? activeJob.label : "Jobs"}</summary>
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
        </details>

        <div className="decision-buttons mode-switcher" role="group" aria-label="Candidate mode">
          {([
            ["recommended", "Recommended"],
            ["all", "All patterns"],
            ["audit", "Audit flags"]
          ] as [CandidateMode, string][]).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              className={candidateMode === mode ? "is-active" : ""}
              aria-pressed={candidateMode === mode}
              onClick={() => setCandidateMode(mode)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeJob && <p className="finder-context">{activeJob.decisionPrompt}</p>}
        {selectedWasFilteredOut && (
          <p className="finder-context" role="status">
            Selected pattern is outside the current candidate filters. It remains open so you can inspect or compare it.
          </p>
        )}

        <details className="filter-details">
          <summary>Advanced filters</summary>
          <div className="filter-content">
            <label>
              <span>Category</span>
              <select name="catalog-category" value={category} onChange={(event) => setCategory(event.target.value)}>
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
                <select name="catalog-platform" value={platform} onChange={(event) => setPlatform(event.target.value)}>
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
                <select name="catalog-maturity" value={maturity} onChange={(event) => setMaturity(event.target.value)}>
                  <option value="all">All levels</option>
                  {maturities.map((item) => (
                    <option key={item} value={item}>
                      {formatLabel(item)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="filter-note">Candidate mode controls whether anti-patterns appear as audit flags or normal entries.</p>
          </div>
        </details>

        <div className="pattern-list candidate-list" aria-label="Candidate patterns">
          {filtered.length === 0 && (
            <div className="empty-catalog-state">
              <h3>No matching patterns</h3>
              <p>Clear a filter or broaden the search to inspect candidates again.</p>
              <button
                className="demo-button small"
                type="button"
                onClick={() => {
                  setQuery("");
                  setJob("all");
                  setCategory("all");
                  setPlatform("all");
                  setMaturity("all");
                  setCandidateMode("recommended");
                }}
              >
                <span className="action-mark" aria-hidden="true">x</span>
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
              <span className="row-title">
                <HighlightedText text={pattern.name} term={firstMatchedTerm(pattern, query)} />
              </span>
              <span className="row-meta">
                <span>{formatPatternType(pattern.patternType)}</span>
                <span>{formatLabel(pattern.maturity)}</span>
                <span>{formatLabel(pattern.completionStatus)}</span>
                <span>{sourceCountLabel(pattern)}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {selected && (
        <aside className="decision-panel" aria-label="Decision guidance and agent export">
          <section className="decision-card fit-card minimal-fit">
            <span className="rail-label">Decision fit</span>
            <h3>{selected.name}</h3>
            <p className="type-summary">
              <strong>{formatPatternType(selected.patternType)}</strong>
              <span>{selected.surfaceType}</span>
            </p>
            <dl className="fit-summary">
              <div>
                <dt>UI</dt>
                <dd>{selected.uiGuidance[0]}</dd>
              </div>
              <div>
                <dt>UX</dt>
                <dd>{selected.uxGuidance[0]}</dd>
              </div>
              <div>
                <dt>Use when</dt>
                <dd>{selected.useWhen[0]}</dd>
              </div>
              <div>
                <dt>Avoid when</dt>
                <dd>{selected.avoidWhen[0]}</dd>
              </div>
            </dl>
            <div className="decision-quick-actions" aria-label="Decision actions">
              {selectedComparisons[0] && (
                <a className="action-link" href={comparisonHref(selectedComparisons[0])}>
                  <span className="action-mark" aria-hidden="true">&lt;&gt;</span>
                  Compare
                </a>
              )}
              <button className="demo-button small" type="button" onClick={copyAgentBrief}>
                <span className="action-mark" aria-hidden="true">copy</span>
                Copy brief
              </button>
            </div>
            <p className="demo-status" aria-live="polite">
              {copyStatus}
            </p>
          </section>

          <details className="decision-card compact-disclosure quality-disclosure" open>
            <summary>UI quality</summary>
            <div className="quality-split">
              <section>
                <h4>Good UI</h4>
                <ul>
                  {selected.uiExamples.good.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <section>
                <h4>Bad UI</h4>
                <ul>
                  {selected.uiExamples.bad.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </div>
          </details>

          <details className="decision-card compact-disclosure quality-disclosure" open>
            <summary>UX behavior</summary>
            <div className="quality-split">
              <section>
                <h4>Good UX</h4>
                <ul>
                  {selected.uxExamples.good.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
              <section>
                <h4>Bad UX</h4>
                <ul>
                  {selected.uxExamples.bad.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </div>
          </details>

          <details className="decision-card compact-disclosure">
            <summary>Decision inputs</summary>
            <div className="filter-pair">
              <label>
                <span>Consequence</span>
                <select name="decision-risk" value={risk} onChange={(event) => setRisk(event.target.value)}>
                  <option value="low">Low risk</option>
                  <option value="medium">Medium risk</option>
                  <option value="high">High risk</option>
                </select>
              </label>
              <label>
                <span>Recovery</span>
                <select name="decision-recovery" value={recovery} onChange={(event) => setRecovery(event.target.value)}>
                  <option value="reversible">Reversible</option>
                  <option value="delayed">Delayed recovery</option>
                  <option value="irreversible">Irreversible</option>
                </select>
              </label>
            </div>
            <div className="filter-pair">
              <label>
                <span>Urgency</span>
                <select name="decision-urgency" value={urgency} onChange={(event) => setUrgency(event.target.value)}>
                  <option value="low">Can wait</option>
                  <option value="normal">Normal pace</option>
                  <option value="urgent">Urgent task</option>
                </select>
              </label>
              <label>
                <span>System confidence</span>
                <select name="decision-confidence" value={confidence} onChange={(event) => setConfidence(event.target.value)}>
                  <option value="known">Known outcome</option>
                  <option value="uncertain">Uncertain outcome</option>
                  <option value="low">Low confidence</option>
                </select>
              </label>
            </div>
            <label>
              <span>Interruption cost</span>
              <select
                name="decision-interruption-cost"
                value={interruptionCost}
                onChange={(event) => setInterruptionCost(event.target.value)}
              >
                <option value="low">Low interruption cost</option>
                <option value="medium">Medium interruption cost</option>
                <option value="high">High interruption cost</option>
              </select>
            </label>
          </details>

          <details className="decision-card compact-disclosure">
            <summary>Why this candidate</summary>
            <span className="rail-label">Why this candidate</span>
            <p>{getMatchReason(selected, job, query)}</p>
            <p className="source-confidence">{sourceConfidence}</p>
          </details>

          <details className="decision-card compact-disclosure">
            <summary>Sources</summary>
            <ul className="claim-list">
              {selected.sources.slice(0, 3).map((source) => (
                <li key={source.id}>
                  <a href={`${baseUrl}sources/${source.id}/`}>{source.id}</a>
                  <span>{source.note}</span>
                </li>
              ))}
            </ul>
          </details>

          <details className="decision-card compact-disclosure">
            <summary>Required states</summary>
            <ul className="check-list">
              {selected.requiredStates.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>

          <details className="decision-card compact-disclosure">
            <summary>Interaction contract</summary>
            <ul className="check-list">
              {selected.interactionContract.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>

          {selectedComparisons.length > 0 && (
            <details className="decision-card compact-disclosure">
              <summary>Alternatives</summary>
              <div className="comparison-links">
                {selectedComparisons.map((comparison) => (
                  <a key={comparison.id} href={comparisonHref(comparison)}>
                    <span className="action-mark" aria-hidden="true">&lt;&gt;</span>
                    {comparison.title}
                  </a>
                ))}
              </div>
            </details>
          )}

          <details className="decision-card compact-disclosure">
            <summary>Audit</summary>
            <ul className="check-list audit-list">
              {selected.critiqueQuestions.slice(0, 3).map((item) => (
                <li key={item}>
                  <label className="audit-check">
                    <input type="checkbox" name={`audit-${selected.id}`} />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
            <label className="critique-note">
              <span>Critique note</span>
              <textarea
                name="critique-note"
                rows={3}
                value={critiqueNote}
                onChange={(event) => setCritiqueNote(event.target.value)}
                placeholder="Record the gap to fix before generating UI"
              />
            </label>
          </details>

          {shortlist.length > 0 && (
            <details className="decision-card compact-disclosure">
              <summary>Shortlist</summary>
              <div className="shortlist">
                {shortlist.map((pattern) => (
                  <button
                    key={pattern.id}
                    type="button"
                    className={pattern.id === selected.id ? "is-active" : ""}
                    onClick={() => setSelectedId(pattern.id)}
                  >
                    {pattern.name}
                  </button>
                ))}
              </div>
            </details>
          )}

          <details className="decision-card agent-brief-card compact-disclosure">
            <summary>Agent brief</summary>
            <textarea name="selected-pattern-agent-brief" readOnly value={agentBrief} rows={9} aria-label="Selected pattern agent brief" />
          </details>
        </aside>
      )}
    </section>
  );
}
