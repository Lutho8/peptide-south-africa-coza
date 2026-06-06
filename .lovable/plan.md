## 1. TS2307 shim verification

`src/vite-env.d.ts` now declares `@revenuecat/purchases-capacitor` with the `LOG_LEVEL` const and the `Purchases` object (`setLogLevel`, `configure`, `logIn`, `getOfferings`, `purchasePackage`, `restorePurchases`, `getCustomerInfo`) — exactly the surface used by `src/lib/revenuecat.ts`. That resolves TS2307 at all five call sites without pulling the native-only package into the web bundle.

In build mode I'll run `tsc --noEmit` (via the harness build) to confirm no new type errors are introduced — specifically watching for: implicit-any on the `unknown`-typed returns inside `revenuecat.ts`, and any incidental Variants/EaseDef regressions touched in earlier passes. If a downstream `.then((res) => …)` complains about `unknown`, I'll narrow with a small inline type assertion at the call site (no behavior change).

## 2. Cycle counting driven by daily-log entries

### Current behavior (the bug)
`getCycleProgress` in `src/screens/MyStackScreen.tsx` and `getDaysElapsed` in `src/services/cycleNotifications.ts` both compute elapsed days as wall-clock `floor((now - startDate) / 1day)`. A missed day still advances the cycle. Weekly peptides (e.g. Reta) are counted exactly like daily ones (e.g. Tesa).

### New behavior
Cycle "day count" = number of **expected dose occurrences** that the user has actually logged in `daily_doses` for that peptide, between `cycle.startDate` and today.

- For a **daily** peptide: count = distinct logged dates with a dose for that peptide.
- For a **weekly / Nx-per-week** peptide: count = number of logged doses for that peptide (capped at expected-to-date based on frequency).
- A day with no log for the peptide does not advance the cycle — the cycle effectively pauses.
- `plannedDuration` is reinterpreted as "expected number of doses in the cycle" (derived from frequency × cycle length in weeks) so progress %, "nearing end", and "overdue" remain meaningful.

### Implementation steps

1. **New helper** `src/lib/cycleProgress.ts`
   - `parseFrequency(freq: string): { perWeek: number; isDaily: boolean }` — leverages existing `src/utils/frequencyParser.ts` if compatible; otherwise small regex for "once a week", "every night", "Nx/week", "EOD".
   - `getExpectedDoses(cycle, frequency, asOf = new Date()): number` — expected dose occurrences from `startDate` up to `asOf`.
   - `getLoggedDoses(cycle, peptideId, doses): number` — count of `daily_doses` rows for that peptide between `startDate` and today.
   - `getCycleProgress(cycle, frequency, doses)` returns `{ dosesLogged, dosesExpected, dosesPlanned, progress, isNearing, isOverdue }`.

2. **Wire in `src/screens/MyStackScreen.tsx`**
   - Replace the local `getCycleProgress` with the new helper.
   - Pull `doses` from `useDailyDoses()` (already imported elsewhere in app shell) and pass through.
   - Update the two progress UIs (lines ~145 and ~808) to read `Dose X/Y` instead of `Day X/Y`, keeping the same visual.
   - Keep the inline label readable: e.g. `Dose 4 / 12 logged` plus a smaller `Week 2 of 6` hint derived from wall-clock for context.

3. **Wire in `src/components/modals/CycleManagementModal.tsx`**
   - Same swap at line ~187. Show logged-vs-expected so users see when they're behind schedule (e.g. weekly Reta missed → 0/2 instead of "Day 14").

4. **Wire in `src/services/cycleNotifications.ts`**
   - `getDaysElapsed` becomes `getDosesLogged`. "Cycle ending soon" / "overdue" notifications fire based on logged-dose progress vs. planned, so a paused cycle doesn't spam end-of-cycle alerts.

5. **Edge cases**
   - Cycle started today, no logs yet → `0 / N`, progress 0%, not overdue.
   - User logs multiple doses same day for a daily peptide → counted once (distinct date).
   - Frequency string unparseable → fall back to current wall-clock behavior and log a warning.
   - Existing cycles with no frequency stored → treat as daily.

### Files touched
- `src/lib/cycleProgress.ts` (new)
- `src/screens/MyStackScreen.tsx`
- `src/components/modals/CycleManagementModal.tsx`
- `src/services/cycleNotifications.ts`

### Out of scope
- Schema changes. We derive everything from existing `daily_doses` rows and the `Cycle` object's existing `frequency` field.
- Changing how cycles are *started* (still user-initiated from MyStack / modal).
- Touching `src/integrations/supabase/*` or `.env`.

### Verification
- Build passes (TS clean, no Rollup resolve errors).
- Manual: start a weekly cycle, log 1 dose, confirm progress reads `1 / N` and doesn't advance until the next log; start a daily cycle, skip a day, confirm count holds.
