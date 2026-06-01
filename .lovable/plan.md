# Plan: Rename CTAs + Improve Peptide Search

## 1. Rename CTAs ("Shop Peptides" / "Explore Peptides" → "Buy Peptides")

Replace every user-facing instance of:
- "Shop Peptides" → **"Buy Peptides"**
- "Explore Peptides" → **"Buy Peptides"**

Files to update:
- `src/components/landing/HeroSection.tsx` (primary hero CTA — both copy + style)
- `src/components/landing/CTASection.tsx`
- `src/components/landing/LandingHeader.tsx` (desktop nav + mobile menu)
- `src/components/landing/LandingFooter.tsx`
- `src/pages/Welcome.tsx`
- Any remaining "Explore Peptides" buttons (e.g. in `PeptideCategories.tsx`, `BentoFeatures.tsx`, `FeaturedPeptides.tsx` if present)

All links continue pointing to `https://www.ridethetide.site` with existing UTM params.

## 2. Bold CTA color treatment

The primary "Buy Peptides" buttons currently use the muted primary (#3B82F6). Upgrade the hero + section CTAs to a bold, attention-grabbing treatment:
- Gradient: `from-orange-500 via-pink-500 to-primary` (warm-to-brand sweep) with white text
- Stronger shadow + subtle scale-on-hover
- Keep secondary/nav links as standard outline/ghost (don't over-shout)

Applied to: hero CTA, CTASection main CTA, footer "Buy Peptides" link, and the standalone "Buy Peptides" button in the landing header.

## 3. Search improvements (`PeptideSearch.tsx` + `PeptidesScreen.tsx`)

Current problem: typing "Tesa" doesn't reliably surface **Tesamorelin**, and results feel sparse.

Fixes in `src/components/landing/PeptideSearch.tsx`:
- **Add alias/synonym matching**: build a lookup of common aliases (e.g. `tesa` → Tesamorelin, `bpc` → BPC-157, `tirz` → Tirzepatide, `sema` → Semaglutide, `ghk` → GHK-Cu, `mots` → MOTS-c, `ipa` → Ipamorelin, `cjc` → CJC-1295, `reta` → Retatrutide, `klow` → KLOW blend, etc.)
- **Broaden scored fields**: also match against `category`, `goalTags`, `aliases` (new), and the first 120 chars of `description` — not just name + mechanism
- **Lower fuzzy threshold**: current "all chars in order" returns 20; add a typo-tolerant Levenshtein-1 match for short queries (≥3 chars) so "Tesa", "Tesm", "Tezamorelin" all hit Tesamorelin
- **Prefix boost**: anything whose name OR shortName OR alias starts with the query gets +60 (so "tesa" → Tesamorelin lands at top)
- **Show more results**: raise cap from 12 → 20 when a query is present
- **Empty-state suggestions**: when no query, show 6 popular peptides (Tesamorelin, BPC-157, Semaglutide, Retatrutide, GHK-Cu, Ipamorelin) as clickable chips instead of just recents

Fixes in `src/screens/PeptidesScreen.tsx` (the "Browse" tab):
- Same alias-aware search applied to the in-page search input
- Match against `shortName`, `name`, `category`, `mechanism`, `benefits`, and aliases
- Show result count + a "Clear filters" affordance when filters return nothing

## 4. Add alias data

New file `src/data/peptideAliases.ts` exporting:
```ts
export const peptideAliases: Record<string, string[]> = {
  'tesamorelin': ['tesa', 'tesm', 'egrifta'],
  'bpc-157': ['bpc', 'bpc157', 'pentadeca'],
  'semaglutide': ['sema', 'ozempic', 'wegovy'],
  // ...20+ entries
};
```
Imported by both PeptideSearch and PeptidesScreen.

## Out of scope
- Backend, auth, routes, Capacitor, tracker features
- DNS/SSL on apex shop domain
- Memory updates (already current)

## Technical notes
- All color treatments use semantic Tailwind tokens; the new gradient uses existing palette stops, no new tokens needed
- No new dependencies; Levenshtein is ~15 lines inline
- Search remains fully client-side