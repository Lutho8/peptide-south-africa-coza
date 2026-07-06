## Scope

Four related fixes across admin, onboarding, and peptide search.

---

### 1. Audit log for admin actions & dosage changes

**New table `public.audit_logs`** (migration):
- `user_id uuid` (actor), `action text` (e.g. `dose.create`, `dose.update`, `dose.delete`, `admin.view_users`, `admin.coa_upload`, `admin.label_generate`, `admin.role_check_failed`), `entity_type text`, `entity_id text`, `metadata jsonb`, `ip text nullable`, `created_at`.
- GRANTs: `INSERT` for `authenticated` (users log their own), `SELECT` for admins only via `has_role`, `ALL` for `service_role`.
- RLS:
  - Insert: `auth.uid() = user_id`.
  - Select: `public.has_role(auth.uid(), 'admin')`.

**Client helper `src/lib/auditLog.ts`**:
- `logAudit({ action, entityType?, entityId?, metadata? })` — best-effort insert, swallow errors so audit failures never break user flows.

**Call sites**:
- `DailyLogScreen` / dose create + update + delete handlers → `dose.create|update|delete` with peptide id + dose + unit in metadata.
- `AdminDashboard` mount (success) → `admin.dashboard.open`; failure branch → `admin.role_check_failed` with error message.
- `COAUploadManager` upload success → `admin.coa_upload`.
- `VialLabelMaker` generate → `admin.label_generate`.

**Admin viewer**: new tab in `AdminDashboard` → `Audit Log` — paginated table of last 200 rows (actor display_name via join, action, entity, timestamp).

---

### 2. DashboardTour JSX + progress bar correctness

- Re-read `src/components/onboarding/DashboardTour.tsx` end-to-end.
- Verify:
  - Every conditional/fragment has matching closing tags (mobile bottom-sheet vs desktop centered branches).
  - Progress bar: `pct` computed once per step, width bound as inline style `{ width: `${pct}%` }`, container has explicit height + rounded track.
  - Step dots render `STEPS.length` items, active dot styled distinctly, keyboard focus preserved.
- Run `tsgo` + a Playwright smoke that opens `/`, forces `localStorage.removeItem('rtd-dashboard-tour-done')`, reloads, and screenshots each of the 7 steps to confirm no runtime errors and the bar fills 14% → 100%.

---

### 3. Improved Peptide Database search & filtering

`src/screens/PeptidesScreen.tsx` upgrades (no data-model changes):

- **Search**
  - Add token-AND matching: split query on whitespace, every token must match at least one haystack field. Keeps current alias + Levenshtein fallback.
  - Add scope hints: `cat:healing`, `fda:true`, `janoshik:true`, `stock:in-stock`, `price:<50`, `score:>=8` — parsed via a small `parseQuery()` helper, applied as extra predicates.
  - Debounce input (150ms) via `useDeferredValue` to keep typing smooth on the full 98-peptide list.
- **Filters**
  - Add a Category multi-select chip row (existing `getCategoryLabel` values) above the current filter tabs.
  - Add a price range slider (min–max) using shadcn `Slider`.
  - Add "Reset filters" pill when any non-default filter is active.
- **Sort**
  - Add `janoshikPurity` and `recentlyAdded` sort options.
- **Result meta**
  - Show `X of Y peptides` count + active-filter summary chips (each removable).
- **Persistence**
  - Persist last filter + sort in `localStorage` key `rtd-peptides-filters` so power users don't reset on nav.

Widget hint copy unchanged; behavior remains additive.

---

### 4. Restore `has_role` execute permission + client fallback

**Migration** (idempotent, safe to re-run):
```sql
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO authenticated;
```

**Client fallback in `AdminDashboard.checkAdminAccess`**:
- Try `supabase.rpc('has_role', ...)` first.
- If it errors with a permission-denied code (`42501`) OR any error, fall back to a direct `select` on `public.user_roles` filtered by `user_id = auth.uid()` and `role = 'admin'` (RLS already allows the user to read their own rows). Only redirect if both paths return no admin row.
- Log the fallback path via `logAudit({ action: 'admin.role_check_fallback', metadata: { reason } })` so we notice if the grant regresses again.
- Mirror the same fallback in `useAccessControl` for consistency (it already uses the direct select — keep as-is, just add the audit ping on failure).

Edge functions `gsc-status`, `gsc-verify-live`, `gsc-resubmit-sitemap` continue to work once the grant is restored (they use the user JWT).

---

## Technical notes

- Audit inserts are fire-and-forget; never `await` in a way that blocks UI. Wrap in `try/catch` and log to console only in dev.
- All new client code is presentation/logic only — no schema drift beyond the two migrations above.
- Verification: `tsgo` typecheck, `bunx vitest run` for any touched util, Playwright smoke for tour + admin dashboard load (with injected Supabase session).
