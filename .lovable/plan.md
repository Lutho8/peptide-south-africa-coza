## Goal

Make the Active Stack card show a clear per-peptide dosing breakdown, persist split-dose awareness everywhere, and add a working "bell" reminder popover that drives push notifications using absolute `next_fire_at` timestamps per cycle.

## 1. Persist `splitParts` end-to-end

- Extend `ActiveStackItem` (in `src/services/storage.ts` + `src/data/userData.ts`) with optional fields: `splitParts`, `perAdministration`, `dosesPerWeek`, `experienceLevel`, `doseTimes: string[]` (e.g. `["08:00","20:00"]`).
- When a user adds/edits a peptide in `MyStackScreen`, run `parseDosing` (or `planForExperience`) and persist the parsed `DosingPlan`. Backfill missing fields lazily on read.
- Update `getCycleProgress` in `src/lib/cycleProgress.ts` to accept the per-cycle `splitParts` and collapse N same-day administrations into 1 complete dose for **all** cadences (currently only daily-or-more dedupes by date).
- Threading: `Cycle` already mirrors stack metadata — add `splitParts`, `doseTimes`, `reminderLeadMinutes`, `reminderEnabled` to it. `MyStackScreen.handleStartCycle` writes them when creating the cycle.
- `DailyLogScreen` reads `splitParts` for the matching stack item and shows "Sub-dose 1/2 logged — log PM dose to complete today" instead of "1 dose logged".

## 2. Active Stack card — expanded per-peptide breakdown

Edit `src/components/home/ActiveStackPreview.tsx`:

- For each row, after the existing "Week N / Total · Phase" line, render a compact dosing breakdown derived from the persisted `DosingPlan`:
  - One row per scheduled administration time, e.g.
    - `08:00 — 2.5 mg (AM)`
    - `20:00 — 2.5 mg (PM)`  → footer "= 1 complete dose · 1×/week"
  - Today-aware status chips per sub-dose: `Logged`, `Due`, `Upcoming`, `Missed`.
- Progress line stays as "X / Y complete doses" (unchanged numerator semantics, now correctly counting split doses as 1).
- Keep the row collapsed by default on the dashboard; tapping the row expands the breakdown inline (Radix Collapsible) so the dashboard stays scannable.

## 3. Bell reminder popover

New component `src/components/home/StackReminderBell.tsx`, rendered next to each row's badge in `ActiveStackPreview`:

- Icon: `Bell` (lucide). Opens a `Popover` (existing `@/components/ui/popover`).
- Popover contents:
  - Header: peptide name + computed next dose ("Tomorrow 08:00 · in 14h 23m").
  - Toggle: "Remind me" (enabled/disabled).
  - Lead-time select: 0, 5, 15, 30, 60, 120 min.
  - Per-administration time editor (one input per `doseTimes` entry, default seeded from frequency parser).
  - Footer: "Snooze until next dose" and "Open in My Stack".
- On save:
  - Persist `reminderEnabled`, `reminderLeadMinutes`, `doseTimes` onto the cycle/stack item.
  - Compute `nextFireAt` via `computeNextFireAt(cycle, doses, time, leadMinutes)` for each `doseTimes` entry and write one `ScheduledReminder` per administration to IndexedDB.

## 4. Push scheduler — absolute `next_fire_at` per cycle

Edit `src/services/pushScheduler.ts`:

- Extend `ScheduledReminder` with: `mode: 'weekly' | 'computed'`, `cycleId?: string`, `nextFireTime: number` (now required for `computed` mode), `leadMinutes?: number`, `splitIndex?: number`.
- In `saveReminderToIndexedDB` / `bulkSaveReminders`, if `mode === 'computed'`, **trust** the provided `nextFireTime` and do not overwrite it via `calculateNextFireTime`.
- Add `scheduleCycleReminders(cycle, doses, opts)`: deletes existing reminders for that `cycleId` then writes one per `doseTimes` entry using `computeNextFireAt`.
- Respect cycle state:
  - `status === 'break'` → mark all that cycle's reminders `enabled: false` (skip scheduling).
  - `dosesBehind >= 2` (Behind) → schedule next dose at `now + 30 min` instead of waiting for the cadence window, with a "Catch-up dose" body.
  - `isOverdue` / phase `complete` → skip and surface a one-time "Cycle complete — start break" reminder.
- After each successful dose log (`DailyLogScreen` write path), call `scheduleCycleReminders` for the affected cycle so `next_fire_at` rolls forward immediately.
- `useStorageInit` already calls `forceSyncAndCheck`; add a `rtd:stack-changed` / `rtd:dose-logged` listener that re-runs `scheduleCycleReminders` for all active cycles.

## 5. Service worker (`public/sw.js`)

- When iterating reminders, prefer `nextFireTime` as the absolute fire time (already supported). Add handling for `mode === 'computed'`: after firing, do NOT auto-advance by weekly cadence — instead emit a `CYCLE_REMINDER_FIRED` message so the page (when open) recomputes and writes the next `nextFireTime`. If the page is closed, the next app open will reschedule via step 4.
- Bump SW cache version to force update.

## 6. UI cleanup / consistency

- `MyStackScreen` stack cards: show the same per-administration breakdown + the bell popover.
- `DailyLogScreen`: when a peptide has `splitParts > 1`, group its today entries under one "complete dose" header with a progress pill (`1/2 sub-doses`).
- Add a small "How split doses count" line to the existing `ActiveStackPreview` explainer.

## Technical notes

- No schema migration required for `dose_reminders` if we keep new fields client-side in IndexedDB only; if persistence across devices is needed for the popover settings, add columns `mode text default 'weekly'`, `cycle_id uuid`, `next_fire_at timestamptz`, `lead_minutes int` to `dose_reminders` and one matching block of GRANTs (already granted in current table). Flagging as **optional** — default plan keeps it local.
- All new persisted fields are optional; existing stacks keep working (treated as `splitParts = 1`, `doseTimes = [parsed-default]`).
- No business-logic changes to cycles other than `splitParts` collapsing and computed-mode scheduling.

## Out of scope

- Changing dosing guidance content per experience level (already shipped).
- Backend cron-driven push (still client SW + IndexedDB).
- Shop "per vial vs 3/5 pack" pricing display — separate concern, not touched here.
