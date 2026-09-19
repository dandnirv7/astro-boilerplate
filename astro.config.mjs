// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import robotsTxt from 'astro-robots-txt';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import min from 'astro-min';
import compressor from 'astro-compressor';

const siteUrl = process.env.SITE_URL || 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  prefetch: true,

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        avif: { effort: 4 },
        webp: { effort: 5 },
        jpeg: { mozjpeg: true },
        png: { compressionLevel: 9 },
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') && !page.includes('/drafts') && !page.includes('/api'),
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api', '/drafts', '/404'],
        },
      ],
      transform(content) {
        return `${content}
# AI Crawlers: citation allowed, training forbidden
User-agent: anthropic-ai
Allow: /
User-agent: Claude-Web
Allow: /
`;
      },
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    icon(),
    min(),
    compressor(), // Compressor must be last in integrations list
  ],

  adapter: vercel(),
});