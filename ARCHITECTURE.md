# Phenix Labs Architecture

## 1. System overview

Phenix Labs is a server-first Next.js website with an embedded Sanity Studio. Sanity is the persisted content source, Next.js composes and caches public pages, and focused client components provide motion, filters, galleries, forms, and navigation. Netlify Forms stores contact submissions when the application is deployed on Netlify.

```text
Content editor
    │
    ▼
Sanity Studio (/admin) ──writes──▶ Sanity dataset
                                      │
                                      │ GROQ reads through CDN
                                      ▼
Browser request ──▶ Next.js App Router ──▶ lib/data normalization
                          │                       │
                          ├── server HTML ◀──────┘
                          ├── JSON-LD and metadata
                          └── client islands for interaction

Contact form ──POST /__forms.html──▶ Netlify Edge guard ──▶ Netlify Forms
```

The important boundary is `lib/data/`: presentation components receive application-shaped data and do not contain GROQ queries or depend on Sanity document shapes.

## 2. Architectural principles

1. **Server first** — routes and non-interactive components remain Server Components. Client JavaScript is limited to interactions that require it.
2. **One content boundary** — all Sanity reads and normalization live in `lib/data/`.
3. **No fabricated CMS collections** — failures return empty collections or blank About content. Only essential contact details have safe application defaults.
4. **Shared public shell** — `MainLayout` owns the navbar, footer, and scroll navigator so pages cannot accidentally render competing footers.
5. **Stable pagination** — large archives use cursor pagination with deterministic secondary `_id` ordering instead of loading every record.
6. **Progressive enhancement and accessibility** — semantic sections, keyboard controls, focus states, reduced-motion support, alt text, and non-native status feedback are built into interactive surfaces.
7. **Public configuration is not authentication** — Sanity project ID, dataset, and API version can be exposed; write tokens and service credentials must remain server-only and are not used by the current site.

## 3. Repository structure

```text
app/
├── admin/[[...tool]]/page.tsx   Embedded Sanity Studio
├── api/
│   ├── health/route.ts          Uptime endpoint
│   ├── inventions/route.ts      Search/sort/cursor endpoint
│   └── testimonials/route.ts    Testimonial cursor endpoint
├── about/page.tsx               Markdown About page
├── contact/page.tsx             Contact page and form composition
├── products/page.tsx            Invention catalogue
├── services/page.tsx            Services page
├── testimonials/page.tsx        Testimonial archive
├── error.tsx                    Route error boundary
├── not-found.tsx                404 experience
├── opengraph-image.tsx          Generated social preview image
├── robots.ts                    Generated robots rules
├── sitemap.ts                   Generated sitemap
├── layout.tsx                   Root metadata, JSON-LD, font, analytics
└── page.tsx                     Home page

components/
├── animations/                  Reusable motion behavior
├── common/                      Icons, JSON-LD, shared rendering helpers
├── content/                     Markdown renderer
├── feedback/                    Toast and status-page UI
├── forms/                       Contact form and calling-code selector
├── layout/                      Navbar, footer, and public page shell
├── navigation/                  Floating section/back-to-top navigator
├── sections/                    Page-level presentation and interactions
└── ui/                          Small UI primitives

config/                          Safe contact fallbacks
content/                         Typed page-wise and shared static copy
lib/config/site.ts               Persistent navigation/footer configuration
lib/data/                        GROQ queries and UI normalization
lib/schemas/                     Form validation contracts
lib/seo.ts                       Metadata and structured-data builders
netlify/edge-functions/          Contact form protection
public/__forms.html              Netlify form discovery blueprint
sanity/                          Studio config, content schemas, custom inputs
types/                           Shared UI data contracts
```

## 4. Rendering and data flow

### Repository-managed page content

Static editorial content is separated from rendering under `content/`. Each public route has a matching module for metadata, section labels, headings, descriptions, CTAs, ordered copy arrays, empty states, and interface messages. `content/shared.ts` owns wording reused by the global footer, navigation, social preview, and exceptional status pages.

The modules are TypeScript constants rather than raw JSON. This preserves one editing location per page while giving components literal key inference and compile-time checks. Content arrays use stable string keys; presentation components translate those keys into icons or other visual elements so the content layer never imports React components.

This layer is not a replacement for Sanity. The ownership boundary is:

```text
content/       Version-controlled editorial copy and UI wording
lib/config/    Version-controlled navigation and site behavior
lib/data/      Published Sanity content normalized for the UI
components/    Layout, visuals, animation, accessibility, and interaction
```

Runtime protocol values—form field names, API parameters, DOM event keys, cache headers, and CSS/animation constants—remain next to the code that implements them. They are not editorial content and moving them would weaken the boundary.

### Initial page requests

Each page fetches independent dependencies concurrently with `Promise.all`:

```text
route Server Component
    ├── getNavbarData()
    ├── getFooterData()
    └── route-specific lib/data function(s)
             │
             ▼
       Sanity client + GROQ
             │
             ▼
       normalized typed values
             │
             ▼
       MainLayout + presentation sections
```

