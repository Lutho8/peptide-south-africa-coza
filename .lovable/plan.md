## Goal
Make stack sync visible, safe, and reversible — and never show an empty stack while cloud data is still loading.

## 1. Sync status indicator ("Syncing… / Up to date")

- Extend `useCloudSync` to expose a `hydrationState`: `'idle' | 'hydrating' | 'syncing' | 'ready' | 'error'`, plus `lastSyncAt`.
  - Set `hydrating` while `loadFromCloud` runs on login.
  - Set `syncing` during `syncActiveStack` writes.
  - Set `ready` once first hydration + any pending push completes.
- Add a small `StackSyncBadge` component (reuse design tokens, `Loader2` spinner + check icon) showing:
  - "Syncing…" while syncing/hydrating
  - "Up to date" with relative time after success
  - "Offline" if user not authenticated, "Sync error" on failure
- Mount it in:
  - `src/screens/MyStackScreen.tsx` header row (next to "My Stack" title)
  - `src/components/home/ActiveStackPreview.tsx` header (small, right of "Active Protocol")

## 2. Stack change log + Undo

- New file `src/services/stackHistory.ts`:
  - `recordStackChange(prev, next, reason)` — pushes `{ id, ts, reason: 'add'|'remove'|'update'|'clear'|'hydrate', prev, next }` into a capped (last 10) ring buffer in `localStorage` per user.
  - `getLastChange()`, `popLastChange()`, `canUndo()`.
- Hook into `saveActiveStack` callers (centralized in `MyStackScreen.handleSaveStack` and `useCloudSync.loadFromCloud` empty-cloud branch). Skip recording for `hydrate`-from-cloud reads except when hydrate would clear a non-empty stack.
- Add a toast with an "Undo" action after every `handleSaveStack` and after any auto-clear: clicking restores `prev`, persists locally, and re-syncs to cloud.
- Add an "Undo last change" item in the MyStackScreen header overflow (visible only when `canUndo()`).

## 3. Safeguards against duplicate cloud inserts

Current `loadFromCloud` empty-cloud branch can race: two tabs / fast reconnects may each insert the same local stack.

- Add a unique constraint on `user_stacks(user_id, peptide_id)` via migration so duplicate inserts fail safely instead of compounding. Use `ON CONFLICT (user_id, peptide_id) DO UPDATE` for the backfill insert.
- Add an in-memory `hydrationInFlight` ref + a per-user `localStorage` flag `rtd:stack-backfilled:<uid>` set after a successful backfill to prevent a second backfill on reconnect.
- Replace destructive `delete + insert` pattern in `syncActiveStack` with an upsert + targeted delete of removed peptide ids only, eliminating the brief "empty cloud" window that today can be observed by another concurrent reader.
- Guard `loadFromCloud` so it does not run while another invocation is in flight (debounce).

## 4. Loading skeleton + shimmer for Home "My Stack" card

- Add a `hydratedRef` / `isHydrating` signal exposed from `useCloudSync` and accessible via a tiny `useStackHydration()` hook (reads context or a module singleton).
- In `ActiveStackPreview`:
  - While `user && isHydrating && userStack.length === 0`, render a `StackPreviewSkeleton` instead of the empty "Build your stack" CTA.
  - Skeleton: `GradientCard` with shimmering placeholder rows (reuse `Skeleton` from shadcn, add a `bg-gradient-shimmer` animation in `index.css` via existing tokens).
- Only after hydration finishes AND stack is still empty do we render the existing empty-state CTA.

## Technical notes

- Files touched:
  - `src/hooks/useCloudSync.ts` (hydration state, debounce, idempotent backfill, upsert)
  - `src/components/home/ActiveStackPreview.tsx` (skeleton + sync badge)
  - `src/screens/MyStackScreen.tsx` (sync badge, undo toast, history hookup)
  - new `src/services/stackHistory.ts`
  - new `src/components/sync/StackSyncBadge.tsx`
  - new `src/components/home/StackPreviewSkeleton.tsx`
  - `src/index.css` (shimmer keyframes if missing)
- Migration: add `UNIQUE (user_id, peptide_id)` on `user_stacks` (after de-duping any existing rows in the same migration).
- No business-logic changes to peptides, dosing, or auth.
