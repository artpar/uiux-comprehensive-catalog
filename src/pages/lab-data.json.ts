import { comparisons, patterns } from "@/lib/catalog";
import type { PatternEntry } from "@/schemas/catalog";

function patternSearchText(pattern: PatternEntry) {
  const core = [
    pattern.name,
    pattern.aliases.join(" "),
    pattern.category,
    pattern.patternType,
    pattern.surfaceType,
    pattern.problem,
    pattern.solution
  ];
  const keywordSource = [
    ...pattern.uiGuidance,
    ...pattern.uxGuidance,
    ...pattern.uiExamples.good,
    ...pattern.uiExamples.bad,
    ...pattern.uxExamples.good,
    ...pattern.uxExamples.bad,
    pattern.selectionRules.join(" "),
    pattern.requiredStates.join(" "),
    pattern.commonMisuses.join(" "),
    pattern.implementationChecklist.join(" "),
    pattern.variants.join(" "),
    pattern.avoidWhen.join(" "),
    pattern.failureModes.join(" "),
    pattern.critiqueQuestions.join(" "),
    pattern.useWhen.join(" "),
    pattern.interactionContract.join(" "),
    pattern.keyboardBehavior.join(" "),
    pattern.accessibility.join(" ")
  ]
    .join(" ")
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9-]{2,}/g) ?? [];
  const keywords = [...new Set(keywordSource)]
    .filter((word) => !["with", "that", "this", "from", "when", "then", "into", "only", "must", "user", "users"].includes(word))
    .slice(0, 32);

  return [...core, keywords.join(" ")]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function GET() {
  const workbenchPatterns = patterns.map((pattern) => ({
    id: pattern.id,
    name: pattern.name,
    aliases: pattern.aliases,
    category: pattern.category,
    patternType: pattern.patternType,
    surfaceType: pattern.surfaceType,
    problem: pattern.problem,
    solution: pattern.solution,
    maturity: pattern.maturity,
    completionStatus: pattern.completionStatus,
    platforms: pattern.platforms,
    lastVerified: pattern.lastVerified,
    searchText: patternSearchText(pattern),
    sourceCount: pattern.sources.length,
    sources: []
  }));
  const workbenchComparisons = comparisons.map((comparison) => ({
    id: comparison.id,
    title: comparison.title,
    patternIds: comparison.patternIds
  }));

  return new Response(
    JSON.stringify({
      patterns: workbenchPatterns,
      comparisons: workbenchComparisons,
      categories: [...new Set(patterns.map((pattern) => pattern.category))].sort(),
      platforms: [...new Set(patterns.flatMap((pattern) => pattern.platforms))].sort(),
      maturities: [...new Set(patterns.map((pattern) => pattern.maturity))].sort()
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600"
      }
    }
  );
}
