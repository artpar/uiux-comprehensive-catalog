import type { APIRoute } from "astro";

function normalizedBase() {
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? base : `${base}/`;
}

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL("https://artpar.github.io");
  const sitemapUrl = new URL(`${normalizedBase()}sitemap.xml`, siteUrl).toString();

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
