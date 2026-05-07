## 1. IU & units in syringe auto-calc

Extend `DosagePreset` schema (`src/services/storage.ts`) with optional fields:
- `vialIU?: string`, `vialUnits?: string` (alongside existing `vialSize` for mg)
- `vialUnitType: 'mg' | 'IU' | 'units'` (defaults to `'mg'` for back-compat)

Update preset save UI in `DosageScreen.tsx` (Reconstitution Calculator) to let user pick the vial unit type and enter the matching amount.

In `EditDoseModal.tsx`:
- Replace mg-only `calc` block. Compute `concentration = vialAmount / bacMl` in whatever unit the preset stores.
- If dose `unit === preset.vialUnitType`, compute `volumeMl = dose / concentration` and `units = volumeMl * unitsPerMl`.
- If mismatch (e.g., dose in mg but preset in IU), show "Preset is in IU — switch dose unit to match" hint instead of unsupported.
- Keep over-capacity / too-small warnings.

## 2. Auto-convert dose unit on save

Replace the "confirm-to-save" flow in `EditDoseModal.tsx`:
- New helper `src/data/peptideUnits.ts` → `convertDose(value, from, to, peptideId)`.
  - Known conversion: HGH 1 mg ↔ 3 IU. HCG: pass-through (already IU).
  - Insulin: pass-through (units).
  - For unknowns: keep value, swap label, return `{ converted: false }`.
- On save, if `unit !== expectedUnit`: silently convert via the helper, update form state, and save the corrected pair. Show a small inline toast "Auto-converted to X mg" (use sonner).
- Remove `confirmMismatch` state and "Confirm & Save" button. Keep the yellow alert as an informational notice ("Will be saved as X IU").

## 3. Today's Reminders schedule screen

New `src/screens/TodayRemindersScreen.tsx`:
- Lists all enabled reminders for today from `useDoseReminders`, sorted by next firing time.
- Each row: peptide name, dose, time, computed `nextFireTime` (relative + absolute), inline `Switch` to toggle enable/disable, swipe-right to mark taken (reuse `SwipeableReminderCard`).
- Header card: "Push notifications" status badge + "Enable" button if `Notification.permission !== 'granted'`. Calls `ensureNotificationsReady()` from `useDoseReminders`.
- For native (Capacitor), call existing `src/services/capacitorNotifications.ts` to register and schedule via `LocalNotifications` so push works on phone.

Routing: add `/reminders/today` route in `App.tsx`. Add entry point from `TodaysReminders` card on `HomeScreen` (`onViewSettings` already lands at settings — change to navigate to the new screen).

## 4. Replace COA section with Bloodwork (user-facing)

- Remove user-facing entry points to `/coa-verification` (`BottomNav`, settings, landing CTAs). Repoint each to `/bloodwork`.
- Keep `COAVerification` page route gated to admin only (use `useAccessControl`/`has_role('admin')`); non-admins are redirected to `/bloodwork`.
- `COAUploadManager` stays in `AdminDashboard`.

`/bloodwork` (existing `BloodworkPage`):
- Above-the-fold "Upload or photograph your lab report" CTA: file input + camera capture (`<input type="file" accept="image/*,application/pdf" capture="environment">`). Upload to existing `lab-reports` bucket via `supabase.storage`.
- After upload: check Premium via `useSubscription().isPremium`.
  - **Premium**: trigger `analyze-lab-report` edge function (already exists), render `BloodworkResults` + `StackPeptideCard` recommendations.
  - **Free**: show `PremiumLockOverlay` with copy "Unlock your personalized peptide stack from your bloodwork" and a CTA wired to `useSubscription().purchase()`.
- Add a "Why upgrade?" mini-section listing: AI lab interpretation, optimized stack, tracking over time.

## 5. Browse predictive search

`PeptideSearch.tsx` currently filters on submit. Refactor:
- Controlled `query` state, debounced 120ms.
- Build search index over `peptidesExpanded` + `peptideBlends` (name, aliases, category, conditions). Use `Fuse.js` (already in node_modules? — if not, lightweight inline scorer).
- Render dropdown of top 8 matches as user types; click navigates to entity page or opens `PeptideDetailModal`.
- Keyboard nav (↑/↓/Enter), `Esc` clears.

## 6. Merge Blends + Stacks into one section

- Create `src/components/landing/BlendsAndStacks.tsx` combining `PeptideBlends` + `StackBuilder` into a single section with two tabs ("Pre-made Blends" / "Build Your Stack") using shadcn `Tabs`.
- Replace both usages in `LandingPage.tsx` with the new component. Update anchor IDs (`#blends-stacks`).
- `ResearchTools` quick-action: replace separate "Blends" and "Stack" tiles with one "Blends & Stacks" tile that scrolls to the combined section.
- Keep `PeptideBlends` and `StackBuilder` as internal sub-components (do not delete).

## Files

**New**: `src/screens/TodayRemindersScreen.tsx`, `src/components/landing/BlendsAndStacks.tsx`.

**Edited**: `src/services/storage.ts`, `src/screens/DosageScreen.tsx`, `src/components/doses/EditDoseModal.tsx`, `src/data/peptideUnits.ts`, `src/App.tsx`, `src/screens/HomeScreen.tsx`, `src/components/home/TodaysReminders.tsx`, `src/components/layout/BottomNav.tsx`, `src/pages/BloodworkPage.tsx`, `src/components/landing/PeptideSearch.tsx`, `src/components/landing/ResearchTools.tsx`, `src/components/landing/LandingPage.tsx`, `src/components/landing/index.ts`, `src/services/capacitorNotifications.ts` (wire reminder scheduling).

No DB migrations needed — preset schema lives in localStorage; lab-reports bucket already exists.
