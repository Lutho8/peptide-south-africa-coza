## Hard Paywall Screen — first-launch gate

A new `PaywallScreen` becomes the first screen any unauthenticated visitor sees on web, PWA, and native (Android/iOS). It pushes Premium (existing R4.99/month or R49/year), with a "Browse Free" escape into a **limited preview** mode.

### What gets built

**1. `src/components/PaywallScreen.tsx`** — exported component

Layout (centered, generous padding, dark gradient bg `from-[#0F172A] via-[#0F172A] to-[#1E293B]`):

```text
        [Animated Logo, lg]
         Unlock Premium        ← 2xl bold
       Full access to Ride The Tide

        ┌───────────────────┐
        │   R4.99 / month   │  ← 5xl bold, primary color, hero
        │   3 days free     │  ← sm muted
        │  Cancel anytime   │  ← xs muted
        └───────────────────┘

   [        Continue        ]   ← full-width primary, h-14
        Restore Purchase        ← text link, sm
       ─────────────────
          Browse Free           ← ghost button
```

No feature list, no monthly/annual toggle, no clutter — per spec, but using existing ZAR pricing per user's pricing answer.

**2. Wire it into `src/pages/Index.tsx` as the first unauthenticated screen**

Replace the current `if (!user) return <LandingPage />` branch with:

```text
if (!user && !teaserMode) → <PaywallScreen onContinue onRestore onBrowseFree />
if (!user && teaserMode)  → <LandingPage /> in limited-preview mode
```

`teaserMode` is stored in `sessionStorage` (`rtt_teaser_mode`) so it doesn't survive a fresh launch — every cold start re-shows the paywall, matching "first screen on app launch".

**3. Limited preview gating**

Add a tiny `useTeaserMode()` hook + `<TeaserGate>` wrapper. In teaser mode:
- Landing page shows only the **first 3 peptides** in `FeaturedPeptides`
- `ReconstitutionCalculator`, `StackBuilder`, `PeptideQuiz` render a locked overlay with a "Unlock Premium" CTA that returns to `PaywallScreen`
- Auth modal still works (sign-in routes to dashboard normally; signup is allowed)

**4. Continue button behavior (per-platform)**

- **Android (Capacitor native)**: launches Google Play Billing via a new wrapper `src/services/playBilling.ts` using `@capacitor-community/in-app-purchases` (to be added). For this plan, the wrapper exposes `purchaseSubscription('premium_weekly_trial')` and `restorePurchases()` — actual SKU configuration in Play Console is a follow-up the user does outside the codebase.
- **Web / PWA**: opens Tagadapay checkout (existing `src/lib/billing.ts` flow) since Play Billing isn't available.
- **iOS** (future): same wrapper falls back to App Store IAP via the same plugin.

`Restore Purchase` only appears on native; hidden on web (no IAP to restore).

**5. Memory updates**

- Update **Core** in `mem://index.md`: drop "Free-access model; no paywalls or PayPal" → replace with "Hard paywall on first launch (all platforms). Free teaser via Browse Free. Premium = existing ZAR pricing (Tagadapay web, Google Play Billing on Android)."
- Update `mem://features/access-model.md` and `mem://features/premium-tier-allowed.md` to reflect the hard paywall + IAP override.
- Add new `mem://features/hard-paywall.md` documenting the first-launch gate, teaser mode rules, and per-platform billing routing.

### Files touched

- **new** `src/components/PaywallScreen.tsx`
- **new** `src/hooks/useTeaserMode.ts`
- **new** `src/components/paywall/PremiumLockOverlay.tsx`
- **new** `src/services/playBilling.ts` (stub wrapper; real plugin install happens during build)
- **edit** `src/pages/Index.tsx` (paywall gate before LandingPage)
- **edit** `src/components/landing/LandingPage.tsx` (consume teaser mode, slice featured peptides)
- **edit** `src/components/landing/StackBuilder.tsx`, `ReconstitutionCalculator.tsx`, `PeptideQuiz.tsx` (lock overlays in teaser mode)
- **edit** `mem://index.md`, `mem://features/access-model.md`, `mem://features/premium-tier-allowed.md`
- **new** `mem://features/hard-paywall.md`

### Out of scope (call out to the user)

- Adding the actual `@capacitor-community/in-app-purchases` package and wiring real Google Play SKU IDs — needs Play Console product setup first; the `playBilling.ts` wrapper will throw a clear "Configure Play Billing SKU" error until then.
- Switching to USD $3.99/week pricing (user chose to keep existing R4.99/month + R49/year).
- Receipt validation edge function for Google Play purchases — needs to be a follow-up task once SKUs exist.

### Risks

- A hard paywall reverses a long-standing project rule. Memory + several existing components (`PricingSection`, `WhyFreeBand`, `BentoFeatures` "free forever" copy) still advertise free access. This plan does **not** rewrite that marketing copy — flag whether you want a follow-up pass to update landing page messaging to match the new paywall stance.
- Google Play policy requires the paywall to clearly disclose trial→paid conversion price and cancellation steps before purchase. The `Continue` flow will need a confirmation sheet before calling `purchaseSubscription` — included in `PaywallScreen` as a small disclosure line above the button.
