

## Plan: Reverse English-only rule + add ZAR/SA copy on top of the Premium tier

You're explicitly reversing the English-only constraint *for South African localization only* (ZAR currency + SA trust copy). This stacks on top of the previously approved Stripe Premium plan — it doesn't replace it.

### Memory rule reversals

- **Update** `mem://constraints/english-only-enforcement` → narrow the rule. Keep "English copy only, no German/multi-language i18n" but explicitly **allow** South African market localization: ZAR (R) currency display, "South African Owned" trust copy, 🇿🇦 flag, "SA-based support" — all still written in English.
- **Update** `mem://index.md` Core line to reflect the narrowed rule.

### Pricing & currency changes

- **Pricing display in ZAR**: Free **R0/month** · Premium **~~R9.99~~ R4.99/month** or **R49/year** (Save ~17%).
- **Stripe products**: create the product with **two ZAR prices** (monthly R4.99, annual R49.00) instead of USD. Stripe accepts ZAR as a settlement currency for South African Stripe accounts; for non-SA accounts it's still chargeable as a presentment currency. I'll create them as `currency: 'zar'` via the batch product tool after Stripe is enabled.
- `src/lib/billing.ts` → no code change; price IDs are passed through from the pricing component.
- `src/components/landing/PricingSection.tsx` → all price strings render with `R` prefix. Strikethrough `R9.99` → `R4.99`. Annual toggle shows `R49/year` with `Save ~17%` badge.

### Trust bar & SA copy

- `src/components/landing/PricingTrustBar.tsx` → replace the generic 4-pillar bar with the SA version:
  **🔒 Secure Stripe Checkout · 🇿🇦 South African Owned · ✓ Cancel Anytime · 💬 WhatsApp & Email Support**
- `src/components/landing/CTASection.tsx` → append "🇿🇦 Built in South Africa" micro-line under the dual CTAs.
- `src/components/landing/LandingFooter.tsx` → add "Proudly South African 🇿🇦 · Prices in ZAR" line in the footer meta row.
- `src/components/landing/FAQSection.tsx` → in the new **Pricing & Membership** tab add a 5th Q&A: *"Is Ride The Tide a South African company?"* → "Yes — we're a Cape Town-based team. All prices are billed in ZAR through Stripe."

### What does NOT change from the previous Premium plan

- Same Stripe built-in path (no Paystack).
- Same `subscriptions` table migration + `has_active_subscription()` helper.
- Same `useMembership` refactor + Premium-gated 1:1 consultation.
- Same header (`Start Free` / `Go Premium` / `Pricing` link) and PricingSection layout.
- Admin email `lutho.kote@relicom.de` still gets `hasPremium = true` unconditionally.

### Files touched (delta on top of the previously approved Premium plan)

```text
EDIT   src/components/landing/PricingSection.tsx     (R prefix, ZAR amounts)
EDIT   src/components/landing/PricingTrustBar.tsx    (SA 4-pillar copy)
EDIT   src/components/landing/CTASection.tsx         (🇿🇦 micro-line)
EDIT   src/components/landing/LandingFooter.tsx      (SA + ZAR footer line)
EDIT   src/components/landing/FAQSection.tsx         (+1 SA Q&A in Pricing tab)
REWRITE mem://constraints/english-only-enforcement   (narrowed rule)
EDIT   mem://index.md                                (Core line update)
+ Stripe product creation uses currency: 'zar' for both prices
```

### Still NOT doing (explicitly)

- ❌ German or any non-English UI strings — English-only copy rule stays.
- ❌ Browser language auto-detection / multi-locale i18n switcher.
- ❌ Paystack — Stripe (built-in) remains the provider; it processes ZAR fine.
- ❌ Vendor surfaces / finnrick.com — original "no vendor access" still locked.

