

## Plan: Scale brand tracking, Sync Now, and per-user data isolation

Three connected fixes — the data isolation issue is the most important.

---

### 1. Track scale brand per measurement (Renpho/Xiaomi/Eufy/etc.)

**Problem**: `body_composition.source` is hardcoded to `'manual'`, `'bluetooth'`, or `'renpho'` regardless of which scale connected.

**Changes**:
- **`src/hooks/useBluetoothScale.ts`**:
  - Track the connected scale brand in state (`scaleBrand: 'renpho' | 'xiaomi' | 'eufy' | 'yunmai' | 'withings' | 'fitbit' | 'generic'`).
  - During `connectScale()`, the existing `serviceAttempts` loop already detects the scale type — promote that into state and persist it.
  - Also infer brand from `bluetoothDevice.name` (e.g. names containing "Renpho", "Mi Body", "Eufy", "Yunmai") as a fallback.
  - In `saveMeasurement()`, write the detected brand into `source` (instead of always `'bluetooth'`).
  - Expose `scaleBrand` from the hook so the UI can render it.
- **`src/services/storage.ts`**: widen the `BodyComposition.source` type to a string union including all brands plus `'manual'`.
- **`src/components/modals/BodyCompositionModal.tsx`**:
  - Replace the hardcoded `"Connected to Renpho ✓"` pill with a dynamic brand label: `"Connected to {Brand} ✓"`.
  - Replace the lookup `h.source === 'renpho'` with `h.source !== 'manual'` so any BT-sourced entry within 24h shows the pill (with the brand stored on that entry).
  - In the History list, show the actual brand (`renpho`, `xiaomi`, etc.) instead of always "renpho".

---

### 2. "Sync Now" button on the Bluetooth card

**Reality check**: Web Bluetooth has no command to remotely trigger a fresh scale reading — every scale requires a physical step-on to wake. So "Sync Now" will:

1. **Re-read the latest characteristic value** from the connected GATT (`characteristic.readValue()`) — this returns the last broadcast measurement the scale stored, which works on most Renpho/Xiaomi models.
2. If no value is cached on the scale, show a friendly toast: *"No fresh reading available. Step on your scale to send a new measurement."*

**Changes**:
- **`src/hooks/useBluetoothScale.ts`**:
  - Keep a ref to the connected `characteristic`.
  - Add `syncNow()` method that calls `characteristic.readValue()`, parses the result via the same parser used by notifications, and saves it through `saveMeasurement()`.
  - Toast success on real reading, info toast on empty buffer.
- **`src/components/settings/BluetoothScaleConnection.tsx`**:
  - When `isConnected`, render a **"Sync Now"** button (with `RefreshCw` icon) next to the disconnect button.
  - Disable while a sync is in flight; spinner during call.

---

### 3. **Per-user data isolation** (CRITICAL — fix data leaking between users on the same device)

**Root cause**: `localStorage` is global per-origin. The keys `peptide_app_active_stack`, `peptide_app_body_composition`, `peptide-daily-doses`, `peptide_app_user_profile`, `peptide_app_calculator_settings`, `peptide_app_scheduled_reminders`, `peptide_app_dose_logs`, `peptide_app_dose_schedules`, `peptide_app_cycles` are shared. When User B logs in on the same browser/device that User A used, they see User A's leftover local data until cloud fetch overwrites it (and for screens that don't fetch, they keep seeing it forever).

**Fix strategy**: Namespace localStorage keys by `user.id`, and **purge non-namespaced legacy keys on auth state change** so leftover global data can't leak.

**Changes**:

- **`src/services/storage.ts`**:
  - Add `setActiveUserId(userId: string | null)` that stores the current user id in a module-level variable.
  - Refactor `STORAGE_KEYS` access: introduce a `getKey(baseKey)` helper that returns `${baseKey}::${activeUserId}` when a user is logged in, or `${baseKey}::guest` when not.
  - Update `getStoredData` / `setStoredData` / `removeStoredData` to apply this prefix internally.
  - Add `clearAllUserScopedStorage()` that wipes every key matching the `peptide_app_*::*` and `peptide-daily-doses::*` patterns (used on sign-out).
  - Add `clearLegacyGlobalKeys()` (one-time migration) that removes the bare `peptide_app_*` and `peptide-daily-doses` keys (without `::userId` suffix) so old leaked data is gone.
  - Keep the `initializeStorage()` defaults seeding behavior, but only seed for the **current** user's namespace.

- **`src/hooks/useDailyDoses.ts`**:
  - Replace direct `localStorage.getItem/setItem` with the namespaced storage helpers (or include `user?.id` in the key explicitly).
  - On `user` change (login/logout), clear the in-memory `doses` state immediately before reloading so a stale list never flashes.

- **`src/contexts/AuthContext.tsx`**:
  - On every `onAuthStateChange`:
    - `SIGNED_IN` / `INITIAL_SESSION` with a user → call `setActiveUserId(user.id)`, then `clearLegacyGlobalKeys()` (one-time idempotent).
    - `SIGNED_OUT` → call `clearAllUserScopedStorage()` for the prior user's namespace and `setActiveUserId(null)`. Also reset to defaults so the next user starts clean.

- **`src/screens/MyStackScreen.tsx`** & **`src/screens/HomeScreen.tsx`** & **`src/screens/DailyLogScreen.tsx`**:
  - These already call `getActiveStack()`, `getUserProfile()`, `getCycles()`, `getBodyCompositionHistory()` on mount. After the storage helpers are user-scoped, these will automatically return the correct user's data.
  - Add a `useEffect` dependency on `user?.id` (where missing) so screens refetch when the active user changes.

- **`src/hooks/useCloudSync.ts`**:
  - Already gated by `if (!user)` — no logic change, but it now writes/reads the namespaced local copies so cloud-down fallback stays per-user.

**Verification**: After this change:
- User A logs in → sees their own stack, doses, body comp.
- User A signs out → all local namespaced keys for User A are wiped.
- User B logs in on same device → starts with empty defaults (or their own cloud-restored data), never User A's.
- Guest mode (no auth) uses `::guest` namespace, isolated from any logged-in user.

---

### Files touched

```text
src/services/storage.ts                            ← user-namespaced keys + cleanup helpers
src/contexts/AuthContext.tsx                       ← wire setActiveUserId + cleanup on auth events
src/hooks/useDailyDoses.ts                         ← namespace local key, clear on user change
src/hooks/useBluetoothScale.ts                     ← scaleBrand state + syncNow() + brand-aware source
src/components/settings/BluetoothScaleConnection.tsx  ← Sync Now button
src/components/modals/BodyCompositionModal.tsx     ← dynamic brand pill + brand in history list
```

No DB migrations needed — `body_composition.source` is already free-text. No new dependencies.