Sanity uses the CDN-backed read client in `sanity/lib/client.ts`. Data requests specify a 60-second Next.js revalidation period. Editors should therefore expect a published change to take up to roughly one minute to appear without an explicit cache invalidation strategy.

### Client-side continuation

The first Products and Testimonials pages are rendered on the server. Their client components request subsequent pages through internal APIs:

- `GET /api/inventions?sort=latest|oldest|title-asc|title-desc&search=...&cursor=...`
- `GET /api/testimonials?cursor=...`

Both APIs return cacheable JSON with `s-maxage=60` and `stale-while-revalidate=300`. Invalid cursors or sort values receive a controlled error rather than restarting the collection silently.

## 5. Content model

### Singleton documents

`aboutPage` and `contactSettings` use canonical document IDs. The Studio:

- pins each singleton in the content structure;
- removes it from the global new-document menu;
- removes standard duplicate/delete actions; and
- provides a recovery action if the canonical document was deleted previously.

`aboutPage.markdown` is rendered through `react-markdown` with GitHub-flavored Markdown. If no Markdown is published, the public route retains its shell but renders no invented body content.

`contactSettings` stores shared contact information and up to 20 ordered social links. Known platforms use dedicated brand icons; a custom platform can select a Lucide icon. Hidden links remain stored but do not render.

### Collections

| Type | Consumer | Important rules |
| --- | --- | --- |
| `services` | Home and Services | Unique Services order; Home flag and unique order 1–4; editor-selected Lucide icon and accent |
| `inventions` | Home and Products | Dedicated primary image, additional gallery, optional start/end dates, maximum five Home features |
| `testimonials` | Home and Testimonials | `isActive` affects Home only; Home limit eight; full archive ignores that flag |
| `clients` | Home marquee | Requires a name and logo to render |
| `products` | Reserved | Retained for future non-invention content; no current public query |

The application enforces display limits both in Studio validation and public queries. Query-side limits remain necessary because documents may also be written through APIs, imports, or older Studio versions.

## 6. Page composition

### Home

`app/page.tsx` concurrently loads navbar, footer, active testimonials, clients, featured services, and featured inventions. `HomePageContent` composes the hero, services, client marquee, count/feature presentation, invention showcase, testimonials, and calls to action.

### About

The route loads the singleton Markdown string and passes it to `MarkdownContent`. Embedded Markdown images are rendered as part of the document flow. Blank or unavailable content produces no placeholder copy.

### Services

All valid services are ordered from Sanity and rendered by `ServicesPageContent`. Home service cards link to their matching Services section; cards on the Services page itself are not navigation links. The visual grid alternates two- and three-card rows while distributing dark variants to avoid repetitive adjacent placement.

### Products

The Products route is an invention catalogue despite retaining the public route name `/products`. It supports:

- 12-item cursor pages;
- text search limited to 80 characters;
- project-date newest/oldest and title sorting;
- deterministic sorting through the selected value plus `_id`;
- primary and additional images;
- separate thumbnails that never obscure the main image;
- desktop image magnification and a detail viewport;
- a modal presentation adapted for desktop and mobile; and
- deep links in the form `/products?invention=<sanity-document-id>`.

Featured Home inventions use those deep links, so the correct invention opens even when it is not part of the initial Products page.

Date sorting uses `startDate`, then `endDate`, then `_createdAt`. This preserves useful ordering for older entries that do not yet have project dates.

### Testimonials

Home receives only `isActive == true` entries, ordered by the editor-managed Home order and capped at eight. The fixed-height carousel supports automatic vertical movement, explicit controls, pause state, truncated copy, and a Read More dialog. Opening a dialog pauses automatic movement; closing it resumes only when the visitor had not already paused manually.

The archive loads every published testimonial, including Home-inactive records, in 12-item cursor pages.

### Contact

The page consumes the `contactSettings` singleton for contact and social information. The form is a client island within the server-rendered route.

## 7. Shared layout and navigation

`MainLayout` is the only public page shell:

```text
MainLayout
├── Navbar
├── main page content
├── SiteFooter
└── ScrollNavigator
```

`lib/config/site.ts` is actual persisted source configuration in the repository, not mock data. Navbar entries contain `showInFooter`; `SiteFooter` derives its navigation from the same array and filters by that flag. This prevents unavailable routes or duplicate keys from drifting into the footer.

The Navbar is responsive and changes presentation after scrolling. The Education CTA is explicitly external and opens in a new tab. Contact Us routes internally to `/contact`.

The floating `ScrollNavigator` discovers `main section` elements after hydration. It prefers `data-section-label`, then an accessible label, then the first heading. It assigns collision-safe IDs, tracks the active section from live scroll position even while its menu is open, keeps that selected row visible in long menus, offsets jumps below the fixed navbar, and respects reduced-motion preferences.

## 8. Contact submission architecture

