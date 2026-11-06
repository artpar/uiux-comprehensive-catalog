import type { APIRoute } from "astro";
import { categoryNames, categorySlug } from "@/lib/categories";
import { comparisons, patterns, sources } from "@/lib/catalog";
import { learningLessons } from "@/data/learning";
import { workflows } from "@/data/workflows";
import { uiPrinciples } from "@/data/ui-principles";
import { contentModifiedDates } from "@/lib/content-modified";
import { readFileSync } from "node:fs";

type SitemapRoute = {
  path: string;
  files: string[];
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
  const modified = contentModifiedDates();
  const patternFile = (id: string) => `src/data/patterns/${id}.json`;
  const sourceFile = (id: string) => `src/data/sources/${id}.json`;
  const catalogData = ["src/data/patterns/", "src/data/comparisons/", "src/data/sources/"];
  // Discover static pages automatically. Dynamic routes below supply their content records.
  const staticPages = Object.keys(import.meta.glob("./**/*.astro"))
    .filter((file) => !file.includes("[") && file !== "./404.astro" && !file.startsWith("./preview/"));
  const routes = [
    ...staticPages.map((file) => ({
      path: file.slice(2).replace(/(?:^|\/)index\.astro$/, "/").replace(/\.astro$/, "/").replace(/^\//, ""),
      files: [`src/pages/${file.slice(2)}`, ...(readFileSync(`src/pages/${file.slice(2)}`, "utf8").includes('@/lib/catalog') ? catalogData : [])]
    })),
    ...learningLessons.flatMap((lesson) => ["learn", "practice"].map((section) => ({
      path: `${section}/${lesson.id}/`, files: [`src/pages/${section}/[id].astro`]
    }))),
    ...uiPrinciples.map((principle) => ({ path: `principles/${principle.id}/`, files: ["src/pages/principles/[id].astro", ...principle.patternIds.map(patternFile)] })),
    ...workflows.map((workflow) => ({ path: `work/${workflow.id}/`, files: ["src/pages/work/[id].astro"] })),
    ...categoryNames.map((category) => ({ path: `patterns/category/${categorySlug(category)}/`, files: ["src/pages/patterns/category/[category].astro", ...patterns.filter((pattern) => pattern.category === category).map((pattern) => patternFile(pattern.id))] })),
    ...patterns.map((pattern) => ({ path: `patterns/${pattern.id}/`, files: ["src/pages/patterns/[id].astro", patternFile(pattern.id), ...pattern.sources.map((source) => sourceFile(source.id)), ...pattern.relatedPatterns.map(patternFile)] })),
    ...comparisons.map((comparison) => ({ path: `compare/${comparison.id}/`, files: ["src/pages/compare/[id].astro", `src/data/comparisons/${comparison.id}.json`, ...comparison.patternIds.map(patternFile), ...comparison.sources.map((source) => sourceFile(source.id))] })),
    ...sources.map((source) => ({ path: `sources/${source.id}/`, files: ["src/pages/sources/[id].astro", sourceFile(source.id), ...patterns.filter((pattern) => pattern.sources.some((ref) => ref.id === source.id)).map((pattern) => patternFile(pattern.id))] }))
  ] satisfies SitemapRoute[];

  const urls = routes
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((route) => {
      const lastmod = modified(route.files);
      return `  <url><loc>${escapeXml(absoluteUrl(route.path, siteUrl))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    })
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
