import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * Strip a single file extension from a collection entry id.
 * Extensionless ids pass through unchanged, so this is safe
 * regardless of how the loader formats ids.
 *
 * 'panduan-strategis.md' -> 'panduan-strategis'
 * 'pertanyaan-umum'      -> 'pertanyaan-umum'
 */
export function stripExtension(id: string): string {
  return id.replace(/\.[^/.]+$/, '');
}

/**
 * Find one entry in a collection by extensionless id.
 * Same convention everywhere: `findEntry('faqs', 'pertanyaan-umum')`.
 */
export async function findEntry<C extends CollectionKey>(
  collection: C,
  id: string
): Promise<CollectionEntry<C> | undefined> {
  const entries = await getCollection(collection);
  const cleanId = stripExtension(id);
  return entries.find((entry) => stripExtension(entry.id) === cleanId);
}
