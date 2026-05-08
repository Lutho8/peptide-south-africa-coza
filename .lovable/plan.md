## Goals

1. Make sure signed-in (non-Premium) users can use all free features without paywall friction, while Premium-only surfaces (Live Q&A, Education premium content, 1:1 calls, AI bloodwork insights) remain gated.
2. Add a new expandable "Dosing, Adherence & Safety" FAQ + safety disclaimer block on the landing page.

## 1. Authenticated Premium Gate

**New component:** `src/components/paywall/PremiumGate.tsx`

A reusable wrapper that:
- Reads `useMembership()` for `hasPremium`, `isAdmin`, `isLoading`.
- Reads `useAuth()` for `user`.
- If loading → skeleton.
- If `hasPremium` → renders `children`.
- Else → renders a soft lock card with: lock icon, configurable title/description, "Upgrade to Premium" CTA (scrolls to `#pricing` or opens auth modal if not signed in), and "Learn more" link to pricing.

Props: `title`, `description`, `featureName`, `children`, optional `variant: 'inline' | 'overlay'`.

**Apply gate to Premium-only surfaces (already partially gated, standardize):**
- `src/pages/LiveQnA.tsx` — replace ad-hoc `!hasPremium` block with `<PremiumGate>`.
- `src/pages/BloodworkPage.tsx` — replace inline non-premium branch with `<PremiumGate>` for AI insights tier; keep manual entry available to free users.
- `src/components/booking/BookCallSection.tsx` — wrap the booking CTA in `<PremiumGate>` (free users see upsell instead of mailto).
- Education premium lessons in `src/screens/EducationScreen.tsx` (if such tagging exists; otherwise add a `premium` flag on lesson rows and gate the player) — verify during implementation.

**Free-feature access for signed-in users:**
- Confirm `useTeaserMode` is not enabled for authenticated users. The teaser overlay in `LandingPage.tsx` (research tools, featured peptides) is driven by `teaser` from `useTeaserMode`; ensure it never auto-enables for signed-in non-Premium users. Add a guard in `useTeaserMode` so `teaser` is forced `false` whenever `useAuth().user` is present (read auth via a small effect rather than coupling the hook). This guarantees signed-in free users hit the dashboard with all free tools unblocked.

## 2. Landing FAQ + Safety Disclaimer

**Augment `src/components/landing/FAQSection.tsx`:**
Add a new category before `safety`:

```
id: 'dosing-adherence'
title: 'Dosing & Adherence'
icon: Syringe
```

with 6 expandable Q/A entries covering:
- How do I know the right starting dose?
- mg vs IU vs U-40 units — what's the difference?
- What if I miss a dose?
- How strict do I need to be with timing?
- Can I stack peptides safely?
- When should I cycle off?

And expand the existing `safety` category with 3 more entries:
- When should I consult a doctor or endocrinologist?
- What bloodwork should I run before/during a cycle?
- Red-flag symptoms that mean stop immediately.

All copy is research/education framing — no medical claims; reinforce "consult a qualified healthcare professional."

**New component:** `src/components/landing/SafetyDisclaimerBand.tsx`
A prominent, expandable disclaimer card placed directly above `<FAQSection />` in `LandingPage.tsx`:
- Amber-bordered card, AlertTriangle icon, heading "Research-Use Only — Not Medical Advice".
- Collapsed: 1-line summary + "Read full disclaimer" toggle.
- Expanded: bullets covering FDA non-approval, "consult a healthcare professional", start-low/go-slow, monitor bloodwork, discontinue on adverse effects, age/pregnancy contraindications.
- Reuses semantic tokens (`border-yellow-500/30 bg-yellow-500/10` style already used in `SafetyDisclaimer.tsx`) but lives at the landing scale (full-width container, larger type).

Insert into `LandingPage.tsx` between `<BlogSection />` and `<FAQSection />`.

## Files

**New**
- `src/components/paywall/PremiumGate.tsx`
- `src/components/landing/SafetyDisclaimerBand.tsx`

**Modified**
- `src/hooks/useTeaserMode.ts` — force-disable when auth user present.
- `src/components/landing/FAQSection.tsx` — add `dosing-adherence` category, extend `safety`.
- `src/components/landing/LandingPage.tsx` — render `<SafetyDisclaimerBand />`.
- `src/pages/LiveQnA.tsx`, `src/pages/BloodworkPage.tsx`, `src/components/booking/BookCallSection.tsx` — adopt `<PremiumGate>`.

No DB or edge-function changes. No payment-flow changes (Tagadapay link unchanged).
