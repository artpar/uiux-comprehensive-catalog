import type { APIRoute } from "astro";
import { comparisons, getPattern } from "@/lib/catalog";
import { withBase } from "@/lib/paths";

export const prerender = true;

export const GET: APIRoute = () => {
  const data = comparisons.map((comparison) => {
    const comparedPatterns = comparison.patternIds.map((id) => getPattern(id)).filter(Boolean);
    const categories = [
      ...new Set(
        comparedPatterns
          .flatMap((pattern) => [pattern?.category, ...(pattern?.secondaryCategories ?? [])])
          .filter(Boolean)
      )
    ];

    return {
      id: comparison.id,
      title: comparison.title,
      href: withBase(`/compare/${comparison.id}/`),
      patternIds: comparison.patternIds,
      patternNames: comparedPatterns.map((pattern) => pattern?.name ?? "").filter(Boolean),
      categories,
      primaryCategory: categories[0] ?? "Other",
      summary: comparison.summary,
      rule: comparison.decisionRules[0],
      lastVerified: comparison.lastVerified
    };
  });

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
