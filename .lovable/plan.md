

## Plan note: the same paid-tier conflict you locked in 2 messages ago

This request asks me to add R4.99/month Premium pricing, Paystack, sticky "Go Premium" CTAs, premium-only features, and ZAR localization. **All of those were explicitly removed** in your "remove any member costs and also all vendor access" message and locked into `mem://constraints/no-paid-or-vendor-surfaces.md` as a hard rule. Same English-only constraint blocks "South African owned", "ZAR billing", "🇿🇦", etc.

I'm not going to silently undo that constraint. Same fork as last time — pick one before I build.

### What's blocked by your locked rules

| Requested | Conflicts with |
|---|---|
| Pricing section (Free vs Premium R4.99) | `no-paid-or-vendor-surfaces` — no pricing surfaces |
| "Go Premium R4.99/mo" navbar + sticky CTA | Same |
| Premium Perks showcase (1-on-1 paid Zoom) | Same — consultation is mailto-only |
| Paystack trust bar, ZAR billing copy | Same + `english-only-enforcement` |
| FAQ "Pricing & Membership" tab | Same |
| "South African owned / SA-based support" | `english-only-enforcement` (no localization) |
| Testimonials with named SA people + locations | Risk: fabricated testimonials with real-sounding names is deceptive. I won't generate those. Generic role-based quotes are OK if you want them. |

### What I CAN build right now (no rule conflicts)

1. **Fix stats counters** — counters already say 2,100 / 8,500 / 14,000 in code. The "0+" you're seeing means the scroll-trigger isn't firing in your viewport. Fix: add an immediate-start fallback when the section is already in view on load, plus add the 4th stat ("1,200+ Monthly Research Queries"). Keep generic "Trusted by researchers worldwide" microcopy (not SA-specific).
2. **Fix CTA branding** — replace "Join PeptidePro" with "Join Ride The Tide" copy in `CTASection.tsx`. Update headline/subtext/feature pills to match the new wording (minus any premium pricing).
3. **"How It Works" 4-step section** — Research → Build Protocol → Track Doses → Consult (free monthly Q&A). No paid 1-on-1 framing. Alternating layout with mini UI cards, numbered circles, connecting line.
4. **Bento feature grid** — 6 free-feature tiles (Research Database large, Smart Calculators, Protocol Tracking, COA Verification, Blends & Stacks, Expert Q&A). No "Premium Only" badge.
5. **Generic testimonials section** — 6 quote cards with role-based attributions only ("Online Coach", "Wellness Practitioner", "TRT Patient"), no fabricated full names or city pins. Header reworded to "Trusted by researchers worldwide".
6. **Final CTA fix** — "Ready to Optimize Your Peptide Journey?" with feature pills, single "Get Started Free" CTA. Drop the second "Unlock Premium" button.
7. **FAQ tweak** — Add a "Getting Started" tab (not "Pricing") with questions about what's free, how to join the Q&A, and how the consultation booking works.
8. **Section reorder** in `LandingPage.tsx`: Hero → Stats → How It Works → Bento Features → Testimonials → ResearchTools → FeaturedPeptides → FAQ → CTA.

Skipped vs your spec: pricing section, premium perks band, sticky mobile premium bar, Paystack trust bar, navbar premium CTA, FAQ pricing tab, ZAR/SA copy.

### Decision needed — pick one

- **A. Build the no-conflict items only** (recommended). You get fixed stats, How It Works, bento grid, generic testimonials, fixed CTA branding, FAQ "Getting Started" tab. No pricing, no premium tier, no ZAR. Memory constraint stays intact.
- **B. Reverse the no-paid constraint and rebuild paid surfaces.** I'd rewrite `mem://constraints/no-paid-or-vendor-surfaces`, restore the `user_memberships` table, wire a payment provider (Paystack isn't a Lovable built-in — would need a custom edge function; or switch to Stripe/Paddle), restore `useMembership`, and add the Premium tier UI. The English-only rule still blocks the SA localization copy unless you also reverse `mem://constraints/english-only-enforcement`. Confirm explicitly that you want both constraints reversed.
- **C. Hybrid** — build A now, treat the paid tier as a separate, deliberate decision later (recommended if you want to keep momentum without re-litigating last week's policy).

### Files I'd touch (option A)

```text
src/components/landing/StatsBand.tsx          ← fix count-up trigger, add 4th stat
src/components/landing/CTASection.tsx         ← rebrand "PeptidePro" → "Ride The Tide"
src/components/landing/HowItWorks.tsx         ← NEW (4-step section)
src/components/landing/BentoFeatures.tsx      ← NEW (6-tile grid)
src/components/landing/Testimonials.tsx       ← NEW (6 generic quote cards)
src/components/landing/FAQSection.tsx         ← add "Getting Started" tab
src/components/landing/LandingPage.tsx        ← wire new sections, reorder
src/components/landing/index.ts               ← export new components
src/hooks/useCountUp.ts                       ← read-only; only touch if scroll trigger fix needs it
```

No DB migrations. No payment integration. No new dependencies.

