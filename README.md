# Boilerplate Astro

Detail arsitektur: `BOILERPLATE-SPEC.md` (kontrak), `AGENTS.md` (aturan agen).

## Pakai untuk project baru (3 sentuhan)

1. `src/config/site.ts` → url, name, description, kontak WA, socials.
2. Env deploy → `SITE_URL=https://domain-produksi.id` (wajib, kalau tidak sitemap gagal diam-diam).
3. `src/content/**` → isi `pages/`, `articles/`, `faqs/` (atau tambah collection sendiri + Zod di `src/content.config.ts`).

Kalau tambah collection baru: daftarkan di `src/pages/llms.txt.ts` + `src/pages/og/[...slug].png.ts` bila perlu OG per-item.

## Perintah

| Perintah        | Fungsi                                          |
| :-------------- | :---------------------------------------------- |
| `pnpm install`  | Install dependencies                            |
| `pnpm dev`      | Dev server `localhost:4321`                     |
| `pnpm build`      | Build produksi ke `./dist/`                 |
| `pnpm preview`    | Preview hasil build                         |
| `pnpm check`      | Typecheck (`astro check`, 0 errors)         |
| `pnpm diagnost`   | Gate SEO/a11y/perf (harus bersih sebelum merge) |

## Yang dihasilkan build

`dist/` berisi `sitemap-index.xml`, `robots.txt` (blok AI training), `llms.txt` (kurasi manual),
`og/*.png` (1200x630, font Inter OFL). Tidak ada `schemamap.xml` (sengaja dihapus, non-standar).

## Cek sebelum serah terima

- View-source `/`, satu halaman, satu artikel: canonical absolut, OG image absolut, tepat 1x JSON-LD `@graph`.
- Rich Results Test + Schema Validator lolos. `pnpm diagnost` bersih. Satu OG PNG dibuka di browser.
- Yang diverifikasi di sini adalah indexabilitas teknis lokal; indexing/ranking aktual tidak terverifikasi dan tidak dijamin.

## Matriks indexability (perilaku yang dimaksud)

| Tipe halaman | Index | Follow | Sitemap | Canonical | JSON-LD |
|---|---|---|---|---|---|
| Halaman publik (`/`, `/tentang-kami/`) | yes | yes | yes | yes | yes (`WebSite`, `Organization`, `WebPage`, `BreadcrumbList`, `FAQPage` bila ada FAQ) |
| Listing artikel | yes | yes | yes | yes | yes (tanpa `BlogPosting`) |
| Detail artikel | yes | yes | yes | yes | yes (+ `BlogPosting`) |
| 404 | no | yes | no | self (`/404/`) | tidak ada |
| Draft (`draft: true`) | tidak di-build | — | no | — | — |

## Menulis konten yang mudah dikutip (AEO/GEO tanpa hack)

- Satu H1 jelas per halaman; H2/H3 deskriptif.
- Jawab langsung di awal section (`<h2>Apa itu X?</h2>` + paragraf jawaban ringkas), bukan terkubur di hero copy.
- Fakta eksplisit: tabel, langkah berurutan, contoh; setiap klaim di JSON-LD harus terlihat di HTML.
- FAQ dari satu sumber (`src/content/faqs/*.json`) → komponen visible + `FAQPage` otomatis sinkron.
- Link internal deskriptif (`Kembali ke Artikel & Wawasan`, bukan "klik di sini"); tanpa link farm.
- Tidak ada jaminan ranking, indexing, sitasi AI, atau visibilitas LLM — fondasi ini hanya membuat konten layak crawl dan layak kutip.

## Capability: katalog (`src/capabilities/catalog/`)

Kapan: project butuh listing + detail item terstruktur (produk, properti, material, jasa, portfolio).
Bukan e-commerce: tidak ada cart, checkout, payment, search, atau state — harga hanya data display.

- `types.ts` (`CatalogItem` generik, field bisnis opsional) + `lib/catalog.ts` (pure: normalize, sort, filter, URL, `formatPrice`, `buildProductSchema` jujur).
- `CatalogCard` / `CatalogGrid` / `CatalogGallery`: 0 JS, `<article>` semantik.
- Collection `catalog/` (nama netral, bukan `products/`); `draft: true` dikecualikan di mana-mana.
- `Offer` hanya bila harga asli ada; tanpa harga → tanpa `Offer`. Tanpa brand/review/rating palsu.
- Routing milik page project (demo: `/katalog/`); hapus `src/content/catalog/` + `src/pages/katalog/` bila tak perlu.
- Komposisi dengan LEAD di level page (contoh konsep, bukan bawaan):
  `detail katalog (CATALOG) + WaButton (LEAD)` — CATALOG tidak mengimpor LEAD.

## Capability: pencarian No-JS (`src/capabilities/search/`)

Tanpa index, tanpa state, tanpa query param, tanpa dep baru: `groupByCategory`,
`categorySlug`, `relatedItems` — murni fungsi build-time. Hasilnya dirender sebagai
link statis: halaman `/katalog/kategori/[slug]/` + nav kategori + section "Item Terkait".
Aturan: `getStaticPaths` harus mandiri (literal inline, tanpa binding scope-modul).

## Dependensi: trade-off yang disengaja

| Keputusan | Alasan |
|---|---|
| `canvaskit-wasm` direct (bukan transitif) | Wajib di pnpm strict-layout; tanpanya build OG gagal (`__dirname is not defined`). Dicek Phase 3. |
| `@expo-google-fonts/inter` di `dependencies` | TTF dibaca saat build OG; devDeps yang di-prune akan merusak build. |
| Tanpa `@astrojs/partytown` | Nol third-party script; `track()` no-op aman tanpa `dataLayer`. Pasang lagi saat project butuh GA4/Pixel. |
| Tanpa `astro-icon` | Nol pemakaian ikon; pasang lagi saat dibutuhkan. |
| `ClientRouter` + `prefetch: true` | Satu-satunya JS runtime (±16KB): transisi halaman + prefetch link. |
| Tanpa `astro:assets` di konten | Belum ada gambar konten; pipeline Sharp siap saat dibutuhkan. |
| `sharp` di `dependencies` | Wajib sejak katalog memakai `<Image>`; Astro tidak membundel Sharp otomatis di pnpm. |
