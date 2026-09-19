import type { CatalogItem } from '../../catalog/types';

export interface CatalogCategory {
  /** Display name, taken verbatim from the first item carrying it. */
  name: string;
  /** URL-safe slug derived from the name. */
  slug: string;
  /** Absolute path of the category page (trailing slash). */
  url: string;
  items: CatalogItem[];
}

/**
 * URL-safe slug for category names (ID-friendly: lowercase, spaces to dashes,
 * strip anything that is not a letter, number, or dash).
 */
export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Group items by category (build-time only). Items without a category
 * are skipped — "uncategorized" buckets are a project decision, not a default.
 * Groups and items inside each group are sorted by name (deterministic).
 */
export function groupByCategory(
  items: CatalogItem[],
  basePath = '/katalog/kategori/'
): CatalogCategory[] {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const groups = new Map<string, CatalogCategory>();

  for (const item of items) {
    if (!item.category) continue;
    const slug = categorySlug(item.category);
    if (!slug) continue;
    const existing = groups.get(slug);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(slug, {
        name: item.category,
        slug,
        url: `${base}${slug}/`,
        items: [item],
      });
    }
  }

  const result = [...groups.values()];
  for (const group of result) {
    group.items.sort((a, b) => a.name.localeCompare(b.name, 'id'));
  }
  result.sort((a, b) => a.name.localeCompare(b.name, 'id'));
  return result;
}

/**
 * Related items for a detail page: same category first, then everything
 * else by name. Never includes the item itself. Pure and deterministic —
 * feeds static "related" sections without client state.
 */
export function relatedItems(
  item: CatalogItem,
  items: CatalogItem[],
  limit = 4
): CatalogItem[] {
  const others = items.filter((candidate) => candidate.id !== item.id);
  const sameCategory = others.filter(
    (candidate) =>
      item.category !== undefined && candidate.category === item.category
  );
  const rest = others
    .filter((candidate) => !sameCategory.includes(candidate))
    .sort((a, b) => a.name.localeCompare(b.name, 'id'));
  return [...sameCategory, ...rest].slice(0, Math.max(0, limit));
}
