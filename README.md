# Boilerplate Astro

Starter generik statis untuk website freelance/personal: clone → configure → content → deploy.
Detail arsitektur: `BOILERPLATE-SPEC.md` (kontrak), `AGENTS.md` (aturan agen).

> Cabang ini adalah **Starter bersih**: hanya homepage, 404, dan pipeline generik.
> Demo Content + Catalog + Lead hidup di branch `showcase`. Tidak ada jaminan
> indexing, ranking, sitasi AI/LLM, traffic, atau konversi — hanya fondasi teknis.

## Pakai untuk project baru

1. `src/config/site.ts` → name, description, locale, kontak, socials (kosongkan yang tak ada datanya).
2. Env → `SITE_URL=https://domain-produksi.id` (wajib; build gagal eksplisit bila absen; salin dari `.env.example`).
3. `src/content/**` → isi `pages/`, `articles/`, `faqs/` (atau tambah collection sendiri + Zod di `src/content.config.ts`).
4. Aktifkan capability bila perlu: impor dari `src/capabilities/{lead,catalog,search}/index.ts` di page project (core tak pernah mengimpornya).

Kalau tambah collection baru: daftarkan di `src/pages/llms.txt.ts` + `src/pages/og/[...slug].png.ts` bila perlu OG per-item.

## Deploy (Vercel, statis)

Profil default adalah **static**: `pnpm build` me-render semua halaman, adapter Vercel menyalin output
statis (lihat `.vercel/output/`); tidak ada server function, ISR, atau SSR. Deploy via integrasi git
Vercel atau `vercel deploy`. Profil server/ISR hanya opt-in per project (lihat komentar di `astro.config.mjs`).
`SITE_URL` harus selalu domain produksi — termasuk untuk preview build — agar canonical/sitemap/OG/JSON-LD
tetap satu identitas (tidak ada canonical berbasis domain preview).

## `llms.txt`

Endpoint kurasi manual (`src/pages/llms.txt.ts`): identitas situs + halaman + max 7 artikel + kontak.
Hanya konten publik non-draft. Bukan syarat ranking Google maupun AI Overview.

## Perintah

| Perintah        | Fungsi                                          |
| :-------------- | :---------------------------------------------- |
| `pnpm install`  | Install dependencies                            |
| `pnpm dev`      | Dev server `localhost:4321`                     |
| `pnpm build`      | Build produksi ke `./dist/`                 |
| `pnpm preview`    | Preview hasil build                         |
| `pnpm check`      | Typecheck (`astro check`, 0 errors)         |
| `pnpm assert:dist` | Gate output utama (lolos = boleh merge)    |
| `pnpm diagnost`   | Laporan heuristik, non-blocking (1 false positive diketahui: `a11y/missing-lang` pada `lang={...}` dinamis; output terverifikasi `lang=id` oleh `assert:dist`) |

## Yang dihasilkan build

`dist/` berisi `sitemap-index.xml`, `robots.txt` (deklaratif; tidak memblokir crawler apapun),
`llms.txt` (kurasi manual), `og/*.png` (1200x630, font Inter OFL). Tidak ada `schemamap.xml`
(sengaja dihapus, non-standar).

## Cek sebelum serah terima

- View-source `/` dan `/404`: canonical absolut, OG image absolut, tepat 1x JSON-LD `@graph` (404: tanpa JSON-LD, `noindex`).
- Rich Results Test + Schema Validator lolos. Satu OG PNG dibuka di browser.
- Gate: `pnpm check` + `pnpm build` + `pnpm assert:dist` hijau. `pnpm diagnost` informatif (1 false positive).
- Yang diverifikasi di sini adalah indexabilitas teknis lokal; indexing/ranking aktual tidak terverifikasi dan tidak dijamin.

## Matriks indexability (perilaku yang dimaksud)

| Tipe halaman | Index | Follow | Sitemap | Canonical | JSON-LD |
|---|---|---|---|---|---|
| Halaman publik (`/`) | yes | yes | yes | yes | yes (`WebSite`, `WebPage`; `Organization` hanya bila kontak/sosial dikonfigurasi) |
| 404 | no | yes | no | self (`/404/`) | tidak ada |
| Draft (`draft: true`) | tidak di-build | — | no | — | — |
| OG endpoint (`/og/*.png`), `llms.txt` | no (bukan halaman) | — | no | — | — |

