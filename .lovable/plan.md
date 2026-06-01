# Plan — Stronger iOS install tests + SEO-owned Blog

Two independent workstreams. Both are frontend/content; no schema or auth changes.

---

## 1. Expand iOS Safari install-verification tests

Goal: emulate Safari install behavior more faithfully and assert the **exact** troubleshooting copy shown for each failure mode.

### Test environment upgrades (`src/test/setup.ts`)
Extend `pwaMock` so iOS Safari quirks can be simulated deterministically:
- `navigator.standalone` toggling (iOS-only flag)
- `window.matchMedia('(display-mode: standalone)')` independent of `navigator.standalone`
- `navigator.serviceWorker` **absent** (Safari < 16.4 in non-standalone tabs) vs present
- `caches` API absent (Private Browsing) vs present-but-empty vs populated
- `navigator.onLine = false` for offline simulation
- `beforeinstallprompt` never fires on iOS (assert no native prompt path taken)
- Stub `window.location.assign` / `reload` and capture calls

### New iOS test cases (`src/components/pwa/__tests__/InstallVerification.test.tsx`)
Adds an `iOS Safari — deep scenarios` describe block:

1. **Safari tab, not installed** → asserts exact strings:
   - "Tap the Share button" + "Add to Home Screen" + "Open from Home Screen icon"
   - Shows Share-icon illustration alt text
2. **Safari standalone, SW missing** (older iOS) → "Update iOS to 16.4 or newer for offline support" guidance
3. **Safari standalone, caches API blocked (Private Browsing)** → "Disable Private Browsing to enable offline mode"
4. **Safari standalone, cache present but `/offline.html` match fails** → "Offline fallback not yet cached — open the app once while online"
5. **Safari standalone + `navigator.onLine === false` + cache ready** → passes; shows "Offline-ready ✓" badge and does NOT show troubleshooting
6. **Safari standalone + offline + cache empty** → shows "You appear to be offline and assets aren't cached yet. Reconnect and reopen."
7. **iOS Chrome/Firefox/Edge** → asserts the warning copy verbatim: "Install only works in Safari on iOS. Tap the … menu → 'Open in Safari'." and that the "Open in Safari" link uses `x-safari-https://` scheme
8. **iPad desktop-mode UA** (MacIntel + maxTouchPoints>1) → treated as iOS-safari, not desktop
9. **Add-to-Home-Screen completion poll** → simulate user returning with `navigator.standalone=true` after troubleshooting was shown; re-running check transitions to passed state and fires `install_verification_passed` exactly once
10. **Analytics payload shape** → asserts `platform: 'ios-safari'`, `iosVersion`, `swSupported`, `cachesSupported`, `online` fields are all present on both pass and fail events

If `InstallVerification.tsx` doesn't yet expose all of those copy strings or analytics fields, add them in the same task (small, surgical additions — no UX redesign).

---

## 2. Replace external blog links with locally-hosted, SEO-indexable blog pages

Right now `BlogSection` and the footer link out to `https://peptiq.io/blog/<slug>` with `target="_blank"`. This bleeds SEO equity off-site and Google won't index Ride The Tide for any of that content. Fix:

### 2a. Content model — re-host the articles
- Extend the importer `scripts/import-peptiq-blogs.mjs` to fetch each `/blog/<slug>` page (not just the index) and pull the **full article markdown** + hero image + author + canonical metadata.
- Rewrite `src/data/blogPosts.ts` so each `BlogPost` includes:
  ```ts
  { id, title, slug, excerpt, contentMd, category, tags[], date, updatedDate,
    readTime, heroImage, author, sourceUrl /* peptiq original for attribution */ }
  ```
  `url` field is removed; `slug` drives internal routing.
- Add an attribution footer rendered on each post: "Originally researched by Peptiq · republished with adaptation" with `rel="canonical"` pointing at the **Ride The Tide** URL (we are the canonical now — we host the full content, add our own commentary, and the source is credited inline). This is the standard pattern for republished content that you want indexed under your domain.

> Note for the user: republishing third-party content verbatim has copyright implications. The safe options are (a) we paraphrase + add original commentary per post during import (LLM rewrite pass via Lovable AI Gateway, `google/gemini-2.5-flash`), or (b) we only host short summaries + our own analysis and link out for the full text. **I'll ask which you want before running the importer.**

### 2b. Routing & pages
- New routes in `src/App.tsx`:
  - `/blog` → `BlogIndexPage` (paginated grid, category filter, search)
  - `/blog/:slug` → `BlogPostPage` (full article)
  - `/blog/category/:category` → `BlogCategoryPage`
- New components:
  - `src/pages/BlogIndexPage.tsx`
  - `src/pages/BlogPostPage.tsx` — renders markdown via `react-markdown` + `remark-gfm` (already referenced in firecrawl docs; add dep if missing), Tailwind `prose prose-invert`
  - `src/pages/BlogCategoryPage.tsx`
- Update `BlogSection.tsx` cards: replace `<a href={post.url} target="_blank">` with `<Link to={`/blog/${post.slug}`}>`.
- Update `LandingFooter.tsx` Blogs column links the same way; "Browse all blogs" → `/blog`.

### 2c. SEO plumbing
- `<SEOHead>` on each post: title, meta description (from excerpt), `og:image` = heroImage, `og:type=article`, `article:published_time`, `article:author`.
- `<JsonLd>` `BlogPosting` schema per post + `Blog` schema on index.
- `Breadcrumbs`: Home → Blog → Category → Post.
- `scripts/generate-sitemap.ts`: import `blogPosts`, add one `<url>` per post (`/blog/<slug>`) and one per category (`/blog/category/<cat>`). Bumps weekly changefreq.
- `public/robots.txt`: ensure `/blog` not disallowed (it isn't currently — verify).
- After deploy, trigger `gsc-resubmit-sitemap` edge function so Google re-crawls.

### 2d. Files
**New:** `src/pages/BlogIndexPage.tsx`, `src/pages/BlogPostPage.tsx`, `src/pages/BlogCategoryPage.tsx`, possibly `src/components/blog/BlogCard.tsx`, `src/components/blog/BlogAttribution.tsx`
**Edited:** `src/data/blogPosts.ts` (regenerated), `scripts/import-peptiq-blogs.mjs` (deep-fetch + optional LLM rewrite), `scripts/generate-sitemap.ts`, `src/App.tsx`, `src/components/landing/BlogSection.tsx`, `src/components/landing/LandingFooter.tsx`, possibly `src/test/setup.ts` and `src/components/pwa/InstallVerification.tsx`

### Out of scope
- No backend tables for blog posts (static data file is faster, fully indexable, no RLS surface).
- No comments/likes/newsletter on posts.
- No changes to Header / nav / Blends & Stacks / Dashboard wiring from previous turn.

---

## Question before build mode
Republishing approach for the ~156 Peptiq articles:
- **A)** LLM rewrite pass (paraphrase + add Ride The Tide commentary; credit + link to Peptiq). Best for SEO, safest legally, ~5–10 min import cost.
- **B)** Short summary + our own takeaways only, with "Read full study at Peptiq" CTA. Lighter, very safe.
- **C)** Verbatim mirror with canonical pointing at **Peptiq** (won't help our SEO — Google credits them). Not recommended.

I'll wait for your pick before running the importer.