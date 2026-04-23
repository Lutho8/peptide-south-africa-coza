

## Plan note: scope conflicts with rules you locked in last message

Your previous message had me strip every paid surface, delete `user_memberships`, drop PayPal, and write a hard constraint into project memory. This new spec asks me to put **most of that back**, plus add new South-Africa-specific paid surfaces. I'm not going to silently undo work you approved 5 minutes ago — flagging the conflicts so you can decide.

### What conflicts with locked rules

| Requested | Conflicts with |
|---|---|
| "Go Premium — R4.99/mo" navbar CTA | Core: *no paywalls, no €/$ pricing anywhere* |
| Free vs Premium tier comparison band | Constraint: *no paid memberships, no pricing surfaces* |
| Premium upsell in Q&A modal | Constraint: *consultation booking is mailto-only, no payment* |
| "Unlock Premium" sticky bottom bar | Same as above |
| Paystack / Stripe SA payment integration | Constraint: *no paid flows* |
| "1-on-1 Zoom for Premium members" | Constraint: *consultation is free mailto only* |
| ZAR localization (R4.99, SAST, "SA support team") | Core: *English only, no localization* |
| "Add to Home Screen" PWA banner | Already exists (`InstallBanner.tsx`) — not a conflict, just noting |

### What I CAN build from your spec (no conflicts)

1. **New benefit-driven Hero layout** — split layout (text left, phone mockup + floating cards right), stacked on mobile.
2. **New H1 + subheadline** — "Track, Calculate & Optimize Your Peptide Protocols" + research-grade subhead. (Reword to drop "South Africa" per English-only rule, keep generic.)
3. **Dual CTA row** — "Join Free Monthly Q&A" (existing flow) + "Explore Peptides" (scrolls to categories).
4. **Social proof micro-bar** — 98+ peptides / 17 FDA-approved / 22+ citations pills under CTAs.
5. **Phone mockup with floating glassmorphism cards** — Protocol Adherence 92%, Current Weight, Active Protocols. Decorative gradient orb + 5★ rating badge.
6. **Below-fold stats band** — "Thousands of Protocols, Doses, Research Hours — Logged" with 3 animated counters (Protocols Created, Doses Calculated, Research Queries).
7. **"Why Ride The Tide" feature band** (replaces the Free vs Premium block) — 6 free-feature tiles: research database, dose calculator, blends/stacks, COA verification, Q&A access, protocol tracking. All "Free Forever". One CTA: "Start Free".
8. **Hero on-load animation sequence** — navbar fade, H1 stagger, CTA slide-up, phone scale-in, floating cards stagger.
9. **Scroll-triggered counter animation** — reuses existing `useCountUp`.
10. **Glassmorphic navbar on scroll** — backdrop-blur after 50px (already partially present in `LandingHeader`).

### Decision needed

Pick one — I won't proceed until you confirm:

- **A. Build only the no-conflict items** (recommended). You get the new hero, phone mockup, floating cards, stats band, and a Free-tier feature band. No pricing, no premium tier, no ZAR. This stays consistent with the constraint memory you just approved.
- **B. Reverse the no-paid constraint and rebuild the paid surfaces.** I'd update `mem://constraints/no-paid-or-vendor-surfaces` to allow a R4.99/mo SA premium tier, restore a membership table, wire Paystack, and add the localization. This undoes last message's work — confirm explicitly if that's the intent.
- **C. Hybrid**: build the hero + stats now (option A), and you raise the paid-tier decision as a separate, deliberate request later.

### Files I'd touch (option A)

```text
src/components/landing/HeroSection.tsx          ← rewrite (split layout, mockup, cards)
src/components/landing/LandingPage.tsx          ← insert new <StatsBand/> + <WhyFreeBand/>
src/components/landing/StatsBand.tsx            ← NEW (count-up trio)
src/components/landing/WhyFreeBand.tsx          ← NEW (6 free-feature tiles)
src/components/landing/PhoneMockup.tsx          ← NEW (iPhone frame + dashboard SVG)
src/components/landing/FloatingStatCards.tsx    ← NEW (glass cards)
```

No changes to navbar pricing, no Stripe/Paystack, no membership DB, no ZAR strings.

