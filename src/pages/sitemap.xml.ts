import type { APIRoute } from "astro";
import { comparisons, patterns, sources } from "@/lib/catalog";

const staticRoutes = ["", "agent/", "anti-patterns/", "compare/", "lab/", "sources/"];

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
  const routes = [
    ...staticRoutes,
    ...patterns.map((pattern) => `patterns/${pattern.id}/`),
    ...comparisons.map((comparison) => `compare/${comparison.id}/`),
    ...sources.map((source) => `sources/${source.id}/`)
  ];

  const urls = routes
    .map((route) => `  <url><loc>${escapeXml(absoluteUrl(route, siteUrl))}</loc></url>`)
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
