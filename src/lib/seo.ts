import { siteConfig } from '../config/site';

/**
 * Remove tracking parameters like utm_*, fbclid, gclid from a URL.
 */
export function stripTrackingParams(url: string | URL): string {
  try {
    const parsed = typeof url === 'string' ? new URL(url, siteConfig.url) : new URL(url.href);
    const paramsToDelete: string[] = [];

    parsed.searchParams.forEach((_, key) => {
      const lower = key.toLowerCase();
      if (
        lower.startsWith('utm_') ||
        lower === 'fbclid' ||
        lower === 'gclid' ||
        lower === 'msclkid' ||
        lower === 'mc_eid'
      ) {
        paramsToDelete.push(key);
      }
    });

    for (const key of paramsToDelete) {
      parsed.searchParams.delete(key);
    }

    // If search is now empty, return without query string
    return parsed.toString();
  } catch {
    return typeof url === 'string' ? url : url.href;
  }
}

/**
 * Resolve an absolute canonical URL, stripping UTM and other tracking parameters.
 */
export function resolveCanonical(pathnameOrUrl?: string | URL, baseUrl: string = siteConfig.url): string {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  if (!pathnameOrUrl) {
    return `${base}/`;
  }

  try {
    let resolved: URL;
    if (typeof pathnameOrUrl === 'string') {
      if (pathnameOrUrl.startsWith('http://') || pathnameOrUrl.startsWith('https://')) {
        resolved = new URL(pathnameOrUrl);
      } else {
        const cleanPath = pathnameOrUrl.startsWith('/') ? pathnameOrUrl : `/${pathnameOrUrl}`;
        resolved = new URL(`${base}${cleanPath}`);
      }
    } else {
      resolved = new URL(pathnameOrUrl.href);
    }

    const cleanUrl = stripTrackingParams(resolved);
    const parsed = new URL(cleanUrl);

    // Normalize trailing slash for directories / root, avoid trailing slash on file extensions
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(parsed.pathname);
    if (!hasExtension && !parsed.pathname.endsWith('/')) {
      parsed.pathname = `${parsed.pathname}/`;
    }

    return parsed.toString();
  } catch {
    return `${base}/`;
  }
}

/**
 * Resolve full page title according to brand formatting.
 */
export function resolveTitle(
  title?: string,
  siteName: string = siteConfig.name,
  tagline: string = siteConfig.tagline
): string {
  if (!title || title.trim() === siteName) {
    return `${siteName} | ${tagline}`;
  }
  return `${title.trim()} | ${siteName}`;
}
