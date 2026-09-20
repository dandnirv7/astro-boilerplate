// Regression assertions over the static build output (dist/).
// Usage: SITE_URL=https://example.com pnpm build && node scripts/assert-dist.mjs
// Exit non-zero on the first failure group; prints every violation found.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = process.argv.find((a) => a.startsWith('--dist='))?.slice(7) || 'dist';
const SITE = (process.env.SITE_URL || '').replace(/\/+$/, '');
if (!SITE) {
  console.error('FAIL: SITE_URL env is required (same source of truth as astro.config.mjs).');
  process.exit(1);
}

// Expected HTML routes relative to dist/. Starter baseline: homepage + 404
// only. Capability demo routes live on the `showcase` branch, not here.
// Update this list when Starter routes intentionally change.
const EXPECTED_HTML = ['index.html', '404.html'];

// Sitemap must contain exactly the public indexable pages: no 404, drafts,
// API, OG assets, or text endpoints.
const EXPECTED_SITEMAP_URLS = EXPECTED_HTML.filter((f) => f !== '404.html').map((f) =>
  f === 'index.html' ? `${SITE}/` : `${SITE}/${f.replace(/\/index\.html$/, '/')}`
);

const failures = [];
const fail = (msg) => failures.push(msg);
const read = (rel) => readFileSync(join(DIST, rel), 'utf8');
const count = (html, re) => (html.match(re) || []).length;

// 1. Expected routes exist; no unexpected HTML output.
const actualHtml = [];
const walk = (dir, prefix = '') => {
  for (const entry of readdirSync(join(DIST, dir), { withFileTypes: true })) {
    const rel = prefix + entry.name;
    if (entry.isDirectory()) walk(join(dir, entry.name), rel + '/');
    else if (entry.name.endsWith('.html')) actualHtml.push(rel);
  }
};
walk('.');
for (const f of EXPECTED_HTML) {
  if (!existsSync(join(DIST, f))) fail(`missing expected route output: dist/${f}`);
}
for (const f of actualHtml.sort()) {
  if (!EXPECTED_HTML.includes(f)) fail(`unexpected HTML output (leak?): dist/${f}`);
}

// Parse <meta>/<link> tags into attribute maps independent of attribute
// order, quoting, or minifier reordering (minifiers swap/drop quotes).
function parseTags(html, tag) {
  const out = [];
  for (const m of html.matchAll(new RegExp(`<${tag}\\s[^>]*>`, 'gi'))) {
    const attrs = {};
    for (const a of m[0].matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
    }
    out.push(attrs);
  }
  return out;
}

// 2. Per-page head contract.
for (const f of EXPECTED_HTML) {
  if (!existsSync(join(DIST, f))) continue;
  const html = read(f);
  // lang must be present in output (covers dynamic lang={...} that static
  // linters cannot evaluate; diagnost checks source, this checks reality).
  if (!/<html[^>]*\blang=/.test(html)) fail(`${f}: <html> has no lang attribute in output`);
  const is404 = f === '404.html';
  if (count(html, /<title[^>]*>/gi) !== 1) fail(`${f}: expected exactly 1 <title>`);
  const canonicals = parseTags(html, 'link').filter((a) => a.rel === 'canonical');
  if (canonicals.length !== 1) {
    fail(`${f}: expected exactly 1 canonical link, found ${canonicals.length}`);
  } else {
    const href = canonicals[0].href || '';
    if (!href.startsWith(SITE + '/') && href !== SITE + '/')
      fail(`${f}: canonical not absolute/production-origin: ${href}`);
    if (href.includes('?')) fail(`${f}: canonical contains query string: ${href}`);
  }
  const robotsMetas = parseTags(html, 'meta').filter((a) => a.name === 'robots');
  if (robotsMetas.length !== 1) {
    fail(`${f}: expected exactly 1 robots meta, found ${robotsMetas.length}`);
  } else if (is404 && !robotsMetas[0].content.includes('noindex')) {
    fail(`${f}: 404 must be noindex`);
  }
  const ldCount = count(html, /application\/ld\+json/g);
  if (is404) {
    if (ldCount !== 0) fail(`${f}: 404 must not emit JSON-LD`);
  } else if (ldCount !== 1) {
    fail(`${f}: expected exactly 1 JSON-LD script, found ${ldCount}`);
  }
}

