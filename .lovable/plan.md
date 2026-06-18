# Bloodwork P0 Hardening + Results Visibility + Quarterly Reminders

Scope: the four CRITICAL items at the top of your list (Bloodwork upload, Baseline/Deep Decode, Results visibility, Quarterly reminders) plus the foundational mobile-a11y fixes. Everything labeled High/Medium/Low (wearables, food logger, community, side-effects journal, etc.) is deferred to a follow-up sprint.

## Already in place (from prior turns)
- `analyze-lab-report` wrapped in 45s `AbortSignal` + structured JSON error envelopes (`ok/code/retryable/message`).
- Client-side validation in `BloodworkWizard.tsx` (≤10MB, PDF-only).
- `useSwipeNav` hook wired into Daily Log calendar.
- `offlineQueue.ts` IndexedDB outbox with auto-sync on reconnect; `useDailyDoses` enqueues on failure.

## 1. Bloodwork Upload — finish the P0
**Edge function `analyze-lab-report`:**
- Add encrypted-/compressed-PDF detection at the top of the handler (look for `/Encrypt` marker, attempt `pdf-lib` decompression of stream objects before text extraction). Reject scanned PDFs with `code: SCANNED_PDF` when extracted text < 200 chars.
- Structured logs at every stage: `pdf_received`, `text_extracted`, `ai_called`, `ai_returned`, `error` with code + duration.
- Always return HTTP 200 with `{ ok:false, code, retryable, message }` so the client never sees "non-2xx".

**Client (`BloodworkPage.tsx` + `BloodworkWizard.tsx`):**
- Exponential backoff: attempts 1/2/3 at 2s / 4s / 8s, only when `retryable: true`.
- Progress UI during retries: skeleton + "Decoding biomarkers… attempt N of 3 · ~Xs remaining" (countdown from 45s per attempt).
- On final failure: render a new `<ManualBloodworkEntry/>` component pre-populated with the 32 most common biomarkers (testosterone, free T, SHBG, IGF-1, HbA1c, fasting glucose, insulin, total/LDL/HDL/triglycerides, ALT/AST/GGT/ALP, creatinine, eGFR, CRP, homocysteine, vitamin D, B12, ferritin, TSH/fT3/fT4, cortisol, estradiol, DHEA-S, prolactin, RBC/WBC/Hb/platelets). Preserve the uploaded PDF blob + step inputs so the user does not re-upload.
- "Scan interrupted" recovery banner with Retry / Enter manually buttons.

## 2. Baseline Scan & Deep Decode
- Both buttons share the fixed `analyze-lab-report` path — once #1 lands they unblock.
- Add skeleton + progress animation while the scan runs (no blank screen).
- Baseline returns: key biomarkers + insights + 1 peptide stack rec within 60s.
- Deep Decode returns: full categorized scorecard (Metabolic / Cardiovascular / Hormonal / Inflammatory / Liver / Renal / Hematology / Thyroid), 32 biomarkers, optimization protocol, 4 follow-up reminders scheduled at 90/180/270/360 days.

## 3. Results tab — Bloodwork sub-tab (currently invisible)
- Add `Bloodwork` sub-tab next to Calendar / Measure / Water / Food / Photos in `ResultsScreen` (or wherever those tabs live — confirm during build).
- `BloodworkCard`: date, lab name, biomarker count, overall health score badge (if Deep Decode ran), "View Report" CTA.
- `BiomarkerTrendChart`: Recharts line chart per biomarker across all `lab_reports` rows, with 7/30/90/all toggles.
- Delta badges: "↑ 12% from Mar 2026" / "↓ 8% — within optimal range".
- Optimal-range coloring: green / yellow / red against age-sex reference ranges from `src/data/bloodwork.ts`.
- Protocol-correlation banner: cross-reference active cycles in `daily_doses` with the biomarker delta window — "Your IGF-1 increased 18% during your CJC-1295 + Ipamorelin cycle".
- Enable `useSwipeNav` on the sub-tab strip.

## 4. Quarterly bloodwork reminders
- New `bloodwork_reminders` table: `user_id`, `lab_report_id`, `due_at`, `kind` (`pre|due|overdue`), `notified_at`, `status`. RLS scoped to `auth.uid()`.
- After a successful Baseline/Deep Decode insert, schedule three rows at +75d, +90d, +105d.
- New edge function `bloodwork-reminder-dispatch` run nightly by pg_cron: finds rows where `due_at <= now()` and `notified_at IS NULL`, sends both a `send-transactional-email` (template `bloodwork-quarterly-reminder`) and a Capacitor LocalNotification, then stamps `notified_at`.
- Home screen: `<BloodworkDueBanner/>` when any row with `kind='due'|'overdue'` is unacknowledged.
- Results tab badge: red dot when a reminder is open.
- Deep link `/bloodwork?flow=quick-upload` that skips the onboarding quiz for returning users.
- "Book Bloodwork" CTA → external links to Synlab / Lancet / PathCare ZA.

## 5. Mobile-a11y foundation (Critical Foundation)
- `BottomNav`: `padding-bottom: env(safe-area-inset-bottom)`.
- Move WhatsApp FAB out of bottom-right (already moved into Support sheet in prior turn — verify nothing remains).
- Audit `size="icon"` buttons to `min-h-11 min-w-11`.
- Switch full-screen wrappers from `h-screen` → `min-h-dvh` to fix keyboard-shift in bloodwork forms.
- Global `:active { transform: scale(0.97); }` on `Button` variants via Tailwind `active:scale-[0.97]`.
- Wire `useSwipeNav` into the Results sub-tab strip.
- Extend offline queue to cover `lab_reports` manual entries (reuse `enqueueOffline`).

## Deferred (separate sprint)
Trend charts beyond bloodwork (weight/adherence), Protocol library/templates, Side-effects journal, Food/supplement expansion, Photo progress slider, Wearable integrations, Export PDF, Community/Research feed expansion, Reconstitution presets/video.

## Technical details
- New table: `bloodwork_reminders` (created via migration tool with GRANTs + RLS).
- New edge function: `bloodwork-reminder-dispatch` (`verify_jwt = true`, service-role caller via pg_cron).
- New template: `supabase/functions/_shared/transactional-email-templates/bloodwork-quarterly-reminder.tsx` registered in `registry.ts`.
- New components: `ManualBloodworkEntry.tsx`, `BloodworkCard.tsx`, `BiomarkerTrendChart.tsx`, `BloodworkDueBanner.tsx`.
- Reuse: `lab_reports` table (already 21 cols), `useDailyDoses`, `useSwipeNav`, `offlineQueue.ts`, Recharts.
