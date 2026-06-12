
# Clinical-Grade v2: 5 Pillar Rebuild

Goal: elevate Ride The Tide from "good basic tracker" to a Pinned.life-class clinical platform. Each of the 5 existing modules is rebuilt against Pinned parity, backed by Lovable Cloud sync, and enriched with Lovable AI lookups for safety reasoning.

## 1. Safety Engine v2 — AI-Assisted Clinical Checks

**UX**
- Dedicated `/safety` route with 3 tabs: Profile, Interaction Checker, Active Alerts.
- Profile wizard: meds, conditions, allergies, pregnancy, age, sex, weight, kidney/liver status, oncology history.
- On every new dose log or stack edit, run a safety check banner: green ✓ / amber caution / red contraindicated.
- "Why?" expander shows reasoning + source disclaimer ("AI-assisted research summary, not medical advice").

**Engine**
- Local hard-rules layer (immediate, free): contraindications, age gates, pregnancy, allergy match using `src/lib/safety/contraindications.ts` (expanded).
- AI layer via Lovable AI Gateway (`google/gemini-3-flash-preview`) for nuanced peptide↔drug, peptide↔condition, and peptide↔peptide interaction reasoning. Structured output (Zod): `{status, severity, mechanism, recommendation, references[]}`.
- Cached per (peptideId, profileHash) for 7 days in `safety_checks` table to avoid burning credits.

**Cloud**
- `safety_profiles` (1:1 user), `safety_checks` (cache).

## 2. PK Engine v2 — Validated Curves

**UX**
- `/pk` page upgraded: multi-peptide overlay, dose markers, Cmax/Tmax/AUC, steady-state line, "active level right now" badge.
- Per-peptide injection form (subq/IM/IV/intranasal) modifies absorption k_a.
- Shareable PNG export for clinicians.

**Engine**
- Move from single half-life to 1-compartment PK with bioavailability F, k_a, k_e per route. Validated parameters table in `src/lib/pk/compounds.ts` (curated literature values).
- Engine simulates rolling 7/14/30-day windows from real `daily_doses` rows (cloud).

**Cloud**
- Reuse `daily_doses`; add `pk_user_overrides` for personal half-life tweaks (advanced users).

## 3. Injection Site Rotation Map v2

**UX**
- Full-body SVG (front/back, male/female toggle) with 14 zones (abdomen quadrants, thighs, glutes, deltoids, lats).
- Heatmap of last 30 days; zone color = days since last use.
- "Suggest next site" button uses rotation algorithm respecting min 7-day cooldown per zone and avoiding consecutive same-side.
- Photo annotation: tap zone to log; optional lump/bruise note.

**Engine**
- Rotation algorithm in `src/lib/injection/rotation.ts` (upgrade): scores zones by cooldown, last bruise report, user-disabled zones.

**Cloud**
- `injection_sites` (per-user enabled zones, custom labels), `injection_records` (per-dose log with zone, notes, side-effect tags).

## 4. Vial Inventory v2

**UX**
- Inventory list with reconstitution wizard (already exists — keep), expiration progress ring, "days left at current pace" projection from real dose history.
- Reorder reminder when projected days < 7 → deep link to `https://www.ridethetide.site` with peptide query.
- Batch/COA link per vial; scan-to-add via Capacitor camera (QR on label).

**Engine**
- `daysLeftAtPace = remainingMg / avgDailyMg(last 14d)`.
- Auto-decrement remainingMg on dose log via DB trigger.

**Cloud**
- `inventory_items` (replaces localStorage). Trigger on `daily_doses` insert decrements matching active vial.

## 5. Bio-Feedback + Correlation Engine v2

**UX**
- `/feedback` daily journal: sleep, energy, libido, mood, soreness, side-effects (0–10 sliders), optional notes/photos.
- Weekly auto-report card: top 3 correlations across peptides × metrics, with confidence band.
- AI narrative: "This week your sleep improved 22% on days you dosed BPC-157 within 6h of bedtime." (Lovable AI summary over correlation output.)

**Engine**
- Keep Pearson correlation, add lag analysis (1, 3, 7-day shift) and minimum-n gate (n≥7 per pair). Adjust trend thresholds and confidence to standard error.
- Weekly summary job triggered on `/feedback` load (no scheduled function needed initially).

**Cloud**
- `feedback_entries` table with RLS scoped to user.

## Cross-cutting

- Migrate localStorage → Cloud on first login via existing `DataMigrationModal` (extend to cover safety, sites, inventory, feedback).
- New nav entries under "Clinical" group in BottomNav / More panel.
- All 5 modules behind feature flag `clinicalV2=true` defaulting on; legacy code kept for one release.
- Disclaimers ("research only, not medical advice") on every AI output per existing Core memory.

## Technical notes

**New tables** (all with RLS `user_id = auth.uid()`, GRANTs to authenticated + service_role):
- `safety_profiles`, `safety_checks`, `pk_user_overrides`, `injection_sites`, `injection_records`, `inventory_items`, `feedback_entries`.

**Edge functions**:
- `safety-check` — calls Lovable AI with structured output, writes cache row.
- `weekly-feedback-report` — runs correlations + AI narrative on demand.

**Files to add/edit (high-level)**:
- `src/pages/SafetyPage.tsx` (upgrade), `src/pages/PKPage.tsx`, `src/pages/InjectionSitesPage.tsx` (upgrade), `src/pages/InventoryPage.tsx` (upgrade), `src/pages/FeedbackPage.tsx` (new).
- `src/lib/safety/*`, `src/lib/pk/*`, `src/lib/injection/rotation.ts`, `src/lib/feedback/*` — engine upgrades.
- Sync hooks: `useSafetyProfile`, `useInventory`, `useFeedback`, `useInjectionSites` — swap localStorage for Supabase queries with optimistic updates and offline fallback to existing localStorage cache.
- `supabase/functions/safety-check/index.ts`, `supabase/functions/weekly-feedback-report/index.ts`.

## Out of scope (for now)

- Real drug DB licensing (RxNorm/DrugBank).
- HIPAA/MDR clearance — copy stays "research only".
- Wearable integrations beyond existing Renpho scale.

## Phasing (so you can ship in slices)

```text
Phase A  Safety v2 + PK v2          (the two biggest differentiators)
Phase B  Injection rotation v2 + Inventory v2 cloud sync
Phase C  Feedback v2 + weekly AI report + cross-module dashboard tile
```

Approve to begin Phase A, or tell me to start with a different phase.
