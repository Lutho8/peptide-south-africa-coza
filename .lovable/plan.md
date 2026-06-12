# Phase A Polish → Phase B Build

## Phase A Polish (ship first)

### 1. Route-aware PK adjustments
Extend the PK simulator to model different administration routes per peptide.

- Update `src/lib/pk/compounds.ts` so each compound exposes per-route params: `subq`, `im`, `iv`, `intranasal` with their own `bioavailability`, `tmax`, `ka` (absorption), and `t12` overrides where they differ (IV: F=1, instant Cmax; IM: faster ka than subq; intranasal: lower F, fast tmax).
- Update `src/hooks/usePKSimulator.ts` to accept a `route` per dose entry and resolve params from the route map (fall back to subq).
- Add a Route selector (`Subq / IM / IV / Intranasal`) in `src/components/pk/PKPanel.tsx` next to dose + interval. Persist last-used route per peptide in `pk_user_overrides` (already in schema).
- Show a small "Route: SubQ • F=0.8 • tmax 2h" caption under each curve so users see why the shape changed.

### 2. PNG export for PK charts
- Add `html-to-image` (already common in the stack) or use `dom-to-image-more`. Prefer `html-to-image` for SSR-safe React.
- New util `src/lib/pk/exportPng.ts` with `exportChartToPng(ref, filename)` → triggers download + returns blob for share sheet.
- Add "Export PNG" + "Share" buttons in `PKPanel.tsx` header. On native (Capacitor), use `@capacitor/share` if available; otherwise fall back to browser download.
- Watermark: render a faint "Ride The Tide • ridethetide.info" footer inside the exported node so shared charts carry the brand.

### 3. Safety v2 small polish
- Wire `useSafetyProfileCloud` migration: on first authenticated load, if cloud row is empty and `localStorage` has a profile, upload it once then clear local key.
- Add "Last AI review: <relative time>" badge on the Safety page using `safety_checks.checked_at`.

---

## Phase B: Injection Rotation v2 + Inventory v2

### 4. Injection Rotation v2

**Data model (migration)**
- `injection_sites` (catalog, seeded): `id`, `region` (abdomen/thigh/glute/deltoid/triceps), `side` (L/R/center), `zone_index`, `svg_path_id`, `recommended_routes text[]`.
- `injection_records`: `id`, `user_id`, `site_id` fk, `peptide_id`, `dose_mg`, `route`, `injected_at`, `notes`, `pain_score smallint`, `swelling_score smallint`. RLS `user_id = auth.uid()`. GRANTs for authenticated + service_role.

**UI**
- New page `src/pages/InjectionSitesPage.tsx` route `/injection-sites` (under Clinical nav group).
- `src/components/injection/BodyMapSVG.tsx` — full-body front+back SVG with 14 zones as `<path id="zone-...">`. Heatmap fill = recency-weighted usage (last 30d). Click a zone → drawer to log injection.
- `src/components/injection/RotationSuggestion.tsx` — calls `suggestNextSite()` from `src/lib/injection/rotation.ts`.

**Rotation engine** (`src/lib/injection/rotation.ts`)
- Inputs: last 30d `injection_records`, configured cooldown (default 7d), route, peptide.
- Rules: hard-block any zone used in last 7d; prefer side opposite to last injection; prefer least-recently-used zone; respect `recommended_routes`.
- Output: ranked list of zones with reason strings ("7d cooldown clear", "opposite side rotation").

**Logging**
- `src/hooks/useInjectionRecords.ts` — list, create, delete with optimistic updates.
- Quick-log FAB on home that prefills suggested site + last peptide/dose.

### 5. Inventory v2

**Data model (migration)**
- `inventory_items`: `id`, `user_id`, `peptide_id`, `vial_total_mg`, `bac_water_ml`, `reconstituted_at`, `expires_at` (generated: reconstituted_at + 28d), `remaining_mg`, `lot_number`, `vendor`, `coa_url`, `status` (sealed/active/finished/expired), `notes`. RLS + GRANTs as above.
- DB trigger `on_dose_logged_decrement_inventory`: after insert on `daily_doses`, find oldest active inventory item for that peptide and decrement `remaining_mg`. Mark `finished` at 0.
- `daysLeftAtPace` computed client-side: `remaining_mg / avgDailyMg(last 14d daily_doses)`.

**UI**
- New page `src/pages/InventoryPage.tsx` route `/inventory`.
- `src/components/inventory/VialCard.tsx` — shows remaining bar, expiry countdown (red <3d, amber <7d), `daysLeftAtPace`, COA link.
- "Add Vial" sheet with reconstitution wizard reusing existing component; auto-sets `expires_at`.
- Low-stock + expiry alerts surfaced in existing notification center; threshold default 7d.

**Migration of existing localStorage inventory**
- `src/hooks/useInventory.ts` becomes cloud-first with a one-time migrator (mirrors safety profile pattern).

---

## Technical notes (collapsed for non-technical readers)

- New tables (all RLS scoped `user_id = auth.uid()`, GRANTs to `authenticated` + `service_role`):
  `injection_sites` (seed-only, read-all authenticated), `injection_records`, `inventory_items`.
- New edge function: none for Phase B; rotation + inventory math runs client-side.
- New deps: `html-to-image` (~25kb). No native SDK additions required.
- Feature flag: keep `clinicalV2=true` flag gating the new nav group; default ON for authenticated users.
- Out of scope: barcode scan for vial intake, biometric-triggered injection logging, multi-user shared inventory.

## Build order
1. PK route-aware + PNG export (Phase A polish 1+2)
2. Safety polish (Phase A polish 3)
3. Inventory v2 migration + UI + trigger
4. Injection Rotation v2 migration + SVG + engine

Approve to proceed with step 1.
