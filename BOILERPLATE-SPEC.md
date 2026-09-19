# Astro Boilerplate — Freelancers Edition

> Reusable Astro boilerplate untuk project freelance dan personal.
>
> Prinsip utama:
>
> **Clone → Configure → Add Content → Deploy Quickly**
>
> Target utama: **bus factor 1**, kompleksitas rendah, static-first, SEO-first, dan mudah dikembangkan menjadi landing page, company profile, content site, catalog, atau catalog lead-generation website.

---

# 1\. Project Goals

Boilerplate ini dirancang untuk mempercepat pembuatan website yang:

- cepat dibuat
- mudah dipahami satu developer
- mudah dikustomisasi
- SEO-friendly
- accessible
- performant
- static-first
- memiliki JavaScript seminimal mungkin
- dapat digunakan ulang untuk banyak domain bisnis

Target penggunaan:

- landing page
- company profile
- personal/portfolio website
- article/content website
- product catalog
- service catalog
- property catalog
- B2B catalog
- digital product catalog
- catalog → WhatsApp lead generation

Boilerplate **tidak** dimaksudkan sebagai full-stack application framework.

---

# 2\. Core Philosophy

## 2.1 Generic Core

Core tidak boleh mengetahui bisnis tertentu.

Core tidak boleh memiliki asumsi terhadap:

- florist
- furniture
- property
- material
- fashion
- agency
- restaurant
- SaaS
- ecommerce
- digital product

Business-specific functionality harus berada pada capability/project layer.

---

## 2.2 Static First

Prioritaskan:

```
Astro
  ↓
Static HTML
  ↓
Minimal JavaScript
  ↓
Progressive Enhancement
```

Gunakan static generation sebanyak mungkin.

Client-side JavaScript hanya digunakan ketika interaksi benar-benar membutuhkannya.

Jangan memperkenalkan:

- React
- Vue
- Svelte
- Redux
- React Query
- global state management

tanpa requirement konkret.

---

## 2.3 Simplicity First

Boilerplate ditujukan untuk **bus factor 1**.

Prefer:

- simple
- explicit
- predictable
- boring technology
- native browser APIs
- Astro primitives

daripada:

- abstraction berlapis
- dependency berlebihan
- architecture enterprise
- state management kompleks
- framework tambahan

---

# 3\. Rendering Strategy

Default rendering:

```
Homepage
    ↓
Static HTML

Listing
    ↓
Static HTML

Detail page
    ↓
Static HTML

Article
    ↓
Static HTML

Interactive component
    ↓
Minimal JavaScript
```

Gunakan client-side rendering hanya jika:

- benar-benar diperlukan
- tidak dapat dilakukan secara sederhana dengan HTML/CSS
- memberikan manfaat UX yang jelas

Jangan membuat seluruh halaman menjadi client application hanya karena terdapat satu komponen interaktif.

---

# 4\. Architecture

Struktur core yang disarankan:

```
src/
├── assets/
├── components/
├── config/
├── content/
├── layouts/
├── lib/
├── pages/
└── styles/
```

### `src/config/`

Project configuration.

Contoh:

```
src/config/site.ts
```

Berisi:

- site name
- site URL
- description
- locale
- social links

Tidak berisi business logic.

---

### `src/lib/`

Pure utilities dan reusable logic.

Contoh:

```
src/lib/
├── seo.ts
├── schema.ts
└── og.ts
```

Business-specific utility harus berada pada capability terkait.

---

### `src/components/`

Reusable UI components.

Contoh core:

```
Header
Footer
Breadcrumbs
Faq
Button
```

Business-specific component tidak boleh masuk core.

---

### `src/layouts/`

Page layouts.

Minimal:

```
BaseLayout.astro
```

Layout harus tetap generic.

---

### `src/pages/`

Astro routes.

Core hanya boleh menyediakan route generik yang memang dibutuhkan boilerplate.

Business-specific routes ditambahkan oleh project/capability.

---

