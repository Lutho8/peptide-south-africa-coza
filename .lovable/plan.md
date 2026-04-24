

## Plan: Premium Bloodwork — Vril-inspired flow with two scan tiers, store CTA, and disclaimer

Transform `/bloodwork` from a single-tool upload into a Premium-gated, multi-step protocol-generation experience modeled on the Vril screenshots you shared. Non-Premium users see an upgrade gate; Premium users get the full flow.

### The new flow (match the screenshots)

**Hero** — *"From bloodwork to protocol."* — 3-step explainer (`01 Upload your bloodwork → 02 Receive your analysis → 03 Execute your protocol`).

**Two-column scan picker** (left = form, right = scan tier cards):

- **Left form (sticky on desktop, stacked on mobile):**
  - `01 — BLOODWORK FILE` — drag-drop / click upload (PDF or image, ≤10MB). "↓ Download sample spec" link.
  - `02 — PATIENT INFO` — Age (number) + Sex (Male/Female/Prefer not to say) underline-style inputs.
  - `03 — GOALS — select at least one` — 8 chip toggles: Longevity, Performance, Cardiovascular Health, Hormone Optimization, Weight Loss, Cognitive Enhancement, Muscle Building, Recovery.
  - `04 — PEPTIDE HISTORY — have you used peptides before?` — Yes / No toggle. If Yes, a textarea appears: *"Which peptides, doses, and how long?"* (e.g. "Retatrutide, Tesamorellin, KLOW, Kisspeptin-10. I have just started 1 month ago").
  - Footer: *"For informational purposes only — not medical advice."*

- **Right column (two stacked tier cards):**
  - **Baseline Scan** (Free with Premium) — *"Instant biomarker extraction across all panels, personalised health insights, and a curated peptide stack. Ready in under 60 seconds."* CTA: **RUN BASELINE SCAN →** (disabled until file + ≥1 goal selected; shows hint "Upload bloodwork or use your saved file to continue").
  - **Deep Decode** (Premium add-on, single-click) — *"32 biomarkers across 8 panels. Full health report scored by category, with a personalised optimisation protocol. Includes 4 follow-ups over 12 months."* CTA: **RUN DEEP DECODE →**.
  - Both tiers run the same backend analyzer; "Deep Decode" stores `scan_type: 'deep'` flag for richer prompt depth + future follow-up scheduling.

**Results screen (post-scan):**

1. **Header** — *"Baseline Scan"* eyebrow + *"Your Bloodwork Results"* title + circular **Health Score** (0–100, green ring) + biomarker count + **↓ Download PDF** button.
2. **Biomarker Panel** — grouped by category (HORMONES, LIPIDS, METABOLIC, LIVER, KIDNEY, INFLAMMATION, THYROID, OTHER). Each row: name + ref range below + value + unit + status badge (NORMAL / HIGH / LOW / CRITICAL).
3. **INSIGHTS** — numbered list of 6–8 plain-English findings.
4. **PEPTIDE STACK** section:
   - Goal-aware paragraph summarizing the recommended stack and rationale.
   - **Primary CTA: `BUY THIS STACK ON RIDETHETIDE.SITE/SHOP →`** — links to `https://www.ridethetide.site/shop` (new tab, `rel="noopener noreferrer"`, fires `crm.captureLead({ activityType: 'premium_click', source: 'bloodwork_stack_buy', planInterest: 'premium', activityData: { goals, stackPeptides } })`).
   - Per-peptide cards: name + priority badge (HIGH / MEDIUM / LOW) + goal tags + 2–3 sentence rationale + `DOSING:` line + **VIEW ON SHOP →** link (each links to `https://www.ridethetide.site/shop?q=<peptide-slug>`).
5. **SUPPLEMENTS** — numbered list. Each item: name + dose + 3 sub-sections: `WHAT IT IS`, `WHY IT MATTERS`, `HOW TO TAKE IT`.
6. **NUTRITION** — numbered list. Each item: title + `WHAT IT LOOKS LIKE` / `WHY ADOPT THIS` / `EXAMPLES`.
7. **EXERCISE** — numbered list of training prescriptions.
8. **STRESS** — numbered list of stress-management practices.
9. **ENVIRONMENT** — numbered list of environmental optimizations.
10. **DIAGNOSTICS — RETEST** (new) — list of suggested follow-up labs and timing windows.

**Footer disclaimer** (page bottom, exact copy):

> *This analysis is for educational and informational purposes only. It does not constitute medical advice. Consult a qualified healthcare provider before making any changes to your health regimen, including peptide protocols, supplements, or diagnostic testing.*

### Premium gate

Wrap the entire page (`/bloodwork`) in `useMembership().hasPremium`:

- **If not signed in** → CTA card "Sign in & upgrade to Premium" → opens AuthModal.
- **If signed in but not Premium** → Premium upgrade card with feature bullets ("AI-decoded biomarkers", "Personalised peptide stack", "12-month optimisation protocol") + **Unlock Premium → R4.99/mo** button → smooth-scrolls to `/#pricing`. Fires `crm.captureLead({ activityType: 'premium_click', source: 'bloodwork_gate', planInterest: 'premium' })`.
- **If admin or Premium** → renders the full flow above.

