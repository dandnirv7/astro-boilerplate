import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';
import { stripExtension } from '../lib/content';

/**
 * Curated llms.txt derived from published collections.
 * Only non-draft entries appear; sections stay empty (omitted) when a
 * collection has no entries. No hardcoded project routes.
 */
export const GET: APIRoute = async () => {
  const base = siteConfig.url.endsWith('/') ? siteConfig.url.slice(0, -1) : siteConfig.url;

  const pages = (await getCollection('pages')).filter((p) => !p.data.draft);
  const articles = (await getCollection('articles'))
    .filter((a) => !a.data.draft)
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, 7);

  const lines: string[] = [
    `# ${siteConfig.name}`,
    ``,
    `> ${siteConfig.description}`,
    ``,
    `- [Beranda](${base}/): ${siteConfig.description}`,
  ];

  if (pages.length > 0) {
    lines.push(``, `## Halaman`, ``);
    for (const page of pages) {
      const cleanId = stripExtension(page.id);
      lines.push(`- [${page.data.title}](${base}/${cleanId}/): ${page.data.description}`);
    }
  }

  if (articles.length > 0) {
    lines.push(``, `## Artikel pilihan`, ``);
    for (const article of articles) {
      const cleanId = stripExtension(article.id);
      lines.push(`- [${article.data.title}](${base}/articles/${cleanId}/): ${article.data.description}`);
    }
  }

  const contactLines = [
    siteConfig.contact.whatsapp
      ? `- WhatsApp: https://wa.me/${siteConfig.contact.whatsapp}`
      : ``,
    siteConfig.contact.email ? `- Email: ${siteConfig.contact.email}` : ``,
  ].filter(Boolean);
  if (contactLines.length > 0) {
    lines.push(``, `## Kontak`, ``, ...contactLines);
  }

  const body = lines.join(`\n`).replace(/\n{3,}/g, `\n\n`) + `\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
