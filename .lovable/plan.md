## Problem

The Reconstitution Calculator on the Dosage screen (`src/screens/DosageScreen.tsx`) only offers **blends/stacks** in its "Quick-Fill from Blend/Stack" dropdown. Users can't auto-fill individual compounds like Retatrutide, CJC-1295 No DAC, or Tesamorellin. Also, the current results show total units for the target dose but not the underlying **units-per-mg conversion** that users actually need at the syringe.

## Changes (single file: `src/screens/DosageScreen.tsx`)

### 1. Quick-Fill dropdown now lists individual peptides too

Rename the field to **"Quick-Fill from Peptide / Blend / Stack"** and split the `<SelectContent>` into two groups:

- **Individual Peptides** — every entry in `peptides` (Retatrutide, CJC-1295 No DAC, Tesamorellin, BPC-157, etc.). Icon: `FlaskConical`.
- **Blends & Stacks** — current `allBlends` list. Icon kept as is.

Add `handlePeptideSelect(peptideId)` that auto-fills:
- **Vial size (mg)** — from a small default map per peptide (e.g. Retatrutide → `10`, CJC-1295 No DAC → `5`, Tesamorellin → `10`, BPC-157 → `5`, Semaglutide → `5`). Fallback: `5` when not in the map.
- **BAC water (mL)** — default `2` (clinically common for these vial sizes).
- **Target dose (mg)** — parse `peptide.dosing.beginner` (regex already exists in `ReconstitutionCalculator.tsx` lines 75–86); convert mcg → mg by `/1000`. Fallback: keep current value.
- **Syringe type** — leave user's selection alone (don't override the U-40 preference).

Selecting an individual peptide also clears `selectedBlendForCalc` (and vice versa) so the blend safety banner doesn't show for individual peptides.

### 2. New "1 mg = X units" reference line in results

Below the existing 4-card results grid, add a single highlighted row:

```text
At this concentration: 1 mg = {unitsPerMg} {syringe.label} units
```

Where `unitsPerMg = selectedSyringe.unitsPerMl / concentrationMgPerMl`, formatted to 1 decimal. Worked example for Retatrutide (10mg vial, 2mL BAC, U-40):
- Concentration = 5 mg/mL
- 1 mg = 40 / 5 = **8 units**
- 2 mg target = **16 units** (matches existing `syringeUnits` output)

Hidden when concentration is 0 or invalid.

### 3. Out of scope

- The standalone `src/components/landing/ReconstitutionCalculator.tsx` (different surface, already supports all peptides via its own `<Select>`) — no change.
- Storage of per-peptide vial-size defaults in a new data file. We inline a small map in `DosageScreen.tsx`; if it grows we can extract later.

## Technical notes

- Reuses existing `peptides` import (already in scope at line 3).
- New state piece: `selectedPeptideForCalc: string`. Mirrors `selectedBlendForCalc` and is cleared whenever the other is set.
- No schema, RLS, or backend changes.