### `src/content/`

Astro Content Collections.

Collection yang bersifat generic dapat digunakan oleh core atau content capability.

Contoh:

```
content/
├── pages/
├── articles/
└── faqs/
```

Tidak semua project wajib menggunakan semua collection.

---

# 5\. Capability Architecture

Boilerplate menggunakan konsep **capability**, bukan business preset.

Core menyediakan fondasi.

Capability menambahkan fitur sesuai kebutuhan project.

```
CORE
 │
 ├── CONTENT
 │
 ├── CATALOG
 │
 └── LEAD
```

---

## 5.1 Core

Core menyediakan:

```
Astro
TypeScript
Tailwind
Layouts
Generic components
SEO
Metadata
Canonical
OG
JSON-LD foundation
Sitemap
Robots
Accessibility
Performance
Image optimization
```

Core tidak menyediakan:

```
Product
Cart
Checkout
Payment
WhatsApp
Customer account
Database
Authentication
```

---

# 6\. Content Capability

Content capability ditujukan untuk website yang membutuhkan konten editorial.

Dapat menyediakan:

```
Articles
Categories
Tags
Authors
FAQ
RSS
Pagination
MD/MDX
```

Content capability tidak boleh mengubah core menjadi CMS backend.

Content tetap dapat berupa:

- Markdown
- MDX
- Content Collections
- structured data

sesuai kebutuhan project.

---

# 7\. Catalog Capability

Catalog capability digunakan untuk project yang memiliki katalog item.

Catalog harus tetap domain-neutral.

Jangan mengasumsikan bahwa setiap catalog adalah ecommerce.

Contoh domain:

```
Product
Property
Furniture
Material
Service
Digital Product
```

Karena itu, implementasi generic sebaiknya menggunakan konsep seperti:

```
Catalog
CatalogItem
Entry
```

bila sesuai.

Catalog capability dapat menyediakan:

```
Item collection
Listing
Detail page
Category
Related items
Search
Filter
Sort
Image gallery
Variants
Pricing
Availability
```

Fitur hanya ditambahkan bila diperlukan oleh project.

---

# 8\. Lead Capability

Lead capability digunakan ketika catalog atau landing page diarahkan menjadi lead-generation website.

Contoh:

```
SEO
  ↓
Landing
  ↓
Catalog
  ↓
Detail
  ↓
WhatsApp CTA
  ↓
Lead
```

Lead capability dapat menyediakan:

```
WhatsApp CTA
Pre-filled WhatsApp message
Inquiry flow
Campaign/source tracking
Lead event tracking
Analytics integration
```

---

# 9\. WhatsApp Rules

WhatsApp harus menjadi **optional capability**, bukan core requirement.

Core tidak boleh bergantung pada WhatsApp.

Implementasi dapat menggunakan helper:

```
buildWaLink({
  number,
  text,
})
```

Pesan dapat berisi:

- item name
- item URL
- selected variant
- quantity
- campaign/source

Nomor WhatsApp tidak boleh di-hard-code di component.

Nomor harus berasal dari project configuration.

Contoh:

```
config
   ↓
WhatsApp number
   ↓
buildWaLink()
   ↓
CTA
```

---

# 10\. Analytics Rules

Analytics bersifat optional.

Component tidak boleh terikat langsung dengan vendor analytics tertentu.

Prefer abstraction:

```
track("lead_whatsapp_click", payload)
```

daripada:

```
gtag(...)
```

langsung di banyak component.

Contoh event:

```
lead_whatsapp_click
```

Payload harus seminimal mungkin.

Jangan mengirim sensitive personal information ke analytics.

---

# 11\. SEO Architecture

SEO merupakan capability inti.

Setiap halaman indexable harus memiliki:

- unique title
- useful description
- canonical URL
- robots directive
- Open Graph metadata
- Twitter/X metadata
- semantic heading hierarchy
- crawlable internal links

---

# 12\. SEO Head

SEO head harus custom dan prop-driven.

