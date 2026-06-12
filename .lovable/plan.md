
# Phase 1 — UX, Revenue Wiring & Clinical Feature Audit

This phase ships fast, visible wins. Heavy clinical features land in Phase 2 once the audit confirms what's missing.

---

## 1. Mobile-first UX polish

**Sign-in button (Welcome / AuthModal)**
- Center horizontally on mobile (`mx-auto`, full-width with `max-w-xs` cap), bump contrast (primary bg, primary-foreground text, shadow), ensure 48px touch target, safe-area aware.
- Same fix applied to Google + Apple OAuth buttons so they line up vertically and are clearly tappable.

**Onboarding tour (DashboardTour)**
- Tooltip card centered on mobile (`inset-x-4` instead of fixed pixel offsets), with arrow hidden under `sm:` breakpoint.
- "Next/Skip" buttons full-width stacked on mobile; auto-scrolls the target into view before showing.

**App-wide mobile-app feel**
- Global tweaks (no behavior change to business logic):
  - Lock max content width to `max-w-lg` on phone screens, 16px gutters.
  - Headers and section titles sized down a step on `sm:`.
  - Bottom nav: ensure 56px height, larger icons, active-tab haptic tap (already partly there).
  - Inputs: 16px font size (prevents iOS zoom), rounded-xl, 48px height.
  - Cards: tighter padding on mobile, full-width.
- Restrict scope to layout/typography classes — no logic refactor.

---

## 2. In-dashboard "Buy your stack" (deep-link cart builder)

**Where it appears**
- Home → keep `ReorderWidget` but rewrite copy to "Reorder your stack".
- My Stack screen → new `BuyStackCard` placed directly under the Cycle Progress block.
- Stack Cart bar reused on stack pages (already exists in `StackCartBar`).

**How it works**
- Build URL via existing `buildStackLink(items, opts)` (already in `src/lib/bloodwork/stackLink.ts`) — extend or reuse to take items from `getActiveStack()` and map peptide IDs → store slugs via `entitySlugs.ts`.
- URL pattern: `https://www.ridethetide.site/cart/add?items=slug1,slug2&utm_source=tracker&utm_medium=stack&utm_campaign=buy_stack`.
- Open in new tab (`_blank, noopener`) — on Capacitor native, falls back to in-app browser via `@capacitor/browser` (already a dep).
- CTA: "Buy this stack →" with item count + estimated savings line ("3 peptides · 1-tap reorder").
- Tracks `bw_stack_built` + `bw_checkout_clicked` already wired in `trackBwEvent`.

---

## 3. My Stack section — 3 CTAs only

Remove from `MyStackScreen`:
- "Quick optimizations" panel
- Duplicate AI recommendation cards
- Anything else not in the 3-CTA list

Keep exactly three CTAs, in order:
1. **View peptides to stack in your Cycle** — unified AI + matrix recommendations. Single button opens a sheet powered by one merged engine: combines `useSafety` synergy data + existing `stackingMatrix` + `usePeptideAI` suggestions into one ranked list ("Add Ipamorelin: synergy with CJC-1295, supported by your cycle goal").
2. **Buy this stack** — deep-link cart (above).
3. **Book a consultation** — opens `BookCallSection` modal (existing component, points to `webinars@fintiba.com`).

All other recommendation widgets removed or merged into CTA #1.

---

## 4. Transform → "Results" outcomes dashboard

Rename `TransformationScreen` → `ResultsScreen`, update bottom-nav label/icon to "Results" (Trophy/Target icon).

**New structure (top → bottom):**
1. **Goal banner** — user's primary goal (from `goalMap`) + headline outcome metric (e.g. "−3.2 kg in 6 weeks").
2. **Outcome cards (grid of 4)** — Body comp delta, Bloodwork trend (top improved marker), Adherence %, Energy/mood avg (from feedback).
3. **Correlation strip** — sparkline overlay of doses vs primary biometric (reuses `CorrelationView`).
4. **Existing tabs collapsed into 'Inputs' drawer** — Calendar, Measure, Water, Food, Photos still accessible but secondary.
5. **Weekly summary card** — auto-generated narrative ("This week your IGF-1 trended up 12% while sleep improved by 0.8h"). Uses existing `WeeklySummary` component.

No new tables; pulls from `measurements`, `lab_reports`, `protocol_adherence`, `feedback`, `body_composition`.

---

## 5. Q&A "Registration Confirmed" email

