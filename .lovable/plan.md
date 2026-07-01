## Goal

Make bloodwork uploads feel reliable end-to-end: users see live progress until the job actually completes, get automatic + manual retry when things stumble, see extracted results in both English and German, and get precise validation errors upfront when a file/content type is unsupported.

## 1. Client-side upload validation (stricter, clearer)

**File:** `src/components/bloodwork/BloodworkWizard.tsx` (StepUpload)

- Add MIME/extension mismatch detection (e.g. file named `.pdf` with `image/png` header → warn "File extension does not match its actual type").
- Add empty-file check (`file.size === 0` → "This file is empty").
- Add magic-byte sniff for PDFs (read first 5 bytes; must be `%PDF-`); if not, error "This isn't a valid PDF — please re-export from your lab portal."
- Add HEIC-specific hint: "iPhone HEIC photos are accepted, but PDFs export more cleanly."
- Show error inline (already exists) plus a red border on the dropzone, and include a "Choose another file" button.

**File:** `src/pages/BloodworkPage.tsx` (`runScan`)

- Duplicate the validation server-side of the client (guardrail before upload):
  - Size 0, size > 10MB, MIME not in allowlist → surface localized message and abort before any Storage write.
  - Ensure `form.file.type` fallback via extension inference if browser reports empty MIME.

## 2. Progress indicator + polling until job completes

Today `progress.advance('generate')` fires immediately after upload and stays there until the AI returns. If the edge function response is delayed by network the UI looks frozen.

**File:** `src/hooks/useScanProgress.ts`

- Add `setPercent(n)` setter and a `heartbeat(stage)` helper so external pollers can nudge percent up to 90.
- Expose a `beginPolling(stopAt=90)` that runs a slower interpolation (0.5%/s) so users always see motion.

**File:** `src/pages/BloodworkPage.tsx` (`runScan`)

- After `insert`, subscribe to `lab_reports` row via `supabase.channel().on('postgres_changes', {event:'UPDATE', filter:'id=eq.<id>'})` to watch `status`.
- While the edge function is invoked (which does the heavy AI call), poll `lab_reports` every 3s as a fallback (in case realtime is not enabled) and:
  - `status='processing'` → `progress.advance('generate')`, keep percent creeping.
  - `status='completed'` → break out of retry loop even if the invoke promise races.
  - `status='failed'` → surface `ai_summary` as the error.
- After 90s of no status change → offer manual retry (see next section).
- Add a running "Elapsed: 0:34" counter under the progress bar so users know it's alive.

## 3. Retry flow until analysis completes

**File:** `src/pages/BloodworkPage.tsx`

- Keep the existing 3-attempt exponential backoff for transport/AI errors.
- Add "Analysis stalled? Retry" auto-appearing button after 60s that re-invokes `analyze-lab-report` with the same `reportId` (no re-upload).
- `handleRetry` already exists — refactor so it can retry against an existing `labReportId` without re-uploading (skip storage + insert if `labReportId` set and file unchanged).
- After 3 automatic + 2 manual retries, show the "Enter values manually" fallback (already wired in `ScanError`) prominently.

**File:** `src/components/bloodwork/ScanError.tsx`

- Add a "Retry now" primary button separate from "Enter manually" so retry is the first action.
- Show the specific error code (`RATE_LIMITED`, `TIMEOUT`, `AI_GATEWAY_ERROR`, `ENCRYPTED_PDF`, `STORAGE_DOWNLOAD_FAILED`, `AI_NETWORK_ERROR`, `INTERNAL_ERROR`) as a small monospace chip with a plain-English explanation and next step.

## 4. Bilingual (EN + DE) results display

The edge function already auto-detects EN/DE from the PDF and returns `detected_language`. Extend to render both languages side by side when a user uploads a German report (and optionally always show DE translations for peptides community members in SA who may share reports across borders).

**File:** `supabase/functions/analyze-lab-report/index.ts`

- Update system prompt to always return two additional fields per biomarker and insight:
  - `biomarkers[].name_de`, `biomarkers[].layman_explanation_de`
  - `insights_de: string[]` (same length/order as `insights`)
  - `summary_de`
- Prompt should translate to German when source is English and to English when source is German, so both are always populated.
- Persist new fields into `lab_reports.extracted_biomarkers` (already JSONB) and add `ai_summary_de` + `ai_insights_de` columns via migration.

**Migration:** `supabase/migrations/<ts>_bilingual_bloodwork.sql`

- `ALTER TABLE public.lab_reports ADD COLUMN ai_summary_de text, ADD COLUMN ai_insights_de text;`
- No GRANT changes needed (column additions inherit existing table grants).

**File:** `src/components/bloodwork/BloodworkResults.tsx` and `src/components/bloodwork/BloodworkTab.tsx`

- Add a small `EN / DE` segmented toggle at the top of the results card (default = `detected_language` or user's preferred toggle; persisted in `localStorage` as `bloodwork_lang`).
- When DE is active, render `name_de`, `layman_explanation_de`, `summary_de`, `insights_de` with graceful fallback to EN when a field is missing (older reports).
- Biomarker units/values stay numeric (no translation needed); reference ranges stay as-is.
- Add small "🇬🇧 EN / 🇩🇪 DE" indicator next to each report card showing the source language.

## 5. Backend robustness for content-type detection

**File:** `supabase/functions/analyze-lab-report/index.ts`

- Sniff magic bytes server-side (first 8 bytes) and correct `resolvedMime`:
  - `%PDF` → `application/pdf`
  - `\xFF\xD8\xFF` → `image/jpeg`, `\x89PNG` → `image/png`, `RIFF…WEBP` → `image/webp`, `ftypheic` → `image/heic`.
- If sniffed type is not supported → return `{ok:false, code:'UNSUPPORTED_CONTENT', retryable:false, message:'File does not appear to be a valid PDF or image.'}`.
- Keep language auto-detect prompt (already in place); force JSON output including the new DE fields.

## Technical notes

- All new copy in EN/DE lives in the AI response and in a small local dictionary in `BloodworkResults.tsx` (labels only: "Language", "English", "Deutsch", "Retry", "Elapsed").
- Realtime subscription requires `lab_reports` to be part of `supabase_realtime` publication; will `ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_reports;` in the migration if not already there.
- Existing reports without DE fields render EN-only with a subtle "German translation unavailable for this report" hint.
- No behavioral change for users who complete a scan quickly (<30s) — new polling/retry UI only surfaces when needed.

## Files changed

- `src/components/bloodwork/BloodworkWizard.tsx` — stronger validation
- `src/pages/BloodworkPage.tsx` — realtime polling, elapsed timer, retry-without-reupload
- `src/hooks/useScanProgress.ts` — heartbeat + polling helpers
- `src/components/bloodwork/ScanProgress.tsx` — elapsed counter, "stalled?" retry CTA
- `src/components/bloodwork/ScanError.tsx` — error code chip + primary Retry
- `src/components/bloodwork/BloodworkResults.tsx` — EN/DE toggle
- `src/components/bloodwork/BloodworkTab.tsx` — EN/DE toggle for saved reports
- `supabase/functions/analyze-lab-report/index.ts` — bilingual output + server-side MIME sniffing
- `supabase/migrations/<ts>_bilingual_bloodwork.sql` — `ai_summary_de`, `ai_insights_de`, realtime publication
