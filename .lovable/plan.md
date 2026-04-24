## Plan: Adherence checklists + biomarker search/filter + staged scan progress

Three additive enhancements to `/bloodwork`. No breaking changes to existing scan flow.

---

### Part 1 — Adherence checklists (Nutrition · Exercise · Stress · Supplements)

**DB migration — new table `protocol_adherence`:**

```sql
create table public.protocol_adherence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lab_report_id uuid not null,
  section text not null check (section in ('supplements','nutrition','exercise','stress')),
  item_key text not null,           -- stable hash of "section:index:title"
  item_label text not null,         -- denormalized for history view
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, lab_report_id, section, item_key)
);

alter table public.protocol_adherence enable row level security;
create policy "Users view own adherence" on public.protocol_adherence for select using (auth.uid() = user_id);
create policy "Users insert own adherence" on public.protocol_adherence for insert with check (auth.uid() = user_id);
create policy "Users delete own adherence" on public.protocol_adherence for delete using (auth.uid() = user_id);

create index protocol_adherence_user_report_idx on public.protocol_adherence (user_id, lab_report_id);
create index protocol_adherence_user_section_completed_idx on public.protocol_adherence (user_id, section, completed_at desc);
```

**Why this shape:** toggle = insert row, untoggle = delete row. The `completed_at` column doubles as the adherence timeline ("you completed X 4 days in a row"). Cycling completion off then on simply leaves a fresh `completed_at`.

**New hook — `src/hooks/useProtocolAdherence.ts`:**
- Fetches all rows for `(user_id, lab_report_id)` once on mount, returns `Set<itemKey>`.
- `toggle(section, index, label)` → optimistic update, then `insert` or `delete` accordingly.
- Exposes `progress(section, totalItems)` → `{ done, total, pct }` for section headers.
- Stable `itemKey` = `${section}:${index}:${slug(label)}` so re-running a scan with the same protocol keeps prior toggles aligned.

**New component — `src/components/bloodwork/AdherenceChecklist.tsx`:**
- Wraps the existing list rendering inside `ProtocolSections.tsx` with a checkbox column.
- Section header shows `{done}/{total} done` + a thin progress bar.
- Toggle uses `Checkbox` from shadcn UI; checked rows fade `text-muted-foreground line-through` on the title only (rationale stays readable).
- A small "Reset section" link (only visible when `done > 0`) bulk-deletes that section's rows for the report.

**Wire-in — `ProtocolSections.tsx`:**
- Pass `labReportId` from `BloodworkPage` → `BloodworkResults` → `ProtocolSections`.
- `SUPPLEMENTS`, `NUTRITION`, `EXERCISE`, `STRESS` blocks render via `<AdherenceChecklist section="..." items={...} labReportId={...} />`.
- `PEPTIDE STACK` and `RETEST` keep current rendering (no adherence — stack adherence is tracked in the existing dose-logging system; retest is a future scheduling concern).

**CRM tracking:**
- On every toggle-on: fire `crm.captureLead({ activityType: 'calculator_use', source: 'bloodwork_adherence', planInterest: 'premium', activityData: { section, item: label } })` (debounced 1s/section so a flurry of toggles only sends one event per second).

**PDF export update — `src/utils/bloodworkProtocolPdf.ts`:**
- Accept an optional `completedKeys: Set<string>` param; checked items render with a `[x]` prefix in the PDF.

---

### Part 2 — Biomarker search & status filter on results screen

**Edits to `src/components/bloodwork/BloodworkResults.tsx`:**

Add a sticky filter bar above the biomarker panel:

```text
[ 🔍 search biomarkers… ]   [ All ] [ Normal ] [ Low ] [ High ] [ Critical ]   12/24 shown
```

- Search input is debounced 150ms; matches `name` OR `short_name` (case-insensitive, substring).
- Status chips are toggleable (single-select; clicking the active chip returns to "All"). Counts per status shown as small superscript: `Normal⁹  High⁴  Low²  Critical¹`.
- Filtering is computed via `useMemo` over `result.biomarkers`; categories with zero matches are hidden entirely (no empty section headers).
- "X/Y shown" indicator updates live.
- Empty state: "No biomarkers match this filter." with a reset button.
- URL deeplink support: `?bm=<query>&status=<status>` — read on mount, write via `replaceState` so back-button isn't polluted.
- Keyboard: `/` focuses the search input; `Esc` clears.

No new components — keep the filter UI inline at the top of the existing biomarker section so it stays sticky-friendly.

---

### Part 3 — Staged scan progress UI with graceful errors

**New hook — `src/hooks/useScanProgress.ts`:**

Drives a 4-stage progress simulator (the AI call itself is a single fetch — no streaming — so we model perceived progress with an asymptotic curve):

| Stage | Label | Target % | Min duration |
|---|---|---|---|
| 1 | "Uploading bloodwork…" | 15 | 0.4s |
| 2 | "Extracting biomarkers…" | 50 | 4s (asymptotes if AI takes longer) |
| 3 | "Generating personalised protocol…" | 90 | 6s asymptote |
| 4 | "Finalising results…" | 100 | snaps when the fetch resolves |