Tidak menggunakan plugin SEO besar untuk abstraction utama.

Contoh:

```
src/components/seo/SeoHead.astro
```

Responsibilities:

```
title
description
canonical
robots
og:title
og:description
og:url
og:image
og:type
og:locale
twitter:card
twitter:title
twitter:description
twitter:image
```

Canonical harus:

- absolut
- menggunakan production site URL
- menghapus `utm_*`
- konsisten dengan URL halaman

---

# 13\. Robots

Default robots directive:

```
index,follow,max-snippet:-1,max-image-preview:large
```

Harus hanya terdapat satu robots meta pada halaman.

Non-indexable page harus dapat menggunakan:

```
noindex
```

Contoh:

```
404
draft
preview
private utility page
```

---

# 14\. Sitemap

Gunakan:

```
@astrojs/sitemap
```

Sitemap harus:

- menggunakan production `site`
- menghapus route non-public
- tidak memasukkan `/404`
- tidak memasukkan draft
- tidak memasukkan endpoint private
- menggunakan `lastmod` hanya bila tanggal tersebut benar-benar berasal dari content

Jangan menghasilkan `lastmod` menggunakan:

```
new Date()
```

untuk semua halaman.

---

# 15\. Robots.txt

Gunakan:

```
astro-robots-txt
```

Robots harus:

- mengizinkan search engine indexing normal
- dapat mendeklarasikan crawler restrictions
- menggunakan production site URL
- tidak digunakan sebagai pengganti authorization/security

AI crawler directives harus diperlakukan sebagai deklaratif.

Jangan mengklaim bahwa robots.txt dapat memberikan kontrol absolut terhadap bot.

---

# 16\. AI / AEO / GEO

Boilerplate harus mendukung **citation-friendly content**, bukan AI-specific hacks.

Prinsip:

- semantic HTML
- explicit facts
- descriptive headings
- clear entities
- useful summaries
- accurate structured data
- internal linking
- authoritative source information
- content yang mudah dipahami dan dikutip

Jangan mengklaim:

```
llms.txt
    ↓
guaranteed AI citation
```

atau:

```
JSON-LD
    ↓
guaranteed AI visibility
```

Tidak ada jaminan indexing, ranking, citation, atau AI visibility.

---

# 17\. llms.txt

`llms.txt` bersifat:

```
manual
curated
optional
```

Bila digunakan:

```
src/pages/llms.txt.ts
```

Format dasar:

```
# Site Name

Description

## Halaman

...

## Artikel

...
```

Isi harus:

- curated
- ringkas
- membantu discovery
- tidak memasukkan draft
- tidak menggunakan `new Date()` untuk `lastmod`

`llms.txt` tidak boleh menjadi dependency utama architecture.

---

# 18\. Structured Data

Gunakan:

```
schema-dts
```

untuk TypeScript type safety.

Tidak menggunakan plugin schema abstraction sebagai dependency utama.

Schema component dapat menggunakan:

```
src/components/seo/Schema.astro
```

Prinsip:

```
1 page
   ↓
1 JSON-LD script
   ↓
1 @graph
```

Data structured data harus identik dengan informasi yang benar-benar terlihat di HTML.

Jangan membuat data:

- review palsu
- rating palsu
- price palsu
- availability palsu
- organization information palsu

---

# 19\. Schema IDs

Gunakan stable IDs.

Contoh:

```
/#website
/#org
{canonical}/#breadcrumb
{canonical}/#faq
```

IDs harus deterministik.

Jangan menghasilkan random IDs pada setiap build.

---

# 20\. OG Image

Gunakan:

```
astro-og-canvas
```

untuk automatic OG image generation bila capability tersebut diaktifkan.

Default:

```
1200 × 630
```

OG URL harus:

- absolut
- deterministic
- konsisten dengan canonical page

Gunakan satu helper sebagai source of truth:

```
ogSlugFromPath()
```

Jangan membuat logic slug berbeda di beberapa tempat.

