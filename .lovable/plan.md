## Scope

Three additive upgrades: peptide search sort/saved-searches, audit log filters + pagination, and complete dose-audit coverage across stack/cycle screens.

---

### 1. Peptide Database — sort options + saved searches

`src/screens/PeptidesScreen.tsx`:

- **Sort options** (extend existing `sortBy`): add `janoshikPurity`, `recentlyAdded`, `priceAsc`, `priceDesc`. Expose via a shadcn `Select` in the filter row.
- **Saved searches** — new lightweight local store `src/lib/savedPeptideSearches.ts` (localStorage key `rtd-peptide-saved-searches`):
  - Shape: `{ id, name, query, activeFilter, researchFilter, sortBy, createdAt }`.
  - Helpers: `list()`, `save(entry)`, `remove(id)`, `rename(id, name)`.
- **UI** in the filters strip:
  - "Save search" button (opens a small inline popover with a name field, defaults to a summary like `"fda + score>=8"`). Disabled when no filters differ from defaults.
  - "Saved" dropdown listing entries — clicking one applies its query/filters/sort in a single state update. Each row has a trash icon to delete.
  - Toast on save/apply/delete.
- No schema changes; entirely client-side per device (matches existing `rtd-peptides-filters` pattern from the previous plan).

---

### 2. Audit Log tab — filters + pagination

`src/components/admin/AuditLogViewer.tsx`:

- **Filter controls** above the table (all optional, AND-combined):
  - **Action type**: multi-select of distinct actions present in the current window plus known constants from `AuditAction` union.
  - **Date range**: two shadcn date pickers (`from`, `to`) — sends `created_at >= from` / `< to+1d`.
  - **Target user**: text input matching against `user_id` (UUID prefix) OR a display name via join to `profiles` (fetched once).
- **Pagination**:
  - Page size 50, server-side using `.range(offset, offset+49)` and `count: 'exact'` on the query.
  - Prev / Next buttons + `Page X of Y` + total count.
  - Reset to page 1 whenever any filter changes.
- **Query building**: single `buildQuery()` helper composes `.eq('action', ...)` / `.in('action', ...)`, `.gte`/`.lt` on `created_at`, `.ilike` on joined profile name (via `profiles!inner(display_name)` select), and `.or('user_id.ilike.%q%')` when the input parses as a UUID fragment.
- Preserve existing free-text `filter` input as a client-side narrowing over the current page.
- Fire `admin.view_audit_log` once per mount (unchanged), plus a per-filter `admin.audit_log.filter` ping with the applied criteria (debounced, best-effort).

---

### 3. Complete dosage-change audit coverage

Goal: every path that creates, edits, or removes a scheduled or logged dose emits an audit entry.

**Storage-layer helper** `src/services/storage.ts` (or a thin wrapper next to the existing dose CRUD): add opt-in audit hooks so we don't have to instrument every caller. Where `storage.ts` already exposes `saveCycle`, `updateCycle`, `deleteCycle`, `saveActiveStack`, wrap each with a `logAudit` call:

- `saveCycle` → `dose.cycle.create` with `{ cycleId, peptideId, peptideName, doseMg, frequency }`.
- `updateCycle` → `dose.cycle.update` with a diff (`{ before: {...}, after: {...} }`) for `doseMg`, `frequency`, `status`, `startDate`, `endDate`.
- `deleteCycle` → `dose.cycle.delete` with `{ cycleId, peptideId }`.
- `saveActiveStack` → `dose.stack.update` with `{ addedIds, removedIds, changedIds }` computed against previous stack snapshot.

**Screen-level call sites** that bypass the storage helpers (or need richer metadata):

- `src/screens/CycleManagementScreen.tsx`:
  - `handleAddCycle`, `handleTogglePause`, `handleMarkComplete`, `handleDelete`, `handleReset` → each already calls `saveCycle`/`updateCycle`/`deleteCycle`. Rely on the wrapper.
  - Additionally emit `dose.cycle.status_change` when status transitions (pause/resume/complete) with explicit before/after status.
- `src/screens/MyStackScreen.tsx`:
  - `saveActiveStack` wrapper covers stack edits.
  - `handlePauseCycle`, `handleStartCycle`, `handleCompleteCycle`, `handleSavePauseEdit`, and the recalculation path each already go through `updateCycle`/`saveCycle` — wrapper covers them; add extra `dose.cycle.recalculate` when `recalculateCycle` reports `changed`.
- `src/components/doses/EditDoseModal.tsx` — inspect and add `dose.update` for its save handler (metadata: `doseId`, `before`, `after`).
- `src/components/doses/EditCyclePanel.tsx` — add `dose.cycle.update` on its submit (in addition to whatever storage call runs, to guarantee coverage if it takes an alternate path).
- `src/screens/DailyLogScreen.tsx` — existing `dose.create|update|delete` unchanged.

**New audit actions** added to the `AuditAction` union in `src/lib/auditLog.ts`:

```
dose.cycle.create
dose.cycle.update
dose.cycle.delete
dose.cycle.status_change
dose.cycle.recalculate
dose.stack.update
admin.audit_log.filter
```

All inserts remain fire-and-forget via `logAudit`.

---

## Technical notes

- No schema/migration changes; `audit_logs` already exists with correct RLS/GRANTs.
- Saved-search store is local per browser to match the existing filter-persistence pattern.
- Audit wrapper in `storage.ts` must swallow errors so audit failures never break dose writes.
- Verification: `tsgo` typecheck; Playwright smoke on `/admin` audit tab (apply date range + action filter, page next/prev, screenshot); on Peptides screen (save a search, reload, re-apply from dropdown).
