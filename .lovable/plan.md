

## Plan: Clear reminders on sign-out + welcome-back toast on sign-in

Two small additions wired into `AuthContext`.

### 1. Clear IndexedDB reminder schedules + active OS notifications on sign-out

**`src/services/pushScheduler.ts`** — add a single helper `clearAllScheduledNotifications()` that:
- Calls existing `clearAllRemindersFromIndexedDB()` to wipe the `scheduled-reminders` store.
- Opens the same DB and clears the `fired-notifications` store (so de-dup history doesn't carry over).
- Calls `navigator.serviceWorker.getRegistration()` → `registration.getNotifications()` → `notification.close()` on each, so any currently displayed banners from the previous user disappear.
- Posts `{ type: 'SYNC_REMINDERS' }` to the active SW so it re-reads the now-empty store and stops scheduling.

**`src/contexts/AuthContext.tsx`** — in `signOut()`, **before** `supabase.auth.signOut()`:
- `await clearAllScheduledNotifications()`.

This guarantees no leftover reminders/banners from User A fire for User B (or for the guest state after logout).

### 2. One-time "Welcome back, {name} — loading your data" toast on sign-in

**`src/contexts/AuthContext.tsx`**:
- Import `toast` from `sonner` (preferred per project conventions).
- Inside `handleAuth`, when the resolved user-id transitions from `null` → a real id (i.e. an actual login event, **not** the initial session restoration on page reload, and not a logout):
  - Resolve a friendly name: `currentUser.user_metadata?.display_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'there'`.
  - Fire `toast.success(\`Welcome back, ${name} — loading your data\`, { duration: 3500 })`.
- Gate via the existing `initializedRef` + `prevUserIdRef`: only toast when `initializedRef.current === true` (so it skips the very first session-restore on page load) **and** `prevId === null && newUserId !== null` (true sign-in transition).

No new dependencies. No DB changes. `sonner` `<Toaster />` is already mounted in `App.tsx`.

### Files touched

```text
src/services/pushScheduler.ts   ← new clearAllScheduledNotifications() helper
src/contexts/AuthContext.tsx    ← call it on signOut + welcome-back toast on real sign-in
```

