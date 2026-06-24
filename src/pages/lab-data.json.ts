import { comparisons, patterns } from "@/lib/catalog";

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
    uiGuidance: pattern.uiGuidance,
    uxGuidance: pattern.uxGuidance,
    uiExamples: pattern.uiExamples,
    uxExamples: pattern.uxExamples,
    selectionRules: pattern.selectionRules,
    requiredStates: pattern.requiredStates,
    commonMisuses: pattern.commonMisuses,
    implementationChecklist: pattern.implementationChecklist,
    variants: pattern.variants,
    avoidWhen: pattern.avoidWhen,
    failureModes: pattern.failureModes,
    critiqueQuestions: pattern.critiqueQuestions,
    maturity: pattern.maturity,
    completionStatus: pattern.completionStatus,
    platforms: pattern.platforms,
    useWhen: pattern.useWhen,
    interactionContract: pattern.interactionContract,
    lastVerified: pattern.lastVerified,
    keyboardBehavior: pattern.keyboardBehavior,
    accessibility: pattern.accessibility,
    sources: pattern.sources.map((source) => ({
      id: source.id,
      note: source.note
    }))
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
