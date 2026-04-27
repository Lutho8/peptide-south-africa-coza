## Context: most of this is already wired

Before paving new road, here's what already works in your codebase:

- **`#pricing` IntersectionObserver tracking** — `src/components/landing/PricingSection.tsx` (lines 40–68) already wraps the section in `id="pricing"`, watches it with an `IntersectionObserver` at 30% threshold, and fires `captureLead({ activityType: 'pricing_view' })` once on first entry.
- **"Go Premium" tracking** — every Premium CTA already calls `captureLead({ activityType: 'premium_click' })`:
  - `LandingHeader.tsx` (header button, both desktop + mobile via `scrollToPricing`)
  - `PricingSection.tsx` (pricing card CTA via `handlePremiumCta`)
  - `LiveQnAPopup.tsx` (popup teaser)
  - `bloodwork/PremiumGate.tsx` (bloodwork gate)
  - `LiveQnA.tsx` (page-level upgrade)
- **Server-side scoring + status thresholds** — `supabase/functions/nocobase-sync/index.ts` already does exactly what `updateLeadScore` was supposed to do: looks up by email, adds the activity-specific delta (`premium_click` = +25, `pricing_view` = +10, `qa_signup` = +15), caps at 100, and derives `leadStatus` (`new` → `nurturing` at ≥30, `qualified` at ≥60 or any `premium_click`). Re-doing this client-side would create two sources of truth.
- **Q&A confirmation card** — `LiveQnA.tsx` already swaps the form for a "You're Registered!" success card on submit.

## Why I won't paste the spec verbatim

Same reasons as last round: it assumes a Next.js `lib/nocobase.ts` with a browser-side token, plus a `useLeadTracking` hook that duplicates code already living in the Pricing component. Shipping it would:

1. Leak `NOCOBASE_API_TOKEN` into the browser bundle.
2. Duplicate the score/threshold logic that's already authoritative in the edge function.
3. Add a `useLeadTracking` abstraction over a single existing call site.

## What I'll actually change

Two small, useful improvements that fill genuine gaps in the request:

### 1. Enrich the Q&A "Reserve My Spot" confirmation

The current success card is a 2-line confirmation. I'll upgrade it to spell out **what the user will receive and when**, matching the request's intent ("…tells users their request was saved and what we'll send next"):

In `src/pages/LiveQnA.tsx` — replace the existing success block with a structured card:
- Big animated check + "You're confirmed for the {sessionMonth} Live Q&A".
- A "What happens next" list with three timeline items, each with an icon:
  - **Right now** — Confirmation email on its way (check spam if you don't see it in 5 min).
  - **Day before** — Zoom link + calendar invite (and a WhatsApp reminder if you provided a number).
  - **Saturday 7:00 PM CET** — We go live. Bring your questions.
- A "Add to calendar" `.ics` download button (generated client-side, no extra deps) for the next session date.
- Keeps the existing "Explore Peptides" link.
- If `premiumInterest` was checked, also shows a subtle "We'll send Premium details separately" note.

### 2. Last-captured-email fallback for anonymous Premium clicks

Right now, when an anonymous (logged-out) visitor clicks "Go Premium", `user?.email` is `null` and the `captureLead` call no-ops silently — even if that same visitor registered for the Q&A 30 seconds earlier. The spec's "userEmail comes from auth state, localStorage, or the last captured lead email" line is the only valuable behavioural change in the request.

In `src/lib/crm.ts`:
- Add `LAST_LEAD_EMAIL_KEY = 'rtd-last-lead-email'` in `localStorage`.
- Export `getLastLeadEmail()`.
- In `captureLead`: if no explicit email is passed, fall back to `getLastLeadEmail()`. If an explicit email *is* passed, persist it to `localStorage` for future calls.
- Result: a visitor who registers for Q&A then clicks "Go Premium" anonymously gets attributed to the correct lead, and the edge function bumps their score from `qa_signup` (+15) → `premium_click` (+25) → status flips to `qualified` automatically.

Zero new components, zero new hooks, zero new files. Existing CTAs benefit immediately because they all already call `captureLead`.

## What I will NOT do

- ❌ Create `src/lib/nocobase.ts` — would leak the CRM token and duplicate the edge function.
- ❌ Create `src/hooks/useLeadTracking.ts` — `usePricingTracking` already lives inline in `PricingSection.tsx` (5 lines, used in one place). `useCTATracking` would be a one-line wrapper around an existing one-line `captureLead` call. Abstraction cost > benefit.
- ❌ Add client-side `updateLeadScore` — the edge function already does this server-side, atomically, with the canonical score table.
- ❌ Add `trackAnonymousEvent` (a `console.log` stub) — adds noise without behaviour.

## Files touched

- `src/lib/crm.ts` — export `getLastLeadEmail`, add localStorage persistence + fallback inside `captureLead`.
- `src/pages/LiveQnA.tsx` — replace the success card with the richer "What happens next" confirmation + .ics download.

**Approve and I'll ship both.**