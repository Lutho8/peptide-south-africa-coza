

## Plan: Quick example row + U-40/U-100 syringe selector

Two enhancements to `src/components/doses/InsulinNeedleGuide.tsx` to make unit conversions clearer and support both common insulin syringe types.

### 1. Syringe type selector (U-40 vs U-100)

Add a small toggle at the top of the guide so users can switch between the two standard insulin syringe markings. All downstream calculations recompute automatically.

- Promote the `syringeType: 'U-40' | 'U-100'` state to the top-level `InsulinNeedleGuide` component (so both the "current dose" panel and the dynamic calculator share it).
- Replace the constant `U40_UNITS_PER_ML = 40` with a derived `unitsPerMl = syringeType === 'U-40' ? 40 : 100`.
- UI: a 2-button segmented toggle (styled like the existing `UnitToggle` pattern) placed right under the header inside the expanded section:
  - `[ U-40 ]  [ U-100 ]` — primary fill on the active option, ghost on the other.
  - Small helper text underneath: *"Pick the syringe type printed on your barrel."*
- Update the header label and all "U-40 units" copy to use the active type dynamically (e.g. `"{syringeType} Syringe Dosage Guide"`, `"1 mg = X {syringeType} units"`, `"1 {syringeType} unit = Y mg"`, `"{syringeType} Units"` table column).
- The big "Your current dose" result card relabels to the chosen type and recomputes `units = volumeNeededMl * unitsPerMl`.

### 2. Quick example row for 0.25 / 0.5 / 1 / 2 mg

The dynamic calculator already renders a presets table — but the current 10mg/2mL default values aren't surfaced as a prominent **"Quick reference"** card outside the calculator. Add a compact, always-visible quick-reference strip just under the concentration info box so users see the four key conversions at a glance without expanding the calculator.

- New section: **"Quick reference (current vial settings)"**
- Renders a 4-column grid (responsive: 2-col on narrow screens) of pill-style cards, one per preset mg value `[0.25, 0.5, 1, 2]`:

  ```text
  ┌──────────┬──────────┬──────────┬──────────┐
  │  0.25 mg │  0.5 mg  │   1 mg   │   2 mg   │
  │  X units │  X units │  X units │  X units │
  └──────────┴──────────┴──────────┴──────────┘
  ```

- Each card: top line = dose in mg (muted), big middle line = units (primary color, bold), tiny bottom line = volume in mL.
- Recalculates on every syringe-type change and reflects the active vial concentration (uses `activeConcentrationMgPerMl` and the active `unitsPerMl`).
- Keeps the existing detailed presets table inside the dynamic calculator as the "expanded" view.

### Files touched

```text
src/components/doses/InsulinNeedleGuide.tsx   ← syringe selector, quick-reference strip, dynamic re-labeling
```

No new dependencies. No DB changes. Reuses existing `Button`/styling patterns and the current calculator structure.

