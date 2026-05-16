## Goals

1. Improve Lighthouse **LCP** and **CLS** on the landing page by tightening hero rendering and reserving space for late-loading sections.
2. Authorize the **Google Search Console** connector so sitemap submission, indexing status, and search analytics become available.

---

## Track 1 — Homepage performance

### LCP fixes (target: faster hero paint)

- **Prioritize the hero**: in `src/components/landing/HeroSection.tsx`, drop the entry animation on the H1/paragraph/positioning card (or set `initial={false}` for the first paint) so the LCP text element is not opacity-0 on load. Keep motion on decorative orbs and the phone mockup only.
- **Hero image preload**: identify the actual LCP image used in `PhoneMockup` / `FloatingStatCards`. Add `<link rel="preload" as="image" href="..." fetchpriority="high">` in `index.html`, set `loading="eager"` + `fetchpriority="high"` + explicit `width`/`height` on that `<img>`, and lazy-load everything below the fold.
- **Defer heavy below-the-fold work**: in `src/components/landing/LandingPage.tsx`, lazy-load `BentoFeatures`, `Testimonials`, `BlogSection`, `FAQSection`, `PeptideCategories`, `FeaturedPeptides`, `ResearchTools`, `CTASection` via `React.lazy` + `Suspense` with skeleton fallbacks, matching the existing pattern used for modals.
- **Reduce blocking JS in the hero**: gate the `LiveQnAPopup` mount behind `requestIdleCallback` / a short timeout so it doesn't compete with LCP.
- **Font-display**: ensure web fonts use `font-display: swap` (check `index.html` / `index.css`).
- **Animation cost**: cap the two large orb `motion.div` animations with `will-change: transform, opacity` and `prefers-reduced-motion` fallback.

### CLS fixes (target: reserve layout for late content)

- **Skeleton-sized placeholders** for sections that mount async or fetch data: `NewsTicker`, `FloatingStatCards`, `FeaturedPeptides`, `BlogSection`, `Testimonials`. Use the existing `ScreenSkeleton` patterns and set fixed `min-h-[Npx]` on each section wrapper to match final rendered height.
- **Phone mockup wrapper**: give the right-column motion container an explicit aspect ratio / min-height so it doesn't reflow when the image decodes.
- **Hero category badges**: reserve height on `HeroCategoryBadges` container (it currently mounts after layout settles).
- **Floating stat cards**: ensure absolute-positioned overlay doesn't trigger layout — already absolute, but verify parent has reserved height.
- **Images**: audit `<img>` tags in landing components and add `width`/`height` attributes everywhere (Testimonials avatars, BlogSection thumbnails, PeptideCategories icons).

### Verification

- After implementation, run Lighthouse (mobile) on `https://ridethetide.info` and capture LCP, CLS, TBT before/after.
- Targets: **LCP < 2.5s**, **CLS < 0.1**, **TBT < 200ms** on mid-tier mobile.

---

## Track 2 — Google Search Console connection

1. Call the `standard_connectors--connect` tool with `connector_id: google_search_console` so the user picks/creates a connection in the built-in picker.
2. Once linked, verify credentials via the gateway `verify_credentials` endpoint.
3. Use the gateway to:
   - **Verify domain ownership** for `https://ridethetide.info/` via the META-tag flow — get a verification token, inject the `<meta name="google-site-verification" ...>` tag into `index.html`, then call the verify endpoint.
   - **Add the site** to Search Console (`PUT /webmasters/v3/sites/...`).
   - **Submit sitemap** `https://ridethetide.info/sitemap.xml`.
4. Optionally pull initial search analytics (impressions/clicks/queries for ZA) to establish a baseline.

---

## Out of scope

- No business-logic changes, no new features, no copy rewrites.
- No changes to dose math, peptide catalog, or auth.

## Open question

For the GSC step, the verification meta tag will be added to `index.html` automatically after step 3 of Track 2 — confirm that's acceptable, or whether you'd prefer DNS verification (requires you to add a TXT record at your registrar).