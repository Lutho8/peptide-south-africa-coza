## Problem Diagnosis

After exhaustive verification (file listing, regex search across `src/`, workspace project listing, cross-project search for "tracker", "tide", "mastery"), the conclusion is definitive:

- **This workspace project** (`peptide-south-africa-site`) is a **marketing/e-commerce site** with no Daily Log, no Dashboard, no Onboarding Tour, no auth flow, and no tracker app code.
- The **tracker app** (with `BloodworkPage`, `DailyLog`, `OnboardingTour`, `dose reminders`, `pushScheduler`, etc.) is **not present in this workspace**.

Therefore, the three reported bugs **cannot be fixed in this project**:
1. "Daily log failed to load"
2. "User not recognized which sign-up method they used"
3. "Onboarding tour replays every time"

These require the actual tracker app's source code.

## What This Plan Covers (what CAN be done here)

1. **Fix the `build:dev` script error** — Lovable's build runner expects `"build:dev"` in `package.json`; add it so builds stop failing.

## Required User Action

- **Open the tracker app project** in Lovable (it may be in a different workspace/account or under a different name).
- **Re-send this bug report there** so the fixes can be applied to the correct codebase.

If you cannot locate the tracker project, check your Lovable dashboard for any project containing files like `BloodworkPage`, `DailyLog`, `OnboardingTour`, or `pushScheduler`.