

## Plan: Goal banner on My Stack header, "Why recommended?" tooltips, and easier body composition + Bluetooth scale UX

Three connected enhancements:

### 1. "Tuned to your goals" chip banner on My Stack header

Add the same goal-chip banner used in `EditStackModal` directly to the profile header card in `src/screens/MyStackScreen.tsx`, so users see their goals reflected without opening the modal.

- Read `profile.goals` (already in state) → resolve via `getGoalLabels()` from `src/data/goalMap.ts`.
- Render below the activity/experience pills in the header card:
  - If goals exist: small `Sparkles` icon + "Tuned to:" label + secondary `Badge` chips for each goal.
  - If no goals: subtle CTA "Set your goals in Settings → Profile" linking to `/?screen=settings`.

### 2. "Why recommended?" tooltip in EditStackModal

For each peptide highlighted in the "Recommended for your goals" group, add a small info tooltip showing **which user goal(s) match the peptide's category**.

- In `src/data/goalMap.ts`, add a reverse helper `getMatchingGoalsForCategory(category, userGoals)` that returns the user-selected goal labels matching a peptide's category.
- In `src/components/modals/EditStackModal.tsx`, wrap each recommended `SelectItem`'s label with a `Tooltip` (already available at `src/components/ui/tooltip.tsx`) showing e.g.:
  > "Recommended because it targets: **Fat Loss, Metabolic Health**"
- Add a tiny `Info` icon next to the peptide name inside recommended items to make the tooltip discoverable. Wrap the modal in `TooltipProvider`.

### 3. Easy body composition editing + clearer Bluetooth scale connection

Two improvements to make weight/body comp tracking effortless for Renpho (and other) users:

**3a. Body Composition modal — quick edit on existing entries** (`src/components/modals/BodyCompositionModal.tsx`)

- Surface the **"Add New Entry"** button more prominently with a primary style (currently outline) and rename to **"Log / Update Today's Reading"**.
- Auto-prefill the form with the latest reading values when expanded (so users edit rather than re-type), and overwrite today's entry via the existing `(user_id, date)` upsert.
- Add a **"Connect Bluetooth Scale"** shortcut button at the top of the modal that opens Settings → Connected Devices section (or directly triggers `connectScale()` from `useBluetoothScale`).
- Fix `BodyCompositionCard.tsx` hardcoded `19` placeholder so the home card uses real `latest.bodyFat` for the "to-go" calculation.

**3b. Bluetooth scale UX polish** (`src/components/settings/BluetoothScaleConnection.tsx` + `src/hooks/useBluetoothScale.ts`)

- Renpho support is already wired in `useBluetoothScale.ts` (`RENPHO_SCALE_SERVICE`). Verify works end-to-end and add an explicit **scale brand list** to the empty state: "Works with Renpho, Xiaomi, Eufy, Withings, Yunmai, and standard Bluetooth scales."
- Add a **"Test Reading" / "Last Reading"** card showing the most recent BT-sourced weight with timestamp, so users get instant confirmation the connection is live.
- Add an **iOS notice** (since Web Bluetooth doesn't work on iOS Safari) suggesting users open the app via the installed PWA on Android, or use manual entry on iOS.
- Surface a "Connect Scale" CTA inside the Body Composition modal (links to Settings) when no Bluetooth-sourced entry exists yet.

### Files touched

```text
src/screens/MyStackScreen.tsx                          ← goal chip banner in header
src/data/goalMap.ts                                    ← add reverse helper
src/components/modals/EditStackModal.tsx               ← Tooltip on recommended items
src/components/modals/BodyCompositionModal.tsx        ← prominent edit, prefill, BT shortcut
src/components/home/BodyCompositionCard.tsx          ← fix hardcoded body-fat baseline
src/components/settings/BluetoothScaleConnection.tsx ← brand list, last reading, iOS notice
```

No DB migrations. No new dependencies. Reuses existing `Tooltip`, `Badge`, `Sparkles`, `useBluetoothScale`, and the `(user_id, date)` upsert logic already in place.

