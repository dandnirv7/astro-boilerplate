/**
 * CATALOG capability — public surface.
 *
 * Optional, composable, static-first item display. Depends only on
 * generic core utilities; core never imports from here.
 * No cart, checkout, payment, search UI, or client state.
 */
export { default as CatalogCard } from './components/CatalogCard.astro';
export { default as CatalogGrid } from './components/CatalogGrid.astro';
export { default as CatalogGallery } from './components/CatalogGallery.astro';
export {
  normalizeItem,
  sortItems,
  filterItems,
  itemUrl,
  entryToCatalogItem,
  formatPrice,
  buildProductSchema,
} from './lib/catalog';
export type { CatalogSortKey, CatalogFilter } from './lib/catalog';
export type { CatalogItem, CatalogImage, CatalogPrice } from './types';
