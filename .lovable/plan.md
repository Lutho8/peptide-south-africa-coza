

## Plan: Reorder Pricing, Premium-gate the monthly Q&A, and wire NocoBase CRM

Three things to ship:

1. **Move `PricingSection` higher** — directly after `<HowItWorks />`.
2. **Convert "Free monthly Q&A" → Premium-only** — gate every CTA so it routes prospects to the Premium purchase flow instead of the free signup.
3. **Connect Ride The Tide → NocoBase CRM** — every meaningful interaction (Q&A click, Start Free, Go Premium, Free Course signup, calculator use, peptide search, premium clicks, pricing views) is captured as a Lead + Activity in NocoBase via a secure edge function.

---

### Part 1 — Move PricingSection up

`src/components/landing/LandingPage.tsx`: change main section order to:

```text
HeroSection → HowItWorks → PricingSection → BentoFeatures → Testimonials
→ WhyFreeBand → ResearchTools → FeaturedPeptides → PeptideCategories
→ BlogSection → FAQSection → CTASection
```

Anchor `#pricing` keeps working.

---

### Part 2 — Premium-gate the monthly Q&A

The Q&A becomes a Premium entitlement (drives upgrades instead of free leads). Edits:

- **`HeroSection.tsx`** — relabel hero CTA from "Join free monthly Q&A" → **"Join Premium Monthly Q&A"** with a small lock icon. On click: if `useMembership().hasPremium` → navigate `/live-qna`; else → smooth-scroll to `#pricing`.
- **`LiveQnAPopup.tsx`** — rename to **"Premium Monthly Live Q&A"**, replace copy with "Exclusive to Premium members — R4.99/mo." Single CTA: **"Unlock with Premium"** → `#pricing`. (No more Reserve My Spot from the popup.)
- **`HowItWorks.tsx`** step 04 — "Consult & Optimize" copy → "Premium monthly group Q&A on Zoom".
- **`BentoFeatures.tsx`** Expert Q&A tile — add "Premium" badge, copy → "Exclusive monthly Zoom session for Premium members."
- **`WhyFreeBand.tsx`** — remove "Live monthly Q&A" tile (no longer free) and replace with "Free protocol tracking" so the band still has 4 items.
- **`FAQSection.tsx`** — update the two Q&A FAQs to say "Premium members" instead of "free monthly Q&A."
- **`Testimonials.tsx`** — soften the testimonial wording from "monthly Q&A alone is worth showing up for" → "Premium monthly Q&A alone is worth the upgrade."
- **`CTASection.tsx`** features list — change "Monthly Expert Q&A" → "Premium Monthly Q&A".
- **`PricingSection.tsx`** — move "Monthly group Q&A access" out of `freeFeatures`, add "Exclusive monthly Q&A on Zoom" to `premiumFeatures`.
- **`pages/LiveQnA.tsx`** — wrap form in a Premium gate. If `!hasPremium`: render an "Unlock with Premium" CTA card instead of the registration form. If Premium: form still works AND submission also pushes a `qa_signup` Activity to NocoBase.

---

### Part 3 — NocoBase CRM integration

#### Architecture

```text
React app
  └── src/lib/crm.ts  ──fetch──▶  Supabase Edge Function: nocobase-sync
                                       │
                                       ├── upsert Leads      (POST /api/leads:upsert)
                                       └── insert Activities (POST /api/activities:create)
```

NocoBase Bearer token + base URL stay server-side (never shipped to the browser). The edge function is `verify_jwt = true` so only authenticated visitors can call it; for anonymous lead capture (Q&A click, free course) we'll use `verify_jwt = false` with a lightweight per-IP rate limit and an `X-RTD-Origin` check.

#### Secrets requested via the secure modal (next step, not in chat)

| Secret | Purpose |
|---|---|
| `NOCOBASE_API_URL` | `https://a-zr3nluc60rf.v13.demo.nocobase.com/api` |
| `NOCOBASE_API_TOKEN` | Bearer token from NocoBase admin → Settings → API Keys |

#### NocoBase setup (you, in NocoBase admin)

Create the 5 collections from your spec exactly as listed: **Leads, Activities, Campaigns, CampaignLogs, Consultations** with the fields, types, and default views you provided. Then mint an API token with read+write on Leads + Activities + Consultations.

#### Edge function: `supabase/functions/nocobase-sync/index.ts`

Single endpoint, dispatches by `action`:

```ts
// POST { action: 'capture_lead', email, firstName?, lastName?, phone?, source, planInterest?, activityType, activityData?, pageUrl? }
// 1. Upsert Lead by email (PATCH if exists, POST if not)
// 2. Compute & bump leadScore (see scoring table below)
// 3. Insert Activity row linked to the lead
// 4. Update lastActivity = now()
// Returns { ok: true, leadId }
```

Scoring table (server-side, additive, capped at 100):

