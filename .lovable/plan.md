## Goals

1. **Stronger unit validation** in the daily log dose edit modal — warn if the chosen unit doesn't match the peptide's normal dosing unit.
2. **Auto-calculate syringe volume** in the edit modal from the user's saved reconstitution preset (vial mg + BAC water + syringe type).
3. **Fix the dose reminder system** so notifications actually fire when set up.

---

## 1. Unit-mismatch validation in EditDoseModal

**`src/data/peptideUnits.ts` (new)** — Lightweight lookup map:
```ts
export const PEPTIDE_PREFERRED_UNIT: Record<string, 'mg' | 'IU' | 'units'> = {
  retatrutide: 'mg',
  semaglutide: 'mg',
  tirzepatide: 'mg',
  'cjc-1295-no-dac': 'mg',
  'cjc-1295': 'mg',
  tesamorelin: 'mg',
  tesamorellin: 'mg',
  'bpc-157': 'mg',
  'tb-500': 'mg',
  ipamorelin: 'mg',
  'mots-c': 'mg',
  hgh: 'IU',
  hcg: 'IU',
  insulin: 'units',
};
export const getPreferredUnit = (peptideId: string) => PEPTIDE_PREFERRED_UNIT[peptideId];
```

**`src/components/doses/EditDoseModal.tsx`**
- Import `getPreferredUnit`. Compute `expectedUnit = getPreferredUnit(dose.peptide_id)`.
- If `unit !== expectedUnit`, show an inline yellow `Alert` ("This peptide is normally dosed in `{expectedUnit}`. You selected `{unit}` — are you sure?") and require a second click on Save to confirm (`confirmMismatch` state). Reset on unit change.
- Add a hard error if `parsedDose <= 0` (already exists) and a sanity warning if dose magnitude looks wrong for the unit (e.g., `> 50` for mg peptides, `< 0.01` for mg) — purely advisory.

---

## 2. Auto-calculate syringe volume from preset

**`src/services/storage.ts`** — add `getDosagePresetForPeptide(peptideId)` helper that returns the most recent matching `DosagePreset` (by `peptideId`).

**`src/components/doses/EditDoseModal.tsx`**
- On open, look up matching preset for `dose.peptide_id`.
- If found, render a collapsible "Syringe volume" panel showing:
  - Vial: `{vialSize} mg` in `{bacWater} mL` → concentration `mg/mL`
  - Syringe: U-40 / U-50 / U-100 (units per mL)
  - Computed: **`X units`** (live, recomputes as the user edits dose/unit)
  - Formula used (small print)
- Conversion rules:
  - mg → volume mL = `dose_mg / (vialSize/bacWater)`
  - units = `volume_mL * unitsPerMl` where unitsPerMl = 100 (U-100), 50 (U-50), 40 (U-40)
  - IU/units inputs: skip auto-calc, show "Auto-calc only available for mg doses".
- If no preset exists, show a hint linking to the Reconstitution Calculator: "Save a preset to enable auto-calculation."
- Add validation warning if computed units exceed syringe capacity (e.g., > 100 on a U-100, > 40 on a U-40) or fall below 2 units (accuracy risk).

---

## 3. Fix dose reminders not firing

Investigation found three real problems in the current pipeline:

**Problem A — `useDoseReminders.addReminder` only writes to Supabase + localStorage; it never calls `saveReminderToIndexedDB`.** The local `saveLocalReminders` triggers `bulkSaveReminders` which DOES write to IDB, so this part is OK on the surface — but `bulkSaveReminders` is fire-and-forget without awaiting the async sync, and a fresh reminder may not be picked up by the SW until the next 30s poll. We'll explicitly call `forceSyncAndCheck()` after add/update/toggle.

**Problem B — Permission gating.** When the user toggles "Enable notifications" in `NotificationSettings`, permission is requested, but on first ever reminder creation in `useDoseReminders.addReminder`, no check ensures `Notification.permission === 'granted'`. If the user creates a reminder without ever opening Settings, no permission was requested → SW shows nothing. We'll auto-prompt for permission (and register the SW if not yet registered) inside `addReminder`/`bulkAddReminders` when permission is `default`.

**Problem C — Service worker update.** `sw.js` cache version is `peptide-tracker-v4` and persists. Bumping to v5 forces clients to pick up scheduling fixes.

### Changes

**`src/hooks/useDoseReminders.ts`**
- Import `forceSyncAndCheck`, `requestPushPermission`, `registerServiceWorker` from `pushScheduler` and `getNotificationPermission`/`isNotificationSupported` from notifications.
- New helper `ensureNotificationsReady()`: if supported and permission is `default`, call `requestPushPermission()`; ensure SW is registered; toast a clear error if denied.
- Call `ensureNotificationsReady()` at the start of `addReminder` and `bulkAddReminders`.
- After every `saveLocalReminders(updated)` in add/update/toggle, `await forceSyncAndCheck()` so the SW immediately re-reads IDB.
- In `toggleReminder`, after enabling, also recompute `nextFireTime` via `saveReminderToIndexedDB(reminderShape)` so the SW picks it up without waiting.

**`src/services/notifications.ts`**
- `scheduleAllTodaysDoses` currently uses in-page `setTimeout`, which dies the moment the tab is closed. Keep it for foreground but make the SW the source of truth (already done via IDB). No change needed here besides documentation comment — the real scheduling lives in the SW.

**`public/sw.js`**
- Bump `CACHE_NAME` to `peptide-tracker-v5`.
- In `checkDueNotifications`, the current window is `-30s..+60s`. Widen to `-60s..+120s` so a reminder isn't missed if the SW wakes slightly late.
- Ensure `nextFireTime` is recomputed on initial save when missing (already done in `saveReminderToIndexedDB`, but defensively in SW too: if a due reminder has no `nextFireTime`, compute it from `time`+`days` and skip this tick rather than firing for a stale time).

**`src/hooks/useStorageInit.ts`**
- After `registerServiceWorker()` resolves, call `forceSyncAndCheck()` so reminders that existed before the SW was active get scheduled immediately on app load.

---

## Out of scope

- Editing peptide id / date in the daily-log modal (already excluded).
- Native (Capacitor) notification scheduling — web/PWA path only; native already wires through `capacitorNotifications.ts`.
- Backend cron-based push (would require `pg_cron` + edge function); current SW-based approach is sufficient while the PWA is open or recently backgrounded.

## Files touched

- `src/data/peptideUnits.ts` (new)
- `src/components/doses/EditDoseModal.tsx`
- `src/services/storage.ts`
- `src/hooks/useDoseReminders.ts`
- `src/hooks/useStorageInit.ts`
- `src/services/notifications.ts` (comment only)
- `public/sw.js`