```text
ContactForm
  │ React Hook Form + Zod + libphonenumber validation
  ▼
URL-encoded POST /__forms.html
  │
  ▼
Netlify Edge function
  ├── method/content-type checks
  ├── same-origin browser check
  ├── encoded body-size limit
  ├── honeypot discard
  ├── exact form-name and field validation
  └── 5 requests/minute per IP + domain
  │
  ▼
Netlify Forms storage
```

`public/__forms.html` exists because Netlify discovers form definitions by scanning static build output. It must use the same `project-enquiry` form name and field names as the React form and edge function.

The visible phone control keeps the country selector separate from national digits. India (`+91`) is the default. Only digits enter the national input; submission combines and normalizes both parts, for example `+91 8961548205`. Country-specific validation and display length come from `libphonenumber-js`.

Security is layered rather than absolute: client validation improves UX, while the honeypot, edge validation, request limits, and Netlify spam controls handle untrusted requests. These Netlify-specific layers do not execute on a Vercel-only deployment.

## 9. SEO and discoverability

`lib/seo.ts` provides a single site identity and builders for:

- canonical metadata;
- Open Graph and Twitter cards;
- Organization and WebSite JSON-LD;
- page, breadcrumb, service, and invention collection structured data.

The root layout synchronizes Organization structured data with Sanity contact/social settings. Route files define page-specific titles, descriptions, keywords, canonical paths, and schema types. `app/opengraph-image.tsx`, `app/icon.png`, `app/apple-icon.png`, `app/robots.ts`, and `app/sitemap.ts` complete the crawl and sharing surface.

`NEXT_PUBLIC_BASE_URL` must match the canonical production origin. Google verification is optional and is emitted only when configured.

## 10. Environment and trust boundaries

| Variable | Required | Purpose | Secret? |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Production | Canonicals, sitemap, robots, structured data | No |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Identifies the Sanity project | No |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Selects the public dataset | No |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Recommended | Pins Sanity API behavior | No |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console ownership token | No |

The current client performs public, read-only Sanity queries and contains no write token. Dataset visibility and Sanity CORS still need correct project configuration. If authenticated previews or server-side writes are added later, their tokens must use unprefixed server-only environment variables and must never enter client modules.

## 11. Failure behavior

- Services, clients, featured inventions, and Home testimonials log a server warning and return empty arrays when Sanity is unavailable.
- About returns an empty string.
- Contact settings fall back to `config/contact.ts` because the footer and contact paths need usable essentials.
- Products catches an initial collection failure and renders an empty catalogue; deep-link resolution returns `null` safely.
- API routes distinguish invalid continuation requests from server failures.
- `app/error.tsx` handles unexpected route errors, while `app/not-found.tsx` handles missing routes.

This strategy avoids showing stale mock records as if they were published CMS content.

## 12. Deployment topology

### Netlify production

Netlify is the complete deployment target for the current contact architecture:

1. Next.js builds and serves the website.
2. Netlify discovers `public/__forms.html`.
3. The edge function intercepts submissions to `/__forms.html`.
4. Valid records reach Netlify Forms.

After deploying, verify the form appears as `project-enquiry`, submit a real test, and confirm rate-limit/validation behavior in the deployed environment.

### Vercel

Next.js, Sanity reads, `/admin`, and production Vercel Analytics can run on Vercel. Netlify Forms storage and the Netlify edge function cannot. A Vercel-only production therefore needs a different form backend or a deliberately separate Netlify form endpoint.

For any deployed `/admin`, register the Studio URL with Sanity and allow the deployment origin in Sanity CORS. Registration is separate from login and explains the “Connect this Studio to your project” screen on a new origin.

## 13. Extension rules

### Add a CMS-backed collection

1. Define the Sanity schema in `sanity/schemaTypes/` and register it in `index.ts`.
2. Put GROQ and normalization in a dedicated `lib/data/` module.
3. Define shared public types next to the data module or in `types/`.
4. Fetch from the route Server Component.
5. Add an API route only when the browser needs later pages or live filtering.
6. Add Studio validation and repeat critical limits in the public query/API.

### Add a public page

1. Create `app/<route>/page.tsx` with route metadata and JSON-LD.
2. Load navbar, footer, and route data concurrently.
3. Wrap the page in `MainLayout`.
4. Mark major sections with useful `data-section-label` values.
5. Add the route to `lib/config/site.ts` and decide `showInFooter` explicitly.
6. Add the route to the sitemap when it should be indexed.

### Change the contact form

Update the Zod schema, visible form, Netlify static blueprint, and edge validator together. A field added in only one layer will either be dropped, fail validation, or never be registered by Netlify.

## 14. Verification

The repository currently provides lint, type-check, build, and run commands rather than a dedicated automated test suite:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

For UI changes, manually verify responsive navigation, reduced motion, keyboard focus, Products deep links/gallery behavior, testimonial pause/modal behavior, section tracking, and the deployed contact submission path. Add a formal test runner only with matching scripts and maintained tests; do not document unconfigured Jest, Vitest, or Playwright suites as existing coverage.
