## Goal

Expand SEO from SA-only to Germany + South Africa, fix indexability, and modernize per-route head management. All changes are presentation/SEO only — no business logic, dose math, or auth changes.

---

## 1. Per-route head infrastructure

- Install `react-helmet-async`, wrap `<App/>` in `<HelmetProvider>` in `src/main.tsx`.
- Rewrite `src/components/seo/SEOHead.tsx` to use `<Helmet>` (drop the manual `document.head` mutations). Add props: `title`, `description`, `keywords?`, `canonical`, `ogImage?`, `ogLocale?`, `lang?`, `breadcrumbs?`, `extraJsonLd?`.
- Mount `<SEOHead>` in every public page with unique title + description + canonical (homepage, /pricing, /free-course, /bloodwork, /browse (= PeptidesScreen), /blends-stacks, /research, all peptide entity pages, category hubs, guides, legal pages).
- Use copy from request §14 for /pricing, /free-course, /bloodwork, /browse, /blends-stacks, /research.

## 2. `index.html` rewrite

- Title → `Ride The Tide | Peptide Protocol Tracker | Germany & South Africa`
- Description + keywords from request §1
- Remove `<link rel="canonical">` from index.html (Helmet owns per-route canonicals)
- Add hreflang block (`en-za`, `de-de`, `x-default`) — request §3
- Add geo meta (`geo.region=ZA,DE`, `geo.placename`, `geo.position`, `ICBM`, `distribution=global`) — §4
- OG/Twitter blocks per §5 incl. `og:locale=en_ZA`, `og:locale:alternate=de_DE`, `og:image:width/height`
- Replace existing Organization + WebSite JSON-LD with the expanded Organization (areaServed ZA+DE, contactPoint EN/DE) and add WebApplication + FAQPage JSON-LD from §7A/B/C.
- Add `<link rel="dns-prefetch" href="https://fonts.googleapis.com" />`.

## 3. HTML `lang` attribute

- Keep `<html lang="en">` as default.
- Add a small `useEffect` in `App.tsx` that reads `?lang=de` from URL and sets `document.documentElement.lang = 'de' | 'en'`. (No i18n rewrite — English-only memory still holds; only `lang` attribute changes for now.)

## 4. Per-page JSON-LD

- /free-course → Course schema (§7F) + BreadcrumbList
- /pricing → SoftwareApplication with Free + Premium offers (§7D) + BreadcrumbList
- All subpages → BreadcrumbList JSON-LD via existing `Breadcrumbs.tsx` (already exists — just mount it on subpages that lack it).
- Fix `Breadcrumbs.tsx` + `JsonLd.tsx` BASE_URL from `peptide-mastery.lovable.app` → `ridethetide.info`.

## 5. Visible breadcrumbs

Mount existing `<Breadcrumbs>` on: /free-course, /bloodwork, PeptidesScreen (browse), /blends-stacks (ResearchLibraryScreen?), /pricing, /research per §10.

## 6. Hero copy (§8–9)

In `src/components/landing/HeroSection.tsx`:
- Single H1: "The Smartest Way to Track Your Peptide Research"
- Demote existing "Are You Still Guessing Your Peptide Doses?" to H2
- Update badge → "Built for researchers in Germany & South Africa"
- Update subtext + body to remove SA-only framing
- Verify category section uses H2 "Browse Peptide Categories" + H3 per category, and stats/features uses H2 "Why Researchers Trust Ride The Tide"

## 7. Footer (§15)

Rework `LandingFooter.tsx` columns into Platform / Resources / Support / Markets / About. Remove "Proudly South African 🇿🇦 · Prices in ZAR" tagline (now dual-market). Keep medical disclaimer.

## 8. `public/sitemap.xml` + `public/robots.txt`

- Sitemap: keep current 30+ entries (peptide pages, categories, guides) AND ensure /pricing, /browse, /blends-stacks, /research are present. Current sitemap is more thorough than §11's minimal list — we'll keep the larger set and just add any missing routes from §11.
- robots.txt: simplify per §12 (`Allow: /`, disallow `/admin`, `/api/`, `/auth`, keep sitemap line).

## 9. Lovable badge (§13)

Call `publish_settings--set_badge_visibility` to hide it (proper way). Also add the defensive CSS rule in `index.css` as belt-and-braces.

## 10. Submit to Google Search Console

After deploy, via the GSC connector gateway:
- `PUT /webmasters/v3/sites/.../sitemaps/...sitemap.xml` to (re)submit.
- Verify sitemap status.

---

## Out of scope (flagged for confirmation)

- **German UI translation**: memory rule says "English only; no localization." We will add hreflang + `og:locale:alternate=de_DE` + `?lang=de` URL handling, but will NOT add a real German translation layer. Confirm if you want me to remove this constraint and add full DE translations — that's a much larger change.
- **Pricing page**: SoftwareApplication schema declares €9.99 Premium. Memory says "Free-access model; no paywalls." Confirm: do you want a real /pricing page added with these tiers, or should we drop the SoftwareApplication offer block and keep free-access? (Current plan: add the page + schema as requested, overriding the memory rule.)
- **aggregateRating 5.0 / 218 reviews**: Google flags fabricated review counts. Confirm these are real or we'll drop the `aggregateRating` block to avoid a manual action.
- **/research, /blends-stacks, /browse, /pricing routes**: /browse and /pricing don't exist today. Plan = add lightweight stub pages OR map /browse → existing PeptidesScreen and skip /pricing. Confirm.

Reply "go" plus any answers to the four points above and I'll implement.