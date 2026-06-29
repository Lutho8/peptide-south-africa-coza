# Plan: Backdate conflict transparency, computed next-dose reminders, and experience-aware split dosing

## 1. Expanded backdate conflict list (Daily-Log–synced)

**`src/lib/cycleProgress.ts`** — extend `validateBackdate` to return a structured `conflicts` array, not just a single message:

```ts
type BackdateConflict = {
  date: string;            // YYYY-MM-DD from daily_doses
  dose: number; unit: string;
  reason: 'before_start' | 'over_frequency_for_week' | 'duplicate_same_day' | 'outside_planned_duration';
  weekIndex: number | null;   // computed week relative to new startDate
  detail: string;             // human sentence
};
```

The function walks the same `useDailyDoses` entries MyStack already reads (single source of truth — no separate query), buckets them by computed `weekIndex = floor((date - startDate)/7)`, compares per-week counts to `parseFrequencyPerWeek(frequency)`, and flags each offending log entry.

**`src/screens/MyStackScreen.tsx`** — replace the single amber line in the Start-Cycle dialog with a scrollable amber `Alert` listing every conflict: date · dose · reason chip · "Open in Daily Log" link that routes to `/daily-log?date=YYYY-MM-DD&peptide=<id>`. Live-recompute as the user changes the start date or picks a "1 week ago / 2 weeks ago" chip.

**`src/screens/DailyLogScreen.tsx`** — read `?date` & `?peptide` query params, scroll to and highlight the matching row so the user can fix/delete it. No schema change.

## 2. Configurable push reminders from computed next-dose

Today's `dose_reminders` are fixed weekly time+day rows. Add a second mode driven by `getNextDose(cycle, doses)`.

**Schema** (`supabase/migrations/...`):

```sql
ALTER TABLE public.dose_reminders
  ADD COLUMN mode text NOT NULL DEFAULT 'fixed',          -- 'fixed' | 'computed'
  ADD COLUMN cycle_id uuid,                                -- links to a MyStack cycle
  ADD COLUMN lead_minutes int NOT NULL DEFAULT 0,          -- 0/15/60/1440
  ADD COLUMN next_fire_at timestamptz;                     -- recomputed on log/edit
-- grants unchanged; existing RLS already user-scoped
```

**`src/lib/cycleProgress.ts`** — export `computeNextFireAt(cycle, doses, preferredTime, leadMinutes)` reusing `getNextDose`.

**`src/components/home/ActiveStackPreview.tsx`** — add a small bell toggle per peptide row. Opens a popover: enable on/off, time of day, lead-time select (At dose time / 15 min before / 1 hr before / 1 day before). Persists a `mode='computed'` row in `dose_reminders` and registers it through the existing `pushScheduler` / `useDoseReminders` pipeline (extend `ScheduledReminder` with `nextFireAt`; the SW already wakes on schedule — it just needs the absolute timestamp instead of a weekly time+day).

**Recompute triggers** (client-side, no cron): after any `daily_doses` insert/delete for that peptide, after Recalculate Cycle, after cycle edit. The hook re-runs `computeNextFireAt` and updates the row + IndexedDB entry. SW wakes at `next_fire_at` and shows: *"BPC-157 — next 250 mcg dose due now (Week 3/8)"*.

## 3. Experience-level + split-dose aware MyStack

Peptide data already carries `dosing.{beginner|intermediate|advanced|athlete}` strings like `"2.5 mg 2x/week"` or `"500 mcg AM + 500 mcg PM daily"`.

**`src/lib/doseParser.ts`** (new) — parser that turns a dosing string into:

```ts
type DosingPlan = {
  perAdministration: { amount: number; unit: 'mg'|'IU'|'units' };
  administrationsPerDay: number;          // 2 for "AM + PM" or "2.5 mg x twice"
  daysPerWeek: number;                     // 7, 2, 3, etc.
  splitParts: number;                      // >1 means N sub-doses = 1 complete dose
  completeDailyDose: { amount: number; unit: string };  // sum of split parts
};
```

Handles `"2.5 mg x twice a week"` (split=2, completes 1 weekly dose), `"AM + PM"`, `"daily"`, `"EOD"`, etc.

**`src/screens/MyStackScreen.tsx` Add-to-Stack dialog** — surface an "Experience level" segmented control (Beginner / Intermediate / Advanced / Athlete), prefilled from the user's `calculator_settings.experienceLevel` already saved by `DosageScreen`. Selecting a level auto-fills frequency + per-dose amount from the parsed `DosingPlan`. Persist `experienceLevel` and `splitParts` on the cycle (extend `user_stacks` payload — already a JSON column, no migration).

**Counting "1 complete dose"** — `cycleProgress.ts` `getCycleProgress` already counts log rows. Update it: when `cycle.splitParts > 1`, group same-day logs for that peptide and count `floor(sameDayLogs / splitParts)` as completed doses, with a partial-progress indicator (e.g. "1/2 of today's split done") shown on the Active Stack card and Daily Log.

**Active Stack line** then reads, e.g. *"MOTS-c · Week 2/4 · Intermediate · 5 mg split 2×2.5 mg · 2/4 complete doses · Next 5pm today"*.

## Out of scope

- No paywall, no localization, no AI body-fat — per project memory.
- No edits to `supabase/integrations/client.ts` or other auto-gen files.
- Existing fixed-time reminders keep working (default `mode='fixed'`).

## File-change summary

```text
src/lib/cycleProgress.ts          extend validateBackdate, add computeNextFireAt, split-dose counting
src/lib/doseParser.ts             new — string → DosingPlan
src/screens/MyStackScreen.tsx     conflict list UI, experience picker, splitParts persistence
src/screens/DailyLogScreen.tsx    deep-link highlight via query params
src/components/home/ActiveStackPreview.tsx   per-peptide bell popover + lead-time
src/hooks/useDoseReminders.ts     support mode='computed' + next_fire_at
src/services/pushScheduler.ts     schedule by absolute timestamp
supabase migration                add mode, cycle_id, lead_minutes, next_fire_at to dose_reminders
```
