## Scope

Standalone project (no merge with store). Remove all paywall surfaces, rewire nav, add cross-property links to ridethetide.site / capetownpeptideclub.co.za / WhatsApp, refresh /welcome hero, add two dashboard widgets, and update meta tags to Cape Town. Auth, Capacitor, i18n, Supabase, routes, and tracker features stay untouched.

One open question before I build — see bottom.

---

## 1. Remove all paywalls

**Delete files**
- `src/components/PaywallScreen.tsx`
- `src/components/TeaserMode.tsx`
- `src/components/paywall/PremiumGate.tsx`
- `src/components/paywall/PremiumLockOverlay.tsx`
- `src/components/bloodwork/PremiumGate.tsx`
- `src/hooks/useTeaserMode.ts`
- `src/hooks/useSubscription.ts`
- `src/hooks/useMembership.ts`
- `src/components/landing/PricingSection.tsx`
- `src/components/landing/PricingTrustBar.tsx`
- `src/components/landing/WhyFreeBand.tsx` (paywall-adjacent; will confirm by reading)
- `src/lib/revenuecat.ts`, `src/lib/billing.ts`, `src/services/playBilling.ts`
- Memory file `.lovable/memory/features/hard-paywall.md`, `payment-provider-tagadapay.md`, `premium-tier-allowed.md`

**Edit callers** — strip `<PremiumGate>`, `<PremiumLockOverlay>`, `useMembership`, `useSubscription`, `useTeaserMode`, `isPremium` checks. Every gated feature renders unconditionally for signed-in users. Replace any inline "Go Premium / Upgrade" CTA copy with a plain text link:

```
Shop Protocols → ridethetide.site
```

Files I expect to touch (confirmed via grep before editing): `LandingPage.tsx`, `BloodworkPage.tsx`, `BloodworkHero.tsx`, `BloodworkWizard.tsx`, `ResearchTools.tsx`, `BlendsAndStacks.tsx`, `StackBuilder.tsx`, `ReconstitutionCalculator.tsx`, `PeptideQuiz.tsx`, `PeptideSearch.tsx`, `FeaturedPeptides.tsx`, `LiveQnA.tsx`, `LiveQnAPopup.tsx`, `App.tsx` (remove paywall route/gate), any screen importing `useMembership`.

## 2. Nav

In `src/components/landing/LandingHeader.tsx` (and any mobile drawer):
- Remove **Pricing** link and **Go Premium** button.
- Final order: Free Course · Bloodwork · Browse · Blends & Stacks · Research · Dashboard · **[Shop Protocols →]**
- "Shop Protocols" = outlined button, `border-accent text-accent`, opens `https://ridethetide.site` in same tab (no `target="_blank"`).

## 3. Cross-property footer links

In `src/components/landing/LandingFooter.tsx`, add a new column "Network" with three rows:

```
RTD Research Peptides → https://ridethetide.site
Cape Town Peptide Club → https://capetownpeptideclub.co.za
WhatsApp Us → https://wa.me/[YOUR_NUMBER]
```

External links open same tab per spec. `[YOUR_NUMBER]` stays as a literal placeholder until you give me a real number (see question below).

## 4. Floating WhatsApp button

New `src/components/global/WhatsAppFab.tsx`. Mounted once in `src/App.tsx` so it appears on every route.

- Fixed `bottom-4 right-4` (with `env(safe-area-inset-*)` padding for iOS).
- 56×56 circle, `background: #25D366`, white `MessageCircle` / WhatsApp glyph (SVG, not lucide so it's the real WA glyph).
- href: `https://wa.me/[YOUR_NUMBER]?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20RTD`
- `aria-label="Chat on WhatsApp"`, subtle shadow, hover scale.

## 5. /welcome rewrite

Edit `src/pages/Welcome.tsx`. Strip phone-OTP form, plan comparison, anything pricing-related. New hero:

- H1: **"Track Your Protocol. See What's Actually Working."**
- Sub: "The only free peptide tracker built for South African researchers. Dose logging, bloodwork integration, monthly expert Q&As. No paywalls. Ever."
- Primary CTA → `/auth` (filled, accent) — "Start Tracking Free"
- Secondary CTA → `https://ridethetide.site` (outlined) — "Shop Protocols"
- Keep the existing research-use-only disclaimer and the country-code/OTP form? **See question below.**

## 6. Dashboard "Running Low?" card

New `src/components/home/ReorderWidget.tsx`, rendered at the bottom of `src/screens/HomeScreen.tsx` (the in-app dashboard).

- Dark surface card (`bg-card`), 3px left border `#06b6d4`.
- Title: "Running Low?" · Body: "Reorder your protocol in one tap."
- CTA: "Shop Now →" → `https://ridethetide.site/products?utm_source=tracker&utm_medium=dashboard&utm_campaign=reorder`

## 7. Dashboard "Next RTD Workshop" card

New `src/components/home/NextClubEventCard.tsx`, rendered alongside the reorder widget (two-column on ≥md, stacked on mobile).

- Dark surface card, 3px left border `#0ea5e9`.
- Title: "Next RTD Workshop" · Body: "November 2025 · Cape Town\nMilnerton / Blouberg"
- CTA: "Reserve Your Seat →" → `https://capetownpeptideclub.co.za?utm_source=tracker&utm_medium=dashboard&utm_campaign=club_event`

## 8. Meta tags

Edit `index.html`, `src/components/seo/SEOHead.tsx`, `src/components/seo/JsonLd.tsx`, `public/sitemap.xml` if relevant:

- Remove all Germany / DE / Johannesburg references.
- Geo: `geo.region = ZA-WC`, `geo.placename = Cape Town`, `geo.position = -33.9249;18.4241`, `ICBM = -33.9249, 18.4241`.
- `<meta name="description">` and og/twitter description → "Free peptide protocol tracker for South African researchers. Dose logging, bloodwork integration, monthly Q&As. Built by Ride The Tide, Cape Town."
- Update LandingFooter tagline "Serving researchers in Germany 🇩🇪 & South Africa 🇿🇦" → "Built in Cape Town 🇿🇦".
- Update Organization JSON-LD address to Cape Town.

## Out of scope (untouched per instruction)

Capacitor config, i18n setup, Supabase config, route structure, auth system, tracker features.

## Memory updates after build

- Remove/supersede `hard-paywall`, `payment-provider-tagadapay`, `premium-tier-allowed`, `access-model` memories.
- Reinstate Core rule: "Free-access model; no paywalls, no premium tiers."
- Add memory: "Cross-property: ridethetide.site (store), capetownpeptideclub.co.za (events). Floating WhatsApp FAB sitewide."

---

## One question before I build

**WhatsApp number** — you wrote `[YOUR_NUMBER]` literally. Should I (a) bake in a real number you give me now, or (b) ship the literal `[YOUR_NUMBER]` placeholder everywhere so you can find-and-replace later? If (a), please paste the number in international format without `+` (e.g. `27821234567`).