API: `const { stage, label, percent, start, advance, complete, fail, reset } = useScanProgress();`
- `start()` → stage 1, kicks off interval.
- `advance('extract'|'generate')` called explicitly from `BloodworkPage` after upload + DB-insert resolves and again right before the AI call resolves.
- `complete()` → snap to 100, then fade.
- `fail()` → freezes percent and surfaces error state.
- Internal interval ticks every 200ms with `next = current + (target - current) * 0.08` (eased asymptote, never overruns target).

**New component — `src/components/bloodwork/ScanProgress.tsx`:**

Renders inline between the form and tier cards (replaces the spinner inside `ScanTierCards` while running):

```text
┌────────────────────────────────────────────┐
│  ●●●○  Generating personalised protocol…   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░  72%               │
│  Usually completes in 30-60 seconds.       │
│  [ Cancel ]                                 │
└────────────────────────────────────────────┘
```

- 4 dot indicators (filled = complete, ring = active w/ pulse, hollow = pending).
- Stage label rotates with subtle `framer-motion` slide-up.
- Progress bar uses `bg-primary` with a shimmer sweep (matches existing luxury animation memory).
- "Cancel" button calls `AbortController.abort()` on the in-flight `supabase.functions.invoke` — onClick: confirms, then `reset()` + clears the upload state but keeps the form intact.

**Error handling — new error card:**

When the scan fails (network, 429, 402, 500, parse error), the tier cards swap for an inline error block:

```text
⚠️  We couldn't decode this report
   <plain-English mapped from edge function response>

   [ Try again ]   [ Upload a different file ]   [ Contact support ]
```

Mapping table (handled in `BloodworkPage`):

| Failure | User-facing copy |
|---|---|
| 429 | "Too many scans right now. Wait 30 seconds and try again." |
| 402 | "Premium scan credits exhausted for this hour. Try again shortly." |
| 500 / network | "Something went wrong on our side. Try again — your file is still saved." |
| Parse / empty AI response | "We couldn't read this lab report. Try a clearer scan or a different file format (PDF, JPG, PNG)." |
| File >10MB (client) | (already handled, but extend to show the error card not just a toast) |
| AbortError | (silently reset — no error card) |

CRM: on failure → `crm.captureLead({ activityType: 'calculator_use', source: 'bloodwork_scan_failed', planInterest: 'premium', activityData: { tier, reason } })` so we can monitor failure rates.

**Wire-up in `BloodworkPage.tsx`:**
- Add `progress` hook + `error` state + `abortRef`.
- `runScan` becomes:
  1. `progress.start()` → upload file → `progress.advance('extract')` once `lab_reports` row inserted
  2. `progress.advance('generate')` immediately before `functions.invoke`
  3. On success → `progress.complete()` → 350ms delay → render results
  4. On error → `progress.fail()` → set error state → render error card
- Replace the existing `running` loader inside `ScanTierCards` with the new `ScanProgress` component. The form stays mounted but greys out (`disabled` prop already supported).
- After results render, dismiss the progress UI.

---

### Files touched

```text
NEW    supabase/migration                                  (protocol_adherence table + RLS)
NEW    src/hooks/useProtocolAdherence.ts                   (toggle/progress/reset helpers)
NEW    src/hooks/useScanProgress.ts                        (4-stage asymptotic progress)
NEW    src/components/bloodwork/AdherenceChecklist.tsx     (checkbox-wrapped list w/ progress bar)
NEW    src/components/bloodwork/ScanProgress.tsx           (4-dot indicator + bar + cancel)
NEW    src/components/bloodwork/ScanError.tsx              (error card w/ retry / different file)
EDIT   src/components/bloodwork/ProtocolSections.tsx       (use AdherenceChecklist for 4 sections; pass labReportId)
EDIT   src/components/bloodwork/BloodworkResults.tsx       (search input + status filter + counts; pass labReportId down)
EDIT   src/pages/BloodworkPage.tsx                         (wire progress hook, AbortController, error mapping, pass labReportId to results)
EDIT   src/utils/bloodworkProtocolPdf.ts                   (accept completedKeys; render [x] prefix)
EDIT   src/integrations/supabase/types.ts                  (auto-regenerated by migration)
```

### Explicitly NOT doing

- ❌ Streaming AI responses — gateway endpoint is non-streaming; staged progress is a perceptual simulation only (this is industry-standard for non-streaming AI UX).
- ❌ Adherence streaks/badges UI — the schema supports it (`completed_at` timestamps), but the visual streak component is a follow-up once we have a few weeks of data to test against.
- ❌ Touching peptide STACK or RETEST sections with checklists — peptide adherence is the existing dose-logging system's job; retest is a future scheduling task.
- ❌ Server-side biomarker filtering — payload is small (~30 markers max), client-side `useMemo` is the right call.

### Migration first, then code

After approval I'll run the `protocol_adherence` migration first (regenerates `types.ts`), then ship all 6 new/edited files in one pass. No new secrets needed.