Font OG harus menggunakan font yang lisensinya jelas.

---

# 21\. Image Strategy

Gunakan Astro Assets:

```
astro:assets
```

dan Sharp sebagai image processing pipeline.

Prioritaskan:

```
AVIF
WebP
responsive sizes
lazy loading
```

kecuali terdapat alasan konkret untuk format lain.

Jangan menggunakan Cloudinary/imgix atau image SaaS lain di core.

---

# 22\. Typography

Font harus:

- memiliki lisensi yang jelas
- dapat disimpan secara lokal
- tidak membutuhkan request Google Fonts runtime
- tidak menyebabkan render-blocking external font request

Inter dapat digunakan sebagai default apabila sesuai dengan project.

Font proprietary tidak boleh dimasukkan ke boilerplate.

---

# 23\. Performance

Performance adalah requirement core.

Prioritaskan:

- static HTML
- minimal JavaScript
- optimized images
- optimized fonts
- minimal third-party scripts
- code splitting bila diperlukan
- lazy loading
- semantic HTML
- small DOM
- efficient CSS

Jangan menambahkan JavaScript hanya untuk convenience.

---

# 24\. Partytown

Gunakan:

```
@astrojs/partytown
```

hanya untuk third-party scripts yang memang perlu dipindahkan dari main thread.

Contoh:

```
Google Analytics
Meta Pixel
TikTok Pixel
```

Partytown bukan alasan untuk memasukkan analytics vendor ke setiap project.

Tracking harus tetap optional.

---

# 25\. Minification

Gunakan:

```
astro-min
```

bila terbukti sesuai dengan build pipeline.

Minification harus dilakukan tanpa merusak:

- HTML
- CSS
- JavaScript
- SVG
- accessibility attributes
- SEO metadata

---

# 26\. Compression

Gunakan:

```
astro-compressor
```

bila deployment target membutuhkan pre-compressed static assets.

Jika digunakan bersama minification:

```
minify
    ↓
compress
```

Compression integration harus berada setelah minification integration.

---

# 27\. Icons

Gunakan:

```
astro-icon
```

untuk reusable inline SVG icons.

Jangan memasukkan icon library besar jika hanya membutuhkan beberapa icon.

---

# 28\. Accessibility

Semua component harus memperhatikan:

- semantic HTML
- keyboard navigation
- focus state
- accessible name
- alt text
- color contrast
- reduced motion
- form labels
- error messaging

Gunakan native HTML terlebih dahulu.

Jangan menggunakan ARIA jika native HTML sudah menyediakan semantics yang dibutuhkan.

---

# 29\. Component Architecture

Component harus:

- kecil
- reusable
- composable
- explicit
- accessible

Prefer:

```
<Card
  title={title}
  description={description}
/>
```

daripada hidden global state.

Component generic tidak boleh mengetahui business logic.

Contoh:

```
Button
```

tidak boleh mengetahui:

```
Product
WhatsApp
Analytics
Checkout
Pricing
```

Business behavior harus berada pada higher-level capability component.

---

# 30\. Content Architecture

Gunakan Content Collections untuk repeated structured content.

Contoh:

```
src/content/
├── pages/
├── articles/
└── faqs/
```

Collection tambahan diperbolehkan sesuai project.

Catalog capability dapat menambahkan:

```
catalog/
```

atau struktur domain-specific yang sesuai.

Jangan memaksa semua project memiliki:

```
products/
articles/
faqs/
```

sekaligus.

---

# 31\. URL Architecture

URL harus:

- readable
- stable
- predictable
- semantic
- lowercase
- tidak menggunakan query parameter untuk canonical identity

Contoh:

```
/about
/articles/example
/catalog/example
```

Hindari:

```
/page?id=123
```

sebagai canonical URL jika static slug dapat digunakan.

---

# 32\. Internal Linking

Internal linking harus membantu:

- user navigation
- crawlability
- content discovery
- entity relationships

Gunakan contextual links.

