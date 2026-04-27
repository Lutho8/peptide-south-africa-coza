## Context: most of this is already built

Your project already has a working NocoBase lead-capture pipeline. Before adding anything new, here's what exists today:

- **`src/lib/crm.ts`** — exposes `captureLead({ email, firstName, lastName, phone, source, planInterest, activityType, activityData })`. Includes a stable `getSessionId()` (sessionStorage UUID) and silent error handling. Already imported in 17+ surfaces.
- **`supabase/functions/nocobase-sync/index.ts`** — server-side edge function that handles upsert-by-email, lead-score deltas (qa_signup = +15, premium_click = +25, pricing_view = +10, etc.), status derivation (new → nurturing → qualified), and writes an `Activities` row in the same call. Reads `NOCOBASE_API_URL` + `NOCOBASE_API_TOKEN` as **server-side secrets** (already configured).
- **`src/pages/LiveQnA.tsx`** — the actual "Reserve Your Premium Spot" form **already calls** `captureLead` after a successful Supabase insert (lines 133–144) with `source: 'live_qna_registration'`, `planInterest: 'premium'`, `activityType: 'consultation_booked'`, plus `firstName`, `lastName`, `phone`, and `session_month`/`experience_level` in `activityData`.
- **`src/components/landing/LiveQnAPopup.tsx`** — the bottom-right popup teaser also calls `captureLead` on the upgrade click.

## Why I won't ship the spec as written

The pasted instructions describe a **Next.js**, browser-side NocoBase client (`process.env.NEXT_PUBLIC_*`, direct `fetch` to NocoBase from the browser). That doesn't fit this codebase and would be a regression:

1. **This is Vite, not Next.js.** `process.env.NEXT_PUBLIC_*` doesn't exist; the Vite equivalent would be `import.meta.env.VITE_*`.
2. **Exposing the NocoBase token to the browser is a security downgrade.** Anyone could read `VITE_NOCOBASE_TOKEN` from the bundle and write/read your CRM directly. Today the token lives only in the edge function — exactly where it should.
3. **It would duplicate logic.** Score table, upsert-by-email, status derivation, and activity creation are already implemented in `nocobase-sync`. Re-doing them client-side means two sources of truth that will drift.
4. **The "Reserve My Spot" button already captures the lead.** The instruction's main behavioural ask is a no-op against current code.

## What I'll actually change

Two small, targeted improvements that deliver the *intent* of the request (capture Q&A signups + activity + optional Premium interest) without the regressions:

### 1. Add an "I'm also interested in Premium" checkbox to the Q&A form

In `src/pages/LiveQnA.tsx`:
- Add `premiumInterest: boolean` to the form state.
- Render a checkbox below the consent block: *"I'm also interested in Premium membership — send me details."*
- In `handleSubmit`, change the existing `captureLead` call so `planInterest` is `'premium'` when the box is ticked, otherwise `'undecided'` (today it's always hardcoded to `'premium'`, which inflates lead quality).
- Keep `source: 'live_qna_registration'` and `activityType: 'consultation_booked'`.

### 2. Add a dedicated `qa_signup` activity ping

Right now the Q&A registration sends `activityType: 'consultation_booked'` (worth +40 score). The spec asks for a `qa_signup` event (worth +15). Both are useful — `qa_signup` for funnel analytics, `consultation_booked` for conversion tracking.

- Fire **two** `captureLead` calls on successful registration:
  - `activityType: 'qa_signup'` (lighter intent signal, fires first)
  - `activityType: 'consultation_booked'` (existing, kept as-is)
- The edge function already deduplicates by email and accumulates score, so this is safe.

### 3. (Optional) `qa_modal` source label

If you want the popup teaser (`LiveQnAPopup.tsx`) to be tracked separately from the full `/live-qna` page, I'll change its `source` from `'qna_popup_upgrade'` to `'qa_modal'` to match the spec's vocabulary. Tell me yes/no.

## Files touched

- `src/pages/LiveQnA.tsx` — add premium-interest checkbox + dual `captureLead` call.
- `src/components/landing/LiveQnAPopup.tsx` — only if you approve item 3.

## Files NOT created (and why)

- ❌ `src/lib/nocobase.ts` — would duplicate `src/lib/crm.ts` and leak the API token to the browser.
- ❌ `NEXT_PUBLIC_NOCOBASE_TOKEN` secret — wrong runtime (Vite, not Next), wrong scope (must stay server-side). The existing `NOCOBASE_API_URL` + `NOCOBASE_API_TOKEN` edge-function secrets already cover this.

## If you really want a browser-side client

Say the word and I'll build it, but I'd recommend keeping the token server-side. The only legitimate reason to bypass the edge function would be to remove the Supabase round-trip for latency — and even then I'd proxy through a thin edge function to keep the token hidden.

**Approve and I'll ship items 1 + 2. Tell me yes/no on item 3.**