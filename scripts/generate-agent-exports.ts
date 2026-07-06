import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  comparisonEntrySchema,
  patternEntrySchema,
  sourceEntrySchema,
  type ComparisonEntry,
  type PatternEntry,
  type SourceEntry
} from "../src/schemas/catalog";

const root = process.cwd();
const outputDir = path.join(root, "public", "agent");
const siteUrl = "https://uxpatternsguide.com";

async function listJsonFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listJsonFiles(entryPath);
      }
      return entry.name.endsWith(".json") ? [entryPath] : [];
    })
  );

  return files.flat();
}

async function loadPatterns() {
  const files = await listJsonFiles(path.join(root, "src", "data", "patterns"));
  const patterns = await Promise.all(
    files.map(async (file) => {
      const raw = JSON.parse(await readFile(file, "utf8"));
      return patternEntrySchema.parse(raw);
    })
  );

  return patterns.sort((a, b) => a.name.localeCompare(b.name));
}

async function loadComparisons() {
  const files = await listJsonFiles(path.join(root, "src", "data", "comparisons"));
  const comparisons = await Promise.all(
    files.map(async (file) => {
      const raw = JSON.parse(await readFile(file, "utf8"));
      return comparisonEntrySchema.parse(raw);
    })
  );

  return comparisons.sort((a, b) => a.title.localeCompare(b.title));
}

async function loadSources() {
  const files = await listJsonFiles(path.join(root, "src", "data", "sources"));
  const sources = await Promise.all(
    files.map(async (file) => {
      const raw = JSON.parse(await readFile(file, "utf8"));
      return sourceEntrySchema.parse(raw);
    })
  );

  return sources.sort((a, b) => a.name.localeCompare(b.name));
}

