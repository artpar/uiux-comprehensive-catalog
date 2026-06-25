import { patterns } from "@/lib/catalog";
import { withBase } from "@/lib/paths";
import type { PatternEntry } from "@/schemas/catalog";

function searchableText(pattern: PatternEntry) {
  const supportingTerms = [
    ...pattern.selectionRules.slice(0, 2),
    ...pattern.requiredStates.slice(0, 3),
    ...pattern.commonMisuses.slice(0, 3)
  ];

  return [
    pattern.name,
    pattern.aliases.join(" "),
    pattern.category,
    pattern.maturity,
    pattern.patternType,
    pattern.surfaceType,
    pattern.problem,
    pattern.useWhen.join(" "),
    supportingTerms.join(" ")
  ]
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function GET() {
  return new Response(
    JSON.stringify(
      patterns.map((pattern) => ({
        id: pattern.id,
        name: pattern.name,
        category: pattern.category,
        maturity: pattern.maturity,
        surfaceType: pattern.surfaceType,
        problem: pattern.problem,
        useWhen: pattern.useWhen[0] ?? pattern.selectionRules[0] ?? pattern.problem,
        href: withBase(`/patterns/${pattern.id}/`),
        searchText: searchableText(pattern)
      }))
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    }
  );
}
