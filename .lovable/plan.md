# Bloodwork tab polish + mobile polish

Two-part scope. The Bloodwork sub-tab already renders (`BloodworkTab.tsx`) with report cards, per-biomarker trend charts, and basic delta percentages. This plan tightens the bloodwork visuals against the spec and applies the mobile-polish fixes that are still missing.

## Part 1 — Bloodwork tab UI upgrades

Edit `src/components/bloodwork/BloodworkTab.tsx` only. No schema changes.

1. **Optimal-range coloring (green / yellow / red)**
   - Build a small lookup that resolves each biomarker to the entry in `src/data/bloodwork.ts` (match on `shortName` or `name`, case-insensitive, with a few aliases for common labels like "Testosterone, Total" → `testosterone`).
   - For each biomarker value, compute a tone:
     - **green** when the value sits inside `optimalRange` (fall back to `normalRange` for the user's sex).
     - **yellow** when it's inside `normalRange` but outside `optimalRange`, or within ±10% of either bound.
     - **red** when it's outside `normalRange`, hits a `warningThreshold`, or the backend `status` is `high`/`low`/`critical`.
   - Apply the tone to the value pill on each biomarker row and to the corresponding trend-chart card border + last-point dot. Continue to honor the existing backend `status` field as the highest-priority signal.
   - Pull the user's `sex` (and DOB → age) from `profiles` via the existing `useAuth` user id so the male/female range is correct; default to the male range if sex is missing.

2. **Richer delta badges**
   - Replace the bare `↑ 12%` chip with `↑ 12% from 18 Mar 2026` (or `↓ 8% — optimal` when the new value is inside the optimal band).
   - When there is no prior reading, show `Baseline` instead of a delta.
   - Keep the existing emerald/amber/muted color logic but flip semantics for biomarkers where "down is good" (LDL, ApoB, HbA1c, fasting glucose, ALT, AST, GGT, triglycerides) so a drop renders green.

3. **Protocol correlation banner**
   - Fetch `user_stacks` (peptide_id, created_at) once on mount.
   - When the active report has a previous report on file, pick the biomarker with the largest absolute delta whose change direction is favorable, and the stack peptide whose `created_at` falls between the two report dates.
   - Render a single banner above the biomarkers list: `Your <Biomarker> <improved/changed> <X>% during your <Peptide Name> cycle.` Hide the banner when no qualifying peptide is found.
   - Use the existing peptide name lookup from `src/data/peptides.ts` / `peptidesExpanded.ts`.

4. **Card metadata polish**
   - Add the lab name to each report card when present (`extracted_biomarkers` may have a lab hint; otherwise fall back to the file name's first token). Show as a small uppercase label under the date.
   - Move the "View Report" affordance into each report card as an explicit `View report →` link routing to `/bloodwork?report=<id>` (the existing wizard can ignore the param for now; the link satisfies the spec).

## Part 2 — Mobile polish

Targeted, low-risk fixes only. No global rewrites.

1. **Results sub-tab tap targets**
   - In `src/screens/TransformationScreen.tsx`, bump `TabsTrigger` to `min-h-11` and adjust padding/typography so each tab still fits 6-across on a 360px viewport (icon-above-label is already used at base width).

2. **Swipe navigation across Results sub-tabs**
   - Reuse the existing `useSwipeNav` hook. Wrap the `Tabs` content in a swipe handler that advances/retreats the active tab among `['calendar','measure','bloodwork','water','food','photos']`. Wraparound disabled.

3. **Dynamic viewport (`dvh`)**
   - Replace `h-screen` / `min-h-screen` with `h-dvh` / `min-h-dvh` in the main app shells where the on-screen keyboard causes layout shift: `src/screens/TransformationScreen.tsx`, `src/screens/HomeScreen.tsx`, `src/pages/BloodworkPage.tsx`, `src/components/bloodwork/ManualBloodworkEntry.tsx`. Leave landing/marketing pages on `min-h-screen` (no keyboard interaction).

4. **Floating overlay clearance above the bottom nav**
   - The bottom nav already uses `env(safe-area-inset-bottom)`. The pieces that can overlap it on mobile are `StackCartBar` (`fixed bottom-4`), `LiveQnAPopup` (`fixed bottom-6 right-6`), and `InstallBanner` (`fixed bottom-20`).
   - Change each to `bottom: calc(env(safe-area-inset-bottom) + 88px)` on mobile (`md:bottom-*` keeps the desktop position). This gives a clean 8px clearance above the 80px nav.
   - Confirm no permanent floating WhatsApp button exists — the WhatsApp link is inside `SupportSheet` triggered from the top header, so the spec's "move it" concern doesn't apply here.

5. **Universal `:active` press feedback**
   - Extend `src/components/ui/button.tsx` base classes with `active:scale-[0.97] transition-transform` so every shadcn button gets the press feedback. (Plain `<button>` elements throughout the app already use ad-hoc `active:scale-[0.97]`.)

## Out of scope (this turn)

Quarterly reminder UI badges/banners, push/email delivery, food/water/photos/wearables, protocol library, symptom journal, file-upload progress bar, edge-function retry/decompression work, analytics events, favicon suite — all deferred to subsequent turns per the user's scope answer.

## Files touched

- `src/components/bloodwork/BloodworkTab.tsx`
- `src/screens/TransformationScreen.tsx`
- `src/screens/HomeScreen.tsx`
- `src/pages/BloodworkPage.tsx`
- `src/components/bloodwork/ManualBloodworkEntry.tsx`
- `src/components/bloodwork/StackCartBar.tsx`
- `src/components/landing/LiveQnAPopup.tsx`
- `src/components/pwa/InstallBanner.tsx`
- `src/components/ui/button.tsx`
