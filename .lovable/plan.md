

## Plan: Build Premium tier UI now, wire Tagadapay later

Skipping Stripe entirely. I'll build everything except the live payment connection. The "Subscribe Now" button will store a pending intent and show a toast — Tagadapay gets wired in a follow-up message once you have the API credentials ready.

### Memory updates

- **Rewrite** `mem://constraints/no-paid-or-vendor-surfaces` → `mem://features/premium-tier-allowed`. Paid Premium tier permitted; vendor surfaces still forbidden.
- **Update** `mem://features/access-model` → "Free + Premium tier (Tagadapay, ZAR)."
- **Update** `mem://features/consultation-booking` → 1:1 consultation = Premium-gated entitlement.
- **Narrow** `mem://constraints/english-only-enforcement` → no multi-language i18n, but ZAR/SA copy allowed (English text).
- **New** `mem://features/payment-provider-tagadapay` → Tagadapay is the chosen processor; Stripe/Paddle/Paystack explicitly skipped; integration deferred until credentials provided.
- **Update** `mem://index.md` Core lines.

### Database (single migration)

```sql
create type public.subscription_status as enum
  ('active','trialing','past_due','canceled','incomplete','pending','paused');

create type public.subscription_plan as enum ('monthly','annual');

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan public.subscription_plan,
  status public.subscription_status not null default 'pending',
  provider text not null default 'tagadapay',
  provider_subscription_id text,
  provider_customer_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.subscriptions enable row level security;
create policy "Users view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);
-- writes service-role only (future Tagadapay webhook)

create or replace function public.has_active_subscription(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = _user_id
      and status in ('active','trialing')
      and (current_period_end is null or current_period_end > now())
  )
$$;
```

Admin email `lutho.kote@relicom.de` returns `hasPremium = true` unconditionally via existing `has_role(_, 'admin')`.

### New components

- **`PricingSection.tsx`** (mounted at `#pricing`, between Testimonials and WhyFreeBand)
  - Two cards. Free (left, R0/month). Premium (right, gradient border + "Most Popular" ribbon).
  - Monthly/Annually pill toggle. Monthly: ~~R9.99~~ **R4.99/month**. Annual: **R49/year** (Save ~17%).
  - Free CTA → `AuthModal`. Premium CTA → `startCheckout(plan)` (currently shows "Premium checkout launches soon — we'll email you when Tagadapay is live" toast + records intent in localStorage).
- **`PricingTrustBar.tsx`** — 4 SA pillars: 🔒 Secure Checkout · 🇿🇦 South African Owned · ✓ Cancel Anytime · 💬 WhatsApp & Email Support. 2x2 on mobile.
- **`src/lib/billing.ts`** — `startCheckout(plan)` stub + `openCustomerPortal()` stub. Single TODO block for Tagadapay wiring.

### Edited components

- **`LandingHeader.tsx`** — Replace "Members" with **Start Free** (outline) + **Go Premium** (gradient, scrolls to `#pricing`). Add **Pricing** nav link. All copy says "Ride The Tide" — no "PeptidePro" anywhere (already verified absent).
- **`LandingPage.tsx`** — Remove `<StatsBand />` import + render. Mount `<PricingSection />` between `<Testimonials />` and `<WhyFreeBand />`.
- **`StatsBand.tsx`** — Delete file. Drop export from `landing/index.ts`.
- **`CTASection.tsx`** — Dual CTA: "Get Started Free" + "Unlock Premium". Append "🇿🇦 Built in South Africa" micro-line.
- **`LandingFooter.tsx`** — Add "Proudly South African 🇿🇦 · Prices in ZAR" meta line.
- **`FAQSection.tsx`** — Add **Pricing & Membership** tab (5 Q&As: what's free, what Premium adds, how to cancel, refund policy, "Is Ride The Tide South African?").
- **`BookCallSection.tsx`** — If `hasPremium`: button "Book Premium 1:1 Call" (mailto with "Premium member" body). Else: disabled with "Available with Premium" + Upgrade link to `#pricing`.
- **`useMembership.ts`** — Real DB-backed: query `subscriptions` row + admin role. Expose `{ hasPremium, plan, status, currentPeriodEnd, isLoading, refetch }`.

### Files touched

```text
NEW    supabase migration                           (subscriptions + enums + helper fn)
NEW    src/components/landing/PricingSection.tsx
NEW    src/components/landing/PricingTrustBar.tsx
NEW    src/lib/billing.ts                           (Tagadapay stub)
EDIT   src/hooks/useMembership.ts                   (real DB-backed)
EDIT   src/components/landing/LandingHeader.tsx     (Pricing link, Start Free / Go Premium, RTD branding)
EDIT   src/components/landing/LandingPage.tsx      (remove StatsBand, mount PricingSection)
EDIT   src/components/landing/CTASection.tsx       (dual CTA + 🇿🇦 line)
EDIT   src/components/landing/LandingFooter.tsx    (SA + ZAR meta)
EDIT   src/components/landing/FAQSection.tsx       (Pricing & Membership tab)
EDIT   src/components/landing/index.ts             (drop StatsBand, add new exports)
EDIT   src/components/booking/BookCallSection.tsx  (Premium-gated)
DELETE src/components/landing/StatsBand.tsx
+ Memory rewrites listed above
```

### Explicitly NOT doing

- ❌ Stripe / Paddle / Paystack enable — skipped per your call.
- ❌ Tagadapay live wiring — deferred until you provide credentials (API key, webhook secret, product/price IDs). I'll need those via the secure secrets modal, never in chat.
- ❌ Vendor surfaces — original block stays.
- ❌ Sticky mobile bottom CTA bar — follow-up.

### When you're ready to wire Tagadapay (next message)

You'll need: Tagadapay **API key** (or publishable + secret), **webhook signing secret**, and the **product/price IDs** for Monthly R4.99 and Annual R49. I'll request them via the secure secrets form, then wire `billing.ts` checkout + a `tagadapay-webhook` edge function that updates the `subscriptions` row.

