# AGENTS.md

## Project Identity

This repository is a reusable Astro boilerplate for freelance and personal websites.

The repository is designed to support multiple project packages ranging from simple landing pages to content sites, product catalogs, and WhatsApp lead-generation websites.

The primary goal is:

> Clone → configure → add content → deploy quickly.

Optimize for maintainability by a single developer.

---

# Core Principles

## 1. Keep the core generic

The core must not assume a specific business domain.

Do NOT introduce business-specific assumptions such as:

- florist
- furniture
- materials
- property
- restaurant
- agency
- SaaS
- ecommerce
- digital product

Business-specific functionality belongs in an appropriate package/branch.

---

## 2. Static-first

Prefer static HTML whenever possible.

Default rendering strategy:

```text
Astro
  ↓
Static HTML
  ↓
Minimal JavaScript
```

Only introduce client-side JavaScript when an interaction genuinely requires it.

Do not introduce React, Vue, Svelte, global state, or client-side data fetching without a concrete requirement.

---

## 3. Progressive enhancement

The website should remain useful without unnecessary JavaScript.

Prefer:

- semantic HTML
- native links
- native forms
- server/static rendering
- progressive enhancement

Interactive behavior should be isolated to the smallest possible component.

---

# Architecture Rules

Use simple boundaries:

```text
src/
├── components/
├── layouts/
├── pages/
├── content/
├── config/
├── lib/
├── styles/
└── assets/
```

Do not create deep abstraction layers unless they solve a repeated problem.

Avoid:

```text
services/
repositories/
factories/
managers/
providers/
adapters/
```

unless there is a demonstrated need.

---

# Component Rules

Components should be:

- small
- composable
- accessible
- reusable
- explicit about their inputs

Prefer:

```astro
<Card title={title} description={description} />
```

over hidden global state.

Avoid components that know about unrelated business logic.

For example, a generic button should not know about:

- products
- WhatsApp
- analytics
- pricing
- checkout

Business behavior belongs in higher-level components.

---

# Content Rules

Content should be data-driven.

Prefer Content Collections or structured data for repeated content.

Do not hard-code large amounts of content inside components.

For repeated entities, use schemas.

Example:

```text
content/
├── pages/
├── articles/
└── faqs/
```

Additional collections may be introduced by a package.

Do not add `products/` to the core unless the selected project package requires catalog functionality.

---

# SEO Rules

SEO is a core capability.

Every indexable page should have:

- unique title
- useful description
- canonical URL
- appropriate robots directive
- Open Graph metadata
- Twitter/X metadata
- semantic heading structure
- crawlable links

Structured data must:

- represent visible content accurately
- use valid Schema.org vocabulary
- avoid fabricated information
- avoid duplicate/conflicting entities

Prefer one JSON-LD `@graph` per page.

Do not add structured data simply to obtain a rich result.

Do not create fake reviews, ratings, prices, availability, or other unverifiable data.

---

# AEO / GEO Rules

Optimize for useful, understandable information rather than AI-specific hacks.

Prefer:

- explicit facts
- descriptive headings
- semantic HTML
- clear entity relationships
- useful summaries
- FAQs where appropriate
- internal linking
- authoritative source information
- accurate structured data

Do not assume that:

- `llms.txt` guarantees AI visibility
- special AI schema guarantees citations
- AI-specific metadata guarantees inclusion
- any plugin guarantees AEO/GEO results

Never make ranking, indexing, or AI visibility guarantees.

---

# Performance Rules

Performance is a core requirement.

Prefer:

- static generation
- Astro components
- minimal client JavaScript
- optimized images
- responsive images
- lazy loading
- optimized fonts
- minimal third-party scripts

Avoid unnecessary hydration.

Before adding a client-side dependency, ask:

> Can this be implemented with HTML/CSS or a small inline script?

If yes, prefer the simpler implementation.

---

# Accessibility Rules

Every component must consider:

- semantic HTML
- keyboard navigation
- focus states
- accessible names
- alt text
- color contrast
- reduced motion
- form labels
- error messaging

Do not use ARIA when native HTML already provides the required semantics.

---

# Package / Branch Architecture

The repository uses capability-oriented project variants.

The core branch contains only generic functionality.

Project variants may add capabilities.

Recommended variants:

```text
starter
content
catalog
catalog-lead
```

## Starter

For:

- landing pages
- company profiles
- portfolios
- simple marketing websites

Contains:

- Astro
- TypeScript
- Tailwind
- layouts
- generic components
- SEO
- sitemap
- robots
- OG
- accessibility
- performance

Must NOT contain:

- product models
- ecommerce logic
- WhatsApp-specific logic
- catalog filtering
- checkout

