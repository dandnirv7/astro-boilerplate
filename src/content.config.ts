import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date().optional(),
    // Draft pages are never built, listed, or referenced (see sitemap/robots /drafts rules).
    draft: z.boolean().default(false),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    modifiedDate: z.coerce.date().optional(),
    author: z.string().default('Tim Editorial'),
    tags: z.array(z.string()).default([]),
    // Draft articles are never built, listed, or referenced.
    draft: z.boolean().default(false),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: z.object({
    title: z.string().optional(),
    items: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
});

/**
 * Generic catalog collection (domain-neutral: NOT "products").
 * Only identity is required; every business attribute is optional.
 * `image` uses Astro's image helper so entries resolve to optimized metadata.
 */
const catalog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/catalog' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
      price: z
        .object({
          amount: z.number(),
          currency: z.string().default('IDR'),
        })
        .optional(),
      available: z.boolean().optional(),
      image: image().optional(),
      gallery: z.array(image()).default([]),
      // Draft items are never built, listed, or referenced.
      draft: z.boolean().default(false),
    }),
});

export const collections = {
  pages,
  articles,
  faqs,
  catalog,
};
