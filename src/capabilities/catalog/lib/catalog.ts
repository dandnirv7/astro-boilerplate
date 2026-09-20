import type { Product } from 'schema-dts';
import type { ImageMetadata } from 'astro';
import { absoluteUrl, makeId } from '../../../lib/schema';
import { stripExtension } from '../../../lib/content';
import type { CatalogItem, CatalogPrice } from '../types';

export type CatalogSortKey = 'name' | 'price-asc' | 'price-desc';

export interface CatalogFilter {
  category?: string;
  /** When true, keep only items with `available === true`. Unknown stays excluded too. */
  availableOnly?: boolean;
}

/**
 * Fill structural defaults without inventing business facts.
 * - `images` falls back to `[image]` when only a primary image exists.
 * - `url` falls back to `basePath + slug` when not provided.
 * - Absent price/availability/category stay absent (never fabricated).
 */
export function normalizeItem(
  input: Partial<CatalogItem> & Pick<CatalogItem, 'id' | 'slug' | 'name'>,
  basePath = '/katalog/'
): CatalogItem {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return {
    ...input,
    images: input.images ?? (input.image ? [input.image] : []),
    url: input.url ?? `${base}${input.slug}/`,
  };
}

/** Sort a copy of the array. Items without price sort after priced items. */
export function sortItems(items: CatalogItem[], key: CatalogSortKey = 'name'): CatalogItem[] {
  const copy = [...items];
  switch (key) {
    case 'price-asc':
      return copy.sort((a, b) => (a.price?.amount ?? Infinity) - (b.price?.amount ?? Infinity));
    case 'price-desc':
      return copy.sort((a, b) => (b.price?.amount ?? -Infinity) - (a.price?.amount ?? -Infinity));
    case 'name':
    default:
      return copy.sort((a, b) => a.name.localeCompare(b.name, 'id'));
  }
}

/** Pure build-time filter for future reuse. No UI, no URL state. */
export function filterItems(items: CatalogItem[], filter: CatalogFilter = {}): CatalogItem[] {
  return items.filter((item) => {
    if (filter.category && item.category !== filter.category) return false;
    if (filter.availableOnly && item.available !== true) return false;
    return true;
  });
}

/** Resolve an item detail URL under a base path. No query state. */
export function itemUrl(basePath: string, slug: string): string {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const clean = slug.replace(/^\/+/, '').replace(/\/+$/, '');
  return `${base}${clean}/`;
}

/**
 * Structural input for entryToCatalogItem. Decoupled from Astro's collection
 * registry on purpose: any project-defined collection with this shape works,
 * so the capability never requires a `catalog` collection in core config.
 */
export interface CatalogEntryLike {
  id: string;
  data: {
    name: string;
    description?: string;
    category?: string;
    price?: { amount: number; currency: string };
    available?: boolean;
    image?: ImageMetadata;
    gallery?: ImageMetadata[];
  };
}

/**
 * Convert a catalog-shaped collection entry into a CatalogItem.
 * The single place where collection shape meets the generic item model,
 * so pages never repeat frontmatter mapping.
 */
export function entryToCatalogItem(
  entry: CatalogEntryLike,
  basePath = '/katalog/'
): CatalogItem {
  const slug = stripExtension(entry.id);
  const data = entry.data;
  const primary = data.image ? { src: data.image, alt: data.name } : undefined;
  const gallery = (data.gallery ?? []).map((src) => ({ src, alt: data.name }));
  return normalizeItem(
    {
      id: entry.id,
      slug,
      name: data.name,
      description: data.description,
      image: primary,
      images: gallery.length > 0 ? gallery : primary ? [primary] : [],
      category: data.category,
      price: data.price,
      available: data.available,
    },
    basePath
  );
}

/** Display-only price formatting. No calculation of any kind. */
export function formatPrice(price: CatalogPrice, locale = 'id-ID'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price.amount);
}

/**
 * Honest Product node for the core single-@graph Schema component.
 * - `Offer` is emitted ONLY when a real price exists.
 * - `availability` is emitted ONLY when explicitly known.
 * - Never emits brand, review, aggregateRating, or any invented fact.
 * - Image URLs only from string sources (optimized metadata has no stable
 *   public URL at data level, so it is rendering-only).
 */
export function buildProductSchema(item: CatalogItem, canonicalUrl: string): Product {
  const stringImages = (item.images ?? [])
    .map((img) => (typeof img.src === 'string' ? absoluteUrl(img.src, canonicalUrl) : null))
    .filter((src): src is string => src !== null);

  return {
    '@type': 'Product',
    '@id': makeId(canonicalUrl, '#product'),
    name: item.name,
    url: canonicalUrl,
    ...(item.description && { description: item.description }),
    ...(item.category && { category: item.category }),
    ...(stringImages.length > 0 && { image: stringImages }),
    ...(item.price && {
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        price: item.price.amount,
        priceCurrency: item.price.currency,
        ...(item.available === true && { availability: 'https://schema.org/InStock' }),
        ...(item.available === false && { availability: 'https://schema.org/OutOfStock' }),
      },
    }),
  };
}
