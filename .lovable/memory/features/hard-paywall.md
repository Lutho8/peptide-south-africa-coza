---
name: Hard paywall
description: First-launch hard paywall (PaywallScreen) on all platforms. Browse Free → limited preview. Continue → RevenueCat (Play Billing) on native, Tagadapay on web.
type: feature
---
Hard paywall is the first screen any unauthenticated visitor sees on every cold start (web, PWA, native Android/iOS).

- Component: `src/components/PaywallScreen.tsx`. Centered, dark gradient, AnimatedLogo, "Unlock Premium" headline, hero price `R4.99 / month` with `3 days free` + `Cancel anytime`, full-width Continue button, Restore Purchase link (native only), Browse Free ghost button.
- Pricing stays existing: R4.99/month or R49/year (ZAR). The PaywallScreen displays only the monthly hero per spec — no monthly/annual toggle, no feature list.
- Teaser mode: `src/hooks/useTeaserMode.ts` stores `rtt_teaser_mode=1` in **sessionStorage only** so cold start re-shows the paywall.
- Limited preview rules (in `LandingPage`): `FeaturedPeptides limit={3}`, ResearchTools (calculator, stack builder, blends, quiz, search) covered with `PremiumLockOverlay` whose CTA exits teaser back to paywall.
- Subscription state: `src/hooks/useSubscription.ts` exposes `{ isPremium, isLoading, error, purchase, restore, refresh }`. PaywallScreen uses it.
- Native billing: `src/lib/revenuecat.ts` wraps `@revenuecat/purchases-capacitor`.
  - Product `info.ridethetide.app.premium.weekly`, offering `default`, entitlement `premium`.
  - API key from `VITE_REVENUECAT_ANDROID_KEY` (public SDK key, starts with `goog_`).
  - All functions return `{ ok, isPremium?, error?, reason? }` — never throw.
- Web routing (`src/services/playBilling.ts`): Native → RevenueCat; Web/PWA → `startCheckout('monthly')` (Tagadapay, currently stubbed).
- Restore Purchase: native only (web has nothing to restore — sign in instead).

This supersedes the old "Free-access model; no paywalls" rule.
