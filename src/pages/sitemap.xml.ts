import type { APIRoute } from "astro";
import { comparisons, patterns, sources } from "@/lib/catalog";

type SitemapRoute = {
  path: string;
  lastmod: string;
};

function normalizedBase() {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? base : `${base}/`;
}

function absoluteUrl(path: string, site: URL) {
  return new URL(`${normalizedBase()}${path}`, site).toString();
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL("https://uxpatternsguide.com");
  const latestPatternDate = patterns.reduce((latest, pattern) => pattern.lastVerified > latest ? pattern.lastVerified : latest, "2026-06-01");
  const latestComparisonDate = comparisons.reduce((latest, comparison) => comparison.lastVerified > latest ? comparison.lastVerified : latest, latestPatternDate);
  const latestSourceDate = sources.reduce((latest, source) => source.checkedAt > latest ? source.checkedAt : latest, latestComparisonDate);
  const routes = [
    { path: "", lastmod: latestSourceDate },
    { path: "agent/", lastmod: latestPatternDate },
    { path: "anti-patterns/", lastmod: latestPatternDate },
    { path: "resources/", lastmod: latestPatternDate },
    { path: "resources/ux-pattern-selection-checklist/", lastmod: latestPatternDate },
    { path: "compare/", lastmod: latestComparisonDate },
    { path: "lab/", lastmod: latestPatternDate },
    { path: "patterns/", lastmod: latestPatternDate },
    { path: "sources/", lastmod: latestSourceDate },
    ...patterns.map((pattern) => ({ path: `patterns/${pattern.id}/`, lastmod: pattern.lastVerified })),
    ...comparisons.map((comparison) => ({ path: `compare/${comparison.id}/`, lastmod: comparison.lastVerified })),
    ...sources.map((source) => ({ path: `sources/${source.id}/`, lastmod: source.checkedAt }))
  ] satisfies SitemapRoute[];

  const urls = routes
    .map((route) => `  <url><loc>${escapeXml(absoluteUrl(route.path, siteUrl))}</loc><lastmod>${route.lastmod}</lastmod></url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
