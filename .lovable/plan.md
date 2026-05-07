# Plan

Three focused workstreams. No DB schema changes (uses existing `lab-reports` bucket, `subscriptions`, and local `Cycle` storage). One updated edge function.

## 1. Premium Bloodwork Upload Flow

**`src/pages/BloodworkPage.tsx`** — rebuild around a 4-step flow:

1. **Upload step**: drag/drop + camera capture. Accepts PDF, JPG, PNG, HEIC. Uploads to `lab-reports` bucket at `${user.id}/${timestamp}-${filename}`. Premium gate happens *before* analysis (upload itself is free so users see progress).
2. **Extracting step**: progress UI while `analyze-lab-report` runs.
3. **Review markers step**: parsed markers grouped (Hormones, Metabolic, Lipids, Inflammation, Other) with optimal-range badges (low / optimal / high) using existing gender-specific ranges. Inline edit if OCR misread a value.
4. **AI Recommendation step**: stack cards (peptide, rationale, suggested dose/freq, target marker improved) + plain-language explanation. "Add to My Stack" CTA per peptide.

**Premium gate** via `useSubscription()`:
- Free user sees uploaded preview + blurred markers/recommendation behind `PremiumLockOverlay` with "Unlock for $X" CTA → `/membership`.
- Save analysis result to `bloodwork_results` localStorage key so users can revisit.

**Edge function `supabase/functions/analyze-lab-report/index.ts`** — extend to:
- Accept `{ filePath, fileType }`, fetch signed URL from `lab-reports`.
- Call Lovable AI (`google/gemini-2.5-pro`, multimodal) with structured tool-calling schema returning `{ markers: [{name, value, unit, referenceRange, status}], recommendations: [{peptideId, peptideName, rationale, suggestedDose, targetMarkers[]}], summary }`.
- Verify JWT + check `has_active_subscription(user_id)` server-side; reject 403 for free users.

**New components**:
- `src/components/bloodwork/UploadDropzone.tsx`
- `src/components/bloodwork/MarkerReview.tsx`
- `src/components/bloodwork/StackRecommendation.tsx`
- `src/components/bloodwork/PremiumLockOverlay.tsx`

## 2. Predictive Search Enhancements

**`src/components/landing/PeptideSearch.tsx`** — refactor to:
- Controlled input + 120 ms debounce.
- Indexed search across `peptidesExpanded`, `peptideBlends`, and saved stacks (from `getActiveStack` + presets) using Fuse.js (already supported pattern). Top 8 results.
- **Category chips** above input: All · Peptides · Blends · Stacks · Recent. Filters dropdown results.
- **Recent searches**: store last 5 queries in `localStorage` (`recent_searches`). Show as chips when input empty/focused.
- **Instant dropdown**: shadcn `Command` / `Popover` pattern, keyboard-navigable, each row shows icon (peptide/blend/stack), name, short tag (category, half-life, or peptide count).
- Selecting a result navigates to existing detail modal/page route.

## 3. Cycle Management Screen

**New `src/screens/CycleManagementScreen.tsx`** at route `/cycles`:
- Three sections: **Active** (highlighted with progress ring + days remaining), **Upcoming/Planned**, **Past**.
- Each card: peptide name, start date, end date, dose, frequency, progress bar, status badge (active / nearing end / overdue / completed).
- **Quick actions** per active cycle: Mark dose taken (links to today's reminders), Edit dose, Pause, End early, Restart on completion.
- "Start new cycle" CTA → modal with peptide picker (from active stack), start date, planned duration (auto-fill from `getCycleSuggestion`), optional end date.
- Reuses existing `Cycle` type, `saveCycle`, `updateCycle`, `getCycles` from `storage.ts`. No schema changes.
- Add nav entry in bottom nav or `MyStackScreen` header → "Manage Cycles".

**Edited**:
- `src/App.tsx` — register `/cycles` route.
- `src/screens/MyStackScreen.tsx` — add "Manage Cycles" link in header.
- `src/components/layout/BottomNav.tsx` — optional shortcut (or skip if nav is full).

## Technical Notes

- All AI calls through `analyze-lab-report` edge function — no client-side keys.
- Subscription check is dual-layer (client UX + server enforcement).
- Marker reference ranges sourced from existing `bloodworkRanges` data.
- Cycles remain in localStorage (matches current architecture); no migration.
- Brand: glassmorphism + #3B82F6 accents, Framer Motion transitions on step changes.

## Files

**New**: `BloodworkPage.tsx` (rewrite), 4 bloodwork components, `CycleManagementScreen.tsx`
**Edited**: `analyze-lab-report/index.ts`, `PeptideSearch.tsx`, `App.tsx`, `MyStackScreen.tsx`
**No DB migration required.**