### Backend changes (single migration + edge function update)

1. **Migration** — add columns to `lab_reports`:
   - `scan_type text not null default 'baseline'` (`'baseline' | 'deep'`)
   - `patient_age integer`
   - `patient_sex text`
   - `goals text[] not null default '{}'`
   - `peptide_history_used boolean`
   - `peptide_history_notes text`
   - `health_score integer` (0–100)
   - `protocol jsonb` (structured: `{ stack: [...], supplements: [...], nutrition: [...], exercise: [...], stress: [...], environment: [...], retest: [...] }`)
   - `recommended_stack_peptides text[]`

2. **`analyze-lab-report` edge function** — extend the prompt:
   - Accept new params: `scanType`, `age`, `sex`, `goals`, `peptideHistoryUsed`, `peptideHistoryNotes`.
   - Add to system prompt: *"Use the user's age, sex, goals, and peptide history to personalise the recommendations. If `scanType` is `deep`, expand each section to include 32 biomarkers where possible and add 4 follow-up retest milestones over 12 months."*
   - Return JSON with new keys: `health_score`, `protocol: { stack, supplements, nutrition, exercise, stress, environment, retest }`, `recommended_stack_peptides`.
   - Save the new fields back to `lab_reports`.

3. **PDF export** — keep existing report-PDF path; the "Download PDF" button uses `utils/exportReport.ts` (already present) and we'll add a `bloodworkProtocolPdf` helper that renders the full protocol to PDF.

### CRM tracking added

| Trigger | activityType | source | planInterest |
|---|---|---|---|
| Premium gate viewed (non-Premium) | `pricing_view` | `bloodwork_gate` | `premium` |
| "Unlock Premium" click on gate | `premium_click` | `bloodwork_gate` | `premium` |
| Baseline scan run | `calculator_use` | `bloodwork_baseline` | `premium` |
| Deep Decode scan run | `calculator_use` | `bloodwork_deep` | `premium` |
| "Buy This Stack on RideTheTide.site/shop" click | `premium_click` | `bloodwork_stack_buy` | `premium` |
| Per-peptide "View on shop" click | `peptide_search` | `bloodwork_peptide_shop` | `premium` |

### Files touched

```text
NEW    src/components/bloodwork/BloodworkHero.tsx           (3-step "From bloodwork to protocol")
NEW    src/components/bloodwork/ScanForm.tsx                (file + age/sex + goals + history)
NEW    src/components/bloodwork/ScanTierCards.tsx           (Baseline + Deep Decode CTAs)
NEW    src/components/bloodwork/BloodworkResults.tsx        (Health Score + biomarker panel)
NEW    src/components/bloodwork/ProtocolSections.tsx        (Stack + Supplements + Nutrition + Exercise + Stress + Environment + Retest)
NEW    src/components/bloodwork/StackPeptideCard.tsx        (per-peptide card with shop link)
NEW    src/components/bloodwork/PremiumGate.tsx             (signed-out + non-Premium gate)
NEW    src/utils/bloodworkProtocolPdf.ts                    (PDF export of full protocol)
EDIT   src/pages/BloodworkPage.tsx                          (wire gate + new flow + disclaimer)
EDIT   src/components/biomarkers/BiomarkerInsights.tsx     (refactor: extract upload to ScanForm; results render via new components — keep History tab)
EDIT   supabase/functions/analyze-lab-report/index.ts      (extend prompt + accept new params + return protocol JSON)
NEW    supabase/migration                                   (lab_reports columns: scan_type, patient_age/sex, goals, peptide_history_*, health_score, protocol, recommended_stack_peptides)
```

### Visual style

- Keep the current dark + glassmorphism brand (Ride The Tide), **not** a verbatim Vril clone — same layout/structure as the screenshots, our colors (#3B82F6 primary, dark surfaces, subtle gradients, monospace `01 — SECTION` eyebrows in muted tracking-wide).
- Section dividers use `border-border/50` thin lines like the screenshots.
- Status badges: NORMAL = green, HIGH/CRITICAL = red, LOW = yellow.
- Health Score ring uses SVG circle with green stroke, animated count-up on mount.

### Explicitly NOT doing

- ❌ Building a full vrilpeptides.com-style storefront — single CTA links out to `https://www.ridethetide.site/shop`.
- ❌ Auto-scheduling the 4 Deep Decode follow-ups (column captured; scheduling is a follow-up task once Tagadapay is wired and we know billing periods).
- ❌ A separate `vril`-style marketing landing page — flow lives at `/bloodwork`.
- ❌ Touching the unrelated `BiomarkerInsights` History/Trends tabs beyond the refactor needed for the new flow.

### After approval

I'll run the DB migration first (extends `lab_reports`), then ship the page + edge function in one pass. No new secrets needed — this uses existing `LOVABLE_API_KEY` (Lovable AI Gateway) and the Supabase storage bucket `lab-reports` that's already provisioned.

