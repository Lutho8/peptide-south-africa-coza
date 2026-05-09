## Goal

In the **Dosage tab → Dosing Schedule → Recommended Dose** cell, when a peptide's recommended dose is expressed in mL (e.g. KLOW shows `0.5ml`), also display the equivalent **mg** and **U-40 syringe units** so the user can draw the correct amount confidently.

Example for KLOW (80 mg / 3 mL ≈ 26.67 mg/mL):

```
Recommended Dose (intermediate)
0.5 mL  ≈ 13.3 mg  •  20 units (U-40)
```

## Scope

Frontend / presentation only. No data model or business-logic changes.

## Files

**Modified**
- `src/screens/DosageScreen.tsx` — enrich the "Recommended Dose" cell (lines ~776–779).

**New**
- `src/components/dosage/RecommendedDoseDisplay.tsx` — small presentational component that takes the raw dose string + peptide id and renders the enriched line.

## Behavior rules

1. **Parse the dose string** (`peptide.dosing[experienceLevel]`) for the first numeric value and unit (`ml`, `mg`, `iu`, `units`, `u`).
2. **Resolve concentration** in mg/mL:
   - If `findBlendData(peptideId)` returns a blend → use `vialSize` mg ÷ reconstitute mL (KLOW = 80/3, etc.).
   - Else if the peptide has a known vial+BAC standard (10 mg / 2 mL → 5 mg/mL) use that as a documented fallback.
   - If no concentration can be resolved, show the original string only (no enrichment).
3. **Compute and show** (when concentration is known):
   - mL input → `mg = mL × concentration`, `units = mL × 100` for U-100 and `mL × 40` for U-40. Show **U-40 units** as the primary callout (per project standard), with mg.
   - mg input → `mL = mg / concentration`, then U-40 units.
   - IU / units inputs → show as-is, no conversion (those aren't volumetric).
4. Render format (single line, wraps on small screens):
   `<original> ≈ <mg> mg • <units> units (U-40)`
   Use `text-primary` for the original value, `text-muted-foreground` for the conversion suffix.
5. Add a tiny `Info` tooltip explaining the assumed reconstitution (e.g. "Based on 80 mg vial + 3 mL BAC water = 26.7 mg/mL").

## Non-goals

- Don't change the dose strings stored in `src/data/peptides.ts` / `peptideBlends.ts`.
- Don't touch `InsulinNeedleGuide`, `ReconstitutionCalculator`, or any other surface — only the Dosage tab schedule card.
- No mcg anywhere (project rule).
