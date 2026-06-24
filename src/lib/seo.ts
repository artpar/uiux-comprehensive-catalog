export const SITE_NAME = "UX Patterns Guide";
export const SITE_DESCRIPTION =
  "A source-backed guide to practical UX and UI patterns with an interactive lab for choosing the right pattern.";

export function absoluteUrl(path: string, site: URL) {
  return new URL(path, site).toString();
}

export function pageTitle(title: string) {
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
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
