# Boilerplate Astro

Detail arsitektur: `BOILERPLATE-PLAN.md`.

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
| `pnpm build`    | Build produksi ke `./dist/`                     |
| `pnpm preview`  | Preview hasil build                             |
| `pnpm diagnost` | Gate SEO/a11y/perf (harus bersih sebelum merge) |

## Yang dihasilkan build

`dist/` berisi `sitemap-index.xml`, `robots.txt` (blok AI training), `llms.txt` (kurasi manual),
`og/*.png` (1200x630, font Inter OFL). Tidak ada `schemamap.xml` (sengaja dihapus, non-standar).

## Cek sebelum serah terima

- View-source `/`, satu halaman, satu artikel: canonical absolut, OG image absolut, tepat 1x JSON-LD `@graph`.
- Rich Results Test + Schema Validator lolos. `pnpm diagnost` bersih. Satu OG PNG dibuka di browser.
