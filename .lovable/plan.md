# Plan: Login Continuity, Apple Sign-In, and Bloodwork Funnel v2

## 1. Cycle history continuity for returning users
Scope per your answer: just verify existing data loads after login (no DB migration).

- Audit `src/services/storage.ts` (`getCycles`, `saveCycle`, etc.) and confirm cycle history is read from the same `peptide_app_cycles` localStorage key regardless of which user is signed in, so signing out and back in on the same device preserves history.
- Audit `signOut` in `AuthContext` and the migration modal flow to confirm we never wipe `peptide_app_cycles` on logout or on a new sign-in.
- Add a tiny `console.info('[cycles] loaded N from local store')` breadcrumb on app boot so we can spot accidental resets in the field.
- No DB schema work, no UI change.

> Note: because cycles live only in localStorage, switching devices still loses history. If you want cross-device cycle sync later, that becomes a separate task (new `user_cycles` table + migration).

## 2. Apple Sign-In — make it visible & working again
- Re-run the managed social auth configuration with both `google` and `apple` enabled so the provider is re-registered on Lovable Cloud.
- Keep `APPLE_SIGNIN_ENABLED = true` in `AuthModal.tsx` (already set) and double-check the Apple button renders in both `signin` and `signup` modes.
- Keep `AuthContext.signInWithOAuth` on `lovable.auth.signInWithOAuth('apple', { redirect_uri: window.location.origin })` and surface real error text in the toast.
- Add a "Test on published URL" note in the UI dev log: managed OAuth callbacks may not complete inside the iframe preview; the button itself must still render and the click must reach the provider.
- Verify by:
  1. Opening AuthModal → Apple button visible.
  2. Clicking → network call to `/~oauth/initiate?provider=apple` returns 200/redirect.
  3. On the published URL, full round-trip completes and session is set.

## 3. Bloodwork v2 — Onboarding → Analysis → Stack → Checkout
Builds on existing `BloodworkOnboarding`, `SystemDashboard`, `PatternDetection`, `StackCartBar`, and `patterns.ts`/`systems.ts`.

### 3a. Onboarding (guest-friendly)
- New `BloodworkUploader` with drag-and-drop zone (PDF/JPG/PNG), progress bar, and three entry paths:
  1. **Drop file** → auto-extract via `analyze-lab-report` edge function.
  2. **Take photo** (mobile camera input).
  3. **Manual entry fallback** → existing biomarker form, pre-grouped by system.
- Guest mode: results are computed and shown without forcing sign-in; persisted in `sessionStorage` until the user creates an account, then upserted to `lab_reports`.

### 3b. Analysis engine — 6 system cards
- Extend `src/lib/bloodwork/systems.ts` to cover: Immune, Metabolic, Hormonal, Cardiovascular, Liver/Kidney, Inflammatory.
- Each card renders: status pill (Optimal / Watch / Action), top 1–2 driver biomarkers with value vs. optimal range, and a one-line plain-language explanation.
- Pattern detection (`patterns.ts`) already supports combos like "Immune Dysregulation + Metabolic Stress" — extend with 4–6 more pairings and surface them as a banner above the cards.

### 3c. Peptide recommendations
- New `RecommendationEngine` ranks peptides per detected pattern/system using the existing stacking matrix and biomarker→peptide mapping.
- Each recommendation card shows: peptide name, why-it-was-picked (biomarker drivers), suggested protocol (dose mg/IU/units, frequency, duration), expected outcomes (timeframe + measurable marker), and a safety warnings accordion (contraindications, interactions, "research only" disclaimer).

### 3d. Stack builder & checkout deep link
- Multi-select cart already in `StackCartContext` — add quantity-less "add/remove" toggles on every recommendation card and a sticky `StackCartBar` summary.
- "Buy Stack" CTA builds a deep link to `https://www.ridethetide.site/cart/add?items=<sku>,<sku>&utm_source=rtdinfo&utm_medium=bloodwork&utm_campaign=stack_v2` and opens in a new tab.
- Post-purchase: on return to the app with `?stack_activated=1`, auto-create a `user_stacks` row and offer "Activate protocol now" → schedules dose reminders.

