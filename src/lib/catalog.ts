import {
  comparisonEntrySchema,
  patternEntrySchema,
  sourceEntrySchema,
  type ComparisonEntry,
  type PatternEntry,
  type SourceEntry
} from "@/schemas/catalog";

const patternModules = import.meta.glob("../data/patterns/*.json", { eager: true });
const sourceModules = import.meta.glob("../data/sources/*.json", { eager: true });
const comparisonModules = import.meta.glob("../data/comparisons/*.json", { eager: true });

function parseModule<T>(module: unknown, parser: { parse: (value: unknown) => T }) {
  const value = module && typeof module === "object" && "default" in module ? module.default : module;
  return parser.parse(value);
}

export const patterns = Object.values(patternModules)
  .map((module) => parseModule(module, patternEntrySchema))
  .sort((a, b) => a.name.localeCompare(b.name));

export const sources = Object.values(sourceModules)
  .map((module) => parseModule(module, sourceEntrySchema))
  .sort((a, b) => a.name.localeCompare(b.name));

export const comparisons = Object.values(comparisonModules)
  .map((module) => parseModule(module, comparisonEntrySchema))
  .sort((a, b) => a.title.localeCompare(b.title));

export const sourceById = new Map<string, SourceEntry>(sources.map((source) => [source.id, source]));
export const patternById = new Map<string, PatternEntry>(patterns.map((pattern) => [pattern.id, pattern]));
export const comparisonById = new Map<string, ComparisonEntry>(
  comparisons.map((comparison) => [comparison.id, comparison])
);

export function getPattern(id: string) {
  return patternById.get(id);
}

export function getComparison(id: string) {
  return comparisonById.get(id);
}

export function getSource(id: string) {
  return sourceById.get(id);
}

export function getPatternsForSource(sourceId: string) {
  return patterns.filter((pattern) => pattern.sources.some((source) => source.id === sourceId));
}
