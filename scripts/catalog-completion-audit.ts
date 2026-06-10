import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  comparisonEntrySchema,
  patternEntrySchema,
  type ComparisonEntry,
  type PatternEntry
} from "../src/schemas/catalog";

const root = process.cwd();
const duplicateAuditFields = [
  "problem",
  "solution",
  "uiGuidance",
  "uxGuidance",
  "selectionRules",
  "requiredStates",
  "interactionContract",
  "implementationChecklist",
  "commonMisuses",
  "critiqueQuestions",
  "useWhen",
  "avoidWhen",
  "failureModes"
] as const;

const genericComparisonPhrases = [
  /\bchoose by task fit\b/i,
  /\btask fit\b/i,
  /\bit depends\b/i,
  /\bas appropriate\b/i,
  /\bwhere useful\b/i,
  /\bdepending on context\b/i,
  /\bdepends on the use case\b/i
];

const genericCompletionPhrases = [
  /seed entry excluded/i,
  /placeholder/i,
  /todo/i,
  /tbd/i,
  /generic/i,
  /template/i
];

type PatternField = (typeof duplicateAuditFields)[number];

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

async function loadJsonFiles<T>(dir: string, parse: (value: unknown) => T) {
  const files = await listJsonFiles(path.join(root, dir));
  return Promise.all(
    files.map(async (fullPath) => {
      const raw = JSON.parse(await readFile(fullPath, "utf8"));
      return {
        file: path.relative(root, fullPath),
        data: parse(raw)
      };
    })
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/ui\/ux/g, "ui ux")
    .replace(/\b(a|an|the|and|or|to|for|from|of|in|on|with|without|when|where|while|that|this|these|those)\b/g, " ")
    .replace(/\b(user|users|pattern|patterns|ui|ux|state|states|use|choose|provide|show|keep|make|allow)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fieldValues(pattern: PatternEntry, field: PatternField) {
  const value = pattern[field];
  return Array.isArray(value) ? value : [value];
}

function goalIdCandidates(label: string) {
  const fullLabelId = slugify(label);
  const primaryLabelId = slugify(label.split(/\s+\/\s+/)[0]);
  return [...new Set([fullLabelId, primaryLabelId])];
}

async function expectedPatternsFromGoal() {
  const goal = await readFile(path.join(root, "ui-ux-patterns-goal.md"), "utf8");
  const expected = new Map<string, string[]>();
  let inScope = false;
  let currentList = "";

  const flushCurrentList = () => {
    if (!currentList) return;
    for (const item of currentList.split(",")) {
      const label = item.trim().replace(/\.$/, "");
      if (!label) continue;
      expected.set(label, goalIdCandidates(label));
    }
    currentList = "";
  };

  for (const rawLine of goal.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "Patterns to implement:") {
      inScope = true;
      continue;
    }
    if (line === "For each pattern:") {
      flushCurrentList();
      break;
    }
    if (!inScope || !line) continue;

    const categoryMatch = line.match(/^[A-Z][^:]+:\s+(.+)$/);
    if (categoryMatch) {
      flushCurrentList();
      currentList = categoryMatch[1];
    } else if (currentList) {
      currentList = `${currentList} ${line}`;
    }
  }

  return expected;
}

function assertCompleteEvidence(
  completePatterns: Array<{ file: string; data: PatternEntry }>,
  comparisons: Array<{ file: string; data: ComparisonEntry }>,
  demoSource: string,
  playgroundSource: string
) {
  const comparisonById = new Map(comparisons.map((entry) => [entry.data.id, entry]));

  for (const { file, data } of completePatterns) {
    if (data.examples.length === 0) {
      throw new Error(`Complete pattern ${data.id} in ${file} must include at least one inspected example.`);
    }
    if (data.relatedPatterns.length === 0) {
      throw new Error(`Complete pattern ${data.id} in ${file} must distinguish itself from at least one related pattern.`);
    }
    if (data.comparisons.length === 0) {
      throw new Error(`Complete pattern ${data.id} in ${file} must link to at least one comparison entry.`);
    }
    if (genericCompletionPhrases.some((phrase) => phrase.test(data.completionNotes))) {
      throw new Error(`Complete pattern ${data.id} in ${file} still has placeholder completion notes.`);
    }
    assertCompletionEvidenceText(data, file);

    const idNeedle = new RegExp(`(["']${data.id}["']|\\n\\s*${data.id})\\s*:`);
    if (!idNeedle.test(demoSource)) {
      throw new Error(`Complete pattern ${data.id} in ${file} is missing a QualityPatternDemo mapping.`);
    }
    if (!idNeedle.test(playgroundSource)) {
      throw new Error(`Complete pattern ${data.id} in ${file} is missing a PatternPlayground prompt mapping.`);
    }

    for (const comparisonId of data.comparisons) {
      const comparison = comparisonById.get(comparisonId);
      if (!comparison) continue;
      assertComparisonRules(comparison.data, comparison.file);
    }
  }
}

function assertCompletionEvidenceText(data: PatternEntry, file: string) {
  const evidence = data.completionEvidence;
  if (!evidence) {
    throw new Error(`Complete pattern ${data.id} in ${file} is missing completionEvidence.`);
  }

  const entries = Object.entries(evidence).filter(([key]) => key !== "screenshots") as Array<[string, string]>;
  for (const [key, value] of entries) {
    if (value.trim().split(/\s+/).length < 8) {
      throw new Error(`Complete pattern ${data.id} in ${file} has under-specified completionEvidence.${key}.`);
    }
    if (genericCompletionPhrases.some((phrase) => phrase.test(value))) {
      throw new Error(`Complete pattern ${data.id} in ${file} has placeholder completionEvidence.${key}.`);
    }
  }
}

async function assertScreenshotEvidence(completePatterns: Array<{ file: string; data: PatternEntry }>) {
  for (const { file, data } of completePatterns) {
    for (const screenshot of data.completionEvidence?.screenshots ?? []) {
      try {
        await access(path.join(root, screenshot));
      } catch {
        throw new Error(`Complete pattern ${data.id} in ${file} references missing screenshot evidence: ${screenshot}`);
      }
    }
  }
}

function assertComparisonRules(comparison: ComparisonEntry, file: string) {
  for (const rule of comparison.decisionRules) {
    if (genericComparisonPhrases.some((phrase) => phrase.test(rule))) {
      throw new Error(`Comparison ${comparison.id} in ${file} has generic decision rule: "${rule}"`);
    }
    if (rule.trim().split(/\s+/).length < 6) {
      throw new Error(`Comparison ${comparison.id} in ${file} has an under-specified decision rule: "${rule}"`);
    }
  }
}

function duplicateAudit(patterns: Array<{ file: string; data: PatternEntry }>) {
  const rows = new Map<string, Array<{ id: string; file: string; field: string; text: string; complete: boolean }>>();

  for (const { file, data } of patterns) {
    for (const field of duplicateAuditFields) {
      for (const value of fieldValues(data, field)) {
        const normalized = normalizeText(value);
        if (normalized.length < 24) continue;
        const key = `${field}|${normalized}`;
        const row = {
          id: data.id,
          file,
          field,
          text: value,
          complete: data.completionStatus === "complete"
        };
        const existing = rows.get(key) ?? [];
        existing.push(row);
        rows.set(key, existing);
      }
    }
  }

  const duplicates = [...rows.values()].filter((group) => new Set(group.map((row) => row.id)).size > 1);
  const completeBlocking = duplicates.filter((group) => group.some((row) => row.complete));

  if (completeBlocking.length > 0) {
    const details = completeBlocking
      .slice(0, 12)
      .map((group) => {
        const first = group[0];
        const ids = [...new Set(group.map((row) => row.id))].join(", ");
        return `${first.field}: ${ids} share "${first.text}"`;
      })
      .join("\n");
    throw new Error(`Complete patterns have duplicated normalized fields:\n${details}`);
  }

  return duplicates;
}

const patterns = await loadJsonFiles<PatternEntry>("src/data/patterns", (value) => patternEntrySchema.parse(value));
const comparisons = await loadJsonFiles<ComparisonEntry>(
  "src/data/comparisons",
  (value) => comparisonEntrySchema.parse(value)
);
const expectedPatterns = await expectedPatternsFromGoal();
const presentIds = new Set(patterns.map((entry) => entry.data.id));
const completePatterns = patterns.filter((entry) => entry.data.completionStatus === "complete");
const stubPatterns = patterns.filter((entry) => entry.data.completionStatus === "stub");
const missingPatterns = [...expectedPatterns.entries()]
  .filter(([, candidates]) => candidates.every((id) => !presentIds.has(id)))
  .map(([label]) => label);
const duplicateGroups = duplicateAudit(patterns);
const demoSource = await readFile(path.join(root, "src", "components", "playgrounds", "QualityPatternDemo.tsx"), "utf8");
const playgroundSource = await readFile(path.join(root, "src", "components", "PatternPlayground.tsx"), "utf8");

comparisons.forEach(({ file, data }) => assertComparisonRules(data, file));
assertCompleteEvidence(completePatterns, comparisons, demoSource, playgroundSource);
await assertScreenshotEvidence(completePatterns);

console.log("Catalog completion audit:");
console.log(`  Complete patterns: ${completePatterns.length}`);
console.log(`  Stub patterns: ${stubPatterns.length}`);
console.log(`  Missing goal patterns: ${missingPatterns.length}`);
console.log(`  Normalized duplicate field groups: ${duplicateGroups.length}`);
if (missingPatterns.length > 0) {
  console.log(`  First missing: ${missingPatterns.slice(0, 12).join("; ")}`);
}
