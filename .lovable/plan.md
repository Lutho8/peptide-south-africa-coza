

# Safety-Critical Fix: KLOW Dosage Guide Correction

## Problem
The `InsulinNeedleGuide` component hardcodes a default concentration of **2,500 mcg/mL** (based on a generic 5mg vial + 2mL water). When KLOW is selected (80mg vial + 3.0mL water = **26,667 mcg/mL**), the guide shows dangerously incorrect unit values — off by **10x**. The screenshot shows "32 units = 0.800 mL" which is wrong for KLOW.

## Plan

### 1. Add blend-aware concentration lookup
- Update `InsulinNeedleGuide` props to accept an optional `peptideId`
- When a blend is selected, auto-resolve its correct concentration from `peptideBlends.ts` data (e.g., KLOW → 80mg / 3mL = 26,667 mcg/mL)
- Build a small lookup map for known blend concentrations so the guide is always accurate

### 2. Add prominent red safety warning banner
- At the top of the guide (inside the expandable section), show a red `AlertTriangle` banner when a blend peptide is detected
- Text: **"⚠️ SAFETY CORRECTION: Previous dosage values for this blend were incorrect. Always verify concentration based on YOUR reconstitution. The values below use the standard protocol for this blend."**
- Styled with `bg-red-50 border-red-500 text-red-700`

### 3. Add KLOW-specific dosing reference table
- When `peptideId` matches a blend, show the blend's `dosingTable` from `peptideBlends.ts` inline (e.g., 7.5 units = 2mg, 15 units = 4mg, 22.5 units = 6mg)
- This replaces the generic syringe comparison for blends, since blends have pre-calculated unit values

### 4. Add dynamic reconstitution calculator
- Input fields: Total mg in vial (default from blend data), mL BAC water added (default from blend data), syringe type selector
- Auto-calculates and displays:
  - Concentration (mg/mL)
  - 1 unit = X mcg
  - Common dose presets (2mg, 4mg, 6mg) → units to draw
- Updates in real-time as inputs change

### 5. Wire it up in DailyLogScreen
- Pass `peptideId={formData.peptideId}` to `InsulinNeedleGuide` so it can resolve the correct blend concentration automatically
- Remove hardcoded "5mg vial + 2mL BAC water" text when a blend with known reconstitution is selected

## Files to modify
- `src/components/doses/InsulinNeedleGuide.tsx` — Major rewrite: blend detection, safety warning, dosing table, dynamic calculator
- `src/screens/DailyLogScreen.tsx` — Pass `peptideId` prop to guide

## Safety verification
- KLOW at default (80mg / 3mL): 7.5 units = ~2mg ✓, 15 units = ~4mg ✓, 22.5 units = ~6mg ✓
- No reference to "2,500 mcg/mL" or "32 units" will appear for blend peptides

