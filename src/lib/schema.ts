import type { Thing, WebSite, Organization, BreadcrumbList, FAQPage, WebPage } from 'schema-dts';
import { siteConfig } from '../config/site';

/**
 * Return an absolute URL given a path or full URL.
 */
export function absoluteUrl(pathOrUrl: string, baseUrl: string = siteConfig.url): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  try {
    const origin = new URL(baseUrl).origin;
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${origin}${cleanPath}`;
  } catch {
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return `${base}${cleanPath}`;
  }
}

/**
 * Create a deterministic @id IRI for Schema nodes.
 * Returns the base unchanged when it cannot be parsed as a URL
 * (schema output must never throw during build).
 */
export function makeId(base: string, suffix: string): string {
  if (suffix.startsWith('#')) {
    // Keep directory trailing slash intact before the hash
    let hasExtension = false;
    try {
      hasExtension = /\.[a-zA-Z0-9]+$/.test(new URL(base, siteConfig.url).pathname);
    } catch {
      hasExtension = false;
    }
    const cleanBase = !hasExtension && !base.endsWith('/') ? `${base}/` : base;
    return `${cleanBase}${suffix}`;
  }
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;
  return `${cleanBase}${cleanSuffix}`;
}

/**
 * Serialize an array of Schema.org Thing objects into a valid JSON-LD @graph string.
 * Drops null/undefined nodes; `undefined` fields inside nodes are omitted
 * by JSON.stringify. Empty strings are preserved as-is.
 *
 * Output is escaped for safe inline `<script>` embedding: `<`, `>`, `&`,
 * U+2028 and U+2029 become `\uXXXX` sequences, which are legal JSON string
 * escapes. A hostile value such as `</script>` therefore cannot terminate
 * the script element.
 */
export function toJsonLd(graph: (Thing | null | undefined)[]): string {
  const activeNodes = graph.filter((node): node is Thing => Boolean(node));

  const jsonLdObj = {
    '@context': 'https://schema.org',
    '@graph': activeNodes,
  };

  return JSON.stringify(jsonLdObj, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Standard WebSite schema node with deterministic @id: /#website
 */
export function buildWebSiteSchema(siteUrl: string = siteConfig.url, name: string = siteConfig.name): WebSite {
  const url = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
  return {
    '@type': 'WebSite',
    '@id': makeId(url, '#website'),
    url,
    name,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
  };
}

/**
 * Standard Organization schema node with deterministic @id: /#org
 *
 * Opt-in by configuration: returns null (emits nothing) unless the project
 * provides at least one real distinguishing fact (email, phone, or social
 * profile). A name-only node built from placeholder config would be a
 * fictional organization claim, so the generic baseline stays silent.
 * Callers pass the result straight into the graph array; nulls are filtered.
 */
export function buildOrganizationSchema(
  siteUrl: string = siteConfig.url,
  name: string = siteConfig.name,
  socials: Record<string, string | undefined> = siteConfig.socials
): Organization | null {
  const url = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
  const sameAs = Object.values(socials).filter((s): s is string => Boolean(s));
  const hasContact = Boolean(siteConfig.contact.email || siteConfig.contact.phone);

  if (!hasContact && sameAs.length === 0) return null;

  return {
    '@type': 'Organization',
    '@id': makeId(url, '#org'),
    name,
    url,
    logo: absoluteUrl('/favicon.svg', url),
    description: siteConfig.description,
    ...(siteConfig.contact.email && { email: siteConfig.contact.email }),
    ...(siteConfig.contact.phone && { telephone: siteConfig.contact.phone }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Standard BreadcrumbList schema with deterministic @id: {canonical}/#breadcrumb
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[], canonicalUrl: string): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    '@id': makeId(canonicalUrl, '#breadcrumb'),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url, canonicalUrl),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Standard FAQPage schema with deterministic @id: {canonical}/#faq
 * Strictly ensures question and answer match visible HTML.
 */
export function buildFaqSchema(faqs: FaqItem[], canonicalUrl: string): FAQPage | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@type': 'FAQPage',
    '@id': makeId(canonicalUrl, '#faq'),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Standard WebPage schema node with deterministic @id: {canonical}/#webpage
 */
export function buildWebPageSchema(
  canonicalUrl: string,
  name: string,
  description: string,
  options?: {
    breadcrumbId?: string;
    hasPart?: Array<{ '@id': string }>;
    datePublished?: string;
    dateModified?: string;
  }
): WebPage {
  const websiteId = makeId(siteConfig.url, '#website');

  return {
    '@type': 'WebPage',
    '@id': makeId(canonicalUrl, '#webpage'),
    url: canonicalUrl,
    name,
    description,
    isPartOf: { '@id': websiteId },
    inLanguage: siteConfig.locale,
    ...(options?.breadcrumbId && { breadcrumb: { '@id': options.breadcrumbId } }),
    ...(options?.hasPart && { hasPart: options.hasPart }),
    ...(options?.datePublished && { datePublished: options.datePublished }),
    ...(options?.dateModified && { dateModified: options.dateModified }),
  };
}