- Setup steps (run in same turn):
  1. Check email domain status → if missing, prompt setup dialog on `ridethetide.info` subdomain `notify.ridethetide.info`.
  2. `setup_email_infra` if not present.
  3. `scaffold_transactional_email` if not present.
  4. New template `qna-registration-confirmation.tsx` in `_shared/transactional-email-templates/` — branded (Primary #3B82F6, Ride The Tide wordmark), shows event date (1st Saturday of next month), Zoom link placeholder, calendar `.ics` link, "Submit a question in advance" CTA.
  5. Register in `registry.ts`.
  6. Trigger: in the existing `qna_registrations` insert path (find the call site in `LiveQnA.tsx` or hook), invoke `send-transactional-email` with idempotency key `qna-confirm-<registration_id>`.
  7. Deploy edge functions.

---

## 6. Clinical feature audit (no code yet — informs Phase 2)

Quick map of the 17 requested vs what's already in the repo:

| # | Requested | Status |
|---|---|---|
| 1 | Automated Safety Engine (interactions, contraindications, cancer/death triggers) | **Exists** — `useAISafetyCheck`, `safety-check` edge fn, `SafetyPanel`. Gap: explicit "death/oncology trigger" rules surfaced as red banner. |
| 2 | 18-point anatomical site mapper, 6 zones, rotation | **Mostly exists** — `INJECTION_SITES` has 16 sites across 5 zones. Gap: add 2 sites (love-handle L/R), expose 6th zone, finalize `BodyMap` SVG. |
| 3 | Visual dosing calculator (syringe, pen, refill pen) | **Partial** — `DosageScreen` + `InsulinNeedleGuide`. Gap: pen + refillable-pen modes with calibration. |
| 4 | Predictive supply hub (vials, vendors, reorder alerts) | **Exists** — `inventory_items` + `ReorderAlert`. Gap: vendor ratings panel + predictive "runs out in X days" badge. |
| 5 | Bio-feedback (mood/sleep/energy/sides/biomarkers) | **Exists** — `FeedbackLogger`. Gap: surface in Results dashboard. |
| 6 | Stack sandbox drag-drop with real-time simulation | **Gap** — no drag-drop builder. New `StackSandbox` component needed. |
| 7 | PK simulator (Bateman) | **Exists** — `PKSimulatorPage`, `PKCurve`, route-aware. ✅ |
| 8 | Bloodwork tracking, ranges, trends | **Exists** — `BloodworkPage`. ✅ |
| 9 | Command Center — correlation charts, evidence overlays | **Partial** — `CorrelationView` exists. Gap: unified "Command Center" page. |
| 10 | Scientific sources portal (PubMed) | **Exists** — `researchReferences.ts`, `ResearchLibraryScreen`. ✅ |
| 11 | Advanced scheduling (pulsing, 5-on/2-off) | **Exists** — cycle protocols + `frequencyParser`. ✅ |
| 12 | Synergy detection & conflict scoring | **Exists** — `stackingMatrix` + `useSafety` synergy. Will be merged into the "View peptides to stack" CTA. |
| 13 | Unlimited history (own your data) | **Exists** — Supabase persistent + export panel. ✅ |
| 14 | Wearable ingestor (Oura/Whoop/Garmin CSV) | **Gap** — no CSV importer. New `WearableImporter` needed. |
| 15 | Receptor sensitivity & washout | **Exists** — `washout.ts`. Gap: pathway-health visualization. |
| 16 | Parallel correlation engine | **Exists** — `correlation.ts` + `CorrelationView`. Gap: multi-overlay UI. |
| 17 | "Bloodwork tracking" (duplicate of #8) | ✅ |

**Phase 1 ships items 1, 2, 4 polish (badges, 6th zone, oncology banner) opportunistically. Items 3, 6, 9, 14, 15-vis are scoped for Phase 2.**

---

## Build order (Phase 1)

1. Mobile UX polish (Welcome sign-in, AuthModal, DashboardTour, global mobile classes).
2. Buy Stack deep-link card on My Stack + dashboard.
3. My Stack 3-CTA cleanup + unified recommendation sheet.
4. Transform → Results dashboard rebuild.
5. Q&A confirmation email (infra check → scaffold → template → trigger → deploy).
6. Quick clinical polish: oncology red banner in `SafetyPanel`, add 2 love-handle sites, "runs out in X days" badge in `VialCard`.

---

## Out of scope for Phase 1 (Phase 2 backlog)

- Stack Sandbox drag-drop builder.
- Wearable CSV importer (Oura/Whoop/Garmin).
- Pen / refillable-pen calibration UI in dosing calculator.
- Dedicated Command Center page.
- Receptor-pathway visualization.
- Vendor ratings dataset & panel.
- Native push for Q&A reminder.

## Technical notes

- No new tables this phase; one new edge-function template only.
- New dep: none (Capacitor Browser, html-to-image, framer-motion already present).
- Memory updates: add `mem://features/buy-stack-deeplink`, `mem://features/results-dashboard`, rename Transform refs.
- All changes respect existing access model (no paywalls), mg/IU/U-40 dosing, English-only.

