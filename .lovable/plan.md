# Dosage Calculator: Validation, Manual Overrides, and Presets

All work happens in `src/screens/DosageScreen.tsx` plus a small extension to `src/services/storage.ts` for the new presets store.

## 1. Syringe-mismatch validation and clearer errors

Goal: warn the user when their inputs would push the dose into a part of the syringe that is impractical (too few units to draw accurately, or more units than the syringe holds). This protects the units-per-mg result.

Add a derived `validation` object next to the existing calculations (around line 180):

- `concentrationMgPerMl <= 0` → "Enter a vial size and BAC water amount to calculate."
- `targetMg <= 0` → info: "Enter a target dose to see units."
- `syringeUnits > selectedSyringe.unitsPerMl` (i.e. > 1 mL) → error: "This dose needs {x} units on a {label} syringe (max {unitsPerMl}). Add more BAC water, choose a higher-capacity syringe (e.g. U-100), or split the dose."
- `syringeUnits > 0 && syringeUnits < 2` → warning: "Only {x} units on a {label} syringe — hard to draw accurately. Use less BAC water or a U-100 syringe."
- Mismatched magnitude: when the chosen target dose is > vial size, error: "Target dose ({targetMg} mg) is larger than the entire vial ({vialMg} mg)."
- Optional sanity hint when concentration is extreme (`concentrationMgPerMl > 20` or `< 0.1`): suggest adjusting BAC water.

Render these as a small stack of `Alert` blocks just above the Verification Badge (after line 479), styled with the existing destructive / yellow / muted variants. Replace the current ad-hoc "✓ Calculation verified" / "⚠ Precision warning" with the same component family so messages are consistent.

## 2. Decouple Quick-Fill from manual overrides

Today, picking a peptide auto-fills vial mg, BAC water, target dose, and any later edit silently differs from the "selected" peptide. We want the user to keep their selection while editing.

Changes:

- Keep `selectedPeptideForCalc` / `selectedBlendForCalc` as-is, but **do not clear them** when the user edits Vial Size, BAC Water, or Target Dose. (No code change needed — those inputs already use independent state.)
- Track `manualOverride: boolean` derived from comparing current `vialSize` / `bacWater` / `targetDose` to the values that would be applied by the current selection (use `PEPTIDE_VIAL_DEFAULTS` / blend `vialSize` & `quickstart.reconstitute` / parsed dose).
- When `manualOverride` is true, show a small inline pill under the Quick-Fill Select: "Using custom values for {selectedName}" with a "Reset to defaults" button that re-runs `handlePeptideSelect(selectedPeptideForCalc)` or `handleBlendSelect(selectedBlendForCalc)`.
- Selecting the same peptide again should always re-apply defaults (current behavior).

## 3. Reusable dosage presets

Let the user save the current `{ peptideId | blendId, vialSize, bacWater, syringeType, targetDose, name }` as a named preset, then load it later with one tap.

### Storage (`src/services/storage.ts`)

Add a new store next to the others:

```ts
export interface DosagePreset {
  id: string;
  name: string;            // user-supplied; defaults to peptide/blend name
  peptideId?: string;
  blendId?: string;
  vialSize: string;
  bacWater: string;
  targetDose: string;
  syringeType: 'u100' | 'u40' | 'u50';
  createdAt: string;
}

export function getDosagePresets(): DosagePreset[];
export function saveDosagePreset(preset: DosagePreset): void; // upsert by id
export function deleteDosagePreset(id: string): void;
```

Use the same `STORAGE_KEYS` / namespacing pattern as the other helpers (`peptide_app_dosage_presets`).

### UI (`DosageScreen.tsx`)

Add a "Presets" row directly under the Quick-Fill Select:

- A horizontally scrollable list of preset chips. Each chip shows the preset name + small mg/mL caption. Tap = load all five fields. Long-press / `×` icon = delete (with confirm toast).
- A "Save current as preset" button (uses the existing `Save` icon). Opens a tiny inline input (or `prompt`-style modal — match the simple style of `EditDoseModal`) to capture a name; pre-fills with the selected peptide/blend `shortName` or "Custom preset".
- Loading a preset sets `vialSize`, `bacWater`, `targetDose`, `syringeType`, and the appropriate `selectedPeptideForCalc` or `selectedBlendForCalc`. After loading, `manualOverride` (from §2) is false because values match.

### Cloud sync (optional, follow-up)

Out of scope for this change. Presets are local-first; we can add a `dosage_presets` table and extend `useCloudSync` later if the user asks.

## Out of scope

- No changes to `ReconstitutionCalculator.tsx` (landing-page version).
- No new schemas in Supabase.
- No changes to the Dosing Schedule section below the calculator.
