/**
 * SEARCH capability (No-JS edition) — public surface.
 *
 * Build-time only: category grouping, category URLs, and related items.
 * No index, no client state, no query parameters, no new dependencies.
 * Pages render the results as plain static links.
 */
export { groupByCategory, categorySlug, relatedItems } from './lib/search';
export type { CatalogCategory } from './lib/search';