// 3. JSON-LD must parse as valid JSON on every page that emits it.
for (const f of EXPECTED_HTML) {
  if (!existsSync(join(DIST, f))) continue;
  const html = read(f);
  for (const m of html.matchAll(/ld\+json>(.*?)<\/script>/gs)) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@context'] !== 'https://schema.org' || !Array.isArray(data['@graph']))
        fail(`${f}: JSON-LD must have @context https://schema.org and array @graph`);
    } catch {
      fail(`${f}: JSON-LD is not valid JSON`);
    }
  }
}

// 4. Every emitted og:image URL must resolve to a file in dist/.
const ogRefs = new Set();
for (const f of EXPECTED_HTML) {
  if (!existsSync(join(DIST, f))) continue;
  const html = read(f);
  for (const attrs of parseTags(html, 'meta')) {
    if (attrs.property === 'og:image' && attrs.content) ogRefs.add(attrs.content);
  }
}
if (ogRefs.size === 0) fail('no og:image references found in HTML output');
for (const url of ogRefs) {
  if (!url.startsWith(SITE + '/')) {
    fail(`og:image not absolute/production-origin: ${url}`);
    continue;
  }
  const local = join(DIST, url.slice(SITE.length + 1).split('?')[0]);
  if (!existsSync(local)) fail(`og:image 404 (not generated): ${url}`);
}

// 5. Sitemap membership.
if (!existsSync(join(DIST, 'sitemap-0.xml'))) {
  fail('missing dist/sitemap-0.xml');
} else {
  const locs = [...read('sitemap-0.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  for (const expected of EXPECTED_SITEMAP_URLS) {
    if (!locs.includes(expected)) fail(`sitemap missing: ${expected}`);
  }
  for (const actual of locs) {
    if (!EXPECTED_SITEMAP_URLS.includes(actual)) fail(`unexpected sitemap URL: ${actual}`);
  }
  for (const actual of locs) {
    if (/\/404|\/drafts|\/api|\/og\/|llms/i.test(actual))
      fail(`non-public URL in sitemap: ${actual}`);
  }
}

// 6. robots.txt + llms.txt presence.
if (!existsSync(join(DIST, 'robots.txt'))) fail('missing dist/robots.txt');
else if (!read('robots.txt').includes('Sitemap:')) fail('robots.txt has no Sitemap: line');
if (!existsSync(join(DIST, 'llms.txt'))) fail('missing dist/llms.txt');
else if (read('llms.txt').trim().length === 0) fail('llms.txt is empty');

// 7. Performance budgets (reproducible locally; see IMPLEMENTATION-PLAN.md §8).
// Marketing JS <= 30 KB gzip (third-party scripts excluded: there are none).
// Budgets fail the gate so regressions are visible, not aspirational.
import { gzipSync } from 'node:zlib';
import { statSync } from 'node:fs';

const KB = 1024;
const BUDGETS = { jsGzip: 30 * KB, cssGzip: 20 * KB, htmlRaw: 100 * KB };

const sumGzip = (files) =>
  files.reduce((total, f) => total + gzipSync(readFileSync(f)).length, 0);

const jsFiles = [];
const cssFiles = [];
const collectAssets = (dir) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectAssets(full);
    } else if (entry.name.endsWith('.js')) jsFiles.push(full);
    else if (entry.name.endsWith('.css')) cssFiles.push(full);
  }
};
collectAssets(join(DIST, '_astro'));

if (jsFiles.length > 0) {
  const jsGzip = sumGzip(jsFiles);
  if (jsGzip > BUDGETS.jsGzip)
    fail(`JS budget exceeded: ${Math.round(jsGzip / KB)} KB gzip > 30 KB`);
}
if (cssFiles.length > 0) {
  const cssGzip = sumGzip(cssFiles);
  if (cssGzip > BUDGETS.cssGzip)
    fail(`CSS budget exceeded: ${Math.round(cssGzip / KB)} KB gzip > 20 KB`);
}
for (const f of EXPECTED_HTML) {
  if (!existsSync(join(DIST, f))) continue;
  const bytes = statSync(join(DIST, f)).size;
  if (bytes > BUDGETS.htmlRaw)
    fail(`${f}: HTML budget exceeded: ${Math.round(bytes / KB)} KB raw > 100 KB`);
}

if (failures.length > 0) {
  console.error(`ASSERT-DIST FAIL (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(
  `assert-dist: PASS (${EXPECTED_HTML.length} routes, ${ogRefs.size} og images, ${EXPECTED_SITEMAP_URLS.length} sitemap URLs)`
);
