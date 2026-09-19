import type { ImageMetadata } from 'astro';

/**
 * Generic catalog image.
 * `src` accepts optimized Astro image metadata (`image()` collection
 * helper or imported asset) or a plain URL/path string.
 * Schema output only uses string URLs; optimized metadata is for rendering.
 */
export interface CatalogImage {
  src: ImageMetadata | string;
  alt: string;
}

/**
 * Display-only price. Catalog never computes totals, taxes, or discounts.
 */
export interface CatalogPrice {
  /** Numeric amount in the smallest standard unit (e.g. rupiah, not sen). */
  amount: number;
  /** ISO 4217 currency code (e.g. 'IDR'). */
  currency: string;
}

/**
 * Domain-neutral catalog item. Only identity fields are required;
 * everything else is optional because no catalog has every attribute.
 */
export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  description?: string;
  /** Primary image. */
  image?: CatalogImage;
  /** Additional images (gallery). May include the primary image. */
  images?: CatalogImage[];
  category?: string;
  /** Display-only price. Absent price means "no price info", never zero. */
  price?: CatalogPrice;
  /** Absolute canonical URL of the item detail page. */
  url: string;
  /** True = in stock/available, false = not, undefined = unknown (render nothing). */
  available?: boolean;
}