function bullets(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function formatPatternType(value: PatternEntry["patternType"]) {
  if (value === "ui") return "UI";
  if (value === "ux") return "UX";
  return "UI + UX";
}

function absoluteUrl(pathname: string) {
  return `${siteUrl}${pathname}`;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function latestCatalogDate(patterns: PatternEntry[], comparisons: ComparisonEntry[]) {
  return [...patterns.map((pattern) => pattern.lastVerified), ...comparisons.map((comparison) => comparison.lastVerified)]
    .sort()
    .at(-1) ?? "unknown";
}

function words(value: string) {
  return value.toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g) ?? [];
}

function searchKeywords(pattern: PatternEntry) {
  const keywordSource = [
    pattern.name,
    pattern.aliases.join(" "),
    pattern.category,
    pattern.patternType,
    pattern.surfaceType,
    pattern.problem,
    pattern.solution,
    ...pattern.uiGuidance,
    ...pattern.uxGuidance,
    ...pattern.selectionRules,
    ...pattern.requiredStates,
    ...pattern.commonMisuses,
    ...pattern.implementationChecklist,
    ...pattern.variants,
    ...pattern.avoidWhen,
    ...pattern.failureModes,
    ...pattern.critiqueQuestions,
    ...pattern.useWhen,
    ...pattern.interactionContract,
    ...pattern.keyboardBehavior,
    ...pattern.accessibility
  ].join(" ");

  const stopWords = new Set([
    "and",
    "are",
    "can",
    "for",
    "from",
    "has",
    "into",
    "must",
    "not",
    "only",
    "that",
    "the",
    "then",
    "this",
    "use",
    "user",
    "users",
    "when",
    "with"
  ]);

  return unique(words(keywordSource).filter((word) => !stopWords.has(word))).slice(0, 40);
}

function compactPattern(pattern: PatternEntry, comparisons: ComparisonEntry[] = []) {
  return {
    id: pattern.id,
    completionStatus: pattern.completionStatus,
    name: pattern.name,
    category: pattern.category,
    patternType: pattern.patternType,
    surfaceType: pattern.surfaceType,
    maturity: pattern.maturity,
    platforms: pattern.platforms,
    problem: pattern.problem,
    solution: pattern.solution,
    uiGuidance: pattern.uiGuidance,
    uxGuidance: pattern.uxGuidance,
    uiExamples: pattern.uiExamples,
    uxExamples: pattern.uxExamples,
    problemContext: pattern.problemContext,
    selectionRules: pattern.selectionRules,
    requiredStates: pattern.requiredStates,
    interactionContract: pattern.interactionContract,
    implementationChecklist: pattern.implementationChecklist,
    commonMisuses: pattern.commonMisuses,
    critiqueQuestions: pattern.critiqueQuestions,
    relatedPatterns: pattern.relatedPatterns,
    comparisons: pattern.comparisons,
    sourceIds: pattern.sources.map((source) => source.id),
    urls: {
      markdown: absoluteUrl(`/agent/patterns/${pattern.id}.md`),
      json: absoluteUrl(`/agent/patterns/${pattern.id}.json`),
      human: absoluteUrl(`/patterns/${pattern.id}/`)
    },
    comparisonUrls: comparisons
      .filter((comparison) => comparison.patternIds.includes(pattern.id))
      .map((comparison) => absoluteUrl(`/agent/comparisons/${comparison.id}.md`))
  };
}

function indexPattern(pattern: PatternEntry, comparisons: ComparisonEntry[]) {
  return {
    id: pattern.id,
    name: pattern.name,
    aliases: pattern.aliases,
    category: pattern.category,
    patternType: pattern.patternType,
    surfaceType: pattern.surfaceType,
    maturity: pattern.maturity,
    platforms: pattern.platforms,
    problem: pattern.problem,
    useWhen: pattern.useWhen[0] ?? pattern.selectionRules[0] ?? pattern.problem,
    avoidWhen: pattern.avoidWhen[0] ?? pattern.commonMisuses[0] ?? "",
    requiredStates: pattern.requiredStates.slice(0, 4),
    commonMisuses: pattern.commonMisuses.slice(0, 4),
    keywords: searchKeywords(pattern),
    lastVerified: pattern.lastVerified,
    urls: {
      markdown: absoluteUrl(`/agent/patterns/${pattern.id}.md`),
      json: absoluteUrl(`/agent/patterns/${pattern.id}.json`),
      human: absoluteUrl(`/patterns/${pattern.id}/`)
    },
    comparisonUrls: comparisons
      .filter((comparison) => comparison.patternIds.includes(pattern.id))
      .map((comparison) => absoluteUrl(`/agent/comparisons/${comparison.id}.md`))
  };
}

function patternsMarkdown(patterns: PatternEntry[]) {
  if (patterns.length === 0) {
    return `# UI/UX Pattern Guidance For LLM Agents

No patterns are currently marked complete. Stub entries are intentionally excluded from agent guidance so schema-valid placeholders are not counted as implementation-ready catalog content.
`;
  }

  const sections = patterns.map((pattern) => `## ${pattern.name} (${pattern.id})

Category: ${pattern.category}
Pattern type: ${formatPatternType(pattern.patternType)}
Surface type: ${pattern.surfaceType}
Maturity: ${pattern.maturity}
Platforms: ${pattern.platforms.join(", ")}

Problem: ${pattern.problem}

Solution: ${pattern.solution}

UI guidance:
${bullets(pattern.uiGuidance)}

Good UI examples:
${bullets(pattern.uiExamples.good)}

Bad UI examples:
${bullets(pattern.uiExamples.bad)}

UX guidance:
${bullets(pattern.uxGuidance)}

Good UX examples:
${bullets(pattern.uxExamples.good)}

Bad UX examples:
${bullets(pattern.uxExamples.bad)}

Choose this when:
${bullets(pattern.selectionRules)}

Required states:
${bullets(pattern.requiredStates)}

Interaction contract:
${bullets(pattern.interactionContract)}

Implementation checklist:
${bullets(pattern.implementationChecklist)}

Common generated-UI mistakes:
${bullets(pattern.commonMisuses)}

Critique questions:
${bullets(pattern.critiqueQuestions)}
`);

  return `# UI/UX Pattern Guidance For LLM Agents

Use this file to choose interaction patterns before generating UI. Do not treat visual styles, colors, CSS frameworks, or design-system names as patterns. Choose patterns based on user problem, task risk, required states, and interaction contract.

${sections.join("\n")}
`;
}

function decisionGuideMarkdown(patterns: PatternEntry[]) {
  if (patterns.length === 0) {
    return `# Agent UI/UX Decision Guide

No patterns are currently marked complete. Run the completion audit and add manual spot-check evidence before publishing decision guidance.
`;
  }

  const byId = new Map(patterns.map((pattern) => [pattern.id, pattern]));
  const pick = (ids: string[]) => ids.map((id) => byId.get(id)).filter((pattern): pattern is PatternEntry => Boolean(pattern));
  const groups = [
    {
      title: "User must make or recover from a risky action",
      ids: ["undo", "confirmation-dialog", "toast-only-critical-error"]
    },
    {
      title: "User must narrow or recover search results",
      ids: ["faceted-search", "no-results-recovery"]
    },
    {
      title: "User needs focused temporary attention",
      ids: ["modal-dialog", "confirmation-dialog"]
    },
    {
      title: "User needs primary mobile destinations",
      ids: ["bottom-navigation"]
    },
    {
      title: "User needs help asking an AI system",
      ids: ["prompt-suggestions"]
    }
  ];

  const sections = groups.map((group) => {
    const items = pick(group.ids).map((pattern) => `### ${pattern.name}

Use for: ${pattern.problem}

Selection rules:
${bullets(pattern.selectionRules)}

Must include:
${bullets(pattern.implementationChecklist)}
`);

    return `## ${group.title}

${items.join("\n")}`;
  });

  return `# Agent UI/UX Decision Guide

Use this guide before coding. Select patterns from the user's task and risk profile, then design the required states and interaction contract.

${sections.join("\n")}
`;
}

function antiPatternMarkdown(patterns: PatternEntry[]) {
  const antiPatterns = patterns.filter((pattern) => pattern.maturity === "anti-pattern");
  if (antiPatterns.length === 0) {
    return `# Anti-Pattern Checklist For LLM Agents

No anti-patterns are currently marked complete. Stub entries are intentionally excluded from the generated checklist.
`;
  }

  const sections = antiPatterns.map((pattern) => `## ${pattern.name} (${pattern.id})

Detect when:
${bullets(pattern.problemContext)}

Why it fails:
${bullets(pattern.commonMisuses)}

Replace with:
${bullets(pattern.implementationChecklist)}

Review question:
${bullets(pattern.critiqueQuestions)}
`);

  return `# Anti-Pattern Checklist For LLM Agents

Use this checklist after generating UI. If any anti-pattern is present, revise the interface before producing final code.

${sections.join("\n")}
`;
}

function patternMarkdown(
  pattern: PatternEntry,
  comparisons: ComparisonEntry[],
  sourceById: Map<string, SourceEntry>
) {
  const relatedComparisons = comparisons.filter((comparison) => comparison.patternIds.includes(pattern.id));
  const relatedPatternLinks = pattern.relatedPatterns.map(
    (id) => `- [${id}](${absoluteUrl(`/agent/patterns/${id}.md`)})`
  );
  const comparisonLinks = relatedComparisons.map(
    (comparison) => `- [${comparison.title}](${absoluteUrl(`/agent/comparisons/${comparison.id}.md`)})`
  );
  const sources = pattern.sources.map((sourceRef) => {
    const source = sourceById.get(sourceRef.id);
    const name = source?.name ?? sourceRef.id;
    const url = source?.url;
    const checkedAt = source?.checkedAt ? ` Checked ${source.checkedAt}.` : "";
    return `- ${url ? `[${name}](${url})` : name}: ${sourceRef.note}${checkedAt}`;
  });

  return `# ${pattern.name}

Pattern ID: ${pattern.id}
Category: ${pattern.category}
Pattern type: ${formatPatternType(pattern.patternType)}
Surface type: ${pattern.surfaceType}
Maturity: ${pattern.maturity}
Platforms: ${pattern.platforms.join(", ")}
Last verified: ${pattern.lastVerified}
Human page: ${absoluteUrl(`/patterns/${pattern.id}/`)}

## Agent Use

Use this pattern contract when generating or reviewing UI. Choose it by user problem, task risk, required states, and interaction contract. Do not choose it only because the component name appears in the request.

## Problem

${pattern.problem}

## Solution

${pattern.solution}

## Use When

${bullets(pattern.useWhen)}

## Avoid When

${bullets(pattern.avoidWhen)}

## Selection Rules

${bullets(pattern.selectionRules)}

## Required States

${bullets(pattern.requiredStates)}

## Interaction Contract

${bullets(pattern.interactionContract)}

## Implementation Checklist

${bullets(pattern.implementationChecklist)}

## Accessibility

${bullets(pattern.accessibility)}

## Keyboard Behavior

${bullets(pattern.keyboardBehavior)}

## Common Generated-UI Mistakes

${bullets(pattern.commonMisuses)}

## Failure Modes

${bullets(pattern.failureModes)}

## Critique Questions

${bullets(pattern.critiqueQuestions)}

## UI Guidance

${bullets(pattern.uiGuidance)}

## UX Guidance

${bullets(pattern.uxGuidance)}

## Quality Examples

Good UI:
${bullets(pattern.uiExamples.good)}

Bad UI:
${bullets(pattern.uiExamples.bad)}

Good UX:
${bullets(pattern.uxExamples.good)}

Bad UX:
${bullets(pattern.uxExamples.bad)}

## Related Patterns

${relatedPatternLinks.length ? relatedPatternLinks.join("\n") : "- No related patterns listed."}

## Comparisons

${comparisonLinks.length ? comparisonLinks.join("\n") : "- No related comparison packs listed."}

## Sources

${sources.join("\n")}
`;
}

function comparisonMarkdown(comparison: ComparisonEntry, patternById: Map<string, PatternEntry>) {
  const patternLinks = comparison.patternIds.map((id) => {
    const pattern = patternById.get(id);
    return `- [${pattern?.name ?? id}](${absoluteUrl(`/agent/patterns/${id}.md`)})`;
  });

  return `# ${comparison.title}

Comparison ID: ${comparison.id}
Last verified: ${comparison.lastVerified}

## Summary

${comparison.summary}

## Candidate Patterns

${patternLinks.join("\n")}

## Decision Rules

${bullets(comparison.decisionRules)}

## Failure Modes

${bullets(comparison.failureModes)}

## Source Notes

${comparison.sources.map((source) => `- ${source.id}: ${source.note}`).join("\n")}
`;
}

function categoryMarkdown(category: string, patterns: PatternEntry[]) {
  const entries = patterns
    .filter((pattern) => pattern.category === category)
    .map((pattern) => `## ${pattern.name}

Pattern ID: ${pattern.id}
Maturity: ${pattern.maturity}
Platforms: ${pattern.platforms.join(", ")}
Pattern contract: ${absoluteUrl(`/agent/patterns/${pattern.id}.md`)}

Use when: ${pattern.useWhen[0] ?? pattern.selectionRules[0]}

Avoid when: ${pattern.avoidWhen[0] ?? pattern.commonMisuses[0]}

Required states:
${bullets(pattern.requiredStates.slice(0, 4))}
`);

  return `# ${category}

Use this category pack as a shortlist only. Load the individual pattern contract before generating or reviewing UI.

${entries.join("\n")}
`;
}

function patternDirectoryIndex(patterns: PatternEntry[]) {
  return `# UX Pattern Contracts

Load the compact index first when possible: ${absoluteUrl("/agent/index.json")}

${patterns.map((pattern) => `- [${pattern.name}](${absoluteUrl(`/agent/patterns/${pattern.id}.md`)}): ${pattern.useWhen[0] ?? pattern.problem}`).join("\n")}
`;
}

function categoryDirectoryIndex(patterns: PatternEntry[]) {
  const categories = unique(patterns.map((pattern) => pattern.category)).sort();

  return `# UX Pattern Category Packs

Use category packs as shortlists. Load individual pattern contracts before generating or reviewing UI.

${categories.map((category) => `- [${category}](${absoluteUrl(`/agent/categories/${slugify(category)}.md`)})`).join("\n")}
`;
}

function comparisonDirectoryIndex(comparisons: ComparisonEntry[]) {
  return `# UX Pattern Comparison Packs

Use comparison packs when multiple nearby patterns could fit the same interface request.

${comparisons.map((comparison) => `- [${comparison.title}](${absoluteUrl(`/agent/comparisons/${comparison.id}.md`)}): ${comparison.summary}`).join("\n")}
`;
}

function copyPastePrompt() {
  return `Before generating or reviewing UI, use UX Patterns Guide as external context.

Read ${absoluteUrl("/agent/start.md")} for the workflow, then search ${absoluteUrl("/agent/index.json")} for 2-5 candidate patterns.

Load only the relevant pattern contracts from ${absoluteUrl("/agent/patterns/{id}.md")}. If candidates overlap, load the related comparison pack from ${absoluteUrl("/agent/comparisons/{id}.md")}. Before final output, apply ${absoluteUrl("/agent/anti-pattern-checklist.md")}.

In your answer, name the selected pattern, rejected alternatives, required states, interaction contract, common generated-UI mistakes avoided, and review questions. Do not load the full catalog unless you are building an offline index.`;
}

function copyPasteMarkdown() {
  return `# Copy-Paste Agent Instruction

Paste this into Codex, Claude Code, Cursor, Windsurf, or another agent that can fetch URLs.

\`\`\`text
${copyPastePrompt()}
\`\`\`
`;
}

function startMarkdown(patterns: PatternEntry[], comparisons: ComparisonEntry[]) {
  const categories = unique(patterns.map((pattern) => pattern.category)).sort();

  return `# UX Patterns Guide Agent Start

Use UX Patterns Guide before generating or reviewing UI. This is a static, source-backed catalog of interaction patterns, required states, interaction contracts, accessibility checks, failure modes, and common generated-UI mistakes.

## Fastest Path

Paste this into your agent:

\`\`\`text
${copyPastePrompt()}
\`\`\`

## Retrieval Order

1. Start with the compact index: ${absoluteUrl("/agent/index.json")}
2. Select 2-5 candidate patterns by user job, task risk, reversibility, platform, and interruption cost.
3. Load only the relevant pattern contracts from ${absoluteUrl("/agent/patterns/{id}.md")}.
4. If candidates overlap, load the related comparison pack from ${absoluteUrl("/agent/comparisons/{id}.md")}.
5. Before final output, apply the anti-pattern checklist: ${absoluteUrl("/agent/anti-pattern-checklist.md")}.

## Required Agent Output

When using this catalog, name:

- the selected pattern;
- the rejected nearby alternatives;
- required empty, loading, error, disabled, keyboard, and recovery states;
- interaction contract requirements;
- common generated-UI mistakes avoided;
- critique questions that should be checked after implementation.

## Static Entry Points

- Root discovery: ${absoluteUrl("/llms.txt")}
- Copy-paste instruction: ${absoluteUrl("/agent/copy-paste.md")}
- Manifest: ${absoluteUrl("/agent/manifest.json")}
- Compact index: ${absoluteUrl("/agent/index.json")}
- Decision guide: ${absoluteUrl("/agent/decision-guide.md")}
- Anti-pattern checklist: ${absoluteUrl("/agent/anti-pattern-checklist.md")}
- Review workflow: ${absoluteUrl("/agent/review-workflow.md")}
- Portable skill: ${absoluteUrl("/agent/skills/ux-patterns/SKILL.md")}
- Full Markdown export: ${absoluteUrl("/agent/patterns.md")}
- Full JSON export: ${absoluteUrl("/agent/patterns.json")}

## Catalog Counts

- Complete patterns: ${patterns.length}
- Comparison packs: ${comparisons.length}
- Categories: ${categories.length}

## Categories

${categories.map((category) => `- [${category}](${absoluteUrl(`/agent/categories/${slugify(category)}.md`)})`).join("\n")}
`;
}

function reviewWorkflowMarkdown() {
  return `# Generated UI Review Workflow

Use this after an agent or human has drafted UI.

## Review Steps

1. Identify the intended user job, platform, consequence severity, reversibility, and interruption cost.
2. Name the pattern the UI appears to use. If no pattern is explicit, infer the nearest pattern from the compact index.
3. Load the selected pattern contract and any nearby comparison pack.
4. Check whether the UI includes every required state from the pattern contract.
5. Check keyboard behavior, accessibility notes, recovery paths, and focus/return behavior.
6. Apply the anti-pattern checklist.
7. Return findings as concrete revisions, not generic UX advice.

## Finding Format

- Pattern: selected pattern and why it fits.
- Alternatives rejected: nearby patterns and why they do not fit.
- Missing states: required states absent from the UI.
- Contract breaks: interaction or keyboard requirements that are violated.
- Anti-pattern risks: named anti-patterns that appear.
- Required revision: concrete UI changes.
`;
}

function skillMarkdown() {
  return `---
name: ux-patterns
description: Use before generating or reviewing UI. Select source-backed UX patterns, required states, interaction contracts, accessibility checks, and anti-pattern risks from UX Patterns Guide.
metadata:
  source: ${siteUrl}
  version: "1.0.0"
---

Use this skill when designing, generating, implementing, or reviewing UI/UX behavior.

## Workflow

1. Identify the user job, platform, consequence severity, reversibility, interruption cost, and recovery needs.
2. Load the compact index from ${absoluteUrl("/agent/index.json")}.
3. Select 2-5 candidate patterns by problem fit. Do not choose by component name alone.
4. Load only the relevant pattern contracts from ${absoluteUrl("/agent/patterns/{id}.md")}.
5. If nearby alternatives overlap, load the relevant comparison pack from ${absoluteUrl("/agent/comparisons/{id}.md")}.
6. Before final output, apply ${absoluteUrl("/agent/anti-pattern-checklist.md")}.
7. State the selected pattern, rejected alternatives, required states, interaction contract, and review questions in the final implementation notes.

## References

- Retrieval details: ${absoluteUrl("/agent/skills/ux-patterns/references/retrieval.md")}
- Review workflow: ${absoluteUrl("/agent/skills/ux-patterns/references/review-checklist.md")}
- Decision guide: ${absoluteUrl("/agent/decision-guide.md")}
`;
}

function skillRetrievalReference() {
  return `# UX Patterns Retrieval

Use the smallest useful artifact.

1. Load ${absoluteUrl("/agent/index.json")} first.
2. Match against problem, useWhen, avoidWhen, requiredStates, commonMisuses, keywords, category, platform, and maturity.
3. Load individual pattern markdown files for shortlisted patterns.
4. Load comparison markdown when two or more candidates could fit.
5. Use full exports only for offline indexing or custom retrieval systems.
`;
}

function skillReviewReference() {
  return `# UX Pattern Review Checklist

Before finalizing generated UI:

- Does the selected pattern match the user job and consequence level?
- Are required empty, loading, error, disabled, keyboard, and recovery states represented?
- Does the interaction contract define focus, dismissal, state preservation, and return behavior?
- Are common generated-UI mistakes explicitly avoided?
- Has a nearby comparison pack ruled out more suitable alternatives?
- Does any anti-pattern checklist item apply?
`;
}

function llmsTxt(patterns: PatternEntry[], comparisons: ComparisonEntry[]) {
  return `# UX Patterns Guide

> Source-backed UI/UX pattern guidance for agents generating or reviewing product interfaces. Use it before coding UI so pattern choice, required states, interaction contracts, accessibility behavior, and anti-pattern risks are explicit.

Start with the agent guide and compact index. Load only the relevant pattern or comparison files. Full exports are available for offline indexing, but should not be the default first context.

## Agent Entry Points

- [Agent start guide](${absoluteUrl("/agent/start.md")}): How agents should use this catalog.
- [Copy-paste instruction](${absoluteUrl("/agent/copy-paste.md")}): One message to paste into an agent that can fetch URLs.
- [Compact pattern index](${absoluteUrl("/agent/index.json")}): Searchable index for ${patterns.length} complete patterns.
- [Decision guide](${absoluteUrl("/agent/decision-guide.md")}): Pattern selection workflow.
- [Anti-pattern checklist](${absoluteUrl("/agent/anti-pattern-checklist.md")}): Generated UI review checks.
- [Review workflow](${absoluteUrl("/agent/review-workflow.md")}): Post-generation review format.
- [UX patterns skill](${absoluteUrl("/agent/skills/ux-patterns/SKILL.md")}): Portable Agent Skill for Codex, Claude Code, and compatible agents.
- [Manifest](${absoluteUrl("/agent/manifest.json")}): Static artifact map and counts.

## Pattern Packs

- [Pattern files](${absoluteUrl("/agent/patterns/index.md")}): One markdown and JSON contract per pattern.
- [Category packs](${absoluteUrl("/agent/categories/index.md")}): Shortlists grouped by pattern category.
- [Comparison packs](${absoluteUrl("/agent/comparisons/index.md")}): ${comparisons.length} decision packs for nearby alternatives.

## Optional

- [Full Markdown export](${absoluteUrl("/agent/patterns.md")}): Complete pattern guidance in one file.
- [Full JSON export](${absoluteUrl("/agent/patterns.json")}): Complete machine-readable export.
`;
}

function manifest(patterns: PatternEntry[], comparisons: ComparisonEntry[]) {
  const categories = unique(patterns.map((pattern) => pattern.category)).sort();

  return {
    name: "UX Patterns Guide Agent Artifacts",
    version: "1.0.0",
    catalogLastVerified: latestCatalogDate(patterns, comparisons),
    source: siteUrl,
    counts: {
      completePatterns: patterns.length,
      comparisons: comparisons.length,
      categories: categories.length
    },
    entrypoints: {
      llms: absoluteUrl("/llms.txt"),
      copyPaste: absoluteUrl("/agent/copy-paste.md"),
      start: absoluteUrl("/agent/start.md"),
      compactIndex: absoluteUrl("/agent/index.json"),
      decisionGuide: absoluteUrl("/agent/decision-guide.md"),
      antiPatternChecklist: absoluteUrl("/agent/anti-pattern-checklist.md"),
      reviewWorkflow: absoluteUrl("/agent/review-workflow.md"),
      skill: absoluteUrl("/agent/skills/ux-patterns/SKILL.md"),
      fullMarkdown: absoluteUrl("/agent/patterns.md"),
      fullJson: absoluteUrl("/agent/patterns.json")
    },
    directories: {
      patterns: absoluteUrl("/agent/patterns/index.md"),
      categories: absoluteUrl("/agent/categories/index.md"),
      comparisons: absoluteUrl("/agent/comparisons/index.md"),
      skills: absoluteUrl("/agent/skills/")
    }
  };
}

function codexPluginManifest() {
  return {
    name: "ux-patterns-guide",
    version: "1.0.0",
    description: "Source-backed UX pattern selection and generated UI review.",
    skills: "./skills/"
  };
}

async function writeSkillPackage(baseDir: string) {
  await mkdir(path.join(baseDir, "references"), { recursive: true });
  await writeFile(path.join(baseDir, "SKILL.md"), skillMarkdown());
  await writeFile(path.join(baseDir, "references", "retrieval.md"), skillRetrievalReference());
  await writeFile(path.join(baseDir, "references", "review-checklist.md"), skillReviewReference());
}

const patterns = await loadPatterns();
const comparisons = await loadComparisons();
const sources = await loadSources();
const completePatterns = patterns.filter((pattern) => pattern.completionStatus === "complete");
const patternById = new Map(completePatterns.map((pattern) => [pattern.id, pattern]));
const sourceById = new Map(sources.map((source) => [source.id, source]));
const completeComparisons = comparisons.filter((comparison) =>
  comparison.patternIds.every((id) => patternById.has(id))
);
await mkdir(outputDir, { recursive: true });
await mkdir(path.join(outputDir, "patterns"), { recursive: true });
await mkdir(path.join(outputDir, "categories"), { recursive: true });
await mkdir(path.join(outputDir, "comparisons"), { recursive: true });

await writeFile(
  path.join(outputDir, "patterns.json"),
  `${JSON.stringify(
    {
      counts: {
        complete: completePatterns.length,
        stub: patterns.length - completePatterns.length
      },
      patterns: completePatterns.map((pattern) => compactPattern(pattern, completeComparisons))
    },
    null,
    2
  )}\n`
);
await writeFile(
  path.join(outputDir, "index.json"),
  `${JSON.stringify(
    {
      catalogLastVerified: latestCatalogDate(completePatterns, completeComparisons),
      source: siteUrl,
      counts: {
        completePatterns: completePatterns.length,
        comparisons: completeComparisons.length,
        categories: unique(completePatterns.map((pattern) => pattern.category)).length
      },
      patterns: completePatterns.map((pattern) => indexPattern(pattern, completeComparisons))
    },
    null,
    2
  )}\n`
);
await writeFile(
  path.join(outputDir, "manifest.json"),
  `${JSON.stringify(manifest(completePatterns, completeComparisons), null, 2)}\n`
);
await writeFile(path.join(outputDir, "patterns.md"), patternsMarkdown(completePatterns));
await writeFile(path.join(outputDir, "copy-paste.md"), copyPasteMarkdown());
await writeFile(path.join(outputDir, "decision-guide.md"), decisionGuideMarkdown(completePatterns));
await writeFile(path.join(outputDir, "anti-pattern-checklist.md"), antiPatternMarkdown(completePatterns));
await writeFile(path.join(outputDir, "start.md"), startMarkdown(completePatterns, completeComparisons));
await writeFile(path.join(outputDir, "review-workflow.md"), reviewWorkflowMarkdown());
await writeFile(path.join(root, "public", "llms.txt"), llmsTxt(completePatterns, completeComparisons));
await writeFile(path.join(outputDir, "patterns", "index.md"), patternDirectoryIndex(completePatterns));
await writeFile(path.join(outputDir, "categories", "index.md"), categoryDirectoryIndex(completePatterns));
await writeFile(path.join(outputDir, "comparisons", "index.md"), comparisonDirectoryIndex(completeComparisons));

await Promise.all(
  completePatterns.flatMap((pattern) => [
    writeFile(path.join(outputDir, "patterns", `${pattern.id}.md`), patternMarkdown(pattern, completeComparisons, sourceById)),
    writeFile(
      path.join(outputDir, "patterns", `${pattern.id}.json`),
      `${JSON.stringify(compactPattern(pattern, completeComparisons), null, 2)}\n`
    )
  ])
);

await Promise.all(
  unique(completePatterns.map((pattern) => pattern.category)).map((category) =>
    writeFile(path.join(outputDir, "categories", `${slugify(category)}.md`), categoryMarkdown(category, completePatterns))
  )
);

await Promise.all(
  completeComparisons.map((comparison) =>
    writeFile(path.join(outputDir, "comparisons", `${comparison.id}.md`), comparisonMarkdown(comparison, patternById))
  )
);

await writeSkillPackage(path.join(outputDir, "skills", "ux-patterns"));

const pluginDir = path.join(outputDir, "plugins", "ux-patterns-guide");
await mkdir(path.join(pluginDir, ".codex-plugin"), { recursive: true });
await writeFile(
  path.join(pluginDir, ".codex-plugin", "plugin.json"),
  `${JSON.stringify(codexPluginManifest(), null, 2)}\n`
);
await writeFile(
  path.join(pluginDir, "plugin-manifest.json"),
  `${JSON.stringify(codexPluginManifest(), null, 2)}\n`
);
await writeSkillPackage(path.join(pluginDir, "skills", "ux-patterns"));

console.log(
  `Generated agent exports for ${completePatterns.length} complete patterns, ${completeComparisons.length} comparisons, and ${unique(completePatterns.map((pattern) => pattern.category)).length} categories; excluded ${patterns.length - completePatterns.length} stubs.`
);
