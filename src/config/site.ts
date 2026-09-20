export interface SiteContact {
  whatsapp?: string;
  phone?: string;
  email?: string;
}

export interface SiteSocials {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

/**
 * Single authoritative production URL.
 * Same source as astro.config.mjs (`SITE_URL`), normalized identically
 * (trimmed, no trailing slash). Fails fast instead of silently falling
 * back to a placeholder domain.
 */
function resolveSiteUrl(): string {
  const raw = (import.meta.env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (!raw) {
    throw new Error(
      '[config] SITE_URL is required. Copy .env.example to .env and set SITE_URL (e.g. SITE_URL=https://domain-produksi.id).'
    );
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error();
  } catch {
    throw new Error(`[config] SITE_URL must be an absolute http(s) URL, got: ${JSON.stringify(raw)}.`);
  }
  return raw;
}

export interface SiteConfig {
  url: string;
  name: string;
  tagline: string;
  description: string;
  locale: string;
  ogDefault: string;
  contact: SiteContact;
  socials: SiteSocials;
}

export const siteConfig: SiteConfig = {
  url: resolveSiteUrl(),
  name: "Boilerplate Astro",
  tagline: "Boilerplate Generik Marketing & Katalog",
  description:
    "Boilerplate Astro generik dengan SEO teknis, structured data JSON-LD @graph valid, dan OG otomatis.",
  locale: "id-ID",
  ogDefault: "/og/default.png",
  // Fill per project. Empty by default: no fictional organization facts
  // in the generic baseline (see IMPLEMENTATION-PLAN.md Phase 1).
  contact: {},
  socials: {},
};
