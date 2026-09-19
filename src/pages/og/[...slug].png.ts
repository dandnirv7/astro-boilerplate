import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { siteConfig } from '../../config/site';
import { ogSlugFromPath } from '../../lib/og';
import { stripExtension } from '../../lib/content';

interface OgPageData {
  title: string;
  description?: string;
}

// Fetch all collections
const articles = await getCollection('articles');
const pages = await getCollection('pages');

// Key OG = slug hasil ogSlugFromPath (kontrak yang sama dipakai SeoHead).
// '/tentang-kami/' -> 'tentang-kami' | '/articles/foo/' -> 'articles-foo'
const ogPages: Record<string, OgPageData> = {
  default: {
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

for (const article of articles) {
  const cleanId = stripExtension(article.id);
  ogPages[ogSlugFromPath(`/articles/${cleanId}/`)] = {
    title: article.data.title,
    description: article.data.description,
  };
}

for (const page of pages) {
  const cleanId = stripExtension(page.id);
  const key = ogSlugFromPath(`/${cleanId}/`);
  if (!ogPages[key]) {
    ogPages[key] = {
      title: page.data.title,
      description: page.data.description,
    };
  }
}

// Halaman statis yang tidak dari collection.
ogPages[ogSlugFromPath('/articles/')] = {
  title: 'Artikel & Wawasan',
  description: 'Analisis, panduan terarah, dan wawasan terpercaya.',
};

export const { getStaticPaths, GET } = await OGImageRoute({
  pages: ogPages,
  getSlug: (path) => path.replace(/\.png$/, ''),
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [15, 23, 42],
      [6, 78, 59],
    ],
    border: {
      color: [16, 185, 129],
      width: 14,
      side: 'block-end',
    },
    padding: 70,
    font: {
      title: {
        size: 54,
        weight: 'Bold',
        color: [255, 255, 255],
        families: ['Inter'],
      },
      description: {
        size: 26,
        lineHeight: 1.4,
        color: [226, 232, 240],
        families: ['Inter'],
      },
    },
    // Inter OFL (SIL Open Font License) via @expo-google-fonts/inter.
    // Jangan komit font proprietary (mis. Arial/Microsoft) ke repo.
    fonts: [
      'node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf',
      'node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf',
    ],
  }),
});
