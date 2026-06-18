# Phase 2: P0 Bugs, Offline-First, Email Migration, Gestures

Sequenced so each piece is independently shippable. End-to-end verification on iOS/Android happens after build.

---

## 1. Bloodwork P0 Bug Fixes (highest priority — blocker)

### 1a. Client-side pre-upload validation (`src/pages/BloodworkPage.tsx`, upload step)
- Reject files > 10 MB, non-PDF MIME, or PDFs whose extracted text length < 200 chars (heuristic for scanned/image-only PDFs).
- Inline error: "Please upload a text-based PDF under 10 MB. Scanned reports cannot be decoded — try the manual entry option below."
- Detect compressed/encrypted PDFs (pdf-lib `isEncrypted`) and block with same message.

### 1b. Edge function `analyze-lab-report` hardening
- Wrap the whole handler in try/catch and return JSON `{ ok:false, code, message, retryable }` instead of throwing.
- Add structured `console.log({stage, durationMs, sizeKb})` at: download, decompress, text-extract, AI-call, parse.
- Bump to streaming text extraction; if extracted text < 200 chars → return `code: 'SCAN_NOT_DECODABLE'`.
- Wrap AI call with `AbortSignal.timeout(45_000)`; on timeout return `code: 'TIMEOUT'`.
- Return 200 with the error envelope (so client gets actionable body, not opaque "non-2xx").

### 1c. Client retry + fallback (`useBloodworkScan` hook, new)
- Exponential backoff: 2 s, 4 s, 8 s — only on `retryable: true` codes.
- Show progress UI: "Decoding biomarkers… attempt N of 3".
- After final failure → render `<ManualBloodworkEntry/>` pre-filled with the 32 baseline biomarkers (sourced from `src/data/bloodwork.ts`). Uploaded file kept in state so user can also re-try.

### 1d. Baseline Scan & Deep Decode buttons (`src/components/bloodwork/...`)
- Skeleton + progress animation while running (no blank screen).
- On failure, preserve uploaded PDF + inputs in component state, show "Scan interrupted. Try again or enter manually."

### 1e. Results visibility (`src/pages/BloodworkPage.tsx` Results tab)
- After successful `analyze-lab-report`, write decoded biomarkers to `lab_reports` (already exists). Results tab queries `lab_reports` ordered desc and renders biomarker cards. Confirm RLS allows the owner to read.

---

## 2. Swipe Gestures (Daily Log + Results)

- Add lightweight `useSwipeNav` hook in `src/hooks/useSwipeNav.ts` (raw `touchstart/move/end`, 60 px threshold, 30° angle tolerance, ignores when target is inside `input/textarea/[contenteditable]/.no-swipe`).
- Wire into:
  - `src/screens/DailyLogScreen.tsx` calendar header → swipe left = next day, right = prev day.
  - `src/pages/BloodworkPage.tsx` Tabs container → swipe cycles tabs in DOM order.

---

## 3. Offline-First Dose Logging + Bloodwork Manual Entry (IndexedDB queue)

### 3a. Queue layer (`src/services/offlineQueue.ts`, new)
- Uses `idb` (already a transitive dep; install if missing) — single object store `outbox` with `{id, table, op, payload, createdAt, attempts}`.
- API: `enqueue(table, op, payload)`, `drain()`, `subscribe(cb)`.
- Drain runs on: app load, `window.online`, every 30 s while online.
- Last-write-wins via `updated_at`.

### 3b. Hook integration
- `useDailyDoses` `addDose/updateDose/deleteDose`: write to local state + Supabase if online, else enqueue. Wrap Supabase calls in `try/catch` — on network failure also enqueue.
- New `useBloodworkManualEntry` hook does the same against `lab_reports` (manual entries get `source: 'manual'`).

### 3c. UX surface
- Small badge in `AppHeader` when `navigator.onLine === false` or queue length > 0 ("Offline — X pending"). Reuses existing `StackSyncBadge` styling.

---

## 4. New Mailboxes + Sending Domain Migration

### 4a. Lovable email domain on `peptide-south-africa.co.za`
- Call email-domain setup for delegated subdomain `notify.peptide-south-africa.co.za`. User adds NS records at registrar (24–72 h propagation). Old `notify.www.ridethetide.info` stays live in parallel until verified.

### 4b. Mailbox routing
- Provision `contact@`, `privacy@`, `support@` on the new domain (forwarding rules set up post-DNS-verification — flagged as a follow-up the user does in Cloud → Emails).

### 4c. Code sweep — replace all `@ridethetide.app` mailto: links
- `src/pages/PrivacyPolicy.tsx`: `privacy@ridethetide.app` → `privacy@peptide-south-africa.co.za`.
- `src/pages/TermsOfService.tsx`, `src/pages/Disclaimer.tsx`: → `contact@peptide-south-africa.co.za`.
- `src/components/landing/LandingFooter.tsx`: footer `contact@` + Mail icon → `contact@peptide-south-africa.co.za`.
- Grep sweep for any other `@ridethetide.app` references → `contact@…co.za`.

### 4d. Transactional send `from:` address
- Update `supabase/functions/process-email-queue` and any `send-transactional-email` default `from` → `Peptide South Africa <notify@peptide-south-africa.co.za>`. Guarded so it only switches once domain status === `active`; otherwise falls back to current sender.

---

## 5. End-to-End iOS/Android Verification

Run the preview browser at iPhone 14 (390×844) and Pixel 7 (412×915) viewports. Walk:
1. Login → Home → BottomNav reachable above safe-area.
2. Daily Log → swipe left/right changes day.
3. Add dose (online) → appears immediately; toggle DevTools offline → add another → appears with "pending" badge → toggle online → badge clears.
4. Bloodwork → upload bad PDF → friendly error. Upload good PDF → progress → results visible in Results tab. Force failure (corrupt file) → manual entry fallback appears with prefilled biomarkers.
5. Support sheet from header opens; WhatsApp link present; no floating FAB blocks Results tab.
6. Footer / Privacy / Terms / Disclaimer mailto links → new domain.

Report findings, fix any regressions, then summarize.

---

## Technical Notes

- No schema changes required — `lab_reports` and `daily_doses` already cover the offline writes.
- `useSwipeNav` is pure DOM, no extra deps.
- `idb` adds ~3 KB gzipped; if not already installed, install via `bun add idb`.
- Edge function changes require `deploy_edge_functions(['analyze-lab-report','process-email-queue'])` after edit.
- Email domain step needs user action (NS records at registrar) — flagged clearly; nothing else blocks on it.
- No DB migrations in this phase.

## Out of Scope (deferred)

- Forwarding rule UI for the 3 mailboxes (user configures in Cloud → Emails once DNS verifies).
- Android native rebuild + Play Store re-publish for the package-name change.
- Cookie/consent banner refresh for the new domain.
