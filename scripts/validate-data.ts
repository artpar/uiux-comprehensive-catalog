import { readdir, readFile } from "node:fs/promises";
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

async function loadJsonFiles<T>(dir: string, parse: (value: unknown) => T) {
  const base = path.join(root, dir);
  const files = await listJsonFiles(base);

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

function assertUniqueIds<T extends { id: string }>(label: string, entries: Array<{ file: string; data: T }>) {
  const seen = new Map<string, string>();

  for (const entry of entries) {
    const existing = seen.get(entry.data.id);
    if (existing) {
      throw new Error(`${label} duplicate id "${entry.data.id}" in ${entry.file}; already used in ${existing}`);
    }
    seen.set(entry.data.id, entry.file);
  }

  return seen;
}

function assertRefs(
  label: string,
  refs: string[],
  known: Map<string, string>,
  ownerFile: string
) {
  for (const ref of refs) {
    if (!known.has(ref)) {
      throw new Error(`${label} unknown ref "${ref}" in ${ownerFile}`);
    }
  }
}

function assertMinimumAgentGuidance(data: PatternEntry, file: string) {
  const checks = [
    ["selectionRules", data.selectionRules.length, 3],
    ["implementationChecklist", data.implementationChecklist.length, 3],
    ["requiredStates", data.requiredStates.length, 3],
    ["commonMisuses", data.commonMisuses.length, 2],
    ["critiqueQuestions", data.critiqueQuestions.length, 1]
  ] as const;

  for (const [field, actual, minimum] of checks) {
    if (actual < minimum) {
      throw new Error(`${data.id} in ${file} needs at least ${minimum} ${field} entries; found ${actual}.`);
    }
  }
}

const sources = await loadJsonFiles<SourceEntry>("src/data/sources", (value) => sourceEntrySchema.parse(value));
const patterns = await loadJsonFiles<PatternEntry>("src/data/patterns", (value) => patternEntrySchema.parse(value));
const comparisons = await loadJsonFiles<ComparisonEntry>(
  "src/data/comparisons",
  (value) => comparisonEntrySchema.parse(value)
);

const sourceIds = assertUniqueIds("source", sources);
const patternIds = assertUniqueIds("pattern", patterns);
const comparisonIds = assertUniqueIds("comparison", comparisons);

for (const { file, data } of patterns) {
  assertRefs(
    "pattern.source",
    data.sources.map((source) => source.id),
    sourceIds,
    file
  );
  assertRefs("pattern.relatedPatterns", data.relatedPatterns, patternIds, file);
  assertRefs("pattern.comparisons", data.comparisons, comparisonIds, file);
  assertMinimumAgentGuidance(data, file);

  if (data.maturity !== "anti-pattern" && data.solution.toLowerCase().includes("design system")) {
    throw new Error(`Pattern ${data.id} in ${file} appears to catalog a design system, not a UI/UX pattern.`);
  }
}

for (const { file, data } of comparisons) {
  assertRefs("comparison.patternIds", data.patternIds, patternIds, file);
  assertRefs(
    "comparison.sources",
    data.sources.map((source) => source.id),
    sourceIds,
    file
  );
}

console.log(
  `Validated ${patterns.length} patterns, ${comparisons.length} comparisons, and ${sources.length} sources.`
);