Contoh:

```
Article
   ↓
Category
   ↓
Catalog item
   ↓
Related item
```

Jangan membuat link hanya demi SEO jika tidak membantu user.

---

# 33\. 404

404 page harus:

- `noindex`
- static
- ringan
- tanpa client-side sitemap fetch
- memiliki beberapa navigation fallback

Minimal:

```
Home
Articles / Content
FAQ
About
```

Link harus disesuaikan dengan project.

---

# 34\. Dependency Policy

Sebelum menambahkan dependency baru, tanyakan:

1. Apakah benar-benar diperlukan?
2. Bisa menggunakan Astro/native browser API?
3. Apakah dependency aktif dipelihara?
4. Apakah menambah bundle/runtime cost?
5. Apakah membuat vendor lock-in?
6. Apakah dependency seharusnya berada di core atau capability?

Jangan menambahkan dependency hanya karena populer.

---

# 35\. Core Dependencies

Dependency core harus seminimal mungkin.

Current approved dependencies dapat mencakup:

```
astro
@astrojs/sitemap
@astrojs/vercel
tailwindcss
@tailwindcss/vite
@tailwindcss/typography
astro-icon
astro-og-canvas
schema-dts
astro-min
astro-compressor
astro-robots-txt
@astrojs/partytown
```

Dependency dapat dihapus jika audit membuktikan bahwa dependency tersebut tidak memberikan value yang cukup.

Jangan menganggap semua dependency harus dipertahankan selamanya.

---

# 36\. Explicitly Excluded

Jangan memasukkan ke generic core:

```
@jdevalk/astro-seo-graph
schemamap
astro-seo-plugin
seo-in-astro
astro-meta
Cloudinary
imgix
React
Vue
Svelte
Redux
React Query
database
authentication
checkout
payment
customer accounts
```

kecuali project-specific requirement benar-benar membutuhkannya.

---

# 37\. Business Logic Boundary

Gunakan pemisahan:

```
Core
 ↓
Generic website functionality
```

```
Content
 ↓
Editorial/content functionality
```

```
Catalog
 ↓
Catalog functionality
```

```
Lead
 ↓
Conversion/WhatsApp functionality
```

Jangan mencampur semuanya menjadi satu core.

---

# 38\. Configuration

Project-specific values harus berada di configuration.

Contoh:

```
src/config/site.ts
```

dapat berisi:

```
name
url
description
locale
socials
```

Capability-specific configuration berada di capability terkait.

Contoh:

```
Lead
 ↓
WhatsApp number
```

Jangan hard-code client information di reusable component.

---

# 39\. Environment Variables

Secrets tidak boleh di-commit.

Gunakan environment variables untuk:

- private API keys
- credentials
- private services
- server-only configuration

Public configuration hanya boleh diekspos ke browser jika memang dimaksudkan untuk public.

---

# 40\. Vercel

`@astrojs/vercel` dapat digunakan sebagai deployment adapter.

Deployment architecture harus tetap kompatibel dengan static-first approach.

Jangan mengaktifkan server rendering hanya karena adapter tersedia.

Gunakan server runtime hanya jika project benar-benar membutuhkannya.

---

# 41\. Quality

Minimum verification:

```
pnpm build
pnpm diagnost
```

Jika tersedia:

```
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
```

Build harus bersih.

Tidak boleh terdapat:

- broken links kritis
- duplicate robots meta
- malformed JSON-LD
- invalid canonical
- broken OG image
- accidental noindex
- leaked secrets

---

# 42\. Definition of Done

Boilerplate/core dianggap selesai apabila:

- `pnpm build` berhasil
- diagnostics berhasil
- production `site` terkonfigurasi
- canonical absolut
- OG absolut
- sitemap tersedia
- robots tersedia
- JSON-LD valid
- tidak ada duplicate robots meta
- 404 tidak terindex
- OG image dapat diakses
- image optimization bekerja
- accessibility dasar terpenuhi
- JavaScript client minimal
- tidak ada business-specific logic di core

