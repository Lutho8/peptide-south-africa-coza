# Plan: Tests, Consistent Conversion Display, and Peptide Catalog Expansion

Three independent tracks. Each is shippable on its own.

---

## Track 1 — Unit tests for dose math

Lock in the math so future edits to `RecommendedDoseDisplay` and `InsulinNeedleGuide` can't silently regress.

**New files**
- `src/components/dosage/__tests__/RecommendedDoseDisplay.test.tsx`
- `src/lib/__tests__/doseMath.test.ts`

**Refactor** (small, no behavior change)
- Extract pure helpers from `RecommendedDoseDisplay.tsx` into `src/lib/doseMath.ts`:
  - `parseDose(s)` → `{ value, unit } | null`
  - `resolveConcentration(peptideId)` → `{ mgPerMl, source } | null`
  - `convertDose({ value, unit, mgPerMl, syringe })` → `{ mg, mL, units }`
  - `unitsPerMl(syringe)` → 40 | 100
- Component imports from the new module.

**Test cases (≥18)**
- parseDose: `"0.5 mL"`, `"0.25ml"`, `"2 mg"`, `"5 IU"`, `"10 units"`, `"15 u"`, `"abc"`, `""`, `"-1 mg"`.
- mg ↔ mL with KLOW concentration (80 mg / 3 mL): 0.5 mL → 13.33 mg; 5 mg → 0.1875 mL.
- U-40 vs U-100 conversion: 0.5 mL → 20 U-40, 50 U-100.
- Fallback concentration (5 mg/mL) when no blend match.
- IU/units doses skip enrichment (return null from component).
- Snapshot of rendered enriched line for KLOW 0.5 mL.

---

## Track 2 — Consistent mg + syringe-units display

Reuse one component everywhere a recommended/typical dose is shown.

**Surfaces to update**
1. `src/components/landing/ReconstitutionCalculator.tsx` — under the calculated result, render `<RecommendedDoseDisplay>` for the selected peptide's typical dose.
2. `src/components/modals/PeptideDetailModal.tsx` — replace the plain dose text in the dosing tier rows (beginner/intermediate/advanced/athlete) with `<RecommendedDoseDisplay>`.
3. `src/components/doses/InsulinNeedleGuide.tsx` — already shows U-40/U-100 math. Add a single header line `<RecommendedDoseDisplay>` for the user's current dose so wording is identical to other surfaces. No change to the existing calculator/quick-reference tables.

**Component change**
- Extend `RecommendedDoseDisplay` with optional `syringe?: 'U-40' | 'U-100'` prop (default `'U-40'`). Output adapts: `≈ X mg • Y units (U-40)`.

No data model changes. No business-logic changes outside presentation.

---

## Track 3 — Peptide catalog expansion from uploaded PDF

### 3a. Add new peptides (skip duplicates)

Cross-checked against existing IDs. **New entries** to add to `src/data/peptidesExpanded.ts` (each with name, shortName, category, mechanism, benefits, risks, dosing tiers, frequency, expectedResults, cycleProtocol — same shape as existing peptides):

Gonadorelin, ACE-031, AICAR, Adipotide, NA-Selank Amidate, NA-Semax Amidate, TB-500 Frag, MGF, PEG-MGF, Thymalin, Melatonin, HGH Fragment 176-191, Dermorphin, Glutathione, HMG, EPO, Ara-290, Alprostadil, Survodutide, Adamax, PE 22-28, N-Acetyl Epitalon Amidate, Vilon, Pinealon, PNC-27, Testagen, Teriparatide, Bronchogen, Cardiogen, Cortagen, Livagen, Pancragen, Prostamax, Cartalax, Chonluten, Crystagen, Ovagen, Vesugen.

**Skipped (already in catalog):** HGH, MT-1/2, PT-141, DSIP, Selank, Oxytocin, Epitalon, BPC-157, BPC+TB blend, Semax, Semaglutide, SS-31, Tirzepatide, GHRP-2/6, CJC-1295 ±DAC, CJC+IPA, TB-500, Sermorelin, HCG, AOD9604, IGF-1LR3, Tesamorelin, Ipamorelin, Hexarelin, GHK-CU, AHK-CU, Kisspeptin-10, Thymosin Alpha-1, MOTS-c, FOXO4, LL-37, Retatrutide, Cagrilintide, Mazdutide, NAD+, KPV, VIP, P21, Humanin, Cerebrolysin, SNAP-8, KLOW, Glow, BPC+GHK+TB stack.

**Skipped (not a peptide):** Botulinum toxin, Bac. Water, Hyaluronic Acid.

### 3b. Vial-size variants

PDF lists multiple vial sizes per peptide (e.g. Retatrutide 5/10/15/20/30/50/60 mg). Add a `vialSizesMg: number[]` field on `Peptide` (optional, defaults to single size from existing data so nothing breaks).

Peptides getting variants (existing + new):
- Retatrutide: [5,10,15,20,30,50,60]
- Tirzepatide: [5,10,15,20,30,40,45,60,100]
- Semaglutide: [2,5,10,15,20,30]
- BPC-157: [2,5,10,20]
- Tesamorelin: [2,5,10,20]
- Ipamorelin: [2,5,10]
- Sermorelin: [2,5,10]
- Selank: [5,10,30]
- Epitalon: [10,40,50]
- DSIP: [2,5,10,15]
- Oxytocin: [2,5,10]
- AOD9604: [2,5,10]
- Cagrilintide: [5,10,20]
- Mazdutide: [5,10]
- NAD+: [100,500,1000]
- HGH Fragment 176-191: [2,5,10]
- SS-31: [10,50]
- (others: single size)

### 3c. UI: vial-size selector

- New `src/components/peptide/VialSizeSelector.tsx` — segmented control rendering buttons for each `vialSizesMg`. Persists per-peptide selection in `localStorage` (`vialSize:<peptideId>`).
- Hook `useSelectedVialSize(peptideId)` returns the active mg.
- `RecommendedDoseDisplay` and `InsulinNeedleGuide` resolve concentration using the user-selected vial size when available; otherwise fall back to existing logic.
- Render selector inside:
  - Peptide Detail Modal (above the dosing tiers)
  - My Stack edit row for that peptide
  - Dosage screen schedule card header
  - Reconstitution Calculator (replaces the manual mg input default)

### 3d. Surface coverage

Verify each new peptide appears in:
- Peptide browse catalog (`PeptidesScreen`) — automatic via `peptidesExpanded`.
- Blends & Stacks selectors — automatic via `getAllSelectablePeptides()`.
- My Stack add modal — automatic.
- Stack Optimizer — automatic.
- Dosage / Reconstitution Calculator — works once `vialSizesMg` is populated.

### 3e. Research references

Append 1–2 PubMed/preprint references per new peptide to `src/data/researchReferences.ts`. For peptides with no recent peer-reviewed work (e.g. Khavinson short peptides — Vilon, Cortagen, etc.), cite the foundational Khavinson lab review papers and mark as `evidenceLevel: 'preliminary'`.

---

## Order of execution

1. Track 1 (tests + extract pure helpers) — lowest risk, locks behavior.
2. Track 2 (consistent display) — touches 3 files, uses Track 1's helpers.
3. Track 3 (catalog + variants) — largest; ship 3a first, then 3b/3c, then 3d/3e.

## Out of scope

- No price, supplier, or stock data (per request).
- No new blends beyond what's in the PDF that we already have.
- No changes to cycle math, reminders, or sync logic.
