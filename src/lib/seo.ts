import type { WorkedDecision } from "@/data/priority-editorial";
import { withBase } from "./paths";

export const SITE_NAME = "UX Patterns Guide";
export const SITE_DESCRIPTION =
  "Learn, practice, and apply UX judgment across interfaces and services, with guided work tools and a source-backed pattern library.";

export function absoluteUrl(path: string, site: URL) {
  return new URL(path, site).toString();
}

export function pageTitle(title: string) {
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}

export function editorialArticle(decision: WorkedDecision, site: URL) {
  const publisher = { "@type": "Organization", name: SITE_NAME, url: absoluteUrl(withBase("/editorial-method/"), site) };
  return {
    "@context": "https://schema.org", "@type": "Article",
    headline: decision.title, name: decision.title, description: decision.description,
    url: absoluteUrl(withBase(decision.path), site), dateModified: decision.updated,
    author: publisher, publisher, inLanguage: "en",
    citation: decision.evidence.map((source) => source.url),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl(withBase("/"), site) }
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>, site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, site)
    }))
  };
}

export function websiteJsonLd(site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/", site),
    description: SITE_DESCRIPTION,
    inLanguage: "en"
  };
}

export function collectionPageJsonLd(name: string, description: string, path: string, site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path, site),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/", site)
    },
    inLanguage: "en"
  };
}
