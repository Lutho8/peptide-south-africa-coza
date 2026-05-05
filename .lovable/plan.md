## Goal

Let users correct dose amount and unit on previously logged daily doses (e.g. fix a microdose mistake where 0.25 mg was logged instead of 2.5 mg). Time/notes editing already works — this extends the same edit flow.

## Changes

### 1. `src/hooks/useDailyDoses.ts`
- Widen `updateDose`'s `updates` type from `Pick<…, 'time' | 'notes'>` to also include `dose` and `unit`.
- Pass `dose` and `unit` through to the Supabase `.update({ … })` call when present.
- Mirror the same fields into local state and localStorage.

### 2. `src/components/doses/EditDoseModal.tsx`
- Add `dose` (number) and `unit` (`'mg' | 'IU' | 'units'`) state, initialized from the incoming dose.
- Add two new fields above the existing Time field:
  - **Dose amount** — numeric `Input` (`type="number"`, `step="0.01"`, `min="0"`), with the unit selector inline.
  - **Unit** — small `Select` (mg / IU / units) styled to match.
- Validate: dose must be `> 0`; show inline error and disable Save if invalid.
- Show a subtle "Original: {original dose} {original unit}" hint under the field whenever the value differs, so users see what they're changing.
- Pass `dose` and `unit` in the `onSave` payload (alongside time/notes).
- Reorder dialog title/sections slightly so "Dose" sits at the top — the most common reason to edit.

### 3. `src/screens/DailyLogScreen.tsx`
- Update `handleEditSave` signature to accept `{ time?; notes?; dose?; unit? }` and forward to `updateDose` (no other logic changes — toast + error handling already in place).
- The existing pencil-icon trigger (line 397) already opens the modal for any dose row, so no list UI changes are needed.

## Out of scope
- Editing peptide name / peptide_id (changing which compound was taken is effectively a delete + re-add; keeping it locked prevents accidental data corruption in cycle/adherence reports).
- Editing the date (same reason — would shift the entry across daily aggregates).
- Bulk edits.
