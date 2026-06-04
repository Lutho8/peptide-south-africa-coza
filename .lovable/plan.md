## Goals

1. **Onboarding surfaces are properly centered and fit mobile** (Welcome, ProfileSetupWizard, DashboardTour, WelcomeGuide / Quick Start, InstallAppStep).
2. **MyStack cycle cards** let the user **edit the start date, pause (with reason), and show missed days** directly — without having to open the full Cycle Management modal.
3. Every **cycle card** (MyStack + CycleManagementModal) shows a compact **Reconstitution & Dosing Reference** for easy reconstitution and cycle management.

No business-logic changes outside cycle data and UI presentation. No paywalls, no schema changes, no backend work.

---

## 1. Mobile centering pass on onboarding surfaces

Audit and fix horizontal/vertical centering and overflow on small viewports (≤ 390 px):

- **`src/pages/Welcome.tsx`** — wrap inner block in `w-full max-w-2xl mx-auto`, drop `text-6xl` on the smallest break so the headline doesn't overflow; reduce hero padding (`py-8 sm:py-12`), ensure CTAs stack with `w-full` inside flex column.
- **`src/components/onboarding/ProfileSetupWizard.tsx`** — `DialogContent` gets `max-w-[calc(100vw-1rem)] sm:max-w-lg mx-auto p-4 sm:p-6 max-h-[90dvh] overflow-y-auto`; goal grid switches to `grid-cols-2` on mobile (currently can produce a third uneven column); step indicator centered with `flex justify-center`.
- **`src/components/onboarding/DashboardTour.tsx`** — clamp tooltip width with `max-w-[min(360px,calc(100vw-1.5rem))]`, center via `left-1/2 -translate-x-1/2` fallback when target is off-screen.
- **`src/components/home/WelcomeGuide.tsx`** — already grid-2, but tighten padding `p-3 sm:p-4`, make CTA stack full-width, and constrain root to `w-full max-w-md mx-auto`.
- **`src/components/onboarding/InstallAppStep.tsx`** — center inner panel, `text-pretty`, give icons `shrink-0`.

No copy or flow changes — just spacing, max-widths, and grid breakpoints.

## 2. MyStack cycle card: edit start, pause with reason, missed-days

In **`src/screens/MyStackScreen.tsx` → `StackItemCard`**, replace the existing two-button row (End / Restart) with a three-button row when a cycle exists:

```
[ Edit & Pause ]  [ End Cycle ]   (active)
[ Resume ]        [ Edit & Pause ] [ End Cycle ]   (break)
```

- "Edit & Pause" toggles the existing **`EditCyclePanel`** inline beneath the progress bar (animated height open/close). On save, the cycle is updated via `updateCycle` and the card re-renders.
- A new chip row under the peptide name shows status detail when present:
  - `Paused — out of peptides` / `Paused — catching up on missed days` / `Paused`
  - `+ Nd missed` badge (amber) when `cycle.missedDays > 0`, regardless of pause state, so active cycles can also surface caught-up gaps.
- Resume from the card calls `updateCycle({ status:'active', resumedAt: today, pauseReason: undefined })`.

`StackItemCard` gains props `onPauseEdit(cycle)` and `onResume(cycle)`; `MyStackScreen` owns the editing-cycle id state and renders `EditCyclePanel` inline inside the card when its id matches. Reuses existing component — no duplication.

Calendar/progress bar already exists; pause state will color the bar amber via the same threshold logic.

## 3. Reconstitution & Dosing Reference inside cycle cards

New compact, read-only component **`src/components/doses/DosingReference.tsx`** that takes `{ peptideId, dose, frequency }` and renders a 3-column mini-panel:

```
┌─────────────────────────────────────────────────┐
│  Vial: 5 mg     BAC: 2 mL     Per dose: 10 U-40 │
│  Concentration: 2.5 mg/mL     Expires: 28 days  │
└─────────────────────────────────────────────────┘
```

- Pulls vial-size + concentration math from existing `src/data/vialSizes.ts`, `src/lib/doseMath.ts`, and `src/data/peptideUnits.ts` (already used by the dosage screen and `RecommendedDoseDisplay`).
- If the peptide is a blend, defers to `findBlendData(peptideId)` and shows blend concentration (e.g. KLOW 80 mg/3 mL → reference row pulled from `blend-aware dosing tools` memory).
- Units strictly mg / IU / U-40 — never mcg.
- Includes a tiny "View full reconstitution guide →" link that opens the existing 6-step animated guide (route already wired via `InsulinNeedleGuide.tsx` / Reconstitution UX).

Mounted in two places:
- **`StackItemCard`** inside `CollapsibleContent`, above the existing "Expected Results" / "Protocol Overview" block.
- **`CycleManagementModal`** active cycles list, inside each cycle's `GradientCard`, beneath the title row and above the action buttons.

Purely presentational — no new storage fields, no migrations.

---

## Files

**Edited**
- `src/pages/Welcome.tsx`
- `src/components/onboarding/ProfileSetupWizard.tsx`
- `src/components/onboarding/DashboardTour.tsx`
- `src/components/onboarding/InstallAppStep.tsx`
- `src/components/home/WelcomeGuide.tsx`
- `src/screens/MyStackScreen.tsx` (StackItemCard + parent)
- `src/components/modals/CycleManagementModal.tsx` (mount DosingReference; keep existing pause flow)

**Created**
- `src/components/doses/DosingReference.tsx`

## Out of scope

- No changes to auth, backend, RLS, paywalls, or membership.
- No reordering of MyStack screen sections.
- No new analytics events.
- No alterations to dose-reminder scheduling beyond rendering the reference text.
- No copy changes to onboarding wording — only layout / spacing fixes.