Rute Content/Catalog/Lead (`/articles/`, `/tentang-kami/`, `/katalog/`, …) hidup di branch `showcase`, bukan di Starter ini.

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
- Routing milik page project; contoh lengkap ada di branch `showcase` (demo `/katalog/` dihapus dari Starter).
- Komposisi dengan LEAD di level page (contoh konsep, bukan bawaan):
  `detail katalog (CATALOG) + WaButton (LEAD)` — CATALOG tidak mengimpor LEAD.

## Capability: pencarian No-JS (`src/capabilities/search/`)

Tanpa index, tanpa state, tanpa query param, tanpa dep baru: `groupByCategory`,
`categorySlug`, `relatedItems` — murni fungsi build-time. Hasilnya dirender sebagai
link statis: halaman `/katalog/kategori/[slug]/` + nav kategori + section "Item Terkait".
Aturan: `getStaticPaths` harus mandiri (literal inline, tanpa binding scope-modul).

## Capability: LEAD (`src/capabilities/lead/`)

Aktifkan per halaman (core tidak pernah me-render-nya sendiri):

```astro
---
import Header from '../components/Header.astro';
import { WaButton } from '../capabilities/lead/index.js';
---
<Header slot="header">
  <div slot="cta"><WaButton text="Konsultasi" /></div>
</Header>
<!-- ...konten... -->
<WaButton variant="floating" />
```

Aturan: nomor dari `siteConfig.contact.whatsapp` (jangan hard-code); tanpa nomor → CTA tidak dirender (bukan `href="#"`); event `lead_whatsapp_click` lewat `track()` (no-op bila tanpa analytics); vendor analytics (GA4/Pixel) dipasang di project, bukan di sini.

## Branding, deploy, batasan

- Branding: `src/config/site.ts` (nama, deskripsi, kontak, socials) + `src/components/Header.astro` (logo/teks) + isi `src/content/**`.
- Deploy (Vercel, statis): `SITE_URL=https://domain-produksi.id` di env → `pnpm install && pnpm check && pnpm build && pnpm assert:dist` → deploy. Tanpa SSR, tanpa server endpoint.
- Batasan: bukan toko online (tanpa cart/checkout/payment), bukan CMS, tanpa search engine (hanya grouping build-time), tanpa i18n, tanpa auth. Tidak ada jaminan indexing, ranking, sitasi AI, traffic, atau konversi.

## Dependensi: trade-off yang disengaja

| Keputusan | Alasan |
|---|---|
| `canvaskit-wasm` direct (bukan transitif) | Wajib di pnpm strict-layout; tanpanya build OG gagal (`__dirname is not defined`). Dicek Phase 3. |
| `@expo-google-fonts/inter` di `dependencies` | TTF dibaca saat build OG; devDeps yang di-prune akan merusak build. |
| Tanpa `@astrojs/partytown` | Nol third-party script; `track()` no-op aman tanpa `dataLayer`. Pasang lagi saat project butuh GA4/Pixel. |
| Tanpa `astro-icon` | Nol pemakaian ikon; pasang lagi saat dibutuhkan. |
| `ClientRouter` + `prefetch: true` | Satu-satunya JS runtime (±16KB): transisi halaman + prefetch link. |
| `astro:assets` + Sharp untuk gambar katalog | `<Image>` responsif + lazy; primer galeri eager (LCP). Pipeline Sharp aktif karena ada gambar konten. |
| `sharp` di `dependencies` | Wajib sejak katalog memakai `<Image>`; Astro tidak membundel Sharp otomatis di pnpm. |
| Output gambar WebP saja (tanpa AVIF) | `<Image>` hanya mendukung satu `format`; AVIF multi-format butuh `<Picture>`. WebP default = build cepat + kompatibel; AVIF opsional per project. |
| `astro-min` + `astro-compressor` dipertahankan | Biaya kecil, manfaat untuk deploy non-Vercel; Vercel juga melakukan kompresinya sendiri. Bukan sekadar "karena ada". |
| Tanpa `script-src` CSP | Inline script (`<details>` nav, tracker LEAD) akan rusak oleh CSP ketat; CSP didefinisikan saat third-party script masuk. Header keamanan dasar ada di `vercel.json`. |
| Tanpa `.diagnost.json` | v0.2.23 tidak memuatnya (`loadConfig` hanya membaca `astro.config.*`); cakupan aturan mengandalkan default + `assert-dist` (termasuk cek `lang` output untuk `lang={...}` dinamis yang tak terbaca linter statis). |
