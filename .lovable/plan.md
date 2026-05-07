## Goal

Remove the first paywall splash screen shown to new visitors and replace the hero messaging with positioning targeted at South African peptide users.

## Changes

### 1. Skip the PaywallScreen on first load

`src/pages/Index.tsx` (line 206–212) currently shows `<PaywallScreen />` to any unauthenticated visitor unless they've tapped "Browse Free". Change this so unauthenticated users land directly on `<LandingPage />` — no paywall splash, no minimal signup-only screen.

```tsx
if (!user) {
  return (
    <Suspense fallback={...}>
      <LandingPage />
    </Suspense>
  );
}
```

`PaywallScreen.tsx` stays in the codebase (still used by Premium upgrade flows / `useSubscription`), but is no longer the entry point.

### 2. Rewrite the Hero section

`src/components/landing/HeroSection.tsx` — replace headline, subhead, social-proof copy.

**New eyebrow chip:** `Built for South African peptide users`

**New H1:** `Are You Still Guessing Your Peptide Doses?`
(keep the gradient styling on the word "Guessing")

**Lede paragraph:**
> Most South Africans using peptides track their protocols in a notes app, spreadsheet, or worse — their memory. The result? Inconsistent cycles, missed doses, and zero insight into what's actually working.

**Positioning block** (new, sits below the lede, above the CTAs) — heading + 4 bullets:

> **RideTheTide is the first protocol tracker built for the South African peptide user.**
> - Log every dose with proper unit conversions (mcg, mg, IU)
> - Track cycles for BPC-157, TB-500, CJC-1295, Ipamorelin, and 20+ peptides
> - Set protocol reminders so you never miss a dose
> - Monitor progress markers (recovery, sleep, energy, body comp)

Bullets render as a clean check-list (Lucide `Check` icon in primary color, `text-sm`, `space-y-2`), wrapped in a subtle bordered card to anchor the section visually.

**CTAs:** unchanged buttons, just relabel primary to `Start Tracking Free` (still triggers `handleQnaCta` → existing premium flow). Secondary stays `Explore peptides`.

**Social-proof pills:** keep as-is.

### 3. Note on dosing units

The bullet uses `mcg, mg, IU` per user's exact wording. Project memory enforces "no mcg" in the app's actual dosing tools, but this is marketing copy describing what users currently juggle, not a UI dose input — the wording stays.

## Files touched

- `src/pages/Index.tsx` — drop PaywallScreen branch for unauthenticated users
- `src/components/landing/HeroSection.tsx` — new headline, lede, positioning card, CTA label

No backend, no routes, no new components.