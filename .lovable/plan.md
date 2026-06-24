
## Problem

The dashboard's **Active Stack** card (`src/components/home/ActiveStackPreview.tsx`) only shows colored category tiles and "N peptides" — nothing about cycle week, doses logged, doses left, or pause state. All that intelligence already exists in `src/lib/cycleProgress.ts` (`computeCycleProgress`, `cycleStatusLabel`) and is rendered correctly inside MyStack, but it never reaches the home screen.

A second source of confusion: when a user adds a peptide they're already weeks into, the **Start Cycle** dialog asks for a start date with no explanation of what that date means or that past-dated logs will be counted, so they pick "today" and the week counter is wrong from day one.

## Plan

### 1. Rebuild `ActiveStackPreview` to show real cycle status

For each peptide in the active stack, look up its current `Cycle` (from `getCycles()`) and feed it through `computeCycleProgress(cycle, doses)` using `useDailyDoses()`. Replace the icon-tile row with a compact per-peptide list:

```
BPC-157            Week 3 / 8 · 12/24 doses     [On Track]
Ipamorelin         Week 1 / 6 · next dose today [Not Started]
Retatrutide        Paused — out of stock        [Paused]
Tirzepatide        No cycle started             [Start →]
```

Each row shows: peptide short name, `Week N / total` (from `calendarDays` and `plannedDuration`), `dosesLogged/dosesPlanned`, and the same status badge MyStack uses (`cycleStatusLabel`). Behind/overdue/nearing badges reuse the existing color tokens (amber / destructive / primary).

Top of the card gets a one-line summary across the whole stack: "*3 cycles active · 1 paused · 2 doses behind today*" so the user can read state at a glance without expanding.

Tapping the card still navigates to MyStack (no behavior change). Empty-state and hydration skeleton are kept as-is.

### 2. Clarify the Start-Cycle date picker

In `MyStackScreen`'s start-cycle dialog (the `pendingStartDate` flow around line 384), add a short helper line under the date input:

> "Pick the date you actually started this peptide. If you're already a few weeks in, set the real start date — past doses you've logged will count toward this cycle."

Add a quick "I started today" / "I started 1 week ago" / "2 weeks ago" / "4 weeks ago" chip row that prefills the date, so users mid-stream don't have to think about calendar math. This matches how the rest of the app uses pill chips.

### 3. Tiny consistency fixes

- The dashboard preview imports `useDailyDoses` so cycle progress matches MyStack exactly (same source of truth, no drift).
- Status label, colors, and "behind" arithmetic all flow through `cycleStatusLabel` / `computeCycleProgress` — no duplicate logic. If cycle math ever changes, both screens update together.

## Out of scope

- No changes to `cycleProgress.ts` math, storage schema, or notifications.
- No change to MyStack itself beyond the start-date dialog copy + chip row.
- No new backend tables.

## Files touched

- `src/components/home/ActiveStackPreview.tsx` — rebuilt rows with cycle data
- `src/screens/MyStackScreen.tsx` — start-cycle dialog: helper copy + "started X ago" chips
