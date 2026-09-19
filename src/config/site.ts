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
  url: import.meta.env.SITE_URL || "https://example.com",
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
