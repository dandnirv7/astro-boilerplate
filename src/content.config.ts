import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
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
    // No default author: projects must attribute real authorship.
    author: z.string(),
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

export const collections = {
  pages,
  articles,
  faqs,
};
