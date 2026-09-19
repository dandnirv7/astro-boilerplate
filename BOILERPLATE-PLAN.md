# Boilerplate Astro Generik — Freelancers Edition

> Dipakai ulang untuk project freelance / pribadi apa saja.
> Satu core, nol asumsi bisnis. Tidak ada preset florist / materials / compro.
> Prioritas: bus factor 1, `clone → ganti config → isi konten → deploy < 30 menit`.

## 0. Keputusan terkunci

- Bahasa: **ID saja** (`id-ID`, tanpa hreflang/i18n routing)
- Konten: **pola Content Collections** (nama collection bebas, tidak dikunci `products/`)
- Image: **built-in Sharp** (`astro:assets`), AVIF/WebP build-time
- OG: **auto-generate per-page** via `astro-og-canvas`, font **Inter OFL** (bukan Arial)
- AI crawler: **citation-friendly** (boleh baca & sitasi, blokir training; deklaratif)
- File `llms.txt`: **manual terkuras** (bukan auto-generate)
- `schemamap.xml`: **DIHAPUS** (non-standar, tidak ada konsumen)
- `@jdevalk/astro-seo-graph`: **DILEPAS SEPENUHNYA** (validasi diganti `diagnost`, 404 manual, tanpa IndexNow)

## 1. Prinsip

1. Boilerplate tidak tahu bisnis apa. Tidak ada `siteType`, `features.product/service`, atau copy bisnis di core.
2. SEO head + JSON-LD **custom, prop-driven**. Tidak bergantung abstraksi plugin schema.
3. Plugin hanya untuk **plumbing membosankan dan API stabil**: sitemap, robots, OG canvas, minify, compress, tracking, icons.
4. Satu tag JSON-LD `@graph` per page. Data di JSON-LD harus identik dengan HTML visible.
5. `site` di `astro.config.mjs` wajib di-set ke URL produksi, kalau tidak sitemap gagal diam-diam.
6. Tidak ada biner proprietary di repo. Font harus OFL dengan lisensi terdokumentasi.

## 2. Plugin final (minimal)

| Kebutuhan | Pilihan | Catatan |
|---|---|---|
| Sitemap | `@astrojs/sitemap` (official) | `site` wajib; `filter` buang `/404 /drafts /api`; `serialize` untuk `lastmod` jujur dari konten |
| robots.txt | `astro-robots-txt` | DRY ambil `site` dari config; tambah blok AI training di `transform` |
| `llms.txt` | **Manual** `src/pages/llms.txt.ts` | Kurasi: home → halaman penting → artikel pilar; ringkasan 1 kalimat per URL; draft dibuang |
| OG auto | `astro-og-canvas` | Route `src/pages/og/[...slug].png.ts`; slug via **satu fungsi** `ogSlugFromPath()`; PNG 1200x630; font Inter OFL dari `@expo-google-fonts/inter` |
| Types JSON-LD | `schema-dts` (dev) | Type safety tanpa plugin schema |
| Typography | `@tailwindcss/typography` | Karena class `prose` dipakai di artikel/halaman |
| Minify | `astro-min` (Rust) | HTML/CSS/JS/SVG |
| Pre-compress | `astro-compressor` (gzip/brotli/zstd) | **Paling terakhir** di `integrations` |
| Tracking | `@astrojs/partytown` | GA4/Meta/TikTok off-main-thread; event `lead_whatsapp_click` via `dataLayer` |
| Icons | `astro-icon` | Inline SVG |
| Format | `prettier` + `prettier-plugin-tailwindcss` (dev) | Sesuai `.prettierrc` yang ada |
| A11y/SEO CI | `diagnost` (dev) | `pnpm diagnost` harus bersih; pengganti validasi seo-graph |
| Search katalog | `astro-pagefind` (optional, per project) | Tidak di core |
| DILARANG di core | `@jdevalk/*`, `schemamap`, `astro-seo-plugin`, `seo-in-astro`, `astro-meta`, Cloudinary/imgix, font proprietary | Lock-in / non-standar / belum perlu |

## 3. Arsitektur core

```
src/config/site.ts            // identitas + kontak saja, nol logika bisnis
src/lib/seo.ts                // resolveCanonical(), resolveTitle(), strip UTM
src/lib/schema.ts             // absoluteUrl(), makeId(), toJsonLd()
src/lib/whatsapp.ts           // buildWaLink({ number, text }) — string bebas
src/lib/og.ts                 // ogSlugFromPath() + getOgImageUrl() — SATU sumber slug
src/layouts/BaseLayout.astro
src/components/seo/
├── SeoHead.astro             // SATU <meta name="robots">, canonical, OG, Twitter
└── Schema.astro              // graph: Thing[] → 1x @graph
src/components/              // Header, Footer, Breadcrumbs, Faq, WaButton (slot-based)
src/content/{pages,articles,faqs}/  // pola saja
src/pages/og/[...slug].png.ts
src/pages/llms.txt.ts         // manual terkuras
src/pages/404.astro           // manual, 3-5 link, tanpa JS fetch
```

SENGAJA tidak ada: `products/`, `services/`, `*Schema` spesifik bisnis, template WA bisnis, `siteType`, `schemamap`, `/schema/*.json`.

## 4. Kontrak per file

- `SeoHead`: title/desc unik, canonical absolut strip `utm_*`, OG absolut 1200x630, Twitter `summary_large_image`, **satu** robots meta (`index,follow,max-snippet:-1,max-image-preview:large`), `og:locale id_ID`.
- `Schema`: satu `@graph`; `@id` tetap `/#website`, `/#org`, `{canonical}/#breadcrumb`, `{canonical}/#faq`. `aggregateRating/review` hanya bila data asli ada.
- `llms.txt.ts`: `# {name}` + deskripsi + `## Halaman` + `## Artikel` (maksimal 7 pilar, ringkasan ditulis untuk AI). `lastmod` dari konten, bukan `new Date()`.
- `404.astro`: `noindex`, link Beranda/Artikel/FAQ/Tentang, tanpa fetch sitemap.
- `WaButton`: `is:inline` script sekali per page; event `lead_whatsapp_click`; Footer pakai `buildWaLink` yang sama.
- `global.css`: Tailwind v4 (`@import "tailwindcss"` + `@plugin "@tailwindcss/typography"`); JANGAN redefine `.sr-only` (sudah ada di Tailwind).

## 5. Checklist per project baru (copy boilerplate ini)

1. `src/config/site.ts` → url, name, description, kontak WA, socials.
2. `.env` / env deploy → `SITE_URL=https://domain-produksi.id`.
3. `src/content/**` → isi pages/articles/faqs (atau tambah collection sendiri + Zod).
4. Kalau tambah collection → daftarkan di `llms.txt.ts` + OG route bila perlu OG per-item.
5. `pnpm install && pnpm build && pnpm diagnost`.
6. View-source: canonical absolut, OG absolut, 1x JSON-LD valid → Rich Results Test + Schema Validator.

## 6. Verifikasi (definition of done)

- `pnpm build` sukses; `dist/` berisi `sitemap-index.xml`, `robots.txt` (ada blok AI), `llms.txt`, `og/*.png`.
- TIDAK ada di `dist/`: `schemamap.xml`, `schema/site.json`.
- `pnpm diagnost` bersih; tidak ada duplikat `robots` meta; OG PNG terbuka di browser.