### 3e. UX spec
- Visual language: Apple-Health-style ring/status pills, InsideTracker-style biomarker bars with optimal-range shading; mobile-first single column on <768px, two-column on ≥768px.
- Stick to design tokens (primary `#3B82F6`, glassmorphism surfaces, Framer Motion fades — no custom hex in components).
- Touch targets ≥44px, content-visibility: auto on card lists.

### 3f. Conversion funnel
guest upload → analysis dashboard → "Save your results" account creation (email + Google + Apple) → stack builder → checkout deep link → post-purchase protocol activation. Each step emits an analytics event (`bw_upload_started`, `bw_analysis_viewed`, `bw_signup`, `bw_stack_built`, `bw_checkout_clicked`, `bw_protocol_activated`).

### 3g. Technical API (edge functions)
Eight endpoints under `supabase/functions/`:
1. `analyze-lab-report` (exists) — PDF/image → biomarker JSON (Gemini vision).
2. `extract-biomarkers-manual` — validates manual entries against reference ranges.
3. `score-systems` — biomarkers → 6-system status.
4. `detect-patterns` — system scores → pattern list.
5. `rank-peptides` — pattern+biomarker context → ranked peptide list with protocols.
6. `build-stack-link` — peptide ids → ridethetide.site cart URL with UTM.
7. `activate-protocol` — stack id → creates `dose_reminders` rows.
8. `bw-event` — analytics passthrough.

PDF parser requirement: pdf.js extraction → fallback to Gemini vision when text layer is empty. Shared auth with the shop is handled by the deep-link UTM + (future) signed token; not in scope for this pass.

### 3h. A/B roadmap + success metrics
Tracked client-side and ready for an experiment flag:
- **Tests:** (1) hero copy "Free Lab Analysis" vs "Decode Your Bloodwork", (2) auto-upload vs choose-method screen, (3) ranked list vs grouped-by-system, (4) sticky vs inline Buy Stack CTA, (5) post-purchase "Activate now" modal vs banner.
- **Metrics:** upload-completion rate, analysis-view rate, signup conversion, stack add-rate, checkout click-through, protocol-activation rate.

### 3i. Competitive differentiation (copy on landing strip)
Add a small "Why Ride The Tide" strip: open vs closed analysis, free for all members, South-Africa focused, integrated with the shop and Cape Town Peptide Club ecosystem.

## Files to touch
- `src/contexts/AuthContext.tsx` — breadcrumb logs, leave OAuth path as-is.
- `src/components/auth/AuthModal.tsx` — verify Apple button render.
- `src/components/bloodwork/` — new `BloodworkUploader.tsx`, `RecommendationsList.tsx`, `RecommendationCard.tsx`, `WhyRTDStrip.tsx`; extend `SystemDashboard.tsx`, `PatternDetection.tsx`, `StackCartBar.tsx`, `BloodworkOnboarding.tsx`, `BloodworkResults.tsx`.
- `src/lib/bloodwork/` — extend `systems.ts`, `patterns.ts`; new `recommendations.ts`, `stackLink.ts`, `analytics.ts`.
- `src/pages/BloodworkPage.tsx` — wire guest flow, post-purchase return handler.
- `supabase/functions/` — add `score-systems`, `detect-patterns`, `rank-peptides`, `build-stack-link`, `activate-protocol`, `extract-biomarkers-manual`, `bw-event` (no DB schema changes; reuses `lab_reports`, `user_stacks`, `dose_reminders`).

## Out of scope (call out explicitly)
- Cross-device cycle sync (would need a new `user_cycles` table + migration).
- Shared SSO token with the shop (UTM-only handoff for now).
- Stripe/PayPal — checkout stays on ridethetide.site per the no-paywall rule.

Ready to implement on approval.
