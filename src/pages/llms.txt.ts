import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';

/**
 * Manual curated llms.txt (freelancers edition).
 * Daftar URL dipilih manual agar yang dikutip AI adalah halaman terbaik,
 * bukan semua URL mentah. Tambahkan collection baru di sini bila perlu.
 */
export const GET: APIRoute = async () => {
  const base = siteConfig.url.endsWith('/') ? siteConfig.url.slice(0, -1) : siteConfig.url;

  const articles = (await getCollection('articles'))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, 7);

  const lines: string[] = [
    `# ${siteConfig.name}`,
    ``,
    `> ${siteConfig.description}`,
    ``,
    `## Halaman`,
    ``,
    `- [Beranda](${base}/): ${siteConfig.description}`,
    `- [Tentang Kami](${base}/tentang-kami/): Profil, visi, dan komitmen profesional.`,
    `- [Artikel & Wawasan](${base}/articles/): Kumpulan analisis dan panduan.`,
  ];

  if (articles.length > 0) {
    lines.push(``, `## Artikel pilihan`, ``);
    for (const article of articles) {
      const cleanId = article.id.replace(/\.[^/.]+$/, '');
      lines.push(`- [${article.data.title}](${base}/articles/${cleanId}/): ${article.data.description}`);
    }
  }

  lines.push(
    ``,
    `## Kontak`,
    ``,
    siteConfig.contact.whatsapp ? `- WhatsApp: https://wa.me/${siteConfig.contact.whatsapp}` : ``,
    siteConfig.contact.email ? `- Email: ${siteConfig.contact.email}` : ``,
  );

  const body = lines.filter((l) => l !== `` || true).join(`\n`).replace(/\n{3,}/g, `\n\n`) + `\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
