## Context

In the previous turn I shipped three goal pages: `weight-loss-peptides-south-africa`, `healing-peptides-south-africa`, and `longevity-peptides-south-africa`. Your new request keeps the first two slugs but changes peptide selections and replaces longevity with **anti-aging**. Plan below adjusts in place — no duplicate files.

## Changes

**1. `/weight-loss-peptides-south-africa`** — edit `src/pages/goals/WeightLossPeptidesSA.tsx`
- Update card set to exactly: `retatrutide`, `tirzepatide`, `motsc`, `semaglutide`
- Remove `aod9604`
- Tighten hero H1 to "Peptides for Weight Loss South Africa"
- Keep existing 3 research paragraphs (already research-framed, SAHPRA disclaimer)

**2. `/healing-peptides-south-africa`** — edit `src/pages/goals/HealingPeptidesSA.tsx`
- Update card set to exactly: `bpc157`, `tb500`, `ghkcu`
- Remove `ss31`
- Tighten hero H1 to "Peptides for Healing South Africa"
- Trim research paragraphs to drop the SS-31 section, keep BPC-157 + TB-500 + GHK-Cu coverage

**3. NEW `/anti-aging-peptides-south-africa`** — create `src/pages/goals/AntiAgingPeptidesSA.tsx`
- Hero H1: "Anti-Aging Peptides South Africa"
- Cards: `epitalon`, `ghkcu`, `ta1` (Thymosin Alpha-1 — confirmed in catalog at `src/data/peptides.ts`)
- 3 research-framed paragraphs covering: telomere/pineal axis (Epitalon), gene expression + collagen/copper (GHK-Cu), immune senescence + T-cell maturation (Thymosin Alpha-1)
- SA disclaimer block + standard research disclaimer

**4. Remove the longevity page** — delete `src/pages/goals/LongevityPeptidesSA.tsx`, remove its route from `src/App.tsx`, remove its sitemap entry. (You didn't ask for it; replaced by anti-aging.)

**5. Wire routes** — `src/App.tsx`
- Add `AntiAgingPeptidesSA` lazy import
- Replace longevity `<Route>` with the anti-aging route

**6. Sitemap** — `scripts/generate-sitemap.ts`
- Replace `/longevity-peptides-south-africa` entry with `/anti-aging-peptides-south-africa`
- Confirm weight-loss and healing entries remain (priority 0.9, monthly)
- Sitemap regenerates on next `predev`/`prebuild`

## Files touched

- edit `src/pages/goals/WeightLossPeptidesSA.tsx`
- edit `src/pages/goals/HealingPeptidesSA.tsx`
- create `src/pages/goals/AntiAgingPeptidesSA.tsx`
- delete `src/pages/goals/LongevityPeptidesSA.tsx`
- edit `src/App.tsx`
- edit `scripts/generate-sitemap.ts`

## Out of scope (call out only)

The app still uses `HashRouter`, so these URLs resolve as `/#/weight-loss-peptides-south-africa`. Google indexes hash routes poorly. Same caveat as last turn — not addressed in this plan; flag a separate ticket if you want me to migrate to `BrowserRouter`.
