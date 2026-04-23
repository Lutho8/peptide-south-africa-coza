

## Plan: Language detection toast + Bloodwork-driven weekly schedule in Cycle Management

Two additions, fully aligned with project rules. The "Compare peptides" request is dropped per your selection — Blends & Stacks remains the canonical comparison surface.

### 1. PDF language auto-detection with confirmation toast

The edge function already returns `detected_language` ("en" | "de"). It's just not surfaced.

**`src/components/biomarkers/BiomarkerInsights.tsx`**
- Read `analysisData.data.detected_language` from the existing `supabase.functions.invoke('analyze-lab-report', …)` response.
- On success, replace the generic "Lab report analyzed successfully!" toast with a language-aware variant:
  - English → `toast.success('Lab report analyzed (English detected)')`
  - German → `toast.success('Lab report analyzed (German detected — translated to English)', { duration: 5000, action: { label: 'Re-analyze as English', onClick: …re-invoke with hint } })`
- Pass an optional `languageHint?: 'en' | 'de'` field in the invoke body so the override action works.

**`supabase/functions/analyze-lab-report/index.ts`**
- Accept optional `languageHint` in the request body.
- When present, append one line to `userText`: `"User has confirmed the document language is ${languageHint === 'de' ? 'German' : 'English'} — treat it accordingly."`
- No change to response shape.

No modal, no confirmation gate — auto-proceeds with a clear toast and an "undo / re-analyze" action.

### 2. Weekly schedule generated from ranked peptides → "From bloodwork" tab in Cycle Management

The biomarker analysis already produces ranked `suggested_peptides` per biomarker. We aggregate them across the latest report into a 7-day grid that the user can review and save as cycles + reminders.

**New file: `src/utils/bloodworkSchedule.ts`**
- `buildWeeklyScheduleFromReport(report: LabReport): ScheduleEntry[]`
  - Walks `extracted_biomarkers`, collects every `suggested_peptides[]` with `rank ≤ 2` from out-of-range markers (`high | low | critical`).
  - Deduplicates by peptide id; if the same peptide appears for multiple biomarkers, merges the `goals: string[]` field (e.g. `["IGF-1", "ALT"]`).
  - Looks up dosing/frequency from `src/data/peptides.ts` (`peptide.frequency`, `peptide.dosing.beginner`).
  - Routes through existing `parseFrequencyToSchedule()` from `src/utils/frequencyParser.ts` to derive `days[]` and `suggestedTime`.
  - Returns entries shaped like:
    ```ts
    {
      peptideId, peptideName, dose, days: ['mon','wed','fri'],
      time: '09:00', goals: ['IGF-1 low'], rank: 1
    }
    ```

**`src/components/modals/CycleManagementModal.tsx`** — add a "From bloodwork" tab
- Wrap existing content in `<Tabs>` with two tabs: **Cycles** (current behavior) and **From bloodwork** (new).
- New tab fetches the user's most recent `lab_reports` row with status=`completed` (single Supabase query, scoped by `user_id`).
- Empty state if no completed report: link to `/bloodwork` with copy "Upload a lab report to generate a schedule".
- When a report exists:
  - Show a header chip: "Based on your report from {date}".
  - Render the 7-day grid (Mon–Sun columns, peptide rows). Each cell shows peptide pill + time. Color cells by `rank` (1 = primary, 2 = muted-primary).
  - Each row: peptide name, dose, *goal chips* ("Low IGF-1", "High LDL", etc.).
  - Two action buttons:
    1. **"Save as cycles"** → for each entry, calls existing `saveCycle()` with `peptideName`, `dose`, `frequency` (rebuilt from days), `plannedDuration: 60`, `breakDuration: 30`, `status: 'active'`, `notes: 'Generated from bloodwork ' + reportDate`. Refresh local `cycles` state.
    2. **"Save reminders"** → reuses existing `bulkAddReminders()` from `useDoseReminders`, mapping each entry to `{peptide_id, peptide_name, dose, time, days, enabled: true}`. Same flow as the existing "Generate Reminders from Cycles" button.
- Toast confirmations on each save action.

### Files touched

```text
src/utils/bloodworkSchedule.ts              ← NEW: aggregation + schedule builder
src/components/modals/CycleManagementModal.tsx  ← add Tabs + "From bloodwork" tab
src/components/biomarkers/BiomarkerInsights.tsx ← language-aware toast + re-analyze action
supabase/functions/analyze-lab-report/index.ts  ← accept optional languageHint
```

No new dependencies. No DB changes. No Compare tool.