| Activity | +score | planInterest |
|---|---|---|
| `page_view` (pricing) | 5 | undecided |
| `qa_signup` (premium gate click) | 15 | premium |
| `course_start` | 10 | free |
| `calculator_use` | 5 | free |
| `peptide_search` | 3 | undecided |
| `premium_click` | 25 | premium |
| `pricing_view` | 10 | undecided |
| `consultation_booked` | 40 | premium |

`leadStatus` lifecycle: `new` (first capture) → `nurturing` (score ≥ 30) → `qualified` (score ≥ 60 OR `premium_click`) → `converted` (set by future Tagadapay webhook).

#### Client helper: `src/lib/crm.ts`

```ts
export async function captureLead(input: {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source: string;
  planInterest?: 'free' | 'premium' | 'undecided';
  activityType: ActivityType;
  activityData?: Record<string, unknown>;
}): Promise<void>
```

- Uses `supabase.functions.invoke('nocobase-sync', { body: { action: 'capture_lead', ...input } })`.
- Fails silently in the browser (CRM never blocks UX).
- Generates & persists `sessionId` in `sessionStorage` for activity correlation.

#### Capture surfaces wired

| Surface | File | Trigger | activityType | planInterest |
|---|---|---|---|---|
| Hero "Join Premium Q&A" | `HeroSection.tsx` | onClick | `qa_signup` | `premium` |
| Pricing section visible | `PricingSection.tsx` | IntersectionObserver, once | `pricing_view` | `undecided` |
| "Go Premium" CTA | `PricingSection.tsx`, `LandingHeader.tsx`, `CTASection.tsx`, `LiveQnAPopup.tsx` | onClick | `premium_click` | `premium` |
| "Start Free" / Auth signup success | `AuthModal.tsx` | onAuthStateChange `SIGNED_UP` | `course_start` (free signup) | `free` |
| Free Course enrollment | `EnrollmentModal.tsx` | submit | `course_start` | `free` |
| Reconstitution calculator open | `ReconstitutionCalculator.tsx` | mount | `calculator_use` | `free` |
| Peptide search query | `PeptideSearch.tsx` | debounced query | `peptide_search` | `undecided` |
| Live Q&A registration submit (Premium only) | `pages/LiveQnA.tsx` | post-insert | `consultation_booked` | `premium` |

Email is required for Leads — for anonymous surfaces (calculator, search) we either (a) skip the CRM call when no email is known, or (b) attach to the existing lead if the user is authenticated. Authenticated user email comes from `useAuth().user.email`.

---

### Files touched

```text
EDIT   src/components/landing/LandingPage.tsx          (reorder: PricingSection after HowItWorks)
EDIT   src/components/landing/HeroSection.tsx          (Premium-gated Q&A CTA + crm.captureLead)
EDIT   src/components/landing/LiveQnAPopup.tsx         (Premium-only copy + Upgrade CTA)
EDIT   src/components/landing/HowItWorks.tsx           (step 04 → Premium)
EDIT   src/components/landing/BentoFeatures.tsx        (Premium badge on Expert Q&A)
EDIT   src/components/landing/WhyFreeBand.tsx          (replace Live Q&A tile)
EDIT   src/components/landing/FAQSection.tsx           (Q&A FAQs → Premium)
EDIT   src/components/landing/Testimonials.tsx         (testimonial copy tweak)
EDIT   src/components/landing/CTASection.tsx           (Premium Q&A in feature list)
EDIT   src/components/landing/PricingSection.tsx       (move Q&A to premium list + pricing_view tracking)
EDIT   src/components/landing/LandingHeader.tsx        (premium_click capture on Go Premium)
EDIT   src/components/landing/PeptideSearch.tsx        (peptide_search activity)
EDIT   src/components/landing/ReconstitutionCalculator.tsx (calculator_use activity)
EDIT   src/components/auth/AuthModal.tsx               (course_start on signup)
EDIT   src/components/course/EnrollmentModal.tsx       (course_start on free course enroll)
EDIT   src/pages/LiveQnA.tsx                           (Premium gate + consultation_booked activity)
NEW    src/lib/crm.ts                                  (captureLead helper, sessionId, scoring types)
NEW    supabase/functions/nocobase-sync/index.ts       (Leads upsert + Activities insert + scoring)
NEW    supabase/config.toml entry                      (verify_jwt = false for nocobase-sync)
+ secrets request: NOCOBASE_API_URL, NOCOBASE_API_TOKEN
```

### What we're explicitly NOT doing in this turn

- ❌ Tagadapay live wiring (still deferred — `startCheckout` remains a stub; `premium_click` activity logs the *intent*, not a payment).
- ❌ Building the Campaigns / CampaignLogs writers (those are NocoBase-side automations you trigger on `leadStatus` changes; we only feed Leads + Activities).
- ❌ NocoBase admin schema creation — you create the 5 collections in NocoBase per your spec; we'll fail loudly with a one-time toast for admins if a collection or field name is missing.

### After approval, the very first thing I'll do

Trigger the secure secrets modal for `NOCOBASE_API_URL` + `NOCOBASE_API_TOKEN`. Once you paste them, I'll deploy the edge function, ship the reorder + Premium-gating, and wire all 8 capture surfaces in one pass.

