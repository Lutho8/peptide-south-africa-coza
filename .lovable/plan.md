# SEO Automation & Admin Dashboard

Three connected pieces: regenerate sitemap on build, surface GSC data in admin, and validate the live page before submitting to Google.

## 1. Auto sitemap regeneration + GSC resubmit

**Sitemap generator** — replace static `public/sitemap.xml` with a script.

- New `scripts/generate-sitemap.ts` — enumerates all public routes from `src/App.tsx` (excluding `/admin`, `/auth`, `*`), pulls dynamic peptide/category slugs from Supabase via the anon client, writes `public/sitemap.xml` with `BASE_URL = https://ridethetide.info`.
- Wire into `package.json`: `"predev"` and `"prebuild"` → `bunx tsx scripts/generate-sitemap.ts`.
- Result: every publish (which runs build) ships a fresh sitemap.

**Auto resubmit to GSC on publish** — edge function `gsc-resubmit-sitemap`.

- Calls `PUT /webmasters/v3/sites/<encoded>/sitemaps/<encoded sitemap url>` via the `google_search_console` connector gateway.
- Triggered two ways:
  1. Manual button in admin dashboard ("Resubmit sitemap now").
  2. Daily cron (08:00 UTC via `pg_cron` + `pg_net`) — acts as the "post-publish" hook since Lovable doesn't expose a publish webhook. Daily cadence matches Google's recommended polling.
- Records each attempt in `gsc_submissions` table (timestamp, status, errors, warnings, source: manual|cron).

## 2. Admin SEO status dashboard

New route `/admin/seo` (gated by existing admin check for `lutho.kote@relicom.de`), linked from `AdminDashboard.tsx`.

**Cards:**
- **Sitemap status** — last submission timestamp, Google's reported `lastSubmitted` / `lastDownloaded`, `isPending`, `errors`, `warnings`, total URLs submitted vs indexed. Manual "Resubmit now" button.
- **Indexing coverage trend** — line chart (recharts) of `contentsIndexed` over the last 30 days, pulled from a new `gsc_coverage_snapshots` table that the daily cron also populates.
- **Latest crawl errors** — list from `GET /webmasters/v3/sites/<site>/sitemaps/<sitemap>` `errors[]` and from `searchanalytics` query (top 10 URLs with 0 impressions over 28d as a proxy for crawl issues since the Inspection API is per-URL only).
- **Search performance** — last 28d clicks/impressions/CTR/position from `POST /webmasters/v3/sites/<site>/searchAnalytics/query`.

**Edge function** `gsc-status` — single function the dashboard calls, returns aggregated JSON. Reuses the connector pattern (`Authorization: Bearer LOVABLE_API_KEY` + `X-Connection-Api-Key: GOOGLE_SEARCH_CONSOLE_API_KEY`).

## 3. Pre-submit live verification check page

New route `/admin/seo/verify` — admin-only.

- Input: production URL (defaults to `https://ridethetide.info`).
- "Run check" button calls edge function `gsc-verify-live` which:
  - `fetch()`es the URL server-side (avoids CORS).
  - Parses the HTML and reports presence of:
    - `<meta name="google-site-verification" content="...">`
    - All `<link rel="alternate" hreflang="...">` tags (en-za, de-de, x-default)
    - `<link rel="canonical">`
    - Sitewide JSON-LD blocks
    - `<title>` and `<meta name="description">`
- UI shows a checklist (✓ / ✗) with the actual found value or "missing". Green "Ready to submit → Verify with Google" button is enabled only when verification meta is present; clicking it triggers the existing verify + add-site flow.

## Database (new tables)

```sql
gsc_submissions      (id, site_url, sitemap_url, submitted_at, status, errors jsonb, warnings int, source text)
gsc_coverage_snapshots (id, site_url, captured_at, submitted int, indexed int, errors int, warnings int)
```

Both admin-read only via RLS using existing `has_role(_user_id, 'admin')` pattern.

## Files touched

- New: `scripts/generate-sitemap.ts`, `supabase/functions/{gsc-resubmit-sitemap,gsc-status,gsc-verify-live}/index.ts`, `src/pages/admin/SEODashboard.tsx`, `src/pages/admin/SEOVerifyPage.tsx`
- Edited: `package.json` (predev/prebuild), `src/App.tsx` (2 admin routes), `src/pages/AdminDashboard.tsx` (link card), DB migration for tables + cron job

## Open questions

1. **Cron cadence** — daily 08:00 UTC OK, or prefer hourly?
2. **Coverage chart source** — Google deprecated the public Index Coverage report API. Confirm OK using "sitemap submitted vs indexed" counts (from sitemaps API) as the trend metric. Alternative is per-URL Inspection API (slow, quota-limited).
3. **Dynamic sitemap entries** — include all peptides + categories + blog posts, or stay with the current static route list?
