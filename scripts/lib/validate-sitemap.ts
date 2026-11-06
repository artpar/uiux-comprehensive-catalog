import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith(".html") ? [path] : [];
  });
}

function attribute(tag: string, name: string) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1];
}

export function validateSitemap(directory: string): { count: number; failures: string[] } {
  const failures: string[] = [];
  const xml = readFileSync(join(directory, "sitemap.xml"), "utf8");
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
  const urls = new Set(locations);
  if (!locations.length) failures.push("Sitemap is empty.");
  if (urls.size !== locations.length) failures.push("Sitemap contains duplicate URLs.");
  const pages = new Set<string>();
  const origins = new Set<string>();
  for (const file of htmlFiles(directory)) {
    const path = relative(directory, file).replaceAll("\\", "/");
    // Verification files and the error page are not search pages.
    if (path === "404.html" || /^(?:google[^/]+|yandex_[^/]+)\.html$/.test(path)) continue;
    const html = readFileSync(file, "utf8");
    if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)]
      .map(([tag]) => tag).find((tag) => attribute(tag, "rel") === "canonical");
    const href = canonical && attribute(canonical, "href");
    if (!href) { failures.push(`${path}: public HTML page has no canonical URL.`); continue; }
    try {
      const url = new URL(href);
      if (url.search || url.hash) failures.push(`${path}: canonical URL has a query or fragment.`);
      if (pages.has(href)) failures.push(`${path}: duplicate canonical URL ${href}.`);
      origins.add(url.origin);
      pages.add(href);
      if (!urls.has(href)) failures.push(`${path}: canonical page missing from sitemap: ${href}`);
    } catch { failures.push(`${path}: invalid canonical URL ${href}.`); }
  }
  if (origins.size > 1) failures.push("Generated pages use multiple canonical origins.");
  for (const location of urls) {
    if (!pages.has(location)) failures.push(`Sitemap URL has no indexable canonical HTML page: ${location}`);
  }
  const today = new Date().toISOString().slice(0, 10);
  for (const [, value] of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value || value > today) {
      failures.push(`Invalid or future lastmod: ${value}`);
    }
  }
  return { count: urls.size, failures };
}
