## Re-verify + polish: reminder & split-dose stack

Verified all four items ship correctly. Found four small correctness/UX issues while auditing. Fix them in a single focused pass.

### Issues found

1. **UTC date drift** — `getNextDose` / `formatNextDose` in `src/lib/cycleProgress.ts` use `new Date().toISOString().split('T')[0]` to derive "today". For SA users (UTC+2) that's the previous UTC day, so "Today 09:00" can show as "Tomorrow" late at night. Fix: local-date helper.

2. **Weekly cadence past-time fallback** — `computeNextFireAt` adds a fixed `+24h` when the computed fire is in the past. For a weekly peptide that produces a next-fire tomorrow instead of +7 days. Fix: advance by the frequency interval (`7 / perWeek` days, min 1).

3. **Multiple daily times → next time selection** — `getNextDose` always uses the last logged time and ignores `cycle.doseTimes`. When splitParts>1 and it's currently 10:00 with slots ["08:00","20:00"], bell should say "Today 20:00", not the last log's time. Fix: when the anchor date is today and doseTimes has upcoming slots, pick the next slot ≥ now; otherwise fall back to first slot on next interval day.

4. **Sub-dose "Logged" indicator order** — In `ActiveStackPreview.tsx` the collapsible marks slots logged by `todaySubdoseCount > i`, so logging PM first paints AM as logged. Fix: compare each slot's HH:MM against the actual logged times for today (allow ±90 min tolerance) so the correct slot lights up.

### Files to edit

- `src/lib/cycleProgress.ts`
  - Add `localIso(d)` helper.
  - Replace both `toISOString().split('T')[0]` calls in `getNextDose` and `formatNextDose` with `localIso`.
  - In `getNextDose`, accept optional `doseTimes: string[]` and when the next date is today, pick the next slot ≥ current HH:MM; when it's a future date, use `doseTimes[0]`.
  - In `computeNextFireAt`, when `fireAt <= now`, roll forward by `max(1, round(7/perWeek))` days instead of a hard 24h.

- `src/services/pushScheduler.ts`
  - Pass `cycle.doseTimes` into the updated `getNextDose` via `computeNextFireAt` (already receives `preferredTime` per slot — no behavior change needed once #2 lands).

- `src/components/home/StackReminderBell.tsx`
  - Pass `cycle.doseTimes` into `getNextDose(cycle, doses, undefined, cycle.doseTimes)` so the "Next: …" line reflects the upcoming slot for split-dose peptides.

- `src/components/home/ActiveStackPreview.tsx`
  - Replace `subLogged = todaySubdoseCount > i` with a per-slot check that scans today's logged doses for a time within ±90 min of `t`; falls back to count-order only when logs have no time.

### Non-goals

- No schema changes, no new fields, no migration.
- No new UI (no snooze presets, no test-fire button — those were the "enhance" option, not chosen).
- No changes to `splitParts` persistence, `Collapsible` layout, or bell popover chrome.

### Verification

- Typecheck.
- Manual: with cycle `Retatrutide weekly, doseTimes ["09:00"]`, log a dose Wednesday 09:00 → bell shows "Next: in 7 days", not "Tomorrow 09:00".
- Manual: with `MOTS-c splitParts=2, doseTimes ["08:00","20:00"]`, at 12:00 log the AM slot → PM slot shows "Upcoming" (not both).
- Manual (SA timezone): at 22:00 local, "Today 09:00" scheduled for tomorrow morning displays as "Tomorrow 09:00", not "in 2 days".