---

# 43\. Project Setup

Project baru harus dapat mengikuti:

```
1. Clone boilerplate
2. Install dependencies
3. Configure site
4. Configure environment
5. Add content
6. Customize UI
7. Build
8. Run diagnostics
9. Deploy
```

Target:

```
Clone
  ↓
Configure
  ↓
Content
  ↓
Deploy

< 30 minutes
```

untuk project sederhana.

---

# 44\. Client Package Model

Boilerplate dapat digunakan berdasarkan kebutuhan client.

### Starter

```
Core
```

Untuk:

- landing
- company profile
- portfolio
- simple marketing website

---

### Content

```
Core
+
Content
```

Untuk:

- blog
- article website
- SEO content website
- knowledge-oriented website

---

### Catalog

```
Core
+
Catalog
```

Untuk:

- product catalog
- property catalog
- furniture catalog
- material catalog
- service catalog
- B2B catalog

---

### Catalog Lead

```
Core
+
Catalog
+
Lead
```

Untuk:

- catalog → WhatsApp
- inquiry website
- quotation lead
- B2B lead generation

---

# 45\. Package Selection Principle

Jangan menambahkan capability berdasarkan asumsi.

Gunakan requirement aktual client.

Contoh:

```
Client:
"Company profile 5 halaman"

→ Starter
```

```
Client:
"Company profile + artikel"

→ Content
```

```
Client:
"Website katalog 100 item"

→ Catalog
```

```
Client:
"Katalog + setiap produk diarahkan ke WhatsApp"

→ Catalog Lead
```

Jangan membawa capability yang tidak digunakan.

---

# 46\. Non-Goals

Boilerplate ini bukan:

- ecommerce platform
- CMS backend
- SaaS framework
- full-stack application starter
- authentication starter
- payment platform
- order management system
- customer management system
- AI content generation platform
- AI SEO automation platform

Tidak ada jaminan terhadap:

- Google indexing
- search ranking
- AI citation
- AI visibility
- traffic
- conversion rate

Boilerplate hanya menyediakan technical foundation yang mendukung praktik tersebut.

---

# 47\. Source of Truth

Dokumentasi memiliki hierarchy:

```
AGENTS.md
    ↓
Agent rules / guardrails

BOILERPLATE-SPEC.md
    ↓
Architecture / technical contract

Phase instructions
    ↓
Current implementation task

Source code
    ↓
Actual implementation
```

Jika terjadi konflik:

1. Explicit project requirement
2. `BOILERPLATE-SPEC.md`
3. `AGENTS.md`
4. Existing implementation
5. Agent assumption

Agent tidak boleh mengisi requirement yang tidak diketahui dengan asumsi besar.

---

# 48\. Guiding Principle

Ketika memilih antara dua solusi yang sama-sama memenuhi requirement:

> **Choose the simpler solution.**

Prioritas:

```
Simplicity
    ↓
Maintainability
    ↓
Performance
    ↓
Accessibility
    ↓
SEO
    ↓
Extensibility
```

Jangan mengorbankan kesederhanaan hanya untuk membuat boilerplate terlihat lebih lengkap.

---

# Final Architecture

```
                         ASTRO BOILERPLATE
                                │
                     ┌──────────┴──────────┐
                     │                     │
                    CORE              CAPABILITIES
                     │                     │
        ┌────────────┼────────────┐        │
        │            │            │        │
     Astro          SEO          UI    ┌───┼───────┐
        │            │            │    │   │       │
     Static       Schema       A11y  Content Catalog Lead
        │            │            │    │   │       │
        └────────────┴────────────┴────┴───┴───────┘
                                │
                                ↓
                         CLIENT PROJECT
                                │
                ┌───────────────┼───────────────┐
                ↓               ↓               ↓
             Starter         Catalog       Catalog Lead
                │               │               │
                └───────────────┴───────────────┘
                                ↓
                         Deploy Quickly
```
