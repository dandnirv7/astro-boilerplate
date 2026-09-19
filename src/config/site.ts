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
    "Boilerplate Astro performa tinggi dengan fokus AEO/SEO, structured data JSON-LD @graph valid, dynamic OG canvas, dan lead WhatsApp tanpa asumsi bisnis.",
  locale: "id-ID",
  ogDefault: "/og/default.png",
  contact: {
    whatsapp: "6281234567890",
    phone: "+62 812-3456-7890",
    email: "kontak@example.com",
  },
  socials: {
    instagram: "https://instagram.com/example",
    facebook: "https://facebook.com/example",
    twitter: "https://x.com/example",
    linkedin: "https://linkedin.com/company/example",
  },
};
