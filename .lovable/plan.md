# Plan

Two independent workstreams, both frontend-only. No schema, no auth, no business-logic changes outside what's listed.

---

## 1. Expand iOS Safari PWA install verification E2E tests

Goal: confirm `InstallVerification.tsx` shows the correct installer step (and exact troubleshooting copy) under realistic iOS Safari conditions — offline, blocked, no SW, private browsing, iPad desktop UA, in-Safari-tab vs standalone.

### Test harness changes (`src/test/setup.ts`)

Extend `PwaMockState` and `applyMocks()` with:
- `online: boolean` → drives `navigator.onLine` and dispatches `online`/`offline` events on toggle.
- `privateBrowsing: boolean` → when true, `caches.open()` rejects with `QuotaExceededError` (Safari Private Mode behavior) and `caches.keys()` returns `[]`.
- `swBlocked: boolean` → `serviceWorker.getRegistration()` rejects with `SecurityError` (simulates blocked SW / Lockdown Mode).
- `cacheMatchFailsFor: string[]` → make `caches.match(url)` return `undefined` for listed URLs even if keys include them (simulates partially populated precache).
- `ipadDesktopUa: boolean` shortcut → sets `navigator.userAgent` to a Mac UA and `navigator.maxTouchPoints = 5` so `detectPlatform()` resolves to `ios-safari` (matches existing logic in `src/lib/pwaInstall.ts`).
- Helpers: `goOffline()` / `goOnline()` that flip `online` and fire the matching window event.

### New / expanded cases in `src/components/pwa/__tests__/InstallVerification.test.tsx`

Add a dedicated `describe('InstallVerification — iOS Safari realistic states', …)` block:

1. **In-Safari tab, not installed** → asserts standalone check fails with detail `Open the app from your Home Screen icon` and troubleshooting auto-opens showing the exact Safari steps (`Tap … Share`, `Add to Home Screen`, `Tap … Add`). Asserts `install_verification_failed` payload `{ platform: 'ios-safari', standalone: false }`.
2. **Standalone + SW unsupported (older iOS)** → `swSupported: false`. SW row state `na` with detail `Not supported on this browser`. Overall still passes if cache `na` too; asserts `markStep('install_completed', …)` fires.
3. **Standalone + Private Browsing** → `privateBrowsing: true`. Cache row fails with `Cache not yet populated …`, fallback row fails. Troubleshooting opens; asserts "Disable private/incognito mode" copy is visible.
4. **Standalone + SW blocked (`SecurityError`)** → SW row fails with `Could not query service worker`. Asserts failure analytics include `swOk: false`.
5. **Standalone + cache populated but `/offline.html` missing** → uses `cacheMatchFailsFor: ['/offline.html']`. Fallback row shows `Offline fallback not yet cached`; cache row still `ok`.
6. **Offline simulation mid-check** → start online with populated cache, call `goOffline()` before clicking Run; assert all checks still resolve from cache and overall passes (offline-ready banner shown).
7. **iPad desktop-mode UA** → `ipadDesktopUa: true`; assert platform pill renders `ios safari` and Safari troubleshooting (not Android) appears.
8. **Re-run after fix** → first run fails (not standalone), then `resetPwaMock({ iosStandalone: true, standaloneMedia: true, caches: [...] })` and click `Re-run check` → success banner appears and `install_verification_passed` fires exactly once for that pass.
9. **Analytics shape** → assert `track('install_verification_started', { platform: 'ios-safari' })` is called once per Run click and never duplicated.

No production code changes to `InstallVerification.tsx` are expected. If a test reveals a real copy or branching bug, fix in that file with a minimal edit and note it in the closing message.

---

## 2. Cycle pause + edit when user missed days / ran out of peptides

Goal: from `CycleManagementModal`, let a user pause an active cycle, log a reason (`missed_doses` or `out_of_stock`), edit start date / duration / dose / frequency, and resume — without losing history. Pure local-storage feature; uses existing `Cycle` type + `updateCycle`.

### Data (non-breaking additions)

Extend `Cycle` in `src/data/userData.ts`:

```ts
pauseReason?: 'missed_doses' | 'out_of_stock' | 'other';
pausedAt?: string;        // ISO date when paused
resumedAt?: string;       // ISO date when last resumed
missedDays?: number;      // optional running tally entered by user
```

All optional, so existing stored cycles keep working. No migration needed.

### UI changes in `src/components/modals/CycleManagementModal.tsx`

- Replace today's single "Start Break / Resume Cycle" button with a two-action row on each active cycle card:
  - **Pause & edit** → opens an inline `EditCyclePanel` (new component below) prefilled with the cycle.
  - **Resume** (only when `status === 'break'`) → sets `status: 'active'`, writes `resumedAt`, clears `pauseReason`.
- Show a small "Paused — out of peptides" / "Paused — caught up on missed days" chip under the status badge when `pauseReason` is set.
- Calendar grid: render paused-day cells in `bg-amber-500/20` (new third legend entry) so missed-day stretches are visible.

### New component `src/components/doses/EditCyclePanel.tsx`

Inline (not modal — embedded in the cycle card) with fields:
- Reason chips: `Missed several days` | `Ran out of peptides` | `Other`
- `Missed days` numeric input (default 0)
- Editable: `Dose`, `Frequency`, `Start date`, `Planned duration`, `Break duration`, `Notes`
- Buttons: **Save & pause** (sets `status: 'break'`, `pausedAt: today`, persists edits via `updateCycle`) and **Cancel**.

Toast on save: `Cycle paused — you can resume when you're back on track.`

### Reminders side-effect (minimal)

When a cycle is paused, call existing `useDoseReminders().pauseRemindersForPeptide(peptideId)` if that helper exists; otherwise skip and surface a note "Reminders for this peptide will keep firing — disable in Reminders if needed." (Will check the hook during implementation; no new backend.)

### Files

- New: `src/components/doses/EditCyclePanel.tsx`, `src/components/pwa/__tests__/InstallVerification.ios.test.tsx` (or extend existing file — decide during impl based on size).
- Edited: `src/test/setup.ts`, `src/components/pwa/__tests__/InstallVerification.test.tsx`, `src/data/userData.ts`, `src/components/modals/CycleManagementModal.tsx`.

### Out of scope

- No paywall changes, no Supabase tables, no notification scheduler changes, no header/footer/blog changes, no styling overhaul of the modal beyond the new chip + amber legend cell.
- No automatic detection of missed doses — user enters the count themselves.
