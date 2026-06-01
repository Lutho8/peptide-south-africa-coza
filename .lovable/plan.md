# Plan: Header revamp, Blogs import, PWA install tests

## 1. Header — dark brand-themed nav

Update `LandingHeader.tsx`:
- Replace nav links with: **Free Course**, **Bloodwork**, **Browse Peptides**, **Blends & Stacks**, **Dashboard** (Dashboard always shown — routes to `/` when logged in, opens auth modal when not).
- Remove the "Research" link.
- Dark glassmorphic skin: deepen header to `bg-background/80` with `border-primary/15`, primary-glow underline on active/hover (Framer Motion layoutId pill behind active link), bold tracking-tight links in `text-foreground/80 → text-primary` on hover. Sticky shadow gains a subtle primary glow on scroll.
- "Buy Peptides" CTA keeps its sparkle but gains the brand gradient (`from-primary to-accent`).
- Mobile menu mirrors the same links and styling.

Routing for new links:
- `Browse Peptides` → opens `PeptideSearch` modal (via existing `onSearch` callback).
- `Blends & Stacks` → opens `BlendsAndStacks` modal. Add a new `onBlendsClick` prop wired from `LandingPage`.
- `Bloodwork` → `/bloodwork` route (existing).
- `Free Course` → `/free-course` route (existing).
- `Dashboard` → `/` (existing).

## 2. Rename Research → Blogs, move into footer area

- `BlogSection.tsx`: change heading "Research & Insights" → **"Blogs"**, section `id="blogs"`, subtitle simplified.
- Move the rendered `<BlogSection />` to sit **directly above the footer** (just before `LandingFooter`) so it reads as the closing/index-of-articles section. Keep it lazy-loaded inside `SafeSection`.
- Add a "Blogs" column to `LandingFooter` linking to the latest ~5 posts plus a "Browse all blogs" link to `#blogs`.

## 3. Import all blogs from peptiq.io/blog

- New file `src/data/blogPosts.ts` exporting a typed `BlogPost[]` of **every article** parsed from `tool-results://fetched-websites/peptiq.io_blog.md` (~85 posts). Fields: `id` (slug), `title`, `excerpt`, `category`, `date` (ISO), `readTime`, `url` (full peptiq.io URL), `image` (peptiq image URL), optional `featured`.
- Generation approach (during build mode): one-off `scripts/import-peptiq-blogs.mjs` parses the fetched markdown with regex `\[!\[(title)\]\((image)\).*?(category)•(date)•(min read).*?(excerpt).*?\]\((url)\)` and writes the TS file. Run once; commit the data file; delete the script after.
- Categories normalised to the peptiq taxonomy (Science & Research, Safety & Best Practices, Protocols, Peptide Science, Clinical Research, Research, recovery, metabolic, longevity, performance). Color map extended in `BlogSection`.
- `BlogSection.tsx` switches to read from `@/data/blogPosts`, shows top 3 featured + paginated grid (load more in 9-card batches, no extra page route). Each card links externally to its `url` (opens new tab, `rel="noopener"`).
- "View All Articles" button → `https://peptiq.io/blog`.

## 4. PWA install verification tests

Use existing Vitest + RTL setup (`src/test/setup.ts`). Add to setup:
- `Object.defineProperty(navigator, 'serviceWorker', ...)` stub (mutable per test).
- Global `caches` mock with controllable `keys()` / `match()` / `open()` / `delete()`.
- Helpers to mock `navigator.userAgent` (iOS Safari, iOS Chrome, Android Chrome, Android Samsung) and `window.matchMedia('(display-mode: standalone)')`.

New `src/components/pwa/__tests__/InstallVerification.test.tsx` covers:
1. **iOS Safari, installed + offline ready** — UA = iPhone Safari, standalone=true, SW controller present, cache has `/offline.html`. Click "Run install check" → all 4 rows render ✅ and the green "You're offline-ready" banner appears. Asserts `track('install_verification_passed', ...)` fires.
2. **iOS Safari, not yet installed** — standalone=false → standalone row fails, troubleshooting auto-opens showing the iOS Safari "Tap Share → Add to Home Screen" panel.
3. **iOS non-Safari** — UA = iPhone Chrome → troubleshooting shows the "only works in Safari" amber panel.
4. **Android Chrome, install ok but cache empty** (offline simulation: `caches.keys()` returns `[]`) → cache row fails, fallback row fails, `install_verification_failed` fires with `cacheOk:false`.
5. **Android Chrome, fully offline ready** — controller + cache populated + `/offline.html` matched → passes, calls `markStep('install_completed', { meta: { source: 'verification' }})`.
6. **Android non-Chrome** (Samsung Internet) → troubleshooting shows "Open in Chrome" deep link.
7. **Troubleshooting toggle** — clicking "Troubleshooting" toggles panel + fires `install_verification_trouble_toggled`.
8. **Clear cache & retry** — stubs `caches.delete` and `serviceWorker.getRegistrations().unregister`, asserts both are invoked and `location.reload` called (jsdom: spy on `window.location.reload`).

Analytics spy: mock `@/lib/analytics` `track` with `vi.fn()`. Onboarding progress: mock `markStep` similarly.

## 5. Files

**New**
- `src/data/blogPosts.ts` — generated catalog of all peptiq.io blog posts
- `src/components/pwa/__tests__/InstallVerification.test.tsx`
- `scripts/import-peptiq-blogs.mjs` — one-off importer (kept in repo for future re-runs)

**Edited**
- `src/components/landing/LandingHeader.tsx` — new nav, dark brand styling, mobile menu updates, new `onBlendsClick` prop
- `src/components/landing/LandingPage.tsx` — pass `onBlendsClick`, reorder so `<BlogSection />` renders just before footer
- `src/components/landing/BlogSection.tsx` — renamed to Blogs, data from `blogPosts.ts`, external links, load-more pagination, expanded category colors
- `src/components/landing/LandingFooter.tsx` — add "Blogs" column with latest 5 + browse-all link
- `src/test/setup.ts` — add `caches`, `serviceWorker`, UA helper utilities

## Out of scope
- No backend/RLS changes.
- No Playwright/headed e2e (heavier setup); component-level tests cover the verification flow deterministically.
- "Research Tools" section on the landing page stays (it powers Quiz / Calculator / Search modals) — only the header link named "Research" is removed.
