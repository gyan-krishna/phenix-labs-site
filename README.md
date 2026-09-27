# Phenix Labs Website

The public website and content-management studio for Phenix Labs. It presents engineering services, inventions, client logos, testimonials, company information, and contact details from a shared Sanity dataset.

## Stack

- Next.js 16 App Router and React 19
- TypeScript with strict checking
- Tailwind CSS 4
- Sanity Studio and `next-sanity`
- Framer Motion
- React Hook Form and Zod
- Netlify Forms with an edge validation and rate-limit layer
- Lucide icons and `libphonenumber-js`

## Requirements

- Node.js 20.9 or newer
- pnpm
- A Sanity project and dataset
- A Netlify site if the production contact form will use Netlify Forms

## Local setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env.local` and supply the public configuration for the target environment:

   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open the website at `http://localhost:3000` and the embedded Sanity Studio at `http://localhost:3000/admin`.

The Sanity values use `NEXT_PUBLIC_` because the Studio and public read client need them in the browser. A project ID, dataset name, and API version identify public content; they are not credentials. Never add a Sanity write token or other secret to a `NEXT_PUBLIC_` variable.

## Commands

```bash
pnpm dev            # Run the local development server
pnpm lint           # Run ESLint and Next.js checks
pnpm exec tsc --noEmit  # Run strict TypeScript checking
pnpm build          # Create a production build
pnpm start          # Serve the production build
```

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with featured services, inventions, clients, counts, and testimonials |
| `/about` | Markdown-driven About page |
| `/services` | Full Sanity-backed service catalogue and development process |
| `/products` | Searchable and sortable invention catalogue with gallery details |
| `/testimonials` | Paginated archive of every published testimonial |
| `/contact` | Contact details, social links, and project-enquiry form |
| `/admin` | Embedded Sanity Studio |
| `/api/inventions` | Cursor-paginated invention collection used by the Products UI |
| `/api/testimonials` | Cursor-paginated testimonial collection |
| `/api/health` | Lightweight health endpoint |

Custom `not-found` and error screens follow the same visual system as the public pages.

## Content management

The Studio exposes these document types:

- **About Page** — one protected singleton containing the complete Markdown body. An empty document renders no About content.
- **Contact & Social Settings** — one protected singleton for phone, email, address, hours, response expectation, and ordered social links.
- **Services** — shared by Home and Services. Every valid service appears on `/services`; `showOnHome` plus a unique position from 1–4 controls Home placement.
- **Inventions** — drives `/products`. A dedicated primary image appears first, additional images form the gallery, and optional project dates control date sorting. Up to five entries may be featured on Home.
- **Testimonials** — every published item appears in the archive. `isActive` only controls the Home carousel, which displays at most eight.
- **Clients** — client names and logos shown in the Home marquee.
- **Products** — retained for future non-invention catalogue content and not currently rendered.

CMS reads are normalized in `lib/data/` before reaching presentation components. Published changes are cached for up to 60 seconds, so an edit may not appear immediately after publishing.

### Static page content

Editorial copy that is intentionally kept in the repository is centralized under `content/`:

```text
content/
├── about.ts
├── contact.ts
├── home.ts
├── products.ts
├── services.ts
├── shared.ts
└── testimonials.ts
```

Use the matching page file to change metadata, section labels, headings, descriptions, CTA labels, ordered static lists, empty states, and other interface copy. `shared.ts` contains footer, navigation, social-preview, and status-page wording used across routes. These are typed TypeScript objects rather than JSON so keys, ordered values, and component usage are checked during development.

Do not move Sanity-authored records into these files. Services, inventions, testimonials, clients, About Markdown, and contact/social details continue to come from `lib/data/`. Components should retain styling, icons, animation, accessibility behavior, and runtime logic rather than embedding editable page copy.

### Studio deployment setup

For `/admin` to reach the login/editor screen in a deployed environment, register the deployed Studio URL with the Sanity project and add the site origin to Sanity CORS. The Studio may show “Connect this Studio to your project” until that URL has been registered. Repeat the CORS step for local development and any preview origin that editors are expected to use.

## Navigation and footer

`lib/config/site.ts` is the persistent source for public navigation and site-wide CTA configuration; it is not sample data. Add, remove, or activate navigation there. Each navigation link has a `showInFooter` flag, so the footer can only show routes that also exist in the navbar.

The Education CTA opens its configured external URL in a new tab. Contact-oriented CTAs should point to `/contact`.

All public pages use `MainLayout`, which supplies the navbar, modular footer, and floating section navigator. Sections opt into readable navigator labels with `data-section-label`. The navigator tracks the current section while open, supports smooth jumps, and provides a back-to-top action.

## Contact form

The visible form is implemented in `components/forms/ContactForm.tsx`. `public/__forms.html` is a hidden deployment blueprint that allows Netlify to discover the same form name and fields during its build scan; it is not a public form page.

The submission flow includes:

- Zod client validation and field length counters
- country calling-code selection with India (`+91`) as the default
- numeric-only national phone input and international validation
- a honeypot field
- same-origin, content-type, body-size, and field validation at Netlify Edge
- a limit of five submissions per minute per IP and domain
- dismissible, non-native success and error notifications

Keep the form name and field names synchronized across:

- `components/forms/ContactForm.tsx`
- `public/__forms.html`
- `netlify/edge-functions/protect-contact-form.ts`

Netlify Forms and the edge protection only run when this application is deployed through Netlify. Local development can exercise validation and UI behavior, but it does not store a real Netlify submission.

## SEO

SEO is centralized in `lib/seo.ts` and includes route metadata, canonical URLs, Open Graph/Twitter data, JSON-LD, a generated Open Graph image, icons, `robots.txt`, and `sitemap.xml`. Set `NEXT_PUBLIC_BASE_URL` to the canonical production origin. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is optional and should contain only the verification token issued by Google Search Console.

## Deployment

### Netlify

Use Netlify for the production site when the contact form must be stored in Netlify Forms. Configure the environment variables from `.env.example`, deploy the repository, then confirm that `project-enquiry` appears under Forms and that the edge function protects `POST /__forms.html`.

### Vercel

The Next.js application and Sanity Studio can run on Vercel, and production builds include Vercel Analytics. Netlify Forms and the Netlify edge guard do not run on a Vercel-only deployment; use a Netlify deployment or replace the contact submission backend in that case.

## Project map

```text
app/                 Routes, metadata, APIs, error pages, and Studio mount
components/          Layout, sections, forms, feedback, navigation, and animation
config/              Safe application defaults
content/             Typed page-wise and shared static editorial content
lib/config/          Persistent site navigation and footer configuration
lib/data/            Typed Sanity queries and normalization
lib/schemas/         Runtime form validation
netlify/              Edge validation and rate-limit function
public/               Images, icons, and Netlify's hidden form blueprint
sanity/               Studio config, schemas, custom inputs, and client
types/                Shared application types
```

For detailed boundaries and data flows, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Development conventions

- Prefer Server Components; use client components only for state, browser APIs, or animation.
- Fetch CMS content in `lib/data/`, normalize it there, and pass plain typed props into the UI.
- Put repository-managed editorial copy in the relevant `content/<page>.ts` module, not inside JSX.
- Keep shared chrome inside `MainLayout` so every public route receives one navbar and one footer.
- Preserve empty-state behavior: unavailable collections render no fabricated records.
- Add meaningful comments around non-obvious behavior, not line-by-line narration.
- Run lint and TypeScript checks before committing; run a production build when validating build or deployment changes.

## License

Private project for Phenix Labs.
