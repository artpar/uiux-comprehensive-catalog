import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  patternEntrySchema,
  type PatternEntry
} from "../src/schemas/catalog";

const root = process.cwd();
const outputDir = path.join(root, "public", "agent");

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

function bullets(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function formatPatternType(value: PatternEntry["patternType"]) {
  if (value === "ui") return "UI";
  if (value === "ux") return "UX";
  return "UI + UX";
}

function compactPattern(pattern: PatternEntry) {
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
    sourceIds: pattern.sources.map((source) => source.id)
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

const patterns = await loadPatterns();
const completePatterns = patterns.filter((pattern) => pattern.completionStatus === "complete");
await mkdir(outputDir, { recursive: true });

await writeFile(
  path.join(outputDir, "patterns.json"),
  `${JSON.stringify(
    {
      counts: {
        complete: completePatterns.length,
        stub: patterns.length - completePatterns.length
      },
      patterns: completePatterns.map(compactPattern)
    },
    null,
    2
  )}\n`
);
await writeFile(path.join(outputDir, "patterns.md"), patternsMarkdown(completePatterns));
await writeFile(path.join(outputDir, "decision-guide.md"), decisionGuideMarkdown(completePatterns));
await writeFile(path.join(outputDir, "anti-pattern-checklist.md"), antiPatternMarkdown(completePatterns));

console.log(`Generated agent exports for ${completePatterns.length} complete patterns; excluded ${patterns.length - completePatterns.length} stubs.`);
