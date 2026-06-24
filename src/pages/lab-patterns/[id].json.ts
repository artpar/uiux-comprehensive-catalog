import { patterns } from "@/lib/catalog";
import type { PatternEntry } from "@/schemas/catalog";

function patternSearchText(pattern: PatternEntry) {
  return [
    pattern.name,
    pattern.aliases.join(" "),
    pattern.category,
    pattern.patternType,
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
    pattern.critiqueQuestions.join(" "),
    pattern.useWhen.join(" "),
    pattern.interactionContract.join(" "),
    pattern.keyboardBehavior.join(" "),
    pattern.accessibility.join(" ")
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function workbenchPatternDetail(pattern: PatternEntry) {
  return {
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
    searchText: patternSearchText(pattern),
    sourceCount: pattern.sources.length,
    sources: pattern.sources.map((source) => ({
      id: source.id,
      note: source.note
    }))
  };
}

export function getStaticPaths() {
  return patterns.map((pattern) => ({ params: { id: pattern.id } }));
}

export function GET({ params }: { params: { id: string } }) {
  const pattern = patterns.find((item) => item.id === params.id);

  if (!pattern) {
    return new Response(JSON.stringify({ error: "Pattern not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  }

  return new Response(JSON.stringify(workbenchPatternDetail(pattern)), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600"
    }
  });
}