---

## Content

Extends the starter capabilities with:

- Content Collections
- articles
- categories/tags where needed
- MD/MDX where needed
- RSS where appropriate
- article SEO
- pagination where appropriate

Do not introduce catalog-specific concepts.

---

## Catalog

Extends the starter/content capabilities with:

- item/product collection
- categories
- detail pages
- listing pages
- search/filter where required
- related items
- image gallery
- variants where required
- pricing where applicable
- availability where applicable
- item/product structured data where applicable

The implementation must remain generic.

Do not call the domain `products` if the package is intended to support non-product catalogs.

Prefer neutral naming such as:

```text
items
entries
catalog
```

when appropriate.

---

## Catalog Lead

Extends catalog functionality with:

- WhatsApp CTA
- inquiry flow
- pre-filled WhatsApp messages
- source/UTM information
- lead click tracking
- analytics abstraction

The core catalog must not depend on WhatsApp.

WhatsApp functionality belongs exclusively to this package.

---

# WhatsApp Rules

WhatsApp integration must be isolated.

Use a helper such as:

```ts
buildWaLink({
  number,
  text,
});
```

Messages may contain:

- item name
- item URL
- selected variant
- quantity
- campaign/source

Do not hard-code a business WhatsApp number inside reusable components.

The number belongs in project configuration.

Track the conversion event:

```text
lead_whatsapp_click
```

Do not send sensitive user information to analytics.

---

# Analytics Rules

Analytics must be optional.

Business components should not directly depend on a specific analytics vendor.

Prefer an abstraction such as:

```ts
track("lead_whatsapp_click", payload);
```

over directly calling:

```ts
gtag(...)
```

inside every component.

---

# Dependencies

Keep dependencies minimal.

Before adding a package, verify:

1. Is the functionality required?
2. Can Astro/native browser APIs solve it?
3. Is the dependency actively maintained?
4. Does it create unnecessary bundle/runtime cost?
5. Does it introduce vendor lock-in?
6. Does it belong in core or a package variant?

Do not add dependencies merely because they are popular.

---

# Forbidden Core Features

Do not add these to the generic core:

- authentication
- database
- checkout
- payment processing
- customer accounts
- ecommerce backend
- complex state management
- React Query
- Redux
- complex caching
- server actions unless specifically required
- business-specific schemas
- business-specific content
- AI content generation
- AI SEO hacks

These belong to a project-specific implementation if ever required.

---

# Branch Rules

When implementing a new capability:

1. Determine which package requires it.
2. Do not automatically add it to core.
3. Keep unrelated branches unaffected.
4. Prefer additive changes.
5. Avoid copying large amounts of code between branches.
6. Keep shared functionality in core only when it is genuinely generic.

Example:

```text
WhatsApp
→ catalog-lead

Product schema
→ catalog

Article schema
→ content

Generic SEO
→ core
```

---

# SEO / Content / Business Separation

Keep these concerns separate.

```text
Generic SEO
    ↓
Core

Article content
    ↓
Content package

Catalog data
    ↓
Catalog package

WhatsApp conversion
    ↓
Catalog Lead package
```

Do not allow business functionality to leak into generic SEO components.

---

# Configuration

Project-specific configuration belongs in:

```text
src/config/site.ts
```

Configuration may contain:

- site name
- site URL
- description
- locale
- contact information
- social links
- analytics configuration
- package-specific configuration

Do not hard-code project-specific values inside reusable components.

---

# Environment Variables

Secrets must never be committed.

Use environment variables for:

- private API keys
- analytics secrets
- service credentials
- server-only configuration

Public values may be exposed only when intentionally prefixed/configured for client access.

---

# Validation

Before considering a change complete, run:

```bash
pnpm build
pnpm diagnost
```

Also run type checking/linting when configured.

For critical user flows, add E2E tests.

---

# Definition of Done

A change is complete when:

- TypeScript passes
- build passes
- diagnostics pass
- no unnecessary dependency was introduced
- accessibility is preserved
- SEO behavior is preserved
- performance is not unnecessarily degraded
- core remains generic
- package boundaries remain intact

---

# Agent Behavior

Before changing architecture:

1. Read this file.
2. Read `BOILERPLATE_SPEC.md`.
3. Inspect the existing repository.
4. Identify the active package/branch.
5. Prefer the smallest change that satisfies the requirement.

Do not rewrite working architecture without evidence.

Do not add features that were not requested.

Do not turn a simple website requirement into a full-stack architecture.

When uncertain, preserve:

```text
simplicity
+
static-first
+
SEO
+
accessibility
+
performance
+
maintainability
```

over abstraction or feature completeness.
