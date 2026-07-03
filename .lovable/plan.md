## Goal

The existing `DashboardTour` overlay is oversized on mobile, tooltip placement drifts off-screen, and copy doesn't explain *why* each feature helps the user achieve their goals. It also re-shows for users who already finished it in a prior version. Rebuild the tour as a mobile-first, centered, one-time guided walkthrough with clear "what this does for you" copy.

## Changes

### 1. `src/components/onboarding/DashboardTour.tsx` — rewrite
- **Centered modal layout on mobile** (< 640px): instead of an anchored tooltip that jumps around the viewport, render a centered bottom-sheet-style card (max-h 85vh, w-[calc(100%-24px)], rounded-t-3xl on mobile / rounded-2xl centered on desktop). The spotlight ring still highlights the target element via smooth scroll + SVG cutout, but the explanation card lives in a fixed, predictable position (bottom sheet mobile / centered card desktop) so it never overflows.
- **Expanded, goal-oriented copy** for each step — each step gets:
  - `title` (what the feature is)
  - `body` (what it does)
  - `benefit` ("Helps you: ..." line in an accent pill) tying it to a user goal (adherence, safe cycling, informed dosing, progress tracking, etc.)
- **New 7-step flow** covering the full dashboard:
  1. Welcome header — orientation
  2. Today's Doses — daily adherence
  3. Active Stack Preview — current protocol at a glance
  4. Quick Actions — jump into Dose Tracker / Body Stats / Cycles / Peptides / Bloodwork / Inventory
  5. Reminders — never miss a dose
  6. Bloodwork/Transformation entry — measure results
  7. Bottom nav + profile — navigation & account
- **One-time enforcement**: keep `rtd-dashboard-tour-done` localStorage key. Add a second guard — a per-user key `rtd-dashboard-tour-done:<userId>` — so completed users never see it again even after cache clears where the profile persists. `resetDashboardTour()` clears both. The tour only auto-mounts when neither key is set AND `force` is false.
- **Skip = Done**: pressing Skip also writes the completion key (currently already does; keep). Add explicit "Don't show again" affordance on step 1.
- **Mobile polish**: touch targets ≥ 44px, larger Next button, safe-area padding (`env(safe-area-inset-bottom)`), backdrop tap does not dismiss (prevents accidental skips), ESC closes on desktop only.
- **Spotlight fix**: when the target isn't found or is off-screen, skip the ring and just show the centered card with the step content — no more empty highlight or off-screen jumps.

### 2. `src/components/home/WelcomeGuide.tsx` — hide for tour-completed users
Currently `WelcomeGuide` shows for anyone who hasn't dismissed it, independent of the tour. Update its mount check so it also hides when `rtd-dashboard-tour-done` (or the per-user variant) is set. Users who finished the tour don't need the quick-start card taking space on mobile.

### 3. `src/screens/HomeScreen.tsx` — add missing `data-tour` anchors
Add `data-tour="active-stack"` to the ActiveStackPreview wrapper, `data-tour="reminders"` to TodaysReminders wrapper, and `data-tour="transformation"` (reuse Body Composition card) so the new step targets resolve. `bottom-nav` and `profile-avatar` anchors already exist elsewhere — verify and add if missing.

### 4. Backfill: mark existing users as tour-complete
For users whose account was created before this change AND who already have logged doses / stacks (signal they've used the app), auto-set the completion key on first mount so they never see the new tour. Implemented client-side in `DashboardTour` mount effect: if `storage.getDailyDoses().length > 0` OR active stack exists, write the completion key and skip mounting.

## Technical notes

- No backend changes.
- No new dependencies.
- Keeps existing `resetDashboardTour()` export so Settings "Replay tour" still works (and `WelcomeGuide` "Take the 60-second guided tour" button).
- All copy stays English-only per project memory.
- Preserves the orange accent styling.

## Out of scope

- No redesign of individual dashboard cards themselves (only the tour + welcome guide).
- No changes to `OnboardingChecklist` (separate account-level flow).
