

## Plan: Remove all member costs and vendor surfaces

Per `mem://features/access-model` the app is already supposed to be free-access; some legacy paid/vendor surfaces are still present. This sweep removes them cleanly and updates supporting code, copy, and memory.

### 1. Remove vendor surfaces (UI + data)

**Delete files**
- `src/data/vendors.ts`
- `src/components/home/VendorListCard.tsx`
- `src/components/landing/VendorShowcase.tsx`

**Edit references**
- `src/screens/HomeScreen.tsx` — remove `VendorListCard` import + the "Verified Vendors" motion block.
- `src/components/landing/LandingPage.tsx` — remove `VendorShowcase` import + the `<VendorShowcase onSignInClick=…/>` render in the landing flow.
- `src/components/landing/index.ts` — drop the `VendorShowcase` re-export.
- `src/pages/Disclaimer.tsx` — leave the existing "Do not endorse any specific vendors…" line; that's a legal disclaimer, not a vendor surface.

### 2. Remove member costs (paywall, PayPal, €9.99 references)

**Booking section — strip pay flow, keep the booking CTA as a free request**
- `src/components/booking/BookCallSection.tsx`:
  - Remove `PAYPAL_EMAIL`, `CALL_PRICE`, `handlePayPalPayment`, the price block (`€{CALL_PRICE}`), the "Pay with PayPal" button, and the "Secure payment via PayPal" footnote.
  - Replace the CTA with a plain "Request a Call" button that opens a `mailto:webinars@fintiba.com` link with subject "1:1 Peptide Consultation Request" (consistent with `mem://features/consultation-booking`).
  - Update copy: "Premium Consultation" badge → "1:1 Consultation"; remove "one-time" price tag.

**Membership hook + admin surface**
- `src/hooks/useMembership.ts`: replace contents with a stub that exports the same `useMembership` shape but always returns `{ membership: null, hasMembership: true, isLoading: false, error: null, refetch: noop, createPendingMembership: noop, activateMembership: noop, cancelMembership: noop }`. This keeps any stray imports working without DB calls. (Free-access model = `hasMembership: true`.)
- `src/pages/AdminDashboard.tsx`:
  - Drop the "Members / Revenue" stats query against `user_memberships`.
  - Replace the Members tab with a simple **Users** tab that lists `profiles` (display_name, created_at) — admin still gets a member overview, just without billing fields.
  - Remove the `Crown`/revenue tile, `price_amount` column, `€9.99` fallback, and the `Membership` types.
  - Keep CRM, Vial Label, COA admin tabs untouched.

**Terms of Service**
- `src/pages/TermsOfService.tsx`: rewrite section 6 ("Account & Membership") to "Account" only — keep account responsibility / accuracy bullets, remove the "€9.99/month", "cancel subscription", and "refund policy" lines.

### 3. Database — drop the membership table

Migration: `DROP TABLE IF EXISTS public.user_memberships CASCADE;` plus `DROP TYPE IF EXISTS public.membership_status;`. Types regenerate automatically. No other table references it (verified via search).

### 4. Memory updates

- Update `mem://features/vendor-showcase` → mark removed, or replace with a `mem://constraints/no-vendor-surfaces` rule: "No vendor lists, ratings, or finnrick.com references anywhere in the app."
- Update `mem://features/consultation-booking` to reflect mailto-only flow (no PayPal).
- Add a one-liner to Core in `mem://index.md`: "No vendor surfaces. No paid/PayPal flows — booking is mailto only."

### Files touched

```text
DELETE  src/data/vendors.ts
DELETE  src/components/home/VendorListCard.tsx
DELETE  src/components/landing/VendorShowcase.tsx
EDIT    src/screens/HomeScreen.tsx
EDIT    src/components/landing/LandingPage.tsx
EDIT    src/components/landing/index.ts
EDIT    src/components/booking/BookCallSection.tsx
EDIT    src/hooks/useMembership.ts          (stub, free-access)
EDIT    src/pages/AdminDashboard.tsx        (drop billing/members table)
EDIT    src/pages/TermsOfService.tsx        (rewrite §6)
NEW     supabase migration                  (drop user_memberships + enum)
EDIT    mem://index.md, mem://features/vendor-showcase, mem://features/consultation-booking
```

No new dependencies. No new routes. No paywalls remain anywhere.

