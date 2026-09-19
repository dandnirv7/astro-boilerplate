import { siteConfig } from '../config/site';
import { absoluteUrl } from './schema';

/**
 * Single source of truth: ubah URL pathname menjadi slug gambar OG.
 * Dipakai DUA arah: SeoHead (pathname -> URL /og/*.png) dan
 * route OG (collection id -> key ogPages). Jangan duplikat regex di file lain.
 *
 * '/' -> 'default' | '/tentang-kami/' -> 'tentang-kami'
 * '/articles/foo/' -> 'articles-foo'
 */
export function ogSlugFromPath(pathname: string): string {
  if (!pathname || pathname === '/' || pathname === 'index') return 'default';
  const clean = pathname
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/\.png$/, '');
  if (!clean || clean === 'default' || clean === 'index') return 'default';
  return clean.replace(/\//g, '-');
}

/**
 * Returns the absolute URL of the dynamic OpenGraph image for a given route/slug.
 * Standard size: 1200x630 PNG.
 */
export function getOgImageUrl(slug?: string, baseUrl: string = siteConfig.url): string {
  if (!slug) return absoluteUrl(siteConfig.ogDefault, baseUrl);
  const key = ogSlugFromPath(slug);
  if (key === 'default') return absoluteUrl(siteConfig.ogDefault, baseUrl);
  return absoluteUrl(`/og/${key}.png`, baseUrl);
}
